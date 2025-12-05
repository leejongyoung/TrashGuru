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
            const centerX=canvas.width/2,startY=50,gapY=80;
            this.nodes={start:{type:'terminal',x:centerX,y:startY,label:"Start"},selectMenu:{type:'process',x:centerX,y:startY+gapY*1,label:"자원봉사 메뉴 선택"},viewList:{type:'process',x:centerX,y:startY+gapY*2,label:"지역 기반\n봉사 목록 조회 및 표시"},volDB:{type:'db',x:centerX-250,y:startY+gapY*2,label:"봉사활동 DB"},selectActivity:{type:'process',x:centerX,y:startY+gapY*3,label:"참여할 활동 선택"},viewDetail:{type:'process',x:centerX,y:startY+gapY*4,label:"상세 정보 표시"},noteDetail:{type:'note',x:centerX-250,y:startY+gapY*4,label:"봉사 일정, 장소, 준비물,\n모집 인원 등"},clickApply:{type:'process',x:centerX,y:startY+gapY*5,label:"참여 신청 버튼 클릭"},checkLimit:{type:'decision',x:centerX,y:startY+gapY*6,label:"모집 인원 초과 여부"},msgFull:{type:'process',x:centerX+280,y:startY+gapY*6,label:"\"모집 마감\" 메세지 표시\n및 목록 화면으로 돌아가기"},saveInfo:{type:'process',x:centerX,y:startY+gapY*7.5,label:"신청 정보 저장"},checkSave:{type:'decision',x:centerX,y:startY+gapY*8.5,label:"저장 성공 여부"},msgError:{type:'process',x:centerX+280,y:startY+gapY*8.5,label:"오류 메세지 표시\n및 이전 화면으로 돌아가기"},confirm:{type:'process',x:centerX,y:startY+gapY*10,label:"참여 확정\n또는 대기 메세지 표시"},sendNotif:{type:'process',x:centerX,y:startY+gapY*11,label:"봉사 시작 전\n알림 전송"},verify:{type:'process',x:centerX,y:startY+gapY*12,label:"봉사 완료 후 인증·검증"},addPoint:{type:'process',x:centerX,y:startY+gapY*13,label:"포인트 적립"},pointDB:{type:'db',x:centerX-250,y:startY+gapY*13,label:"포인트 DB"}};
            this.edges=[{from:'start',to:'selectMenu'},{from:'selectMenu',to:'viewList'},{from:'volDB',to:'viewList',points:[{x:this.nodes.volDB.x,y:this.nodes.viewList.y}]},{from:'viewList',to:'selectActivity'},{from:'selectActivity',to:'viewDetail'},{from:'viewDetail',to:'clickApply'},{from:'clickApply',to:'checkLimit'},{from:'checkLimit',to:'msgFull',label:"Yes"},{from:'msgFull',to:'viewList',points:[{x:this.nodes.msgFull.x,y:this.nodes.viewList.y}]},{from:'checkLimit',to:'saveInfo',label:"No"},{from:'saveInfo',to:'checkSave'},{from:'checkSave',to:'msgError',label:"No"},{from:'msgError',to:'viewDetail',points:[{x:this.nodes.msgError.x+50,y:this.nodes.msgError.y},{x:this.nodes.msgError.x+50,y:this.nodes.viewDetail.y},{x:this.nodes.viewDetail.x+100,y:this.nodes.viewDetail.y}]},{from:'checkSave',to:'confirm',label:"Yes"},{from:'confirm',to:'sendNotif'},{from:'sendNotif',to:'verify'},{from:'verify',to:'addPoint'},{from:'pointDB',to:'addPoint',points:[{x:this.nodes.pointDB.x,y:this.nodes.addPoint.y}]}];
        },
        draw() {
            ctx.lineWidth=1.5;
            ctx.strokeStyle=CONSTANTS.STROKE_COLOR;
            this.edges.forEach(edge=>{
                const n1=this.nodes[edge.from],n2=this.nodes[edge.to];if(!n1||!n2)return;
                let startP={x:n1.x,y:n1.y},endP={x:n2.x,y:n2.y};
                if(n1.type==='process'||n1.type==='terminal'||n1.type==='db'){
                    if(edge.points&&edge.points[0].y<n1.y)startP.y-=25;
                    else if(n2.y>n1.y||(edge.points&&edge.points[0].y>n1.y))startP.y+=25;
                    else if(n2.x>n1.x)startP.x+=90;
                    else startP.x-=90;
                }
                else if(n1.type==='decision'){
                    if(n2.y>n1.y&&(!edge.points||edge.points[0].y>n1.y))startP.y+=40;
                    else if(n2.x>n1.x)startP.x+=60;
                    else startP.x-=60;
                }
                let lastP=(edge.points&&edge.points.length>0)?edge.points[edge.points.length-1]:startP;
                if(n2.type==='process'||n2.type==='terminal'||n2.type==='db'){
                    if(lastP.y<n2.y)endP.y-=25;
                    else if(lastP.y>n2.y)endP.y+=25;
                    else if(lastP.x<n2.x)endP.x-=90;
                    else endP.x+=90;
                }
                else if(n2.type==='decision'){
                    if(lastP.y<n2.y)endP.y-=40;
                    else if(lastP.x<n2.x)endP.x-=60;
                    else endP.x+=60;
                }
                drawPolyLineArrow(ctx, startP,endP,edge.points);
                if(edge.label){
                    let lx,ly;
                    if(n1.type==='decision'){
                        if(edge.points){lx=(startP.x+edge.points[0].x)/2;ly=(startP.y+edge.points[0].y)/2-10;}
                        else{lx=(startP.x+endP.x)/2;ly=(startP.y+endP.y)/2-10;}
                        if(edge.label==='No'&&n2.x>n1.x)ly-=5;
                        if(edge.label==='Yes'&&n2.y>n1.y)lx+=5;
                    }
                    else{
                        lx=(startP.x+endP.x)/2;
                        ly=(startP.y+endP.y)/2;
                    }
                    ctx.save();ctx.fillStyle='#fff';ctx.fillRect(lx-12,ly-8,24,16);ctx.restore();
                    ctx.fillStyle='#000';ctx.font='12px sans-serif';ctx.fillText(edge.label,lx,ly);
                }
            });
            for(let key in this.nodes){
                const n=this.nodes[key];
                ctx.fillStyle=(n.type==='note')?CONSTANTS.NOTE_FILL:CONSTANTS.SHAPE_FILL;
                if(n.type==='terminal')drawOval(ctx, n.x,n.y,140,50);
                else if(n.type==='process')drawRect(ctx, n.x,n.y,180,50);
                else if(n.type==='decision')drawDiamond(ctx, n.x,n.y,120,80);
                else if(n.type==='db')drawCylinder(ctx, n.x,n.y,100,70);
                else if(n.type==='note') {
                    drawNote(ctx, n.x,n.y,220,60);
                    ctx.fillStyle = CONSTANTS.SHAPE_FILL;
                }
                ctx.fillStyle = CONSTANTS.STROKE_COLOR;
                ctx.font = `${CONSTANTS.FONT_SIZE}px 'Noto Sans KR', sans-serif`;
                drawText(ctx, n.label,n.x,n.y, CONSTANTS.FONT_SIZE);
            }
        }
    };

    const usecase = {
        actors: {},
        useCases: {},
        initData() {
            const centerX=canvas.width/2,centerY=canvas.height/2;
            const leftActorX=centerX-400,leftColX=centerX-200,midColX=centerX+50,rightActorX=centerX+450;
            this.actors={user:{x:leftActorX,y:centerY-50,label:"사용자"},notiSys:{x:rightActorX,y:centerY-150,label:"알림시스템"},volDB:{x:rightActorX,y:centerY+50,label:"봉사활동 DB"}};
            this.useCases={login:{x:leftColX,y:centerY-150,label:"로그인"},volunteer:{x:leftColX,y:centerY+50,label:"자원봉사"},notification:{x:midColX,y:centerY-200,label:"참여 알림"},apply:{x:midColX,y:centerY-80,label:"봉사 신청"},viewList:{x:midColX,y:centerY+50,label:"봉사 목록 조회"},verify:{x:midColX,y:centerY+180,label:"봉사 완료 인증"},points:{x:midColX,y:centerY+300,label:"포인트 적립"}};
        },
        draw() {
            const useCaseWidth = 180;
            const useCaseHeight = 70;
            drawSolidArrow(ctx, this.actors.user.x+20,this.actors.user.y+30,this.useCases.login.x-useCaseWidth/2,this.useCases.login.y);
            drawSolidArrow(ctx, this.actors.user.x+20,this.actors.user.y+30,this.useCases.volunteer.x-useCaseWidth/2,this.useCases.volunteer.y);
            drawSolidArrow(ctx, this.useCases.volunteer.x+useCaseWidth/2,this.useCases.volunteer.y,this.useCases.apply.x-useCaseWidth/2,this.useCases.apply.y);
            drawSolidArrow(ctx, this.useCases.volunteer.x+useCaseWidth/2,this.useCases.volunteer.y,this.useCases.viewList.x-useCaseWidth/2,this.useCases.viewList.y);
            drawSolidArrow(ctx, this.useCases.volunteer.x+useCaseWidth/2,this.useCases.volunteer.y,this.useCases.verify.x-useCaseWidth/2,this.useCases.verify.y);
            drawDashedArrow(ctx, this.useCases.apply.x,this.useCases.apply.y-useCaseHeight/2,this.useCases.notification.x,this.useCases.notification.y+useCaseHeight/2,"<< include >>");
            drawDashedArrow(ctx, this.useCases.verify.x,this.useCases.verify.y+useCaseHeight/2,this.useCases.points.x,this.useCases.points.y-useCaseHeight/2,"<< include >>");
            drawSolidArrow(ctx, this.actors.notiSys.x-20,this.actors.notiSys.y+30,this.useCases.notification.x+useCaseWidth/2,this.useCases.notification.y);
            drawSolidArrow(ctx, this.actors.volDB.x-20,this.actors.volDB.y+30,this.useCases.apply.x+useCaseWidth/2,this.useCases.apply.y);
            drawSolidArrow(ctx, this.actors.volDB.x-20,this.actors.volDB.y+30,this.useCases.viewList.x+useCaseWidth/2,this.useCases.viewList.y);
            Object.values(this.actors).forEach(a=>drawActor(ctx, a.x,a.y,a.label));
            Object.values(this.useCases).forEach(uc=>drawUseCase(ctx, uc.x,uc.y,uc.label));
        }
    };

    DiagramCommons.setupDiagramLifecycle(canvas, ctx, { flowdata, usecase }, {
        flowdata: { scale: 0.7 },
        usecase: { scale: 0.9 }
    });
})();
