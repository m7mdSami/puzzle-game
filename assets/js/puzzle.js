
    // SCALING OPTIONS
    // scaling can have values as follows with full being the default
    // "fit"	sets canvas and stage to dimensions and scales to fit inside window size
    // "outside"	sets canvas and stage to dimensions and scales to fit outside window size
    // "full"	sets stage to window size with no scaling
    // "tagID"	add canvas to HTML tag of ID - set to dimensions if provided - no scaling

    var scaling = "fit"; // this will resize to fit inside the screen dimensions
    var width = 1424;
    var height = 768;
    var countPieces = 0;
    var totalPieces = 0;
    // as of ZIM 5.5.0 you do not need to put zim before ZIM functions and classes
    var frame = new Frame(scaling, width, height);
    frame.on("ready", function()
    {

        var stage = frame.stage;
        var stageW = frame.width;
        var stageH = frame.height;

        var puzzleX;
        var puzzleY;
        frame.outerColor = "#444";
        frame.color = "#ddd";

        var con = new Container

        // with chaining - can also assign to a variable for later access
        var imageObj = [];
        var piecesArrayObj = [];
        frame.loadAssets(["test.jpg"], "assets/img/");

        var label = new Label({
            text:"",
            size:60,
            font:"courier",
            color:"orange",
            rollColor:"red",
            fontOptions:"italic bold"
        });
        stage.addChild(label);
        label.x = label.y = 20;
        label.on("click", function(){zog("clicking");});


        frame.on("complete", function() {

            var imgVoice = document.createElement('img');
            imgVoice.src = 'assets/img/penguin.png';
            imgVoice.classList.add('imgVoice');
            imgVoice.style.bottom = document.getElementById('myCanvas').style.top;

            var playAudio = true;
            imgVoice.addEventListener("mouseover", function(){
                if(playAudio){
                    playAudio = false;
                    var audiobody = document.createElement('audio');
                    audiobody.src = 'assets/audio/body.mp3';
                    audiobody.play();
                    audiobody.onended = function() {
                        playAudio = true;
                    };
                }
            });

            window.addEventListener('resize', function(){

                imgVoice.style.bottom = document.getElementById('myCanvas').style.top;

            });

            document.getElementsByTagName('body')[0].appendChild(imgVoice);

            imageObj = frame.asset("test.jpg").clone();
            imageObj.addTo(con);
            imageObj.alpha = 0.2;

            var piecesArray = new Array();
            var horizontalPieces = 3;
            var verticalPieces = 2;
            var obj = getQueryString();
            zog(obj)
            if(obj)
            {
                horizontalPieces = obj.row;
                verticalPieces = obj.column;
            }
            var imageWidth = imageObj.width;
            var imageHeight = imageObj.height;
            var pieceWidth = Math.round(imageWidth / horizontalPieces);
            var pieceHeight = Math.round(imageHeight / verticalPieces);

            var gap = 40;
            totalPieces = horizontalPieces*verticalPieces;

            puzzleX = frame.width/2-imageWidth/2;
            puzzleY = frame.height/2-imageHeight/2;
            imageObj.pos(puzzleX,puzzleY);
            // zog(puzzleX,puzzleY);

            // label.text = "Jigsaw Puzzle "+countPieces+"/"+totalPieces;


            for (j = 0; j < verticalPieces; j++) {
                piecesArrayObj[j] = [];
                // console.log(piecesArrayObj[j]);
                for (i = 0; i < horizontalPieces; i++) {
                    var n = j + i * verticalPieces;
                    // console.log(horizontalPieces);
                    var offsetX = pieceWidth * i;
                    var offsetY = pieceHeight * j;


                    var x8 = Math.round(pieceWidth / 8);
                    var y8 = Math.round(pieceHeight / 8);

                    piecesArrayObj[j][i] = new Object();
                    piecesArrayObj[j][i].right = Math.floor(Math.random() * 2);
                    piecesArrayObj[j][i].down = Math.floor(Math.random() * 2);

                    if (j > 0) {
                        piecesArrayObj[j][i].up = 1 - piecesArrayObj[j - 1][i].down;
                    }
                    if (i > 0) {
                        piecesArrayObj[j][i].left = 1 - piecesArrayObj[j][i - 1].right;
                    }

                    piecesArray[n] = new Rectangle({
                        width: pieceWidth,
                        height: pieceHeight,

                    });

                    // console.log(piecesArray[n])

                    var tileObj = piecesArrayObj[j][i];
                    
                    var s = new Shape
                    var context = s.graphics;
                    s.drag();
                    
                    s.mouseChildren = false;
                    
                    function rotate(e){
                        if(angleInDegrees >= 360){
                            angleInDegrees=0;
                        }
                        angleInDegrees+=90;
                        var mc = e.currentTarget;
                        console.log(mc)
                        var xx = Math.round(mc.x);
                        var yy = Math.round(mc.y);
                        mc.rotation = angleInDegrees;
                        // mc.pointers.x = xx*offsetX;
                        // mc.pointers.y = yy*offsetY;
                        mc.x = rand(-offsetX,frame.width-offsetX-pieceWidth);
                        mc.y = rand(-offsetY,frame.height-offsetY-pieceHeight);
                    }

                    var angleInDegrees=0;
                    var clickCount = 0;
                    s.addEventListener("click", function(e) {
                        clickCount++;
                        if (clickCount === 1) {
                            singleClickTimer = setTimeout(function() {
                                clickCount = 0;
                                // singleClick();
                            }, 400);
                        } else if (clickCount === 2) {
                            clearTimeout(singleClickTimer);
                            clickCount = 0;
                            // rotate(e)
                        }
                    }, false);

                    s.addEventListener("pressup", function(e) {
                        
                        var mc = e.currentTarget;
                        
                        var xx = Math.round(mc.x);
                        var yy = Math.round(mc.y);
                        console.log(mc)

                        if (xx < puzzleX+gap / 2 && xx > puzzleX-gap / 2 && yy < puzzleX+gap / 2 && yy > puzzleY-gap / 2) {
                            mc.x = puzzleX;
                            mc.y = puzzleY;
                            mc.noDrag();
                            mc.addTo(mc.parent,0);
                            mc.mouseChildren = false;
                            mc.mouseEnabled = false;
                            mc.hint.visible = false;
                            countPieces++;
                            // label.text = "Jigsaw Puzzle "+countPieces+"/"+totalPieces;
                            // zog("countPieces",countPieces);

                            var audio = document.createElement('audio');
                            audio.src = 'assets/audio/good.mp3';
                            audio.play();



                            if(countPieces == totalPieces)
                            {
                                var pane = new Pane({width:600,label:"VERY NICE!", height:250, modal:false, displayClose:false});
                                
                                var confirm = new Button(120, 50, "ON", "green").center(pane).mov(0,70);

                                confirm.on("click", function() {
                                    pane.hide();
                                    window.location.replace(window.location.pathname + window.location.search + window.location.hash);

                                });
                                pane.show();
                            }
                            stage.update();

                        }

                    });
                    context.setStrokeStyle(3,"round");
                    var commandi1 = context.beginStroke(createjs.Graphics.getRGB(0, 0, 0)).command;
                    //
                    var commandi = context.beginBitmapFill(imageObj.image).command;


                    context.moveTo(offsetX, offsetY);




                    if (j != 0) {
                        context.lineTo(offsetX + 3 * x8, offsetY);
                        if (tileObj.up == 1) {
                            context.curveTo(offsetX + 2 * x8, offsetY - 2 * y8, offsetX + 4 * x8, offsetY - 2 * y8);
                            context.curveTo(offsetX + 6 * x8, offsetY - 2 * y8, offsetX + 5 * x8, offsetY);
                        } else {
                            context.curveTo(offsetX + 2 * x8, offsetY + 2 * y8, offsetX + 4 * x8, offsetY + 2 * y8);
                            context.curveTo(offsetX + 6 * x8, offsetY + 2 * y8, offsetX + 5 * x8, offsetY);
                        }
                    }
                    context.lineTo(offsetX + 8 * x8, offsetY);
                    if (i != horizontalPieces - 1) {
                        context.lineTo(offsetX + 8 * x8, offsetY + 3 * y8);
                        if (tileObj.right == 1) {
                            context.curveTo(offsetX + 10 * x8, offsetY + 2 * y8, offsetX + 10 * x8, offsetY + 4 * y8);
                            context.curveTo(offsetX + 10 * x8, offsetY + 6 * y8, offsetX + 8 * x8, offsetY + 5 * y8);
                        } else {
                            context.curveTo(offsetX + 6 * x8, offsetY + 2 * y8, offsetX + 6 * x8, offsetY + 4 * y8);
                            context.curveTo(offsetX + 6 * x8, offsetY + 6 * y8, offsetX + 8 * x8, offsetY + 5 * y8);
                        }
                    }
                    context.lineTo(offsetX + 8 * x8, offsetY + 8 * y8);
                    if (j != verticalPieces - 1) {
                        context.lineTo(offsetX + 5 * x8, offsetY + 8 * y8);
                        if (tileObj.down == 1) {
                            context.curveTo(offsetX + 6 * x8, offsetY + 10 * y8, offsetX + 4 * x8, offsetY + 10 * y8);
                            context.curveTo(offsetX + 2 * x8, offsetY + 10 * y8, offsetX + 3 * x8, offsetY + 8 * y8);
                        } else {
                            context.curveTo(offsetX + 6 * x8, offsetY + 6 * y8, offsetX + 4 * x8, offsetY + 6 * y8);
                            context.curveTo(offsetX + 2 * x8, offsetY + 6 * y8, offsetX + 3 * x8, offsetY + 8 * y8);
                        }
                    }
                    context.lineTo(offsetX, offsetY + 8 * y8);
                    if (i != 0) {
                        context.lineTo(offsetX, offsetY + 5 * y8);
                        if (tileObj.left == 1) {
                            context.curveTo(offsetX - 2 * x8, offsetY + 6 * y8, offsetX - 2 * x8, offsetY + 4 * y8);
                            context.curveTo(offsetX - 2 * x8, offsetY + 2 * y8, offsetX, offsetY + 3 * y8);
                        } else {
                            context.curveTo(offsetX + 2 * x8, offsetY + 6 * y8, offsetX + 2 * x8, offsetY + 4 * y8);
                            context.curveTo(offsetX + 2 * x8, offsetY + 2 * y8, offsetX, offsetY + 3 * y8);
                        }
                    }
                    context.lineTo(offsetX, offsetY);
                    s.addTo(con);

                    var fill = new createjs.Graphics.Fill("red");

                    //var newGra = context.append(fill);
                    var hint = new Shape();//s.clone(true);
                    hint.mouseChildren = false;
                    hint.mouseEnabled = false;
                    s.hint = hint;
                    hint.graphics = context.clone(true);
                    hint.pos(puzzleX,puzzleY);
                    // newGra.graphics = newGra;
                    hint.graphics._fill = fill;
                    hint.graphics._fill.style = null;

                    hint.addTo(con,0);
                    //s.animate({obj:{x:frame.width-offsetX-pieceWidth,y:frame.height-offsetY-pieceHeight}, time:700});
                    //s.animate({obj:{x:-offsetX,y:-offsetY}, time:700});

                    var postion = {x:rand(-offsetX,frame.width-offsetX-pieceWidth),y:rand(-offsetY,frame.height-offsetY-pieceHeight)};
                    s.animate({obj:postion, time:700});

                    console.log(postion);

                }
            }


            con.addTo(stage);
            /*con.x -= imageWidth/2;
            con.y -= imageHeight/2;*/
            stage.update();



        }); // end asset complete


        stage.update(); // this is needed to show any changes

    }); // end of ready
