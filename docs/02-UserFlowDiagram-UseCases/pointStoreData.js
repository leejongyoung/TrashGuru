(function() {
    const canvas = document.getElementById('diagramCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const { drawRect, drawDiamond, drawOval, drawNote, drawText, drawPolyLineArrow, drawActor, drawUseCase, drawSolidArrow, drawGeneralizationArrow } = DiagramCommons;
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
                menuSelect: { type: 'process', x: centerX, y: startY + gapY, label: "상점 메뉴 선택" },
                checkPoints: { type: 'process', x: centerX, y: startY + gapY * 2, label: "현재 포인트 조회" },
                noteOptions: { type: 'note', x: centerX - 200, y: startY + gapY * 2.5, label: "찜 목록, 장바구니\n옵션에서 선택도 가능" },
                selectProduct: { type: 'process', x: centerX, y: startY + gapY * 3, label: "상품 선택" },
                paymentProcess: { type: 'process', x: centerX, y: startY + gapY * 4, label: "상품 결제 진행" },
                inputPoints: { type: 'process', x: centerX, y: startY + gapY * 5, label: "사용 포인트 입력" },
                checkCoverage: { type: 'decision', x: centerX, y: startY + gapY * 6.5, label: "포인트만으로\n결제 가능 여부" },
                payFullPoint: { type: 'process', x: centerX - 180, y: startY + gapY * 8, label: "포인트 전액 결제" },
                payPartial: { type: 'process', x: centerX + 180, y: startY + gapY * 8, label: "잔여금액\n등록 결제 수단으로\n결제" },
                checkSuccess: { type: 'decision', x: centerX, y: startY + gapY * 9.5, label: "결제 성공 여부" },
                msgFail: { type: 'process', x: centerX + 350, y: startY + gapY * 9.5, label: "결제 실패 메세지\n및 재시도 요청" },
                showComplete: { type: 'process', x: centerX, y: startY + gapY * 11, label: "결제 완료 화면표시" },
                saveOrder: { type: 'process', x: centerX, y: startY + gapY * 12, label: "주문 내역 저장" },
                showStatus: { type: 'process', x: centerX, y: startY + gapY * 13, label: "주문 상태 표시" },
                noteStatus: { type: 'note', x: centerX - 200, y: startY + gapY * 13, label: "결제 완료/ 배송 준비/\n배송 완료 등의\n주문상태" }
            };
            this.edges = [
                { from: 'start', to: 'menuSelect' }, { from: 'menuSelect', to: 'checkPoints' }, { from: 'checkPoints', to: 'selectProduct' },
                { from: 'selectProduct', to: 'paymentProcess' }, { from: 'paymentProcess', to: 'inputPoints' }, { from: 'inputPoints', to: 'checkCoverage' },
                { from: 'checkCoverage', to: 'payFullPoint', label: "Yes", points: [{x: centerX-180, y: this.nodes.checkCoverage.y}, {x: centerX-180, y: this.nodes.payFullPoint.y}] },
                { from: 'checkCoverage', to: 'payPartial', label: "No", points: [{x: centerX+180, y: this.nodes.checkCoverage.y}, {x: centerX+180, y: this.nodes.payPartial.y}] },
                { from: 'payFullPoint', to: 'checkSuccess', points: [{x: centerX-180, y: this.nodes.checkSuccess.y}, {x: this.nodes.checkSuccess.x, y: this.nodes.checkSuccess.y}] },
                { from: 'payPartial', to: 'checkSuccess', points: [{x: centerX+180, y: this.nodes.checkSuccess.y}, {x: this.nodes.checkSuccess.x, y: this.nodes.checkSuccess.y}] },
                { from: 'checkSuccess', to: 'msgFail', label: "No" },
                { from: 'msgFail', to: 'paymentProcess', points: [{x: this.nodes.msgFail.x, y: this.nodes.paymentProcess.y}] },
                { from: 'checkSuccess', to: 'showComplete', label: "Yes" }, { from: 'showComplete', to: 'saveOrder' }, { from: 'saveOrder', to: 'showStatus' }
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
                    else if (n2.x > n1.x || (edge.points && edge.points[0].x > n1.x)) startP.x += 90;
                    else startP.x -= 90;
                } else if (n1.type === 'decision') {
                    if (n2.y > n1.y && (!edge.points || edge.points[0].y > n1.y)) startP.y += 40;
                    else if (n2.x > n1.x || (edge.points && edge.points[0].x > n1.x)) startP.x += 60;
                    else startP.x -= 60;
                }
                let lastP = (edge.points && edge.points.length > 0) ? edge.points[edge.points.length-1] : startP;
                if (n2.type === 'process' || n2.type === 'terminal' || n2.type === 'db') {
                    if (lastP.y < n2.y) endP.y -= 25; else if (lastP.y > n2.y) endP.y += 25;
                    else if (lastP.x < n2.x) endP.x -= 90; else endP.x += 90;
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
                        if (edge.label === 'Yes' && n2.y > n1.y) lx += 5;
                    } else { lx = (startP.x + endP.x) / 2; ly = (startP.y + endP.y) / 2; }
                    ctx.save(); ctx.fillStyle = '#fff'; ctx.fillRect(lx - 12, ly - 8, 24, 16); ctx.restore();
                    ctx.fillStyle = '#000'; ctx.font = '12px sans-serif'; ctx.fillText(edge.label, lx, ly);
                }
            });
            for (let key in this.nodes) {
                const n = this.nodes[key];
                ctx.fillStyle = (n.type === 'note') ? CONSTANTS.NOTE_FILL : CONSTANTS.SHAPE_FILL;
                if (n.type === 'terminal') drawOval(ctx, n.x, n.y, 140, 50);
                else if (n.type === 'process') drawRect(ctx, n.x, n.y, 180, 50);
                else if (n.type === 'decision') drawDiamond(ctx, n.x, n.y, 120, 80);
                else if (n.type === 'note') {
                    drawNote(ctx, n.x, n.y, 220, 60);
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
            const centerX = canvas.width / 2, centerY = canvas.height / 2;
            const leftActorX = centerX - 400, leftColX = centerX - 200, midColX = centerX, rightColX = centerX + 250, rightActorX = centerX + 450;
            this.actors = {
                user: { x: leftActorX, y: centerY - 50, label: "사용자" },
                shopDB: { x: rightActorX, y: centerY - 20, label: "상점 DB" },
                paySys: { x: rightActorX, y: centerY + 200, label: "결제 시스템" }
            };
            this.useCases = {
                login: { x: leftColX, y: centerY - 150, label: "로그인" },
                shop: { x: leftColX, y: centerY + 50, label: "상점" },
                buyProduct: { x: midColX, y: centerY + 50, label: "상품 구매" },
                viewPoint: { x: rightColX, y: centerY - 100, label: "포인트 조회" },
                history: { x: rightColX, y: centerY + 20, label: "구매 내역" },
                payment: { x: rightColX, y: centerY + 200, label: "결제" }
            };
        },
        draw() {
            const useCaseWidth = 180;
            drawSolidArrow(ctx, this.actors.user.x+20,this.actors.user.y+30,this.useCases.login.x-useCaseWidth/2,this.useCases.login.y);
            drawSolidArrow(ctx, this.actors.user.x+20,this.actors.user.y+30,this.useCases.shop.x-useCaseWidth/2,this.useCases.shop.y);
            drawSolidArrow(ctx, this.useCases.shop.x+useCaseWidth/2,this.useCases.shop.y,this.useCases.buyProduct.x-useCaseWidth/2,this.useCases.buyProduct.y);
            drawGeneralizationArrow(ctx, this.useCases.viewPoint.x-useCaseWidth/2,this.useCases.viewPoint.y,this.useCases.buyProduct.x+useCaseWidth/2,this.useCases.buyProduct.y-10);
            drawGeneralizationArrow(ctx, this.useCases.history.x-useCaseWidth/2,this.useCases.history.y,this.useCases.buyProduct.x+useCaseWidth/2,this.useCases.buyProduct.y);
            drawGeneralizationArrow(ctx, this.useCases.payment.x-useCaseWidth/2,this.useCases.payment.y,this.useCases.buyProduct.x+useCaseWidth/2,this.useCases.buyProduct.y+10);
            drawSolidArrow(ctx, this.actors.shopDB.x-20,this.actors.shopDB.y+30,this.useCases.viewPoint.x+useCaseWidth/2,this.useCases.viewPoint.y);
            drawSolidArrow(ctx, this.actors.shopDB.x-20,this.actors.shopDB.y+30,this.useCases.history.x+useCaseWidth/2,this.useCases.history.y);
            drawSolidArrow(ctx, this.actors.paySys.x-20,this.actors.paySys.y+30,this.useCases.payment.x+useCaseWidth/2,this.useCases.payment.y);
            Object.values(this.actors).forEach(a=>drawActor(ctx, a.x,a.y,a.label));
            Object.values(this.useCases).forEach(uc=>drawUseCase(ctx, uc.x,uc.y,uc.label));
        }
    };

    DiagramCommons.setupDiagramLifecycle(canvas, ctx, { flowdata, usecase }, {
        flowdata: { scale: 0.8 },
        usecase: { scale: 0.9 }
    });
})();
