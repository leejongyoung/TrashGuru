const canvas = document.getElementById('diagramCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('canvas-container');

// 상태 변수
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;
let hoveredNode = null;

// 상수 설정
const NODE_WIDTH = 210; // 너비 확대 (180 -> 210)
const NODE_HEIGHT = 60;  // 높이 확대 (50 -> 60)
const VERTICAL_GAP = 70;
const HORIZONTAL_GAP = 40;
const RADIUS = 8;

// 색상 팔레트
const COLORS = {
    root: { fill: '#FF9F43', stroke: '#E67E22', text: '#fff' },
    aux: { fill: '#FFEAA7', stroke: '#FDCB6E', text: '#333' }, // 상단 보조
    category: { fill: '#FFEAA7', stroke: '#FDCB6E', text: '#333' }, // 노란색 카테고리
    blue: { fill: '#E3F2FD', stroke: '#90CAF9', text: '#1565C0' }, // 파란색 (입력)
    gray: { fill: '#FAFAFA', stroke: '#E0E0E0', text: '#616161' }, // 회색 (출력)
    line: '#B0BEC5'
};

let nodes = []; // 렌더링을 위해 계산된 노드 리스트

function initLayout() {
    nodes = [];
    
    // 전체 캔버스 중앙 계산을 위한 너비 추정
    const colWidth = NODE_WIDTH + HORIZONTAL_GAP;
    const totalWidth = colWidth * data.columns.length;
    const startX_pos = -totalWidth / 2 + NODE_WIDTH / 2;

    // 1. Root Node
    nodes.push({
        ...data.root,
        x: 0,
        y: -300,
        w: NODE_WIDTH,
        h: NODE_HEIGHT
    });

    // 2. Aux Nodes (Root 주변)
    // 왼쪽
    nodes.push({
        ...data.aux[0],
        x: -NODE_WIDTH * 1.5,
        y: -300,
        w: NODE_WIDTH,
        h: NODE_HEIGHT
    });
    // 오른쪽 1
    nodes.push({
        ...data.aux[1],
        x: NODE_WIDTH * 1.5,
        y: -300,
        w: NODE_WIDTH,
        h: NODE_HEIGHT
    });
    // 오른쪽 2
    nodes.push({
        ...data.aux[2],
        x: NODE_WIDTH * 2.8,
        y: -300,
        w: NODE_WIDTH,
        h: NODE_HEIGHT
    });

    // 3. Columns
    data.columns.forEach((col, idx) => {
        const colX = startX_pos + (idx * colWidth);
        const startY_pos = -150;

        // Category Head
        const headNode = {
            ...col.head,
            x: colX,
            y: startY_pos,
            w: NODE_WIDTH,
            h: NODE_HEIGHT * 1.2, // 살짝 높게
            parent: 'root'
        };
        nodes.push(headNode);

        // Children
        let currentY = startY_pos + VERTICAL_GAP + 10;
        col.children.forEach(child => {
            nodes.push({
                ...child,
                x: colX,
                y: currentY,
                w: NODE_WIDTH,
                h: NODE_HEIGHT,
                parent: headNode
            });
            currentY += VERTICAL_GAP;
        });
    });

    centerView();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function drawConnection(p1, p2) {
    if (!p1 || !p2) return;

    ctx.beginPath();
    ctx.moveTo(p1.x + p1.w / 2, p1.y + p1.h);
    
    // 베지어 곡선 제어점 (수직으로 내려왔다 들어감)
    const cp1x = p1.x + p1.w / 2;
    const cp1y = p1.y + p1.h + 30;
    const cp2x = p2.x + p2.w / 2;
    const cp2y = p2.y - 30;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x + p2.w / 2, p2.y);
    
    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawNode(node) {
    const style = COLORS[node.type] || COLORS.gray;
    const x = node.x;
    const y = node.y;
    
    // Shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;

    // Box Background
    ctx.fillStyle = style.fill;
    drawRoundedRect(ctx, x, y, node.w, node.h, RADIUS);
    ctx.fill();

    // Highlight if hovered
    if (hoveredNode === node) {
        ctx.strokeStyle = '#2980b9';
        ctx.lineWidth = 3;
    } else {
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = 1.5;
    }
    ctx.stroke();

    // Reset Shadow for text
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Text
    ctx.fillStyle = style.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = node.type === 'root' ? 'bold 16px "Noto Sans KR"' : '500 14px "Noto Sans KR"';
    
    const lines = node.text.split('\n');
    const lineHeight = 18;
    const startY = y + (node.h / 2) - ((lines.length - 1) * lineHeight / 2);

    lines.forEach((line, i) => {
        ctx.fillText(line, x + node.w / 2, startY + (i * lineHeight));
    });
}

function drawGrid() {
    const gridSize = 40 * scale;
    const w = canvas.width;
    const h = canvas.height;
    const ox = offsetX % gridSize;
    const oy = offsetY % gridSize;

    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

    for (let x = ox; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
    }
    for (let y = oy; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
    }
    ctx.stroke();
}

function draw(isExporting = false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 내보내기 모드가 아닐 때만 배경 그리드 그리기
    if (!isExporting) {
        drawGrid();
    }

    ctx.save();
    
    if (isExporting) {
        // 내보내기 시: 캔버스 크기에 맞춰 내용이 중앙에 오도록 조정 (이미 외부에서 캔버스 크기를 맞춤)
        // 하지만 drawNode 등은 절대 좌표를 쓰므로, 여기서는 전체 노드들을 감싸는 오프셋만큼 이동해줘야 함.
        // 이 로직은 downloadImage 함수에서 처리하는 것이 더 깔끔하므로, 
        // 여기서는 transform을 적용하지 않거나, 외부에서 설정한 transform을 따릅니다.
        // export 로직은 별도로 분리합니다.
    } else {
        ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
        ctx.scale(scale, scale);
    }

    // 1. Draw Connections first
    const rootNode = nodes.find(n => n.id === 'root');
    nodes.filter(n => n.parent === 'root').forEach(child => {
        drawConnection(rootNode, child);
    });
    
    // 2. Draw Nodes
    nodes.forEach(node => {
        drawNode(node);
    });

    ctx.restore();
}

// 이미지 저장 기능
function downloadImage() {
    // 1. 전체 노드를 포함하는 영역 계산
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    nodes.forEach(node => {
        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x + node.w);
        maxY = Math.max(maxY, node.y + node.h);
    });

    // 여백 추가
    const padding = 50;
    const width = maxX - minX + (padding * 2);
    const height = maxY - minY + (padding * 2);

    // 2. 현재 상태 저장
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    const originalScale = scale;
    const originalOffsetX = offsetX;
    const originalOffsetY = offsetY;

    // 3. 캔버스 크기를 전체 내용에 맞게 임시 변경
    canvas.width = width;
    canvas.height = height;

    // 4. 배경 없이 그리기 (수동 draw)
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    // 모든 노드가 (0,0) 기준이 아니라 중앙 기준 좌표계이므로, 
    // 가장 왼쪽/위쪽 노드가 (padding, padding)에 오도록 이동
    ctx.translate(-minX + padding, -minY + padding);
    
    // 연결선 그리기
    const rootNode = nodes.find(n => n.id === 'root');
    nodes.filter(n => n.parent === 'root').forEach(child => {
        drawConnection(rootNode, child);
    });
    // 노드 그리기
    nodes.forEach(node => {
        drawNode(node);
    });
    ctx.restore();

    // 5. 다운로드 트리거
    const link = document.createElement('a');
    link.download = '분리배출_서비스_구조도.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // 6. 상태 복구
    canvas.width = originalWidth;
    canvas.height = originalHeight;
    // draw() 함수가 scale, offsetX 등을 사용하므로 변수 복구 불필요 (변수 자체는 안 바뀜)
    draw();
}

// View Control Functions
function centerView() {
    offsetX = 0;
    offsetY = 0; // 중앙 정렬
    scale = 0.8;
    draw();
}

function resetView() {
    centerView();
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left - canvas.width / 2 - offsetX) / scale,
        y: (e.clientY - rect.top - canvas.height / 2 - offsetY) / scale
    };
}

// Event Listeners
window.addEventListener('resize', resizeCanvas);

canvas.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    container.style.cursor = 'grabbing';
});

window.addEventListener('mousemove', e => {
    if (isDragging) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        draw();
    } else {
        // Hover Check
        const pos = getMousePos(e);
        const prevHover = hoveredNode;
        hoveredNode = null;
        
        for (const node of nodes) {
            if (pos.x >= node.x && pos.x <= node.x + node.w &&
                pos.y >= node.y && pos.y <= node.y + node.h) {
                hoveredNode = node;
                break;
            }
        }

        if (prevHover !== hoveredNode) {
            canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
            draw();
        }
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    container.style.cursor = 'grab';
});

canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    const newScale = Math.min(Math.max(0.2, scale + delta), 3);
    
    // Zoom towards mouse pointer logic could be added here, 
    // but simple center zoom is often enough for this use case
    scale = newScale;
    draw();
}, { passive: false });

// Initialize
initLayout();
resizeCanvas();
