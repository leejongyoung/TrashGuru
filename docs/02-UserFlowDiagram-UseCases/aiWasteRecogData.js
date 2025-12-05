(function() {
    const canvas = document.getElementById('diagramCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const { drawRect, drawDiamond, drawOval, drawCylinder, drawNote, drawText, drawPolyLineArrow, drawActor, drawUseCase, drawSolidArrow, drawDashedArrow } = DiagramCommons;
    const CONSTANTS = DiagramCommons.CONSTANTS;

    const flowdata = {
        nodes: {},
        edges: [],
        
        initData() {
            const centerX = canvas.width / 2;
            const startY = 50;
            const gapY = 80;

            this.nodes = {
                start: { type: 'terminal', x: centerX, y: startY, label: "Start" },
                click: { type: 'process', x: centerX, y: startY + gapY * 1, label: "촬영 버튼 클릭" },
                camera: { type: 'process', x: centerX, y: startY + gapY * 2, label: "카메라 실행" },
                capture: { type: 'process', x: centerX, y: startY + gapY * 3, label: "폐기물 촬영" },
                send: { type: 'process', x: centerX, y: startY + gapY * 4, label: "이미지 AI 서버 전송" },
                analyze: { type: 'process', x: centerX, y: startY + gapY * 5, label: "AI서버 품목\n+ 신뢰도 분석" },
                success: { type: 'decision', x: centerX, y: startY + gapY * 6.5, label: "인식 성공여부" },
                note: { type: 'note', x: centerX - 180, y: startY + gapY * 6.5, label: "신뢰도 >= 80%" },
                getCode: { type: 'process', x: centerX, y: startY + gapY * 8, label: "품목 코드 획득" },
                mapping: { type: 'process', x: centerX, y: startY + gapY * 9, label: "품목·재질·매핑 조회" },
                display: { type: 'process', x: centerX, y: startY + gapY * 10, label: "품목·재질·신뢰도 표시" },
                guide: { type: 'process', x: centerX, y: startY + gapY * 11, label: "배출 가이드 조회" },
                db: { type: 'db', x: centerX - 200, y: startY + gapY * 9, label: "품목·재질\n매핑 DB" },
                retake: { type: 'decision', x: centerX + 250, y: startY + gapY * 6.5, label: "재촬영\n여부" },
                manual: { type: 'process', x: centerX + 500, y: startY + gapY * 6.5, label: "품목·재질 수동선택" },
                save: { type: 'process', x: centerX + 500, y: startY + gapY * 7.5, label: "선택값 저장" }
            };

            this.edges = [
                { from: 'start', to: 'click' }, { from: 'click', to: 'camera' }, { from: 'camera', to: 'capture' },
                { from: 'capture', to: 'send' }, { from: 'send', to: 'analyze' }, { from: 'analyze', to: 'success' },
                { from: 'success', to: 'getCode', label: "Yes" }, { from: 'getCode', to: 'mapping' },
                { from: 'mapping', to: 'display' }, { from: 'display', to: 'guide' }, { from: 'db', to: 'mapping' },
                { from: 'success', to: 'retake', label: "No" },
                { from: 'retake', to: 'camera', label: "Yes", points: [{x: this.nodes.retake.x, y: this.nodes.camera.y}] },
                { from: 'retake', to: 'manual', label: "No" }, { from: 'manual', to: 'save' },
                { from: 'save', to: 'guide', points: [{x: this.nodes.save.x, y: this.nodes.guide.y}] }
            ];
        },

        draw() {
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = CONSTANTS.STROKE_COLOR;
            this.edges.forEach(edge => {
                const n1 = this.nodes[edge.from];
                const n2 = this.nodes[edge.to];
                if (!n1 || !n2) return;
                let startP = { x: n1.x, y: n1.y }, endP = { x: n2.x, y: n2.y };
                if (n1.type === 'process' || n1.type === 'terminal' || n1.type === 'db') {
                    if (edge.points && edge.points[0].y < n1.y) startP.y -= 25;
                    else if (n2.y > n1.y || (edge.points && edge.points[0].y > n1.y)) startP.y += 25;
                    else if (n2.x > n1.x) startP.x += 80; else startP.x -= 80;
                } else if (n1.type === 'decision') {
                    if (n2.y > n1.y && (!edge.points || edge.points[0].y > n1.y)) startP.y += 40;
                    else if (n2.x > n1.x) startP.x += 60; else startP.x -= 60;
                }
                let lastP = (edge.points && edge.points.length > 0) ? edge.points[edge.points.length - 1] : startP;
                if (n2.type === 'process' || n2.type === 'terminal' || n2.type === 'db') {
                    if (lastP.y < n2.y) endP.y -= 25; else if (lastP.y > n2.y) endP.y += 25;
                    else if (lastP.x < n2.x) endP.x -= 80; else endP.x += 80;
                } else if (n2.type === 'decision') {
                    if (lastP.y < n2.y) endP.y -= 40; else if (lastP.x < n2.x) endP.x -= 60; else endP.x += 60;
                }
                drawPolyLineArrow(ctx, startP, endP, edge.points);
                if (edge.label) {
                    let lx, ly;
                    if (n1.type === 'decision') {
                        if (edge.points) { lx = (startP.x + edge.points[0].x) / 2; ly = (startP.y + edge.points[0].y) / 2 - 10; } 
                        else { lx = (startP.x + endP.x) / 2; ly = (startP.y + endP.y) / 2 - 10; }
                        if (edge.label === 'No' && n2.x > n1.x) ly -= 5;
                    } else { lx = (startP.x + endP.x) / 2; ly = (startP.y + endP.y) / 2; }
                    ctx.save(); ctx.fillStyle = '#fff'; ctx.fillRect(lx - 10, ly - 7, 20, 14); ctx.restore();
                    ctx.fillStyle = '#000'; ctx.font = '12px sans-serif'; ctx.fillText(edge.label, lx, ly);
                }
            });
            for (let key in this.nodes) {
                const n = this.nodes[key];
                ctx.fillStyle = (n.type === 'note') ? CONSTANTS.NOTE_FILL : CONSTANTS.SHAPE_FILL;
                if (n.type === 'terminal') drawOval(ctx, n.x, n.y, 140, 50);
                else if (n.type === 'process') drawRect(ctx, n.x, n.y, 180, 50);
                else if (n.type === 'decision') drawDiamond(ctx, n.x, n.y, 120, 80);
                else if (n.type === 'db') drawCylinder(ctx, n.x, n.y, 100, 70);
                else if (n.type === 'note') {
                    drawNote(ctx, n.x, n.y, 120, 40);
                    ctx.fillStyle = CONSTANTS.SHAPE_FILL;
                }
                
                ctx.fillStyle = CONSTANTS.STROKE_COLOR;
                ctx.font = `${CONSTANTS.FONT_SIZE}px 'Noto Sans KR', sans-serif`;
                drawText(ctx, n.label, n.x, n.y, CONSTANTS.FONT_SIZE);
            }
        }
    };

    const usecase = {
        actors: {},
        useCases: {},

        initData() {
            const centerX = canvas.width / 2; const centerY = canvas.height / 2;
            const leftActorX = centerX - 400; const rightActorX = centerX + 400;
            const middleX = centerX - 50; const rightUseCaseX = centerX + 200;
            this.actors = {
                user: { x: leftActorX, y: centerY, label: "사용자" },
                camera: { x: rightActorX, y: centerY - 80, label: "디바이스 카메라" },
                server: { x: rightActorX, y: centerY + 80, label: "AI 인식 서버" }
            };
            this.useCases = {
                login: { x: middleX, y: centerY - 150, label: "로그인" },
                wasteRec: { x: middleX, y: centerY, label: "폐기물 인식" },
                aiRec: { x: rightUseCaseX, y: centerY, label: "AI 인식" },
                guide: { x: middleX, y: centerY + 180, label: "배출 가이드 조회" },
                manualSelect: { x: rightUseCaseX, y: centerY + 180, label: "품목 수동 선택" }
            };
        },

        draw() {
            drawSolidArrow(ctx, this.actors.user.x + 20, this.actors.user.y + 30, this.useCases.login.x - CONSTANTS.USE_CASE_WIDTH/2, this.useCases.login.y);
            drawSolidArrow(ctx, this.actors.user.x + 20, this.actors.user.y + 30, this.useCases.wasteRec.x - CONSTANTS.USE_CASE_WIDTH/2, this.useCases.wasteRec.y);
            drawSolidArrow(ctx, this.useCases.wasteRec.x + CONSTANTS.USE_CASE_WIDTH/2, this.useCases.wasteRec.y, this.useCases.aiRec.x - CONSTANTS.USE_CASE_WIDTH/2, this.useCases.aiRec.y);
            drawSolidArrow(ctx, this.actors.camera.x - 20, this.actors.camera.y + 30, this.useCases.aiRec.x + CONSTANTS.USE_CASE_WIDTH/2, this.useCases.aiRec.y - 10);
            drawSolidArrow(ctx, this.actors.server.x - 20, this.actors.server.y + 30, this.useCases.aiRec.x + CONSTANTS.USE_CASE_WIDTH/2, this.useCases.aiRec.y + 10);
            drawDashedArrow(ctx, this.useCases.wasteRec.x, this.useCases.wasteRec.y + CONSTANTS.USE_CASE_HEIGHT/2, this.useCases.guide.x, this.useCases.guide.y - CONSTANTS.USE_CASE_HEIGHT/2, "<< include >>");
            drawDashedArrow(ctx, this.useCases.wasteRec.x + CONSTANTS.USE_CASE_WIDTH/4, this.useCases.wasteRec.y + CONSTANTS.USE_CASE_HEIGHT/2 - 10, this.useCases.manualSelect.x - CONSTANTS.USE_CASE_WIDTH/4, this.useCases.manualSelect.y - CONSTANTS.USE_CASE_HEIGHT/2, "<< extend >>");
            Object.values(this.actors).forEach(a => drawActor(ctx, a.x, a.y, a.label));
            Object.values(this.useCases).forEach(uc => drawUseCase(ctx, uc.x, uc.y, uc.label));
        }
    };

    DiagramCommons.setupDiagramLifecycle(canvas, ctx, { flowdata, usecase }, {
        flowdata: { scale: 0.8 },
        usecase: { scale: 1.0 }
    });
})();
