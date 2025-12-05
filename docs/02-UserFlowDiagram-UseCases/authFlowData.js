(function() {
    const canvas = document.getElementById('diagramCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const { drawRect, drawDiamond, drawOval, drawText, drawPolyLineArrow, drawActor, drawUseCase, drawSolidArrow, drawDashedArrow } = DiagramCommons;
    const CONSTANTS = DiagramCommons.CONSTANTS;

    const flowdata = {
        nodes: {},
        edges: [],
        initData() {
            const centerX = canvas.width / 2;
            const startY = 50;
            const gapY = 100;
            const colGap = 280;
            const leftCol = centerX - colGap;
            const midCol = centerX;
            const rightCol = centerX + colGap;

            this.nodes = {
                start: { type: 'terminal', x: midCol, y: startY, label: "Start" },
                select: { type: 'process', x: midCol, y: startY + gapY * 0.8, label: "로그인 선택" },
                find: { type: 'process', x: leftCol, y: startY + gapY * 2, label: "아이디, 패스워드 찾기" },
                authFind: { type: 'decision', x: leftCol, y: startY + gapY * 3, label: "인증" },
                checkInfo: { type: 'process', x: leftCol, y: startY + gapY * 4, label: "아이디 패스워드 확인" },
                inputLogin: { type: 'process', x: midCol, y: startY + gapY * 2, label: "아이디, 패스워드 입력" },
                checkLogin: { type: 'decision', x: midCol, y: startY + gapY * 3, label: "로그인\n성공여부" },
                signup: { type: 'process', x: rightCol, y: startY + gapY * 2, label: "회원가입" },
                agree: { type: 'decision', x: rightCol, y: startY + gapY * 3, label: "개인정보\n동의여부" },
                inputInfo: { type: 'process', x: rightCol, y: startY + gapY * 4, label: "개인정보 입력" },
                confirmJoin: { type: 'decision', x: rightCol, y: startY + gapY * 5, label: "가입확인" },
                cancel: { type: 'process', x: rightCol + 200, y: startY + gapY * 3, label: "회원가입 취소" },
                loginEnd: { type: 'process', x: midCol, y: startY + gapY * 6.5, label: "로그인" }
            };
            this.edges = [
                { from: 'start', to: 'select' },
                { from: 'select', to: 'find', points: [{x: midCol, y: this.nodes.select.y + 40}, {x: leftCol, y: this.nodes.select.y + 40}] },
                { from: 'select', to: 'inputLogin' },
                { from: 'select', to: 'signup', points: [{x: midCol, y: this.nodes.select.y + 40}, {x: rightCol, y: this.nodes.select.y + 40}] },
                { from: 'find', to: 'authFind' },
                { from: 'authFind', to: 'checkInfo', label: "Yes" },
                { from: 'authFind', to: 'find', label: "No", points: [{x: leftCol + 100, y: this.nodes.authFind.y}, {x: leftCol + 100, y: this.nodes.find.y}] },
                { from: 'checkInfo', to: 'loginEnd', points: [{x: leftCol, y: this.nodes.loginEnd.y}] },
                { from: 'inputLogin', to: 'checkLogin' },
                { from: 'checkLogin', to: 'loginEnd', label: "Yes" },
                { from: 'checkLogin', to: 'find', label: "No", points: [{x: midCol - 100, y: this.nodes.checkLogin.y}, {x: midCol - 100, y: this.nodes.find.y + 20}, {x: leftCol + 100, y: this.nodes.find.y + 20}] },
                { from: 'signup', to: 'agree' },
                { from: 'agree', to: 'inputInfo', label: "Yes" },
                { from: 'agree', to: 'cancel', label: "No" },
                { from: 'inputInfo', to: 'confirmJoin' },
                { from: 'confirmJoin', to: 'loginEnd', label: "Yes", points: [{x: rightCol, y: this.nodes.loginEnd.y}] },
                { from: 'confirmJoin', to: 'cancel', label: "No", points: [{x: rightCol + 200, y: this.nodes.confirmJoin.y}] },
                { from: 'cancel', to: 'select', points: [{x: rightCol + 200, y: this.nodes.select.y}] }
            ];
        },
        draw() {
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = CONSTANTS.STROKE_COLOR;
            ctx.fillStyle = CONSTANTS.SHAPE_FILL;
            this.edges.forEach(edge => {
                const n1 = this.nodes[edge.from], n2 = this.nodes[edge.to];
                let startP = { x: n1.x, y: n1.y }, endP = { x: n2.x, y: n2.y };
                if (n1.type === 'process' || n1.type === 'terminal') {
                    if (edge.points && edge.points[0].y > n1.y) startP.y += 25;
                    else if (edge.points && edge.points[0].y < n1.y) startP.y -= 25;
                    else if (n2.y > n1.y) startP.y += 25; else if (n2.y < n1.y) startP.y -= 25;
                    else if (n2.x > n1.x) startP.x += 80; else startP.x -= 80;
                } else if (n1.type === 'decision') {
                    if (n2.y > n1.y) startP.y += 40; else if (n2.x > n1.x) startP.x += 60; else if (n2.x < n1.x) startP.x -= 60;
                }
                let lastP = (edge.points && edge.points.length > 0) ? edge.points[edge.points.length-1] : startP;
                if (n2.type === 'process' || n2.type === 'terminal') {
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
                else if (n.type === 'process') drawRect(ctx, n.x, n.y, 160, 50);
                else if (n.type === 'decision') drawDiamond(ctx, n.x, n.y, 120, 80);
                
                ctx.fillStyle = CONSTANTS.STROKE_COLOR;
                ctx.font = `${CONSTANTS.FONT_SIZE}px 'Noto Sans KR', sans-serif`;
                drawText(ctx, n.label, n.x, n.y, CONSTANTS.FONT_SIZE);
            }
        }
    };

    const usecase = {
        actors: {},
        useCasesPrimary: {},
        useCasesSecondary: {},
        initData() {
            const centerX = canvas.width / 2, centerY = canvas.height / 2;
            const primaryX = centerX, actorX = centerX - 450, secondaryX = centerX + 450;
            const topGroupY = centerY - 250, mainGroupY = centerY + 120;
            this.actors = {
                nonMember: { x: actorX, y: topGroupY, label: "비회원" },
                member: { x: actorX, y: mainGroupY, label: "회원" }
            };
            this.useCasesPrimary = {
                signup: { x: primaryX, y: topGroupY, label: "회원가입" },
                login: { x: primaryX, y: mainGroupY - 50, label: "로그인" },
                findId: { x: primaryX, y: mainGroupY + 80, label: "아이디 찾기" },
                findPw: { x: primaryX, y: mainGroupY + 180, label: "비밀번호 찾기" }
            };
            const gapRightY = 90, startRightY = centerY - 180;
            this.useCasesSecondary = {
                infoReg: { x: secondaryX, y: topGroupY, label: "정보등록" },
                wasteAI: { x: secondaryX, y: startRightY, label: "폐기물 촬영·AI 인식" },
                guide: { x: secondaryX, y: startRightY + gapRightY, label: "가이드 및/배출규정 매핑" },
                auth: { x: secondaryX, y: startRightY + gapRightY * 2, label: "인증 및 포인트 적립" },
                proxy: { x: secondaryX, y: startRightY + gapRightY * 3, label: "대리수거 매칭" },
                community: { x: secondaryX, y: startRightY + gapRightY * 4, label: "커뮤니티·챌린지·랭킹" },
                shop: { x: secondaryX, y: startRightY + gapRightY * 5, label: "상점(포인트 사용)" },
                volunteer: { x: secondaryX, y: startRightY + gapRightY * 6, label: "자원봉사 모집" }
            };
        },
        draw() {
            const useCaseWidth = 220;
            drawSolidArrow(ctx, this.actors.nonMember.x + 20, this.actors.nonMember.y + 30, this.useCasesPrimary.signup.x - useCaseWidth/2, this.useCasesPrimary.signup.y);
            const memberActor = this.actors.member;
            drawSolidArrow(ctx, memberActor.x + 20, memberActor.y + 30, this.useCasesPrimary.login.x - useCaseWidth/2, this.useCasesPrimary.login.y);
            drawSolidArrow(ctx, memberActor.x + 20, memberActor.y + 30, this.useCasesPrimary.findId.x - useCaseWidth/2, this.useCasesPrimary.findId.y);
            drawSolidArrow(ctx, memberActor.x + 20, memberActor.y + 30, this.useCasesPrimary.findPw.x - useCaseWidth/2, this.useCasesPrimary.findPw.y);
            
            drawDashedArrow(ctx, this.useCasesPrimary.signup.x + useCaseWidth/2, this.useCasesPrimary.signup.y, this.useCasesSecondary.infoReg.x - useCaseWidth/2, this.useCasesSecondary.infoReg.y, '<< include >>');
            
            const loginUC = this.useCasesPrimary.login;
            const features = Object.values(this.useCasesSecondary).filter(f => f !== this.useCasesSecondary.infoReg);
            features.forEach(feature => {
                drawDashedArrow(ctx, loginUC.x + useCaseWidth/2, loginUC.y, feature.x - useCaseWidth/2, feature.y, '<< include >>');
            });
            
            Object.values(this.actors).forEach(a => drawActor(ctx, a.x, a.y, a.label));
            
            ctx.strokeStyle = CONSTANTS.STROKE_COLOR;
            Object.values(this.useCasesPrimary).forEach(uc => {
                const {x, y, label} = uc;
                ctx.beginPath();
                ctx.fillStyle = CONSTANTS.USE_CASE_FILL;
                ctx.ellipse(x, y, useCaseWidth / 2, CONSTANTS.USE_CASE_HEIGHT / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = CONSTANTS.STROKE_COLOR;
                ctx.font = '14px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                drawText(ctx, label, x, y, CONSTANTS.FONT_SIZE);
            });
            Object.values(this.useCasesSecondary).forEach(uc => {
                const {x, y, label} = uc;
                ctx.beginPath();
                ctx.fillStyle = CONSTANTS.USE_CASE_FILL;
                ctx.ellipse(x, y, useCaseWidth / 2, CONSTANTS.USE_CASE_HEIGHT / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = CONSTANTS.STROKE_COLOR;
                ctx.font = '14px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                drawText(ctx, label, x, y, CONSTANTS.FONT_SIZE);
            });
        }
    };

    DiagramCommons.setupDiagramLifecycle(canvas, ctx, { flowdata, usecase }, {
        flowdata: { scale: 0.8 },
        usecase: { scale: 0.9 }
    });
})();
