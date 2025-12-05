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
                click: { type: 'process', x: centerX, y: startY + gapY * 1, label: "봉배관내 버튼 클릭" },
                popup: { type: 'process', x: centerX, y: startY + gapY * 2, label: "위치 권한 팝업 표시" },
                permission: { type: 'decision', x: centerX, y: startY + gapY * 3, label: "위치 권한\n동의 여부" },
                location: { type: 'process', x: centerX, y: startY + gapY * 4.5, label: "현재 위치 조회" },
                manual: { type: 'process', x: centerX + 250, y: startY + gapY * 3, label: "지역 수동 선택" },
                lookup: { type: 'process', x: centerX, y: startY + gapY * 5.5, label: "지역 군정 조회" },
                db: { type: 'db', x: centerX - 250, y: startY + gapY * 5.5, label: "지역 군정 DB" },
                check: { type: 'decision', x: centerX, y: startY + gapY * 7, label: "군정 존재" },
                regional: { type: 'process', x: centerX, y: startY + gapY * 8.5, label: "지역 군정 가이드\n생성 및 표시" },
                national: { type: 'process', x: centerX + 250, y: startY + gapY * 8.5, label: "국가 수준 가이드\n생성 및 표시" }
            };
            this.edges = [
                { from: 'start', to: 'click' }, { from: 'click', to: 'popup' }, { from: 'popup', to: 'permission' },
                { from: 'permission', to: 'location', label: "Yes" },
                { from: 'permission', to: 'manual', label: "No" },
                { from: 'manual', to: 'lookup', points: [{x: this.nodes.manual.x, y: this.nodes.lookup.y}] },
                { from: 'location', to: 'lookup' }, { from: 'db', to: 'lookup' }, { from: 'lookup', to: 'check' },
                { from: 'check', to: 'regional', label: "Yes" },
                { from: 'check', to: 'national', label: "No", points: [{x: this.nodes.national.x, y: this.nodes.check.y}] }
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
                user: { x: leftActorX, y: centerY, label: "사용자" },
                gps: { x: rightActorX, y: centerY - 50, label: "GPS" },
                db: { x: rightActorX, y: centerY + 150, label: "지역 군정 DB" }
            };
            this.useCases = {
                login: { x: leftColX, y: centerY - 150, label: "로그인" },
                guide: { x: leftColX, y: centerY + 50, label: "배출 가이드 조회" },
                manualSelect: { x: rightColX, y: centerY - 180, label: "지역 수동 선택" },
                regionInfo: { x: rightColX, y: centerY - 50, label: "지역 정보" },
                rules: { x: rightColX, y: centerY + 150, label: "배출 군정" }
            };
        },
        draw() {
            drawSolidArrow(ctx, this.actors.user.x+20,this.actors.user.y+30,this.useCases.login.x-CONSTANTS.USE_CASE_WIDTH/2,this.useCases.login.y);
            drawSolidArrow(ctx, this.actors.user.x+20,this.actors.user.y+30,this.useCases.guide.x-CONSTANTS.USE_CASE_WIDTH/2,this.useCases.guide.y);
            drawSolidArrow(ctx, this.actors.gps.x-20,this.actors.gps.y+30,this.useCases.regionInfo.x+CONSTANTS.USE_CASE_WIDTH/2,this.useCases.regionInfo.y);
            drawSolidArrow(ctx, this.actors.db.x-20,this.actors.db.y+30,this.useCases.rules.x+CONSTANTS.USE_CASE_WIDTH/2,this.useCases.rules.y);
            drawSolidArrow(ctx, this.useCases.regionInfo.x-CONSTANTS.USE_CASE_WIDTH/2,this.useCases.regionInfo.y,this.useCases.guide.x+CONSTANTS.USE_CASE_WIDTH/2,this.useCases.guide.y-20);
            drawSolidArrow(ctx, this.useCases.rules.x-CONSTANTS.USE_CASE_WIDTH/2,this.useCases.rules.y,this.useCases.guide.x+CONSTANTS.USE_CASE_WIDTH/2,this.useCases.guide.y+20);
            drawDashedArrow(ctx, this.useCases.regionInfo.x,this.useCases.regionInfo.y-CONSTANTS.USE_CASE_HEIGHT/2,this.useCases.manualSelect.x,this.useCases.manualSelect.y+CONSTANTS.USE_CASE_HEIGHT/2,"<< extend >>\n");
            
            Object.values(this.actors).forEach(a=>drawActor(ctx, a.x,a.y,a.label));
            Object.values(this.useCases).forEach(uc=>drawUseCase(ctx, uc.x,uc.y,uc.label));
        }
    };

    DiagramCommons.setupDiagramLifecycle(canvas, ctx, { flowdata, usecase }, {
        flowdata: { scale: 0.8 },
        usecase: { scale: 1.0 }
    });
})();
