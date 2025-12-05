(function() {
    const canvas = document.getElementById('diagramCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const { drawRect, drawDiamond, drawOval, drawCylinder, drawText, drawPolyLineArrow, drawActor, drawUseCase, drawSolidArrow, drawDashedArrow, drawGeneralizationArrow } = DiagramCommons;
    const CONSTANTS = DiagramCommons.CONSTANTS;

    const flowdata = {
        nodes: {},
        edges: [],

        initData() {
            const centerX = canvas.width / 2;
            const startY = 50;
            const gapY = 80;
            const colGap = 350;
            const leftCol = centerX - colGap;
            const midCol = centerX;
            const rightCol = centerX + colGap;

            this.nodes = {
                start: { type: 'terminal', x: midCol, y: startY, label: "Start" },
                menuSelect: { type: 'process', x: midCol, y: startY + gapY, label: "커뮤니티 메뉴 선택" },
                postMenu: { type: 'process', x: leftCol, y: startY + gapY * 2, label: "게시글 메뉴 선택" },
                clickWrite: { type: 'process', x: leftCol, y: startY + gapY * 3, label: "게시글 작성하기 클릭" },
                inputPost: { type: 'process', x: leftCol, y: startY + gapY * 4, label: "게시글 입력" },
                checkMissing: { type: 'decision', x: leftCol, y: startY + gapY * 5, label: "필수항목 누락 여부" },
                msgMissing: { type: 'process', x: leftCol - 220, y: startY + gapY * 5, label: "\"제목과 내용을\n입력해주세요\"\n메세지 표시" },
                checkInappropriate: { type: 'decision', x: leftCol, y: startY + gapY * 6.5, label: "부적절한 내용 여부" },
                msgBlock: { type: 'process', x: leftCol - 220, y: startY + gapY * 6.5, label: "게시글 등록 차단 및\n수정 요청 메세지 표시" },
                savePost: { type: 'process', x: leftCol, y: startY + gapY * 8, label: "게시글 저장" },
                updateList: { type: 'process', x: leftCol, y: startY + gapY * 9, label: "게시글 목록 상단 반영" },
                viewList: { type: 'process', x: leftCol, y: startY + gapY * 10, label: "게시글 목록 조회\n및 상세조회" },
                interact: { type: 'process', x: leftCol, y: startY + gapY * 11, label: "댓글 / 좋아요 / 공유" },
                dbComm: { type: 'db', x: leftCol - 200, y: startY + gapY * 10, label: "커뮤니티 DB" },
                challengeMenu: { type: 'process', x: midCol, y: startY + gapY * 2, label: "챌린지 메뉴 선택" },
                viewChallengeList: { type: 'process', x: midCol, y: startY + gapY * 3, label: "챌린지 목록 조회" },
                joinChallenge: { type: 'process', x: midCol, y: startY + gapY * 4, label: "챌린지 참여하기 선택" },
                saveRecord: { type: 'process', x: midCol, y: startY + gapY * 5, label: "챌린지 기록 저장" },
                viewRecord: { type: 'process', x: midCol, y: startY + gapY * 6, label: "챌린지 기록 조회" },
                dbChallenge: { type: 'db', x: midCol + 180, y: startY + gapY * 5.5, label: "챌린지 DB" },
                checkChallengeDB: { type: 'decision', x: midCol, y: startY + gapY * 7.5, label: "챌린지 데이터 조회\n성공 여부" },
                msgChallengeError: { type: 'process', x: midCol + 220, y: startY + gapY * 7.5, label: "\"현재 정보 조회 불가\"\n메세지 표시\n및 이전 화면으로 돌아가기" },
                showChallengeData: { type: 'process', x: midCol, y: startY + gapY * 9, label: "챌린지 기록\n데이터 표시" },
                rankMenu: { type: 'process', x: rightCol, y: startY + gapY * 2, label: "랭킹 메뉴 선택" },
                viewRank: { type: 'process', x: rightCol, y: startY + gapY * 3, label: "랭킹 조회" },
                checkRankDB: { type: 'decision', x: rightCol, y: startY + gapY * 4.5, label: "랭킹 데이터 조회\n성공 여부" },
                msgRankError: { type: 'process', x: rightCol + 220, y: startY + gapY * 4.5, label: "\"현재 정보 조회 불가\"\n메세지 표시\n및 이전 화면으로 돌아가기" },
                showRankData: { type: 'process', x: rightCol, y: startY + gapY * 6, label: "랭킹 기록\n데이터 표시" }
            };
            this.edges = [
                { from: 'start', to: 'menuSelect' },
                { from: 'menuSelect', to: 'postMenu', points: [{x: midCol, y: this.nodes.menuSelect.y + 40}, {x: leftCol, y: this.nodes.menuSelect.y + 40}] },
                { from: 'menuSelect', to: 'challengeMenu' },
                { from: 'menuSelect', to: 'rankMenu', points: [{x: midCol, y: this.nodes.menuSelect.y + 40}, {x: rightCol, y: this.nodes.menuSelect.y + 40}] },
                { from: 'postMenu', to: 'clickWrite' }, { from: 'clickWrite', to: 'inputPost' }, { from: 'inputPost', to: 'checkMissing' },
                { from: 'checkMissing', to: 'msgMissing', label: "Yes" },
                { from: 'msgMissing', to: 'inputPost', points: [{x: this.nodes.msgMissing.x, y: this.nodes.inputPost.y}] },
                { from: 'checkMissing', to: 'checkInappropriate', label: "No" },
                { from: 'checkInappropriate', to: 'msgBlock', label: "Yes" },
                { from: 'msgBlock', to: 'inputPost', points: [{x: this.nodes.msgBlock.x - 80, y: this.nodes.msgBlock.y}, {x: this.nodes.msgBlock.x - 80, y: this.nodes.inputPost.y}] },
                { from: 'checkInappropriate', to: 'savePost', label: "No" },
                { from: 'savePost', to: 'updateList' }, { from: 'updateList', to: 'viewList' }, { from: 'viewList', to: 'interact' },
                { from: 'dbComm', to: 'viewList' },
                { from: 'challengeMenu', to: 'viewChallengeList' }, { from: 'viewChallengeList', to: 'joinChallenge' },
                { from: 'joinChallenge', to: 'saveRecord' }, { from: 'saveRecord', to: 'viewRecord' },
                { from: 'saveRecord', to: 'dbChallenge', points: [{x: this.nodes.saveRecord.x, y: this.nodes.saveRecord.y}, {x: this.nodes.dbChallenge.x, y: this.nodes.saveRecord.y}] },
                { from: 'dbChallenge', to: 'viewRecord', points: [{x: this.nodes.dbChallenge.x, y: this.nodes.viewRecord.y}, {x: this.nodes.viewRecord.x, y: this.nodes.viewRecord.y}] },
                { from: 'viewRecord', to: 'checkChallengeDB' },
                { from: 'checkChallengeDB', to: 'msgChallengeError', label: "No" },
                { from: 'msgChallengeError', to: 'joinChallenge', points: [{x: this.nodes.msgChallengeError.x, y: this.nodes.joinChallenge.y}] },
                { from: 'checkChallengeDB', to: 'showChallengeData', label: "Yes" },
                { from: 'rankMenu', to: 'viewRank' }, { from: 'viewRank', to: 'checkRankDB' },
                { from: 'checkRankDB', to: 'msgRankError', label: "No" },
                { from: 'msgRankError', to: 'viewRank', points: [{x: this.nodes.msgRankError.x, y: this.nodes.viewRank.y}] },
                { from: 'checkRankDB', to: 'showRankData', label: "Yes" }
            ];
        },
        draw() {
            ctx.lineWidth = 1.5; ctx.strokeStyle = CONSTANTS.STROKE_COLOR;
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
                ctx.fillStyle = CONSTANTS.SHAPE_FILL;
                if (n.type === 'terminal') drawOval(ctx, n.x, n.y, 140, 50);
                else if (n.type === 'process') drawRect(ctx, n.x, n.y, 180, 50);
                else if (n.type === 'decision') drawDiamond(ctx, n.x, n.y, 120, 80);
                else if (n.type === 'db') drawCylinder(ctx, n.x, n.y, 100, 70);
                
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
            const centerX = canvas.width/2, centerY = canvas.height/2;
            const leftActorX = centerX - 450, leftColX = centerX - 250, midColX = centerX - 50, rightColX = centerX + 200, rightActorX = centerX + 450;
            this.actors = {
                user: { x: leftActorX, y: centerY - 50, label: "사용자" },
                commDB: { x: rightActorX, y: centerY - 50, label: "커뮤니티 DB" },
                filterSys: { x: rightActorX, y: centerY + 100, label: "필터링 시스템" },
                rankModule: { x: rightActorX, y: centerY + 250, label: "챌린지·랭킹 모듈" }
            };
            this.useCases = {
                login: { x: leftColX, y: centerY - 150, label: "로그인" },
                community: { x: leftColX, y: centerY + 50, label: "커뮤니티" },
                post: { x: midColX, y: centerY, label: "게시글" },
                challenge: { x: midColX, y: centerY + 150, label: "챌린지" },
                ranking: { x: midColX, y: centerY + 250, label: "랭킹" },
                comment: { x: rightColX, y: centerY - 200, label: "댓글/좋아요/공유" },
                viewDetail: { x: rightColX, y: centerY - 100, label: "게시글 상세 보기" },
                viewList: { x: rightColX, y: centerY, label: "게시글 목록 조회" },
                writePost: { x: rightColX, y: centerY + 100, label: "게시글 작성" }
            };
        },
        draw() {
            const useCaseWidth = 180;
            const useCaseHeight = 70;
            drawSolidArrow(ctx, this.actors.user.x+20,this.actors.user.y+30,this.useCases.login.x-useCaseWidth/2,this.useCases.login.y);
            drawSolidArrow(ctx, this.actors.user.x+20,this.actors.user.y+30,this.useCases.community.x-useCaseWidth/2,this.useCases.community.y);
            drawSolidArrow(ctx, this.useCases.community.x+useCaseWidth/2,this.useCases.community.y,this.useCases.post.x-useCaseWidth/2,this.useCases.post.y);
            drawSolidArrow(ctx, this.useCases.community.x+useCaseWidth/2,this.useCases.community.y,this.useCases.challenge.x-useCaseWidth/2,this.useCases.challenge.y);
            drawSolidArrow(ctx, this.useCases.community.x+useCaseWidth/2,this.useCases.community.y,this.useCases.ranking.x-useCaseWidth/2,this.useCases.ranking.y);
            drawGeneralizationArrow(ctx, this.useCases.viewDetail.x-useCaseWidth/2,this.useCases.viewDetail.y,this.useCases.post.x+useCaseWidth/2,this.useCases.post.y-10);
            drawGeneralizationArrow(ctx, this.useCases.viewList.x-useCaseWidth/2,this.useCases.viewList.y,this.useCases.post.x+useCaseWidth/2,this.useCases.post.y);
            drawGeneralizationArrow(ctx, this.useCases.writePost.x-useCaseWidth/2,this.useCases.writePost.y,this.useCases.post.x+useCaseWidth/2,this.useCases.post.y+10);
            drawDashedArrow(ctx, this.useCases.viewDetail.x,this.useCases.viewDetail.y-useCaseHeight/2,this.useCases.comment.x,this.useCases.comment.y+useCaseHeight/2,"<< include >>\n");
            drawSolidArrow(ctx, this.actors.commDB.x-20,this.actors.commDB.y+30,this.useCases.viewList.x+useCaseWidth/2,this.useCases.viewList.y);
            drawSolidArrow(ctx, this.actors.filterSys.x-20,this.actors.filterSys.y+30,this.useCases.writePost.x+useCaseWidth/2,this.useCases.writePost.y);
            drawSolidArrow(ctx, this.actors.rankModule.x-20,this.actors.rankModule.y+30,this.useCases.challenge.x+useCaseWidth/2,this.useCases.challenge.y);
            drawSolidArrow(ctx, this.actors.rankModule.x-20,this.actors.rankModule.y+30,this.useCases.ranking.x+useCaseWidth/2,this.useCases.ranking.y);
            
            Object.values(this.actors).forEach(a => drawActor(ctx, a.x, a.y, a.label));
            Object.values(this.useCases).forEach(uc => drawUseCase(ctx, uc.x, uc.y, uc.label));
        }
    };

    DiagramCommons.setupDiagramLifecycle(canvas, ctx, { flowdata, usecase }, {
        flowdata: { scale: 0.75 },
        usecase: { scale: 0.9 }
    });
})();
