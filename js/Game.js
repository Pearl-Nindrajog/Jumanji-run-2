class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(displayWidth/4,-displayHeight*4);
    car1.scale=0.8;
    car1.addImage("car1",car1_img);
    car2 = createSprite(300,200);
    car2.scale=2;
    car2.addImage("car2",car2_img);
    car3 = createSprite(500,200);
    car3.scale=0.7;
    car3.addImage("car3",car3_img);
    car4 = createSprite(700,200);
    car4.scale=0.3;
    car4.addImage("car4",car4_img);
    cars = [car1, car2, car3, car4];
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      background(rgb(198,135,103));

      image(track, 0,-displayHeight*4,displayWidth-50, displayHeight*5);
      image(jaguar_img,displayWidth/2.5,-displayHeight*4,250,250);

      var display_position = 100;
      console.log(displayHeight);

      //index of the array
      var index = 0;

      //x and y position of the cars
     // var x = 175 ;
      var x=100;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
         x = x + 200;
        //x = displayWidth/2 + allPlayers[plr].left_right;

        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;
       // console.log(index, player.index)

       
        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
       
        textSize(25);
        fill("black");

      text(allPlayers[plr].name + ": " + allPlayers[plr].score, 120,y);
      }

    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }
    /*if(keyIsDown(RIGHT_ARROW) && player.index !== null){
      player.distance +=10;
      player.update();
    }
 /*else if(keyIsDown(LEFT_ARROW) && player.index !== null){
      player.left_right =player.left_right-10;
      player.update();
    }*/
if (frameCount%40===0){
  obstacles= createSprite(Math.round(random(100,1000)),Math.round(random(-displayHeight*2,-displayHeight*4)),50,50);
  obstacles.velocityY=4;
  var num = Math.round(random (1,3));
  switch(num){
    case 1: obstacles.addImage( MonkeyMan_image);
    obstacles.scale=0.7;
    break;
    case 2: obstacles.addImage (CreepyCreature_image);
    obstacles.scale=0.5;
    break;
    case 3: obstacles.addImage(AngryLion_image);
    obstacles.scale=0.5;
    break;
  }
  ObstaclesGroup.add(obstacles)
}
if (player.index!==null) {
  for (var i=0; i<ObstaclesGroup.length; i++){
 if (ObstaclesGroup.get(i).isTouching(cars)){
ObstaclesGroup.get(i).destroy()
player.score+=10;
player.update();

}
  }
}
    if(player.distance > 3860){
      gameState = 2;
      player.rank +=1
      Player.updateCarsAtEnd(player.rank)
    }
   
    drawSprites();
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank);
  }
}
