(function() {
    const canvas = document.getElementById('diagramCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const { drawRect, drawDiamond, drawOval, drawCylinder, drawText, drawPolyLineArrow, drawActor, drawUseCase, drawSolidArrow, drawDashedArrow } = DiagramCommons;
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
                selectMenu: { type: 'process', x: centerX, y: startY + gapY, label: "미션 메뉴 선택" },
                photo: { type: 'process', x: centerX, y: startY + gapY * 2, label: "인증샷 촬영\n또는 업로드" },
                validate: { type: 'process', x: centerX, y: startY + gapY * 3, label: "인증샷 유효성 검증" },
                isValid: { type: 'decision', x: centerX, y: startY + gapY * 4.5, label: "인증샷\n유효 여부" },
                retry: { type: 'process', x: centerX + 250, y: startY + gapY * 4.5, label: "업로드 제한 및\n재시도 안내" },
                basicPoint: { type: 'process', x: centerX, y: startY + gapY * 6, label: "기본 포인트 적립" },
                showHistory: { type: 'process', x: centerX, y: startY + gapY * 7, label: "포인트 내역 표시" },
                db: { type: 'db', x: centerX - 250, y: startY + gapY * 8.5, label: "포인트 DB" },
                stepCheck: { type: 'process', x: centerX, y: startY + gapY * 8, label: "걸음 수 데이터 조회" },
                isStepMet: { type: 'decision', x: centerX, y: startY + gapY * 9.5, label: "걸음 수\n기준 충족" },
                addPoint: { type: 'process', x: centerX, y: startY + gapY * 11, label: "추가 포인트 적립\n및 내역 갱신" },
                noChange: { type: 'process', x: centerX + 250, y: startY + gapY * 9.5, label: "포인트 변경 없음\n(기본 포인트만 지급)" }
            };
            this.edges = [
                { from: 'start', to: 'selectMenu' }, { from: 'selectMenu', to: 'photo' }, { from: 'photo', to: 'validate' },
                { from: 'validate', to: 'isValid' }, { from: 'isValid', to: 'retry', label: "No" },
                { from: 'retry', to: 'photo', points: [{x: this.nodes.retry.x, y: this.nodes.photo.y}] },
                { from: 'isValid', to: 'basicPoint', label: "Yes" }, { from: 'basicPoint', to: 'showHistory' },
                { from: 'db', to: 'showHistory', points: [{x: this.nodes.db.x, y: this.nodes.showHistory.y}] },
                { from: 'showHistory', to: 'stepCheck' }, { from: 'stepCheck', to: 'isStepMet' },
                { from: 'isStepMet', to: 'addPoint', label: "Yes" },
                { from: 'db', to: 'addPoint', points: [{x: this.nodes.db.x, y: this.nodes.addPoint.y}] },
                { from: 'isStepMet', to: 'noChange', label: "No" }
            ];
        },
        draw() {
            ctx.lineWidth = 1.5; 
            ctx.strokeStyle = CONSTANTS.STROKE_COLOR;
            this.edges.forEach(edge => {
                const n1 = this.nodes[edge.from], n2 = this.nodes[edge.to]; if (!n1 || !n2) return;
                let startP = { x: n1.x, y: n1.y }, endP = { x: n2.x, y: n2.y };
                if (n1.type === 'process' || n1.type === 'terminal' || n1.type === 'db') {
                    if (edge.points && edge.points[0].y < n1.y) startP.y -= 25;
                    else if (n2.y > n1.y || (edge.points && edge.points[0].y > n1.y)) startP.y += 25;
                    else if (n2.x > n1.x) startP.x += 80; else startP.x -= 80;
                } else if (n1.type === 'decision') {
                    if (n2.y > n1.y && (!edge.points || edge.points[0].y > n1.y)) startP.y += 40;
                    else if (n2.x > n1.x) startP.x += 60; else startP.x -= 60;
                }
                let lastP = (edge.points && edge.points.length > 0) ? edge.points[edge.points.length-1] : startP;
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
                ctx.fillStyle = CONSTANTS.SHAPE_FILL;
                if (n.type === 'terminal') drawOval(ctx, n.x, n.y, 140, 50);
                else if (n.type === 'process') drawRect(ctx, n.x, n.y, 180, 50);
                else if (n.type === 'decision') drawDiamond(ctx, n.x, n.y, 120, 80);
                else if (n.type === 'db') drawCylinder(ctx, n.x, n.y, 120, 70);

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
            const centerX = canvas.width / 2, centerY = canvas.height / 2;
            const leftActorX = centerX - 400, rightActorX = centerX + 400;
            const leftColX = centerX - 150, rightColX = centerX + 150;
            this.actors = {
                user: { x: leftActorX, y: centerY - 100, label: "사용자" },
                authSys: { x: rightActorX, y: centerY - 100, label: "인증 검증 시스템" },
                pointSys: { x: rightActorX, y: centerY + 50, label: "포인트 시스템" },
                stepSys: { x: rightActorX, y: centerY + 200, label: "걸음 수 연동 모듈" }
            };
            this.useCases = {
                login: { x: leftColX, y: centerY - 200, label: "로그인" },
                auth: { x: leftColX, y: centerY, label: "분리수거 인증" },
                block: { x: rightColX, y: centerY - 100, label: "중복 조작 사진 차단" },
                point: { x: rightColX, y: centerY + 50, label: "포인트 적립" },
                step: { x: rightColX, y: centerY + 200, label: "걸음 수 연동" }
            };
        },
        draw() {
            drawSolidArrow(ctx, this.actors.user.x+20,this.actors.user.y+30,this.useCases.login.x-CONSTANTS.USE_CASE_WIDTH/2,this.useCases.login.y);
            drawSolidArrow(ctx, this.actors.user.x+20,this.actors.user.y+30,this.useCases.auth.x-CONSTANTS.USE_CASE_WIDTH/2,this.useCases.auth.y);
            drawDashedArrow(ctx, this.useCases.auth.x+CONSTANTS.USE_CASE_WIDTH/4,this.useCases.auth.y-CONSTANTS.USE_CASE_HEIGHT/2,this.useCases.block.x-CONSTANTS.USE_CASE_WIDTH/2,this.useCases.block.y+10,"<< include >>");
            drawSolidArrow(ctx, this.useCases.auth.x+CONSTANTS.USE_CASE_WIDTH/2,this.useCases.auth.y+10,this.useCases.point.x-CONSTANTS.USE_CASE_WIDTH/2,this.useCases.point.y-10);
            drawDashedArrow(ctx, this.useCases.step.x,this.useCases.step.y-CONSTANTS.USE_CASE_HEIGHT/2,this.useCases.point.x,this.useCases.point.y+CONSTANTS.USE_CASE_HEIGHT/2,"<< extend >>");
            drawSolidArrow(ctx, this.actors.authSys.x-20,this.actors.authSys.y+30,this.useCases.block.x+CONSTANTS.USE_CASE_WIDTH/2,this.useCases.block.y);
            drawSolidArrow(ctx, this.actors.pointSys.x-20,this.actors.pointSys.y+30,this.useCases.point.x+CONSTANTS.USE_CASE_WIDTH/2,this.useCases.point.y);
            drawSolidArrow(ctx, this.actors.stepSys.x-20,this.actors.stepSys.y+30,this.useCases.step.x+CONSTANTS.USE_CASE_WIDTH/2,this.useCases.step.y);
            Object.values(this.actors).forEach(a=>drawActor(ctx, a.x,a.y,a.label));
            Object.values(this.useCases).forEach(uc=>drawUseCase(ctx, uc.x,uc.y,uc.label));
        }
    };

    DiagramCommons.setupDiagramLifecycle(canvas, ctx, { flowdata, usecase }, {
        flowdata: { scale: 0.8 },
        usecase: { scale: 1.0 }
    });
})();
