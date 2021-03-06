// Set starting life totals here
var playerLife = 10;
var hackerLife = 10;

// Message text when teh game is over
var hackerWinnerMessage = "Game over: You got hacked!";
var playerWinnerMessage = "You defeated the hacker!";


var playerStartLife = parseInt(playerLife);
var hackerStartLife = parseInt(hackerLife);

var roundFinished = false;
var cardSelected = false;

updateScores();

document.querySelector(".game-board").classList.add("before-game");

var playerCardEls = document.querySelectorAll(".player-area .card");
var allCards = document.querySelectorAll(".card");
var allCardElements = document.querySelectorAll(".card");

for(var i = 0; i < allCards.length; i++) {
  var card = allCardElements[i];
  if(card.classList.contains("player-card")) {
    card.addEventListener("click",function(e){
      cardClicked(this);
    });
  }
}


// When a card is clicked
function cardClicked(cardEl) {

  if(cardSelected) {
    return;
  }

  cardEl.classList.add("played-card");
  cardSelected = true;

  // Wait 500ms to reveal the hacker power
  setTimeout(function(){
    revealHackerPower();
  },500)

  // Wait 750ms to reveal the player power
  setTimeout(function(){
    revealPlayerPower();
  },750)

  // Wait 1250ms to compare the card scoers
  setTimeout(function(){
    compareCards();
  }, 1250);
}

// Shows the power level on the player card
function revealPlayerPower(){
  var playerCard = document.querySelector(".played-card");
  var playerPowerEl = playerCard.querySelector(".power");
  playerPowerEl.style.display = "block";
}

// Shows the power level on the hacker card
function revealHackerPower(){
  var hackerCard = document.querySelector(".hacker-card");
  var hackerPowerEl = hackerCard.querySelector(".power");
  hackerPowerEl.style.display = "block";
}

function compareCards(){
  var playerCard = document.querySelector(".played-card");
  var playerPowerEl = playerCard.querySelector(".power");

  var hackerCard = document.querySelector(".hacker-card");
  var hackerPowerEl = hackerCard.querySelector(".power");

  var playerPower = parseInt(playerPowerEl.innerHTML);
  var hackerPower = parseInt(hackerPowerEl.innerHTML);

  var powerDifference = playerPower - hackerPower;

  if (powerDifference < 0) {
    // Player Loses
    playerLife = playerLife + powerDifference;
    hackerCard.classList.add("better-card");
    playerCard.classList.add("worse-card");
    document.querySelector(".player-stats .thumbnail").classList.add("ouch");
  } else if (powerDifference > 0) {
    // Player Wins
    hackerLife = hackerLife - powerDifference;
    playerCard.classList.add("better-card");
    hackerCard.classList.add("worse-card");
    document.querySelector(".hacker-stats .thumbnail").classList.add("ouch");
  } else {
    playerCard.classList.add("tie-card");
    hackerCard.classList.add("tie-card");
  }

  updateScores();

  if(playerLife <= 0) {
    gameOver("Hacker");
  } else if (hackerLife <= 0){
    gameOver("Player")
  }

  roundFinished = true;

  document.querySelector("button.next-turn").removeAttribute("disabled");
}

// Shows the winner message
function gameOver(winner) {
  document.querySelector(".game-board").classList.add("game-over");
  document.querySelector(".winner-section").style.display = "flex";
  document.querySelector(".winner-section").classList.remove("player-color");
  document.querySelector(".winner-section").classList.remove("hacker-color");

  if(winner == "Hacker") {
    document.querySelector(".winner-message").innerHTML = hackerWinnerMessage;
    document.querySelector(".winner-section").classList.add("hacker-color");
  } else {
    document.querySelector(".winner-message").innerHTML = playerWinnerMessage;
    document.querySelector(".winner-section").classList.add("player-color");
  }
}

function startGame() {
  document.querySelector(".game-board").classList.remove("before-game");
  document.querySelector(".game-board").classList.add("during-game");

  playGame();
}

function restartGame(){



  document.querySelector(".game-board").classList.remove("game-over");
  document.querySelector(".game-board").classList.remove("during-game");
  document.querySelector(".game-board").classList.add("before-game");

  document.querySelector(".winner-section").style.display = "none";
  document.querySelector(".hacker-card").style.display = "none";

  var cards = allCards;

  document.querySelector("button").removeAttribute("disabled");

  for(var i = 0; i < cards.length; i++) {
    cards[i].style.display = "none";
  }

  playerLife = playerStartLife;
  hackerLife = hackerStartLife;

  updateScores();

  roundFinished = true;
  cardSelected = false;
}


function updateScores(){
  // Update life totals
  document.querySelector(".player-stats .life-total").innerHTML = playerLife;
  document.querySelector(".hacker-stats .life-total").innerHTML = hackerLife;

  // Set player lifebar
  var playerPercent = playerLife / playerStartLife * 100;
  if (playerPercent < 0) {
    playerPercent = 0;
  }

  document.querySelector(".player-stats .life-left").style.height =  playerPercent + "%";

  var hackerPercent = hackerLife / hackerStartLife * 100
  if (hackerPercent < 0) {
    hackerPercent = 0;
  }

  document.querySelector(".hacker-stats .life-left").style.height =  hackerPercent + "%";
}

function playGame() {

  roundFinished = true;
  cardSelected = false;

  // Get scenario cards
  var randomScenarioIndex = Math.floor(Math.random() * (scenarios.length));
  var scenario = scenarios[randomScenarioIndex];

  var hackerCard = scenario.hackerCard;
  var hackerCardEl = document.querySelector(".hacker-area .card");

  // Contents of the player cards
  var playerCards = scenario.playerCards;

  //Show cards
  document.querySelector(".next-turn").setAttribute("disabled", "true");

  var j = 0;

  for(var i = 0; i < allCardElements.length; i++) { //asdf
    var card = allCardElements[i];

    card.querySelector(".power").style.display = "none";
    card.style.display = "none";
    card.classList.remove("worse-card");
    card.classList.remove("better-card");
    card.classList.remove("played-card");
    card.classList.remove("tie-card");
    card.classList.remove("prepared");
    card.classList.remove("showCard");

    if(card.classList.contains("player-card")) {
      card.querySelector(".text").innerHTML = playerCards[j].description;
      card.querySelector(".power").innerHTML = playerCards[j].power;
      j++;
    }

    setTimeout(function(card){
      return function() {
        card.classList.remove("prepared");
        card.classList.add("showCard");
        card.style.display = "block";
      }
    }(card,i), parseInt(i+1) * 100);


  }

  // Display the hacker card
  hackerCardEl.querySelector(".text").innerHTML = hackerCard.description;
  hackerCardEl.querySelector(".power").innerHTML = hackerCard.power;




}
