(function() {
    const canvas = document.getElementById('diagramCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const { drawActor, drawUseCase, drawSolidArrow, drawDashedArrow, drawGeneralizationArrow } = DiagramCommons;
    const CONSTANTS = DiagramCommons.CONSTANTS;

    let useCases = {};
    let actorsLeft = {};
    let actorsRight = {};

    const mainDiagram = {
        initData() {
            const centerX = canvas.width / 2;
            const leftBaseX = centerX - 450;
            const rightBaseX = centerX + 500;
            const useCaseStartY = 100;
            const useCaseGapY = 120;

            useCases = {
                signup: { x: centerX, y: useCaseStartY, label: "회원가입" },
                registerInfo: { x: centerX + 320, y: useCaseStartY, label: "개인정보등록" }, 
                login: { x: centerX, y: useCaseStartY + useCaseGapY * 1, label: "로그인" },
                wasteAI: { x: centerX, y: useCaseStartY + useCaseGapY * 2, label: "폐기물 촬영/AI 인식" },
                guideMap: { x: centerX, y: useCaseStartY + useCaseGapY * 3, label: "가이드 및/배출규정 매핑" },
                authPoints: { x: centerX, y: useCaseStartY + useCaseGapY * 4, label: "인증 및 포인트 적립" },
                proxyMatch: { x: centerX, y: useCaseStartY + useCaseGapY * 5, label: "대리수거 매칭" },
                community: { x: centerX, y: useCaseStartY + useCaseGapY * 6, label: "커뮤니티/챌린지/랭킹" },
                shop: { x: centerX, y: useCaseStartY + useCaseGapY * 7, label: "상점(포인트 사용)" },
                volunteer: { x: centerX, y: useCaseStartY + useCaseGapY * 8, label: "자원봉사 모집" }
            };
            actorsLeft = {
                user: { x: leftBaseX, y: 300, label: "사용자" },
                member: { x: leftBaseX - 100, y: 850, label: "회원" },
                nonMember: { x: leftBaseX + 100, y: 850, label: "비회원" }
            };
            actorsRight = {
                camera: { x: rightBaseX, y: 150, label: "디바이스 카메라" },
                aiServer: { x: rightBaseX, y: 150 + 180 * 1, label: "AI 인식 서버" },
                gps: { x: rightBaseX, y: 150 + 180 * 2, label: "GPS" },
                pointSystem: { x: rightBaseX, y: 150 + 180 * 3, label: "포인트/결제 시스템" },
                communityDB: { x: rightBaseX, y: 150 + 180 * 4, label: "커뮤니티 DB" },
                volunteerDB: { x: rightBaseX, y: 150 + 180 * 5, label: "봉사활동 DB" }
            };
        },

        draw() {
            if (!actorsLeft.user) return; // Ensure initData has run
            const useCaseWidth = 220;

            ctx.fillStyle = CONSTANTS.USE_CASE_FILL; // Default fill
            
            const userConnections = [
                useCases.signup, useCases.login, useCases.wasteAI, 
                useCases.guideMap, useCases.authPoints, useCases.proxyMatch, 
                useCases.community, useCases.shop, useCases.volunteer
            ];
            userConnections.forEach(uc => {
                drawSolidArrow(ctx, actorsLeft.user.x + 20, actorsLeft.user.y + 40, uc.x - useCaseWidth/2, uc.y);
            });
            drawSolidArrow(ctx, actorsRight.camera.x - 20, actorsRight.camera.y + 40, useCases.wasteAI.x + useCaseWidth/2, useCases.wasteAI.y - 10);
            drawSolidArrow(ctx, actorsRight.aiServer.x - 20, actorsRight.aiServer.y + 40, useCases.wasteAI.x + useCaseWidth/2, useCases.wasteAI.y + 10);
            drawSolidArrow(ctx, actorsRight.gps.x - 20, actorsRight.gps.y + 40, useCases.guideMap.x + useCaseWidth/2, useCases.guideMap.y);
            drawSolidArrow(ctx, actorsRight.pointSystem.x - 20, actorsRight.pointSystem.y + 40, useCases.authPoints.x + useCaseWidth/2, useCases.authPoints.y);
            drawSolidArrow(ctx, actorsRight.pointSystem.x - 20, actorsRight.pointSystem.y + 40, useCases.proxyMatch.x + useCaseWidth/2, useCases.proxyMatch.y);
            drawSolidArrow(ctx, actorsRight.pointSystem.x - 20, actorsRight.pointSystem.y + 40, useCases.shop.x + useCaseWidth/2, useCases.shop.y);
            drawSolidArrow(ctx, actorsRight.communityDB.x - 20, actorsRight.communityDB.y + 40, useCases.community.x + useCaseWidth/2, useCases.community.y);
            drawSolidArrow(ctx, actorsRight.volunteerDB.x - 20, actorsRight.volunteerDB.y + 40, useCases.volunteer.x + useCaseWidth/2, useCases.volunteer.y);
            
            const userTextBottomY = actorsLeft.user.y + 150; 
            drawGeneralizationArrow(ctx, actorsLeft.member.x, actorsLeft.member.y, actorsLeft.user.x - 10, userTextBottomY);
            drawGeneralizationArrow(ctx, actorsLeft.nonMember.x, actorsLeft.nonMember.y, actorsLeft.user.x + 10, userTextBottomY);
            drawDashedArrow(ctx, useCases.signup.x + useCaseWidth/2, useCases.signup.y, useCases.registerInfo.x - useCaseWidth/2, useCases.registerInfo.y, "<< include >>");
            
            Object.values(actorsLeft).forEach(actor => drawActor(ctx, actor.x, actor.y, actor.label));
            Object.values(actorsRight).forEach(actor => drawActor(ctx, actor.x, actor.y, actor.label));
            Object.values(useCases).forEach(uc => {
                const { x, y, label } = uc;
                ctx.fillStyle = CONSTANTS.USE_CASE_FILL;
                ctx.strokeStyle = CONSTANTS.STROKE_COLOR;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(x, y, useCaseWidth / 2, CONSTANTS.USE_CASE_HEIGHT / 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = CONSTANTS.STROKE_COLOR;
                ctx.font = '14px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const lines = label.split('/');
                if (lines.length > 1) {
                    ctx.fillText(lines[0], x, y - 9);
                    ctx.fillText(lines[1], x, y + 11);
                } else {
                    ctx.fillText(label, x, y);
                }
            });
        }
    };

    DiagramCommons.setupDiagramLifecycle(canvas, ctx, { main: mainDiagram }, {
        main: { scale: 1.0 }
    });
})();
