var trex, trex_running, trex_collided;
var edges;
var ground, ground_image;
var cloud, cloud_image;
var invisibleground;
var cactu1, cactu2, cactu3, cactu4, cactu5, cactu6;
var gameover, restart, gameoverimg, restartimg;
var score = 0;
var PLAY = 1;
var END = 0;
var gamestate = PLAY;
var jumpsound, failsound, checkpointsound;

function preload() {
  //carregar imagens em variáveis auxiliares
  trex_running = loadAnimation("trex1.png",  "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  cactu1 = loadImage("obstacle1.png");
  cactu2 = loadImage("obstacle2.png");
  cactu3 = loadImage("obstacle3.png");
  cactu4 = loadImage("obstacle4.png");
  cactu5 = loadImage("obstacle5.png");
  cactu6 = loadImage("obstacle6.png");
  gameoverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
  jumpsound = loadSound("jump.mp3");
  failsound = loadSound("fail.mp3");
  checkpointsound = loadSound("checkPoint.mp3");
}

function setup() {
  //criação da area do jogo
  createCanvas(windowWidth, windowHeight);
  ground = createSprite(width/2, height-20, width, 20);
  ground.addImage("ground", ground_image);

  //criando o trex
  trex = createSprite(50, height-40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  
  //definindo limites
  edges = createEdgeSprites();

  invisibleground = createSprite(width/2, height-10, width, 10);
  invisibleground.visible = false;
  
  cloudG = new Group();
  cactuG = new Group();
  
  gameover = createSprite(width/2, height/2);
  gameover.addImage(gameoverimg);
  gameover.visible = false;

  restart = createSprite(width/2, height/2+40);
  restart.addImage(restartimg)
  restart.visible = false;
  restart.scale = 0.6;
  /*var teste = Math.round(random(1, 100));
  console.log(teste);*/
  //trex.setCollider("rectangle", 0, 0, 400, trex.height);
  //trex.debug=true;
}

function draw() {
  background('white');
  fill('gold');
  textSize(20);
  text("Score: "+score, width-100, 50);
  //console.log("Isto é: ", gamestate);
  if(gamestate == PLAY){
    ground.velocityX = -5;
    score = score+Math.round(getFrameRate()/30);
    if(score>0&&score%100==0){
      checkpointsound.play();
    }
    if(ground.x < 0){
      ground.x = ground.width/2;
    }
    if(touches.length > 0&&trex.y >=150){
      trex.velocityY = -10;
      jumpsound.play();
      touches = [];
    }
    trex.velocityY = trex.velocityY + 0.5;
    createcactu();
    createclouds();
    if(cactuG.isTouching(trex)){
      //trex.velocityY = -10;
      //jumpsound.play();
      gamestate = END;
      failsound.play();
    }
  }
  else if(gamestate == END){
    ground.velocityX = 0;
    trex.changeAnimation("collided", trex_collided);
    trex.velocityY = 0;
    cactuG.setLifetimeEach(-1);
    cloudG.setLifetimeEach(-1);
    cactuG.setVelocityXEach(0);
    cloudG.setVelocityXEach(0);
    restart.visible = true;
    gameover.visible = true;
    if(touches.length > 0){
      touches = [];
      reset();
    }
  }
  //colidindo
  //trex.collide(edges[3]);
  trex.collide(invisibleground);
  if(mousePressedOver(restart)&&gamestate==END){
      //console.log("Reinicia.");
      reset();
    }
  //console.log(frameCount);
  drawSprites();
}
function createclouds(){
  if(frameCount%60==0){
  cloud = createSprite(width+10, 100, 10, 10);
  cloud.addImage("cloud", cloud_image);
  cloud.scale = 0.5;
  cloud.y = Math.round(random(height-150, height-100));
  cloud.velocityX = -3;
  cloud.lifetime = width+10;
  cloud.depth = trex.depth;
  trex.depth = trex.depth+1;
  cloud.depth = gameover.depth;
  gameover.depth = gameover.depth+1;
  trex.depth = gameover.depth;
  gameover.depth = gameover.depth+1;
  //console.log(cloud.depth);
  //console.log(trex.depth);
  cloudG.add(cloud);
  }
}
function createcactu(){
  if(frameCount%60==0){
  var cactu = createSprite(width+10, height-35, 10, 40);
  cactu.velocityX = -(5+score/100);
  var aleatorio = Math.round(random(1, 6));
  switch(aleatorio){
    case 1:cactu.addImage(cactu1);
    break;
    case 2:cactu.addImage(cactu2);
    break;
    case 3:cactu.addImage(cactu3);
    break;
    case 4:cactu.addImage(cactu4);
    break;
    case 5:cactu.addImage(cactu5);
    break;
    case 6:cactu.addImage(cactu6);
    break;
    default:break;
  }
  cactu.scale = 0.5;
  cactu.lifetime = width+10;
  cactuG.add(cactu);
  }
}

function reset(){
  gamestate = PLAY;
  restart.visible = false;
  gameover.visible = false;
  cactuG.destroyEach();
  cloudG.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
  
}