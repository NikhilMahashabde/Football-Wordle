/////////////////////// GLOBAL BINDINGS ////////////////////////////////////

///// NODE ELEMENTS /////

// elements targets for global use. 
let keyboardContainer = document.querySelector("#containerKeyboardInput")
let keyboardContainerTopRowDiv = document.getElementById("keyboardContainerTopRow");
let keyboardContainerMiddleRowDiv = document.getElementById("keyboardContainerMiddleRow");
let keyboardContainerBottomRowDiv = document.getElementById("keyboardContainerBottomRow");
let selectInputDifficulty = document.getElementById("selectDifficulty");
let containerLetterOutput = document.getElementById("containerLetterOutput"); 
let buttonStartGame = document.getElementById("startGame")
let settingsButton = document.querySelector("#buttonSettingsModal");
let buttonModalInstructionsTrigger = document.getElementById("instructionsModalTrigger");
let svgSettingsIcon = document.getElementById("svgSettingsIcon")
let svgInstructionsIcon = document.getElementById("svgInstructionsIcon")
let svgPlayIcon = document.getElementById("svgPlayIcon");
let svgStopIcon = document.getElementById("svgStopIcon");
let playerScore = document.getElementById("scoreText") 

let hintsButton = document.querySelector("#hintsButton");
let clueContainer = document.getElementById("clueContainer");
let buttonWL = document.getElementById("btnModalWL");
let headingWLModal = document.getElementById("headingWL")
let tdName = document.getElementById("tdName");
let tdKitNumber = document.getElementById("tdKitNumber");
let tdClub = document.getElementById("tdClub");
let tdNationality = document.getElementById("tdNationality");
let tdAge = document.getElementById("tdAge");
let tdPosition = document.getElementById("tdPosition");
let divPlayerPhoto = document.getElementById("divPlayerPhoto");
let imgPlayerPhoto = generateElement("img", divPlayerPhoto);
let buttonGameStateDisplay = document.getElementById("buttonGameStateDisplay")


let buttonHints = document.getElementById("hintsButton")

let tdClueName = document.getElementById("tdClueName");
let tdClueKitNumber = document.getElementById("tdClueKitNumber");
let tdClueClub = document.getElementById("tdClueClub");
let tdClueNationality = document.getElementById("tdClueNationality");
let tdClueAge = document.getElementById("tdClueAge");
let tdCluePosition = document.getElementById("tdCluePosition");
let divCluePlayerPhoto = document.getElementById("divCluePlayerPhoto");
let imgCluePlayerPhoto = generateElement("img", divCluePlayerPhoto);

let timeSeconds = document.getElementById("timeSeconds");
let timeMinutes = document.getElementById("timeMinutes");



//test
let TkeyboardContainer = document.querySelector("#TcontainerKeyboardInput")
let TkeyboardContainerTopRowDiv = document.getElementById("TkeyboardContainerTopRow");
let TkeyboardContainerMiddleRowDiv = document.getElementById("TkeyboardContainerMiddleRow");
let TkeyboardContainerBottomRowDiv = document.getElementById("TkeyboardContainerBottomRow");



///// EVENT LISTNERS
//static event listeners
buttonStartGame.addEventListener('click', resetFocus);
hintsButton.addEventListener('click', resetFocus);
settingsButton.addEventListener('click', resetFocus);
svgSettingsIcon.addEventListener('click', triggerSettings);
svgInstructionsIcon.addEventListener('click', triggerHelp);
document.addEventListener('keydown', (event) => {
    document.body.focus();
    document.activeElement.blur();
    if (!flagGameActive) return;
    keyInput = event.key.toUpperCase();
    keyInput == "BACKSPACE" ? keyInput = "\u2612" : keyInput;
    keyInput == "ENTER" ? keyInput = "\u23CE" : keyInput;

    
    if (!validKeys.includes(keyInput)) return;
    console.log(document.activeElement)
    handleKeyInput(keyInput);

    // Alert the key name and key code on keydown
});



////// GLOBAL VARIABLES
let test = 1;
let targetName = "";
let currentWord = "";
let currentLine = "";
let wordGuessList = []; 
let inputGridRows = 8;
let gridLength = 10;
let playerCard;
let playerData;
let cluesUsed = [];
const win = "WIN";
const lose = "LOSE";
const gaveUp = "GAVE UP";
let secondCounter = 0;
let gameTimer = 0;

let uniqueLetters = 0;
let currentUniqueLetters = [];




svgStopIcon.style.display = "none";

///// FLAGS /////

let flagStartGame = false;
let flagGameActive = false;
let flagGameEnded = false; 
let flagCluesActive = true;

let flagLeagueSelected = {
    "La Liga": false, 
    "EPL": true,
}

///// DATASETS AND MAPS /////

// JSON import
fetch('https://nikhilmahashabde.github.io/Football-Wordle/playerData.json')
    .then((response) => response.json())
    .then((data) => {
        playerData = data;
    });

// User profile factory function TBA

function createPlayer(playerName) {
    const player = {
      name: playerName,
      storageKey: "",
      setScore(currentScore) {
        localStorage.setItem(this.storageKey, currentScore);
      },
      getScore() {
        return localStorage.getItem(this.storageKey);
      }
    };
    player.storageKey = `${player.name}.score`;
    return player;
  }

const profileDefault = createPlayer("default");
  
// User profile 1 test

console.log(profileDefault.getScore());

let currentGems = "";

let currentScore = profileDefault.getScore();


// keyboard keyset to display
let displayKeysMap = {
    topRow: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P" ],
    middleRow: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "-"],
    bottomRow: ["\u23CE", "Z", "X", "C", "V", "B", "N", "M", "\u2612"]
}

let positionToFullPositionMap = {
    "\"<span class=\"\"pos pos2\"\">RWB\"" : "Right Wing Back",
    "\"<span class=\"\"pos pos3\"\">RB\"": "Right Back",
    "\"<span class=\"\"pos pos4\"\">RCB\"": "Right Center Back",
    "\"<span class=\"\"pos pos5\"\">CB\"": "Center Back",
    "\"<span class=\"\"pos pos6\"\">LCB\"": "Left Center Back",
    "\"<span class=\"\"pos pos7\"\">LB\"": "Left Back",
    "\"<span class=\"\"pos pos8\"\">LWB\"": "Left Wing Back",
    "\"<span class=\"\"pos pos9\"\">RDM\"": "Right Defensive Mid",
    "\"<span class=\"\"pos pos10\"\">CDM\"": "Center Defensive Mid", 
    "\"<span class=\"\"pos pos11\"\">LDM\"": "Left Defensive Mid", 
    "\"<span class=\"\"pos pos12\"\">RM\"": "Right Midfield",
    "\"<span class=\"\"pos pos13\"\">RCM\"": "Right Center Mid",
    "\"<span class=\"\"pos pos14\"\">CM\"": "Center Midfield",
    "\"<span class=\"\"pos pos15\"\">LCM\"": "Left Center Mid",
    "\"<span class=\"\"pos pos16\"\">LM\"": "Left Midfield",
    "\"<span class=\"\"pos pos17\"\">RAM\"": "Right Attacking Mid",
    "\"<span class=\"\"pos pos18\"\">CAM\"": "Center Attacking Mid",
    "\"<span class=\"\"pos pos19\"\">LAM\"": "Left Attacking Mid", 
    "\"<span class=\"\"pos pos20\"\">RF\"": "Right Forward",
    "\"<span class=\"\"pos pos21\"\">CF\"": "Center Forward",
    "\"<span class=\"\"pos pos22\"\">LF\"": "Left Forward",
    "\"<span class=\"\"pos pos23\"\">RW\"": "Right Wing Forward",
    "\"<span class=\"\"pos pos24\"\">RS\"": "Right Striker",
    "\"<span class=\"\"pos pos25\"\">ST\"": "Striker",
    "\"<span class=\"\"pos pos26\"\">LS\"": "Left Striker",
    "\"<span class=\"\"pos pos27\"\">LW\"": "Left Wing Forward",
    "\"<span class=\"\"pos pos28\"\">SUB\"": "Substitute/Bench",
    "\"<span class=\"\"pos pos29\"\">RES\"": "Reserve",
    

}
let validKeys = Object.values(displayKeysMap).flat()

//game difficulty map 
let mapDifficulty = {
    easy: 8,
    medium: 7,
    hard: 6,
}

//clue map

let clueToKeyMap = {
    0: "Age",
    1: "Photo",
    2: "Nationality",
    3: "Club",
    4: "Position",
    5: "Kit Number",
}

///////////////////////////////// PAGE INITIALISATION /////////////////////////////
//generate the keyboard appearance and layout.

// keyboard

displayKeyboard(displayKeysMap);
generateGrid();

// variables
playerScore.textContent = profileDefault.getScore();
svgStopIcon.style.display = "none";

////////////////////////////////// FUNCTIONS ///////////////////////////

function displayKeyboard(displayKeysMap){
    keyboardContainerTopRowDiv.textContent = "";
    keyboardContainerMiddleRowDiv.textContent = '';
    keyboardContainerBottomRowDiv.textContent - '';

    displayKeysMap.topRow.forEach(element => {
        let key = generateElement("button", keyboardContainerTopRowDiv)
        key.classList.add("btn", "btn-secondary", "keyboardKeys", "col");
        key.textContent = element;
        key.addEventListener("click", event => {keyPress(event)});
    });

    displayKeysMap.middleRow.forEach(element => {
        let key = generateElement("button", keyboardContainerMiddleRowDiv)
        key.classList.add("btn", "btn-secondary", "keyboardKeys", "col");
        key.textContent = element;
        
        key.addEventListener("click", event => {keyPress(event)});
    });
    displayKeysMap.bottomRow.forEach(element => {
        let key = generateElement("button", keyboardContainerBottomRowDiv)
        key.textContent = element;
        key.classList.add("btn", "btn-secondary", "keyboardKeys", "col")
        if (key.textContent == "\u23CE"){
            key.classList.add("enterKey", "col-2");
        }
        if(key.textContent == "\u2612"){
            key.classList.add("deleteKey", "col-2");
        }
        key.addEventListener("click", event => {keyPress(event)});
    });
}


// filter dataset to get a random value;
// Optional take into account selected league
function filterDataset(flagLeagueSelected, playerData) {

    randomPlayerNumber = Math.floor(Math.random() * playerData.length)

    //random data generate value;
    //function etc
    // function to generate random name from the list of players. 
    let nameFilter = playerData[randomPlayerNumber]["Name"].toUpperCase();
    
    while (nameFilter.length > 12){
        randomPlayerNumber = Math.floor(Math.random() * playerData.length);
        nameFilter = playerData[randomPlayerNumber]["Name"].toUpperCase();
    }
    playerCard = playerData[randomPlayerNumber];
    return nameFilter;
}

//generate grid
function generateGrid(){

    containerLetterOutput.style.gridTemplateColumns = `repeat(${gridLength}, min(5vh, clamp(28px, 8vw, 60px))`;
  
    for (let y=0; y<inputGridRows; y++){
        for (let x = 0; x<gridLength; x++){
            let newNode = generateElement("div", containerLetterOutput, 'id="sadgasg"', 'class="hi"');
            newNode.classList.add("charInputBox");
            newNode.maxLength = 1;
            newNode.id = `${x}.${y}`;
        }
    }
}

function generateElement(type, parent, ...options){
    let newNode = document.createElement(type);
    parent.appendChild(newNode);
    return newNode;
}

function handleGuess(){

    wordGuessList.push(currentWord);
    lastGuess = currentWord;
    let lastLine = currentLine;
        
    for (guess of wordGuessList){
      
        for (let x = 0; x < lastGuess.length; x++){
            if (targetName.includes(lastGuess[x])){
                let divGuessIncludes = document.getElementById(`${x}.${lastLine}`);
                divGuessIncludes.classList.add("letterIncludes");

                let divKeyInput = keyboardContainer.querySelectorAll("div > div > button");
               
                divKeyInput.forEach(element => {
                    if (element.textContent == lastGuess[x]){
                        element.classList.add("btn","btn-warning");
                    }
                });

            } else {
                let divKeyInput = keyboardContainer.querySelectorAll("div > div > button");
                
                divKeyInput.forEach(element => {
                    if (element.textContent == lastGuess[x]){
                        element.classList.add("btn", "btn-dark");
                    }
                });

            }

            if (lastGuess[x] == targetName[x]){
                //scoring

                if (!currentUniqueLetters.includes(lastGuess[x])){
                    currentUniqueLetters.push(lastGuess[x])
                    currentScore++;
                    localStorage.setItem("currentScore", `${currentScore}`);
                    profileDefault.setScore(currentScore);

                    playerScore.textContent = profileDefault.getScore();
                }

                let divGuessIncludes = document.getElementById(`${x}.${lastLine}`);
                divGuessIncludes.classList.add("letterCorrect");
               
                let divKeyInput = keyboardContainer.querySelectorAll("div > div > button");
                
                divKeyInput.forEach(element => {
                    if (element.textContent == lastGuess[x]){
                        element.classList.remove("btn-warning");
                        element.classList.add("btn","btn-success");
                        
                    }
                });
            }
        }
    }
    if (guess == targetName){
        endGame(win);
       
    } else if (inputGridRows == (currentLine+1)){
        endGame(lose);
    }
    currentLine++;
    currentWord = "";
}

function endGame(condition){

    headingWLModal.textContent = `You ${condition} in ${timeMinutes.textContent} minutes and ${timeSeconds.textContent} seconds!`;
    fillPlayerCard();
    buttonWL.click();

    // score updating - temporarily set to give up as i cant win.. 
    if (condition == win){
        currentScore += 25;
        profileDefault.setScore(currentScore);
        localStorage.setItem("currentScore", `${currentScore}`);
        playerScore.textContent = profileDefault.getScore();
        if (secondCounter < 60){

        }
    }

    //reset game states

    svgStopIcon.style.display = "none";
    svgPlayIcon.style.display = "";
    flagGameEnded = true;
    flagGameActive = false;
    buttonGameStateDisplay.textContent = "Play";
    clearTimeout(inactiveTimer);
    clearInterval(gameTimer);

}

function fillPlayerCard(){
    
    tdName.textContent = targetName;
    tdKitNumber.textContent = playerData[randomPlayerNumber]["Kit Number"]
    tdClub.textContent  = playerData[randomPlayerNumber]["Club"]
    tdNationality.textContent  = playerData[randomPlayerNumber]["Nationality"]
    tdAge.textContent  = playerData[randomPlayerNumber]["Age"]
    tdPosition.textContent  = playerData[randomPlayerNumber]["Position"]
    imgPlayerPhoto.setAttribute("src", `${ playerData[randomPlayerNumber]["Photo"]}`)
    imgPlayerPhoto.style.width = "300px";

}

//////////////////////////////////// EVENT HANDLERS ///////////////////////////////////////////

//start button feature
function startGameInit(){

    if (!flagGameActive){
       
        setGameStartStates()
        targetName = filterDataset(flagLeagueSelected, playerData);
        playerCard["Position"] = positionToFullPositionMap[playerCard["Position"]];
        resetActiveVariables()
       
        startGameTimer();
        gridLength = targetName.length;
        inputGridRows = mapDifficulty[selectInputDifficulty.value];
        generateGrid();
        
        buttonGameStateDisplay.textContent = "End";
        flagStartGame = false;

    } else if (flagGameActive == true){
        flagStartGame = false;
        endGame(gaveUp);
        buttonGameStateDisplay.textContent = "Start";
    };
   
};

function setGameStartStates(){
    flagStartGame = true;
    flagGameEnded = false;
    flagGameActive = true;
}
function resetActiveVariables(){
    cluesUsed.length = 0;
    flagCluesActive = true;
    currentWord  = "";
    currentLine = 0;
    containerLetterOutput.textContent = "";
    divKeyInput = keyboardContainer.querySelectorAll("div > div > button")
        divKeyInput.forEach(divElement => {
            divElement.classList.remove("btn-success", "btn-dark", "btn-warning")
    })
    
    tdName.textContent = "";
    tdKitNumber.textContent = "";
    tdClub.textContent  = "";
    tdNationality.textContent  = "";
    tdAge.textContent  = "";
    tdPosition.textContent  = "";
    imgPlayerPhoto.setAttribute("src", "");

    tdClueName.textContent = "??????????";
    tdClueKitNumber.textContent = "??????????";
    tdClueClub.textContent = "??????????";
    tdClueNationality.textContent = "??????????";
    tdClueAge.textContent = "??????????";
    tdCluePosition.textContent = "??????????";
    
    imgCluePlayerPhoto.setAttribute("src", playerCard["Photo"])
    imgCluePlayerPhoto.classList.add("superBlur");
    
    inactiveTimer = setTimeout(function() {
        buttonHints.click();
    }, 60000);
    clueContainer.textContent = "";

    // timer reset states
    resetStopwatch();

    // button swap
    svgStopIcon.style.display = "";
    svgPlayIcon.style.display = "none";

    uniqueLetters = [...targetName].reduce((letters, currentLetter) => {
                letters == !letters.includes(currentLetter) ? letters : letters.push(currentLetter)
                return letters;
            }, []); // unique leters inside the target word
        
    

}

function resetStopwatch(){
    secondCounter = 0;
    timeSeconds.textContent = 0;
    timeMinutes.textContent = 0;


}
  
function keyPress(event){
    if (!flagGameActive) return;
    resetInactiveTimer();
    keyInput = event.target.textContent;
    console.log(keyInput)
    handleKeyInput(keyInput);
}

function handleKeyInput(keyInput){

    
    currentWord = updateWord(currentWord, keyInput);
    mapCurrentWordToLine(currentWord, currentLine);
           
    if (currentWord.length == targetName.length && keyInput == "\u23CE"){
        handleGuess()
    }
}

///// updatedword
function updateWord(wordToUpdate, keyInput) {
    switch (keyInput){
        case ("\u2612"):
            return (wordToUpdate.substring(0,wordToUpdate.length-1));

        break;
        case ("\u23CE"):
            return currentWord;

        break;
        default:
            if (currentWord.length < targetName.length){
                return wordToUpdate.concat(keyInput);
            } else {
                return currentWord;
            }
  
        break;
    };
        
};

function mapCurrentWordToLine(currentWord, currentLine){
    let y = currentLine;

    for (let x = 0; x < targetName.length ; x++){
        let divAtIndex = document.getElementById(`${x}.${y}`);
        divAtIndex.textContent = currentWord[x];
    }

}



function triggerSettings(){

    settingsButton.click();
}

function triggerHelp(){
    buttonModalInstructionsTrigger.click();
}
/////////////////////////////

function resetFocus(){
    hintsButton.blur();
    settingsButton.blur();
    buttonStartGame.blur();
    document.body.focus();
};

function revealHint(){
    
    if (!flagCluesActive) return;
    if (flagGameActive){

        if (currentLine+1 == inputGridRows){
            let newText = generateElement("p", clueContainer);
            clueContainer.textContent = "Last line left - no more clues"
            flagCluesActive = false;
            return;
        }
        
        if (cluesUsed.length == 6){
            console.log(clueContainer.textContent);
            let newText = generateElement("p", clueContainer);
            clueContainer.textContent = "HA nice try, the name wont be revealed. No more clues!"
            flagCluesActive = false;
            return;
        }
         //generate random number for the 6 different clues

        randomClueNumber = Math.floor(Math.random()*6);
        while (cluesUsed.includes(randomClueNumber)){
            randomClueNumber = Math.floor(Math.random()*6);
        }
             
        //map the clues to each object's props
        // depending on which one, do/display something

        let cluetype = clueToKeyMap[randomClueNumber];

        // let tdCluePosition = document.getElementById("tdCluePosition");

        switch (cluetype){
            case "Photo": 
                imgCluePlayerPhoto.setAttribute("src", playerCard["Photo"])
                imgCluePlayerPhoto.classList.remove("superBlur");
                imgCluePlayerPhoto.classList.add("playerImage");
            break;
            case "Name":
                tdClueName.textContent = playerCard["Name"];
                break;
            case "Age":
                tdClueAge.textContent = playerCard["Age"];
                break;
            case "Kit Number":
                tdClueKitNumber.textContent = playerCard["Kit Number"];
            break;
            case "Club":
                tdClueClub.textContent = playerCard["Club"];
            break;
            case "Nationality":
                tdClueNationality.textContent = playerCard["Nationality"];
            break;
            case "Position":
                tdCluePosition.textContent = playerCard["Position"];
            break;
        }

        //increse line counter and fill the line with -----
        cluesUsed.push(randomClueNumber);
        currentWord = ".".repeat(targetName.length);
        mapCurrentWordToLine(currentWord, currentLine);
        handleGuess();
                

    } else {
        clueContainer.textContent = "Game not started. Start game first!";
    }

}

// TIMER FUNCTIONS
//on load 

window.onload = function(){
    setTimeout(function() {
        
        buttonModalInstructionsTrigger.click();
    }, 3000);
};

function resetInactiveTimer(){
    clearTimeout(inactiveTimer);
    inactiveTimer = setTimeout(function() {
        buttonHints.click();
    }, 60000);
}

function startGameTimer(){
    
    gameTimer = setInterval(function() {
        secondCounter++;
        console.log(secondCounter);
        timeSeconds.textContent = secondCounter%60;
        timeMinutes.textContent = Math.floor(secondCounter/60);


    }, 1000);

}
