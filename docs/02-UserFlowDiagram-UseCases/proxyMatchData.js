(function() {
    const canvas = document.getElementById('diagramCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const { drawRect, drawDiamond, drawOval, drawCylinder, drawNote, drawText, drawPolyLineArrow, drawActor, drawUseCase, drawSolidArrow, drawDashedArrow, drawGeneralizationArrow } = DiagramCommons;
    const CONSTANTS = DiagramCommons.CONSTANTS;

    const flowdata = {
        nodes: {},
        edges: [],
        groups: [],
        
        initData() {
            const centerX = canvas.width/2, startY = 50, gapY = 80, colGap = 400;
            const leftCol = centerX - colGap/2 - 50, rightCol = centerX + colGap/2 + 50;
            const groupStroke = '#FF5252';

            this.groups = [
                { x: leftCol, y: startY + gapY * 7.5, w: 380, h: gapY * 13, label: "요청자", stroke: groupStroke },
                { x: rightCol, y: startY + gapY * 7.5, w: 380, h: gapY * 13, label: "수거자", stroke: groupStroke }
            ];
            this.nodes = {
                start: { type: 'terminal', x: centerX, y: startY, label: "Start" },
                menu: { type: 'process', x: centerX, y: startY + gapY, label: "대리수거 메뉴 선택" },
                reqSelect: { type: 'process', x: leftCol, y: startY + gapY * 2, label: "대리수거 요청하기 선택" },
                reqInput: { type: 'process', x: leftCol, y: startY + gapY * 3, label: "요청 정보 입력" },
                reqNote: { type: 'note', x: leftCol - 220, y: startY + gapY * 3, label: "주소·배출장소·시간\n등 요청 정보 입력" },
                addList: { type: 'process', x: leftCol, y: startY + gapY * 4, label: "요청 목록에 추가" },
                waitAssign: { type: 'process', x: leftCol, y: startY + gapY * 5, label: "수거자 배정 대기" },
                checkAssign: { type: 'decision', x: leftCol, y: startY + gapY * 6, label: "수거자\n승인 여부" },
                msgWait1: { type: 'process', x: leftCol + 200, y: startY + gapY * 6, label: "\"수거자 배정 중입니다\"\n대기 메세지 표시" },
                notifAssign: { type: 'process', x: leftCol, y: startY + gapY * 7, label: "수거자 승인 알림 수신" },
                placeWaste: { type: 'process', x: leftCol, y: startY + gapY * 8, label: "입력한 장소에\n폐기물 배치" },
                checkCert: { type: 'decision', x: leftCol, y: startY + gapY * 9, label: "수거자 배출\n인증 완료 여부" },
                msgWait2: { type: 'process', x: leftCol + 200, y: startY + gapY * 9, label: "\"수거자가 인증 전 입니다\"\n대기 메세지 표시" },
                notifPay: { type: 'process', x: leftCol, y: startY + gapY * 10, label: "결제 진행 알림 수신" },
                doPay: { type: 'process', x: leftCol, y: startY + gapY * 11, label: "등록된 결제수단 및\n포인트로 결제 진행" },
                checkPay: { type: 'decision', x: leftCol, y: startY + gapY * 12, label: "정상 결제\n가능 여부" },
                msgPayError: { type: 'process', x: leftCol + 200, y: startY + gapY * 12, label: "결제 오류 및\n재시도 안내" },
                complete: { type: 'process', x: leftCol, y: startY + gapY * 13, label: "결제 완료" },
                dbReq: { type: 'db', x: rightCol + 200, y: startY + gapY * 2, label: "대리수거\n요청 DB" },
                viewReqList: { type: 'process', x: rightCol, y: startY + gapY * 2, label: "대리수거\n목록 조회" },
                selectReq: { type: 'process', x: rightCol, y: startY + gapY * 3, label: "요청 선택" },
                clickApprove: { type: 'process', x: rightCol, y: startY + gapY * 4, label: "수거 승인 클릭" },
                checkCancel: { type: 'decision', x: rightCol, y: startY + gapY * 5, label: "수거자\n취소 여부" },
                processCancel: { type: 'process', x: rightCol + 200, y: startY + gapY * 5, label: "요청자에게 알림\n& 요청 목록에 재등록" },
                sendApprove: { type: 'process', x: rightCol, y: startY + gapY * 6, label: "요청자에게\n승인 알림 발송" },
                pickup: { type: 'process', x: rightCol, y: startY + gapY * 7.5, label: "요청자 폐기물 픽업\n및 배출 진행" },
                uploadCert: { type: 'process', x: rightCol, y: startY + gapY * 8.5, label: "배출 완료 인증 업로드" },
                checkValid: { type: 'decision', x: rightCol, y: startY + gapY * 9.5, label: "인증 사진\n유효 여부" },
                reqRetake: { type: 'process', x: rightCol + 200, y: startY + gapY * 9.5, label: "재촬영 요청" },
                givePoint: { type: 'process', x: rightCol, y: startY + gapY * 10.5, label: "포인트 지급" },
                sendPayNotif: { type: 'process', x: rightCol, y: startY + gapY * 11.5, label: "요청자에게 결제 진행\n알림 발송" }
            };
            this.edges = [
                { from: 'start', to: 'menu' },
                { from: 'menu', to: 'reqSelect', points: [{x:centerX,y:this.nodes.menu.y+40},{x:leftCol,y:this.nodes.menu.y+40}] },
                { from: 'menu', to: 'viewReqList', points: [{x:centerX,y:this.nodes.menu.y+40},{x:rightCol,y:this.nodes.menu.y+40}] },
                { from: 'reqSelect', to: 'reqInput' },
                { from: 'reqInput', to: 'addList' },
                { from: 'addList', to: 'waitAssign' },
                { from: 'waitAssign', to: 'checkAssign' },
                { from: 'checkAssign', to: 'msgWait1', label: "No" },
                { from: 'msgWait1', to: 'checkAssign', points: [{x:this.nodes.msgWait1.x,y:this.nodes.checkAssign.y-40}] },
                { from: 'checkAssign', to: 'notifAssign', label: "Yes" },
                { from: 'notifAssign', to: 'placeWaste' },
                { from: 'placeWaste', to: 'checkCert' },
                { from: 'checkCert', to: 'msgWait2', label: "No" },
                { from: 'msgWait2', to: 'checkCert', points: [{x:this.nodes.msgWait2.x,y:this.nodes.checkCert.y-40}] },
                { from: 'checkCert', to: 'notifPay', label: "Yes" },
                { from: 'notifPay', to: 'doPay' },
                { from: 'doPay', to: 'checkPay' },
                { from: 'checkPay', to: 'msgPayError', label: "No" },
                { from: 'msgPayError', to: 'doPay', points: [{x:this.nodes.msgPayError.x,y:this.nodes.doPay.y}] },
                { from: 'checkPay', to: 'complete', label: "Yes" },
                { from: 'dbReq', to: 'viewReqList' },
                { from: 'viewReqList', to: 'selectReq' },
                { from: 'selectReq', to: 'clickApprove' },
                { from: 'clickApprove', to: 'checkCancel' },
                { from: 'checkCancel', to: 'processCancel', label: "Yes" },
                { from: 'checkCancel', to: 'sendApprove', label: "No" },
                { from: 'sendApprove', to: 'pickup' },
                { from: 'pickup', to: 'uploadCert' },
                { from: 'uploadCert', to: 'checkValid' },
                { from: 'checkValid', to: 'reqRetake', label: "No" },
                { from: 'reqRetake', to: 'uploadCert', points: [{x:this.nodes.reqRetake.x,y:this.nodes.uploadCert.y}] },
                { from: 'checkValid', to: 'givePoint', label: "Yes" },
                { from: 'givePoint', to: 'sendPayNotif' },
                { from: 'sendApprove', to: 'notifAssign', style: 'dashed' },
                { from: 'sendPayNotif', to: 'notifPay', style: 'dashed' }
            ];
        },
        draw() {
            this.groups.forEach(g => {
                ctx.save();
                ctx.setLineDash([10, 5]);
                ctx.strokeStyle = g.stroke;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.rect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
                ctx.stroke();
                ctx.fillStyle = g.stroke;
                ctx.font = 'bold 16px sans-serif';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                ctx.setLineDash([]);
                ctx.fillText(g.label, g.x - g.w / 2 + 10, g.y - g.h / 2 - 10);
                ctx.restore();
            });

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = CONSTANTS.STROKE_COLOR;
            this.edges.forEach(edge => {
                const n1 = this.nodes[edge.from], n2 = this.nodes[edge.to];
                if (!n1 || !n2) return;
                let startP = { x: n1.x, y: n1.y }, endP = { x: n2.x, y: n2.y };
                if (n1.type === 'process' || n1.type === 'terminal' || n1.type === 'db') {
                    if (edge.points && edge.points[0].y < n1.y) startP.y -= 25;
                    else if (n2.y > n1.y || (edge.points && edge.points[0].y > n1.y)) startP.y += 25;
                    else if (n2.x > n1.x) startP.x += 90;
                    else startP.x -= 90;
                } else if (n1.type === 'decision') {
                    if (n2.y > n1.y && (!edge.points || edge.points[0].y > n1.y)) startP.y += 40;
                    else if (n2.x > n1.x || (edge.points && edge.points[0].x > n1.x)) startP.x += 60;
                    else startP.x -= 60;
                }
                let lastP = (edge.points && edge.points.length > 0) ? edge.points[edge.points.length - 1] : startP;
                if (n2.type === 'process' || n2.type === 'terminal' || n2.type === 'db') {
                    if (lastP.y < n2.y) endP.y -= 25;
                    else if (lastP.y > n2.y) endP.y += 25;
                    else if (lastP.x < n2.x) endP.x -= 90;
                    else endP.x += 90;
                } else if (n2.type === 'decision') {
                    if (lastP.y < n2.y) endP.y -= 40;
                    else if (lastP.x < n2.x) endP.x -= 60;
                    else endP.x += 60;
                }
                drawPolyLineArrow(ctx, startP, endP, edge.points, edge.style);
                if (edge.label) {
                    let lx, ly;
                    if (n1.type === 'decision') {
                        if (edge.points) { lx = (startP.x + edge.points[0].x) / 2; ly = (startP.y + edge.points[0].y) / 2 - 10; } 
                        else { lx = (startP.x + endP.x) / 2; ly = (startP.y + endP.y) / 2 - 10; }
                        if (edge.label === 'No' && n2.x > n1.x) ly -= 5;
                        if (edge.label === 'Yes' && n2.y > n1.y) lx += 5;
                    } else { lx = (startP.x + endP.x) / 2; ly = (startP.y + endP.y) / 2; }
                    ctx.save();
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(lx - 12, ly - 8, 24, 16);
                    ctx.restore();
                    ctx.fillStyle = '#000';
                    ctx.font = '12px sans-serif';
                    ctx.fillText(edge.label, lx, ly);
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
                    drawNote(ctx, n.x, n.y, 220, 50);
                    ctx.fillStyle = CONSTANTS.SHAPE_FILL;
                }
                ctx.fillStyle = CONSTANTS.STROKE_COLOR;
                ctx.font = `${CONSTANTS.FONT_SIZE}px 'Noto Sans KR',sans-serif`;
                drawText(ctx, n.label, n.x, n.y, CONSTANTS.FONT_SIZE);
            }
        }
    };

    const usecase = {
        actors: {},
        useCases: {},
        initData() {
            const centerX = canvas.width/2, centerY = canvas.height/2;
            const userX = centerX-350, subActorY = centerY+150, rightActorX = centerX+400;
            const leftColX = centerX-100, rightColX = centerX+200;
            this.actors = {
                user: { x: userX, y: centerY - 150, label: "사용자" },
                requester: { x: userX - 80, y: subActorY, label: "요청자" },
                collector: { x: userX + 80, y: subActorY, label: "수거자" },
                paySys: { x: rightActorX, y: centerY - 100, label: "결제시스템" },
                authSys: { x: rightActorX, y: centerY + 100, label: "수거자 인증 시스템" }
            };
            this.useCases = {
                login: { x: leftColX, y: centerY - 200, label: "로그인" },
                match: { x: leftColX, y: centerY, label: "대리수거 매칭" },
                request: { x: rightColX, y: centerY - 100, label: "대리수거 요청" },
                accept: { x: rightColX, y: centerY + 100, label: "대리수거\n승낙 및 인증" },
                point: { x: rightColX, y: centerY + 250, label: "포인트 적립" }
            };
        },
        draw() {
            const useCaseWidth = 200;
            const useCaseHeight = 80;

            drawSolidArrow(ctx, this.actors.user.x + 20, this.actors.user.y + 30, this.useCases.login.x - useCaseWidth / 2, this.useCases.login.y);
            drawSolidArrow(ctx, this.actors.user.x + 20, this.actors.user.y + 30, this.useCases.match.x - useCaseWidth / 2, this.useCases.match.y);
            drawGeneralizationArrow(ctx, this.actors.requester.x, this.actors.requester.y, this.actors.user.x - 10, this.actors.user.y + 90);
            drawGeneralizationArrow(ctx, this.actors.collector.x, this.actors.collector.y, this.actors.user.x + 10, this.actors.user.y + 90);
            drawSolidArrow(ctx, this.useCases.match.x + useCaseWidth / 2, this.useCases.match.y, this.useCases.request.x - useCaseWidth / 2, this.useCases.request.y);
            drawSolidArrow(ctx, this.useCases.match.x + useCaseWidth / 2, this.useCases.match.y, this.useCases.accept.x - useCaseWidth / 2, this.useCases.accept.y);
            drawSolidArrow(ctx, this.actors.paySys.x - 20, this.actors.paySys.y + 30, this.useCases.request.x + useCaseWidth / 2, this.useCases.request.y);
            drawSolidArrow(ctx, this.actors.authSys.x - 20, this.actors.authSys.y + 30, this.useCases.accept.x + useCaseWidth / 2, this.useCases.accept.y);
            drawDashedArrow(ctx, this.useCases.accept.x, this.useCases.accept.y + useCaseHeight / 2, this.useCases.point.x, this.useCases.point.y - useCaseHeight / 2, "<< include >>\n");
            
            Object.values(this.actors).forEach(a => drawActor(ctx, a.x, a.y, a.label));
            Object.values(this.useCases).forEach(uc => {
                const { x, y, label } = uc;
                ctx.fillStyle = CONSTANTS.USE_CASE_FILL;
                ctx.strokeStyle = CONSTANTS.STROKE_COLOR;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(x, y, useCaseWidth / 2, useCaseHeight / 2, 0, 0, Math.PI * 2);
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
        flowdata: { scale: 0.65, offsetY: -50 },
        usecase: { scale: 1.0 }
    });
})();
