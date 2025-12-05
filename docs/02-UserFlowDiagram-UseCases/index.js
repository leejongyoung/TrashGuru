window.DiagramCommons = {
    CANVAS_STATE: {
        scale: 1.0,
        isPanning: false,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
    },
    
    CONSTANTS: {
        SHAPE_FILL: '#FFFFD0',
        NOTE_FILL: '#E0F7FA',
        STROKE_COLOR: '#000000',
        FONT_SIZE: 14,
        USE_CASE_WIDTH: 200,
        USE_CASE_HEIGHT: 80,
        USE_CASE_FILL: '#FFFFD0',
    },

    drawRect(ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x - w / 2, y - h / 2, w, h);
        ctx.fill();
        ctx.stroke();
    },

    drawDiamond(ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.moveTo(x, y - h / 2);
        ctx.lineTo(x + w / 2, y);
        ctx.lineTo(x, y + h / 2);
        ctx.lineTo(x - w / 2, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },

    drawOval(ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    },

    drawCylinder(ctx, x, y, w, h) {
        const ovalH = h * 0.15;
        const cy1 = y - h / 2 + ovalH; // Top center
        const cy2 = y + h / 2 - ovalH; // Bottom center

        // Body
        ctx.beginPath();
        ctx.moveTo(x - w / 2, cy1);
        ctx.lineTo(x - w / 2, cy2);
        // Bottom arc: Left (PI) to Right (0) via Bottom (Counter-clockwise)
        ctx.ellipse(x, cy2, w / 2, ovalH, 0, Math.PI, 0, true);
        ctx.lineTo(x + w / 2, cy1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Top Ellipse
        ctx.beginPath();
        ctx.ellipse(x, cy1, w / 2, ovalH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    },

    drawNote(ctx, x, y, w, h) {
        const r = 10;
        const right = x + w / 2;
        const left = x - w / 2;
        const top = y - h / 2;
        const bottom = y + h / 2;

        ctx.beginPath();
        
        // Top edge
        ctx.moveTo(left + r, top);
        ctx.lineTo(right - r, top);
        ctx.quadraticCurveTo(right, top, right, top + r);

        // Right edge & Tail (centered)
        ctx.lineTo(right, y - 10); 
        ctx.lineTo(right + 20, y);
        ctx.lineTo(right, y + 10);
        ctx.lineTo(right, bottom - r);
        
        // Bottom edge
        ctx.quadraticCurveTo(right, bottom, right - r, bottom);
        ctx.lineTo(left + r, bottom);
        ctx.quadraticCurveTo(left, bottom, left, bottom - r);

        // Left edge
        ctx.lineTo(left, top + r);
        ctx.quadraticCurveTo(left, top, left + r, top);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },

    drawText(ctx, text, x, y, FONT_SIZE) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lines = text.split('\n');
        if (lines.length > 1) {
            const lineHeight = FONT_SIZE * 1.2;
            const startY = y - ((lines.length - 1) * lineHeight) / 2;
            lines.forEach((line, i) => ctx.fillText(line, x, startY + i * lineHeight));
        } else {
            ctx.fillText(text, x, y);
        }
    },

    drawPolyLineArrow(ctx, start, end, points, style) {
        let prevX = start.x;
        let prevY = start.y;

        ctx.save();
        if (style === 'dashed') {
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = '#555';
        }

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        if (points) {
            points.forEach(p => {
                ctx.lineTo(p.x, p.y);
                prevX = p.x;
                prevY = p.y;
            });
        }
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        const headLen = 10;
        const angle = Math.atan2(end.y - prevY, end.x - prevX);
        
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = (style === 'dashed') ? '#555' : DiagramCommons.CONSTANTS.STROKE_COLOR;
        ctx.fill();
        ctx.restore();
    },
    
    drawActor(ctx, x, y, label) {
        ctx.beginPath();
        ctx.strokeStyle = DiagramCommons.CONSTANTS.STROKE_COLOR;
        ctx.lineWidth = 1.5;
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.moveTo(x, y + 15);
        ctx.lineTo(x, y + 55);
        ctx.moveTo(x - 20, y + 30);
        ctx.lineTo(x + 20, y + 30);
        ctx.moveTo(x, y + 55);
        ctx.lineTo(x - 15, y + 85);
        ctx.moveTo(x, y + 55);
        ctx.lineTo(x + 15, y + 85);
        ctx.stroke();
        ctx.fillStyle = DiagramCommons.CONSTANTS.STROKE_COLOR;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y + 100);
    },

    drawUseCase(ctx, x, y, label) {
        ctx.beginPath();
        ctx.fillStyle = DiagramCommons.CONSTANTS.USE_CASE_FILL;
        ctx.strokeStyle = DiagramCommons.CONSTANTS.STROKE_COLOR;
        ctx.lineWidth = 1;
        ctx.ellipse(x, y, DiagramCommons.CONSTANTS.USE_CASE_WIDTH / 2, DiagramCommons.CONSTANTS.USE_CASE_HEIGHT / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = DiagramCommons.CONSTANTS.STROKE_COLOR;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y);
    },

    drawSolidArrow(ctx, fromX, fromY, toX, toY) {
        const headLength = 12;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = DiagramCommons.CONSTANTS.STROKE_COLOR;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = DiagramCommons.CONSTANTS.STROKE_COLOR;
        ctx.fill();
    },

    drawDashedArrow(ctx, fromX, fromY, toX, toY, label) {
        const headLength = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.save();
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = DiagramCommons.CONSTANTS.STROKE_COLOR;
        ctx.stroke();
        ctx.restore();
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = DiagramCommons.CONSTANTS.STROKE_COLOR;
        ctx.fill();
        if (label) {
            ctx.font = '12px sans-serif';
            const midX = (fromX + toX) / 2;
            const midY = (fromY + toY) / 2;
            const textMetrics = ctx.measureText(label);
            const textWidth = textMetrics.width;
            ctx.save();
            ctx.fillStyle = 'white';
            ctx.fillRect(midX - textWidth / 2 - 2, midY - 10, textWidth + 4, 20);
            ctx.restore();
            ctx.fillStyle = DiagramCommons.CONSTANTS.STROKE_COLOR;
            ctx.fillText(label, midX, midY);
        }
    },

    drawGeneralizationArrow(ctx, fromX, fromY, toX, toY) {
        const headLength = 15;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = DiagramCommons.CONSTANTS.STROKE_COLOR;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
    },

    setupPanAndZoom(canvas, onDraw, state) {
        canvas.addEventListener('mousedown', (e) => {
            state.isPanning = true;
            state.startX = e.clientX - state.offsetX;
            state.startY = e.clientY - state.offsetY;
            canvas.style.cursor = 'grabbing';
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!state.isPanning) return;
            e.preventDefault();
            state.offsetX = e.clientX - state.startX;
            state.offsetY = e.clientY - state.startY;
            onDraw();
        });

        const endPan = () => {
            state.isPanning = false;
            canvas.style.cursor = 'grab';
        };

        canvas.addEventListener('mouseup', endPan);
        canvas.addEventListener('mouseleave', endPan);

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomIntensity = 0.1;
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;
            const worldX = (mouseX - state.offsetX) / state.scale;
            const worldY = (mouseY - state.offsetY) / state.scale;
            const delta = e.deltaY < 0 ? 1 : -1;
            const newScale = state.scale + delta * zoomIntensity * state.scale;
            if (newScale > 0.1 && newScale < 10) {
                state.scale = newScale;
                state.offsetX = mouseX - worldX * state.scale;
                state.offsetY = mouseY - worldY * state.scale;
            }
            onDraw();
        }, { passive: false });
    },

    setupDiagramLifecycle(canvas, ctx, dataObjects, config = {}) {
        const { CANVAS_STATE: state, setupPanAndZoom } = DiagramCommons;
        let currentDiagram = '';
        
        const modes = Object.keys(dataObjects);
        const isSingle = modes.length === 1;
        const initialMode = modes[0];

        function handleResize() {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Re-init data for current mode or all? 
            // Original code re-inited based on currentDiagram. 
            // Let's init the active one to be safe and efficient.
            const mode = currentDiagram || initialMode;
            if (dataObjects[mode] && dataObjects[mode].initData) {
                dataObjects[mode].initData();
            }
            
            draw();
        }

        function draw() {
            if (!ctx) return;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Auto-fit logic
            // Assuming a "logical" diagram size. Most diagrams are centered around canvas.width/2 in initData.
            // But since we want consistent centering, let's assume a virtual canvas size the diagrams were designed for.
            // Based on typical offsets (e.g. centerX +/- 400), a width of ~1600 and height ~1200 covers most.
            const DIAGRAM_WIDTH = 1600;
            const DIAGRAM_HEIGHT = 1200;

            // If scale is 1.0 (reset or initial), recalculate to fit
            if (state.scale === 1.0 && state.offsetX === 0 && state.offsetY === 0) {
                const scaleX = canvas.width / DIAGRAM_WIDTH;
                const scaleY = canvas.height / DIAGRAM_HEIGHT;
                state.scale = Math.min(scaleX, scaleY) * 0.9; // 0.9 for padding
                
                // Center it
                // The content is drawn around center (canvas.width/2, 50...) in data files?
                // No, initData uses current canvas.width/2. 
                // So if we scale, we need to translate to center.
                // But wait, the data files use `canvas.width` in `initData`.
                // If we resize canvas, `initData` updates coordinates to center of NEW canvas.
                // So `offsetX/Y` should largely be 0 if `initData` does its job correctly for position.
                // However, to ensure "constant visual size" regardless of window size (zooming out on small screens),
                // we apply scale.
                
                // Since initData centers nodes at `canvas.width/2`, scaling around center is ideal.
                // But standard `scale` scales from (0,0).
                // To scale around center: translate(w/2, h/2) scale(s) translate(-w/2, -h/2).
                
                // Our transform is: translate(offsetX, offsetY) scale(s).
                // If initData puts things at center, we just need to scale relative to center.
                // Effectively: offsetX = (canvas.width - canvas.width * scale) / 2? 
                // No, that centers the top-left corner if content was at 0,0.
                
                // Let's keep it simple: 
                // The request is "constant size" layout.
                // If we rely on initData centering, we just need scale.
                // But scaling shrinks everything towards 0,0.
                // So centered content moves to top-left.
                // We need to push it back to center.
                state.offsetX = (canvas.width - canvas.width * state.scale) / 2;
                state.offsetY = (canvas.height - 1000 * state.scale) / 2; // Approximate height center
            }

            const modeToDraw = currentDiagram || initialMode;
            
            ctx.translate(state.offsetX, state.offsetY);
            ctx.scale(state.scale, state.scale);
            
            if (dataObjects[modeToDraw] && dataObjects[modeToDraw].draw) {
                dataObjects[modeToDraw].draw();
            }
        }

        function showDiagram(type) {
            if (!dataObjects[type]) return;
            if (currentDiagram === type) return;
            currentDiagram = type;
            
            state.isPanning = false;
            
            const modeConfig = config[type] || {};
            state.scale = modeConfig.scale || 1.0;
            state.offsetX = modeConfig.offsetX || 0;
            state.offsetY = modeConfig.offsetY || 0;

            const flowBtn = document.getElementById('flowdataBtn');
            const usecaseBtn = document.getElementById('usecaseBtn');
            if (flowBtn) flowBtn.classList.toggle('active', type === 'flowdata');
            if (usecaseBtn) usecaseBtn.classList.toggle('active', type === 'usecase');
            
            handleResize();
        }

        setupPanAndZoom(canvas, draw, state);
        window.addEventListener('resize', handleResize);
        
        window.activeDiagramResize = handleResize;
        window.activeDiagramDraw = draw;
        
        // Initialize state once
        handleResize();

        if (!isSingle) {
            window.showDiagram = showDiagram;
            Object.defineProperty(window, 'currentDiagram', {
                get: () => currentDiagram,
                configurable: true
            });
            showDiagram(initialMode);
        } else {
            currentDiagram = initialMode;
            handleResize(); // Ensure single diagram is drawn with correct size
        }
    },

    resetView() {
        DiagramCommons.CANVAS_STATE.scale = 1.0;
        DiagramCommons.CANVAS_STATE.offsetX = 0;
        DiagramCommons.CANVAS_STATE.offsetY = 0;
        if (window.activeDiagramDraw) {
            window.activeDiagramDraw();
        }
    },

    downloadCanvas(baseFilename) {
        const canvas = document.getElementById('diagramCanvas');
        if (!canvas) return;
        const link = document.createElement('a');
        const diagramType = window.currentDiagram || 'diagram'; // Default to 'diagram' if not set
        link.download = `${baseFilename}_${diagramType}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const diagramMenu = document.getElementById('diagram-menu');
    let viewControls = document.getElementById('view-controls');
    let flowdataBtn = document.getElementById('flowdataBtn');
    let usecaseBtn = document.getElementById('usecaseBtn');
    let downloadBtn = document.getElementById('downloadBtn');
    let resetBtn = document.getElementById('resetBtn');
    
    let canvas = document.getElementById('diagramCanvas');

    let loadedScript = null;

    const diagrams = [
        { name: '분리수거 서비스 모델', file: 'mainData.js', type: 'single', diagramId: 'main_use_case', icon: '♻️' },
        { name: '로그인 및 회원관리', file: 'authFlowData.js', type: 'dual', diagramId: 'auth_flow', icon: '👤' },
        { name: '폐기물 촬영·AI 인식', file: 'aiWasteRecogData.js', type: 'dual', diagramId: 'ai_waste_recog', icon: '📷' },
        { name: '가이드 및 배출규정 매핑', file: 'disposalGuideData.js', type: 'dual', diagramId: 'disposal_guide', icon: '🗺️' },
        { name: '인증 및 포인트 적립', file: 'missionPointData.js', type: 'dual', diagramId: 'mission_point', icon: '💰' },
        { name: '대리수거 매칭', file: 'proxyMatchData.js', type: 'dual', diagramId: 'proxy_match', icon: '🤝' },
        { name: '커뮤니티·인증샷 피드·챌린지·랭킹 통합', file: 'communityFlowData.js', type: 'dual', diagramId: 'community_flow', icon: '💬' },
        { name: '상점(포인트 사용)', file: 'pointStoreData.js', type: 'dual', diagramId: 'point_store', icon: '🛒' },
        { name: '자원 봉사 모집(플로깅·자원봉사)', file: 'volunteerFlowData.js', type: 'dual', diagramId: 'volunteer_flow', icon: '🙋' },
    ];

    function cleanupPrevious() {
        if (loadedScript) {
            loadedScript.remove();
            loadedScript = null;
        }

        if (window.activeDiagramResize) {
            window.removeEventListener('resize', window.activeDiagramResize);
        }
        
        delete window.activeDiagramResize;
        delete window.activeDiagramDraw; // New: delete activeDiagramDraw
        delete window.showDiagram;
        delete window.downloadCanvas;
        delete window.resetView;
        delete window.currentDiagram;

        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'diagramCanvas';
        if (canvas && canvas.parentNode) {
            canvas.parentNode.replaceChild(newCanvas, canvas);
        }
        canvas = newCanvas;
    }

    function loadDiagram(diagram) {
        document.querySelectorAll('#diagram-menu li').forEach(item => {
            item.classList.toggle('active', item.dataset.file === diagram.file);
        });

        cleanupPrevious();

        const script = document.createElement('script');
        script.id = 'diagramScript';
        script.src = diagram.file;
        script.defer = true;
        
        script.onload = () => {
            viewControls = document.getElementById('view-controls');
            flowdataBtn = document.getElementById('flowdataBtn');
            usecaseBtn = document.getElementById('usecaseBtn');
            downloadBtn = document.getElementById('downloadBtn');
            resetBtn = document.getElementById('resetBtn');

            // Assign handlers early
            resetBtn.onclick = () => DiagramCommons.resetView();
            downloadBtn.onclick = () => DiagramCommons.downloadCanvas(diagram.diagramId);

            if (diagram.type === 'single') {
                viewControls.classList.add('hidden');
            } else {
                viewControls.classList.remove('hidden');
                
                if (window.showDiagram) {
                    window.showDiagram('flowdata');
                }
                
                flowdataBtn.onclick = () => window.showDiagram && window.showDiagram('flowdata');
                usecaseBtn.onclick = () => window.showDiagram && window.showDiagram('usecase');
            }
        };

        loadedScript = script;
        document.head.appendChild(script);
    }

    diagrams.forEach(diagram => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="menu-icon">${diagram.icon}</span><span class="menu-text">${diagram.name}</span>`;
        li.dataset.file = diagram.file;
        li.addEventListener('click', () => loadDiagram(diagram));
        diagramMenu.appendChild(li);
    });

    loadDiagram(diagrams.find(d => d.name === '분리수거 서비스 모델'));
});
