
//////////////////////////////////////////////  GLOBAL BINDINGS  ////////////////////////////////////////////
// Note to reader - I am aware of the number of global variables and event listeners in use. This is generally
// terrible practise but I have run out of time to refactor and organise code into functions which pass around data
// When the project was first startedI was also unsure how to "globalise" html elements when created inside a function . 

///// NODE ELEMENTS /////
// elements targets for global use. 
let keyboardContainer = document.querySelector("#containerKeyboardInput");
let keyboardContainerTopRowDiv = document.getElementById("keyboardContainerTopRow");
let keyboardContainerMiddleRowDiv = document.getElementById("keyboardContainerMiddleRow");
let keyboardContainerBottomRowDiv = document.getElementById("keyboardContainerBottomRow");
let selectInputDifficulty = document.getElementById("selectDifficulty");
let containerLetterOutput = document.getElementById("containerLetterOutput"); 
let buttonStartGame = document.getElementById("startGame");
let settingsButton = document.querySelector("#buttonSettingsModal");
let buttonModalInstructionsTrigger = document.getElementById("instructionsModalTrigger");
let svgSettingsIcon = document.getElementById("svgSettingsIcon");
let svgInstructionsIcon = document.getElementById("svgInstructionsIcon");
let svgPlayIcon = document.getElementById("svgPlayIcon");
let svgStopIcon = document.getElementById("svgStopIcon");
let playerScore = document.getElementById("scoreText");
let hintsButton = document.querySelector("#hintsButton");
let clueContainer = document.getElementById("clueContainer");
let buttonWL = document.getElementById("btnModalWL");
let headingWLModal = document.getElementById("headingWL");
let tdName = document.getElementById("tdName");
let tdKitNumber = document.getElementById("tdKitNumber");
let tdClub = document.getElementById("tdClub");
let tdNationality = document.getElementById("tdNationality");
let tdAge = document.getElementById("tdAge");
let tdPosition = document.getElementById("tdPosition");
let divPlayerPhoto = document.getElementById("divPlayerPhoto");
let imgPlayerPhoto = generateElement("img", divPlayerPhoto);
let buttonGameStateDisplay = document.getElementById("buttonGameStateDisplay");
let buttonHints = document.getElementById("hintsButton");
let tdClueName = document.getElementById("tdClueName");
let tdClueKitNumber = document.getElementById("tdClueKitNumber");
let tdClueClub = document.getElementById("tdClueClub");
let tdClueNationality = document.getElementById("tdClueNationality");
let tdClueAge = document.getElementById("tdClueAge");
let tdCluePosition = document.getElementById("tdCluePosition");
let divCluePlayerPhoto = document.getElementById("divCluePlayerPhoto");
let timeSeconds = document.getElementById("timeSeconds");
let timeMinutes = document.getElementById("timeMinutes");

///// EVENT LISTENERS /////
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
    handleKeyInput(keyInput);

});

///// GLOBAL VARIABLES /////
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

///// FLAGS  /////

let flagStartGame = false;
let flagGameActive = false;
let flagGameEnded = false; 
let flagCluesActive = true;

let flagLeagueSelected = { //TBA feature not yet implemented. 
    "La Liga": false, 
    "EPL": true,
};

///// DATASETS, MAPS, DATA OBJECTS /////

// JSON data file format imported from github. In future, this data should be imported and stored into local object, and only reloaded when there is a version mismatch.
//currently pulling 2mb of data every refresh. 

//check local object for data - if return null/undef, then load fetch, else check version number against JS version, if not same, load data from fetch and store into local object. 
fetch('https://nikhilmahashabde.github.io/Football-Wordle/playerData.json')
    .then((response) => response.json())
    .then((data) => {
        playerData = data;
    });

// User profile generator function TBA
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
  };

const profileDefault = createPlayer("default");

// keyboard keyset to display
let displayKeysMap = {
    topRow: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P" ],
    middleRow: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "-"],
    bottomRow: ["\u23CE", "Z", "X", "C", "V", "B", "N", "M", "\u2612"]
};

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
    

};

//game difficulty map 
let mapDifficulty = {
    easy: 8,
    medium: 7,
    hard: 6,
};

//clue to Key Map lets the random number generator access a random string from this map which is then used to access a key in the playerCard object.
let clueToKeyMap = {
    0: "Age",
    1: "Photo",
    2: "Nationality",
    3: "Club",
    4: "Position",
    5: "Kit Number",
};

////////////////////////////////////////////// PAGE INITIALISATION ////////////////////////////////////////////

//generate the keyboard appearance and layout.

displayKeyboard(displayKeysMap);

//generate grid function as this is dynamic size (defaults value above on first load)
generateGrid();

// variables to be initialised dynamically after page 'load'
svgStopIcon.style.display = "none";
let imgCluePlayerPhoto = generateElement("img", divCluePlayerPhoto);
playerScore.textContent = profileDefault.getScore();
svgStopIcon.style.display = "none";
//[not implemented] check player against default name, switch playerID code and initiase currentscore/gems to current player profile
let currentScore = profileDefault.getScore();
let currentGems = ""; // initialise player's gem counts similair to above. [tba]
let validKeys = Object.values(displayKeysMap).flat();

////////////////////////////////// FUNCTIONS ///////////////////////////
// KEY BOARD DISPLAY FUNCTION
// Removes existing elements, and generates a new keyboard in accordance to the keyboard Map object. This function was made as the keyboard
// layout has been changed on a dozen occasions due to screen limitations and other "inputs" required compared to standard worlde. 
// three repetitive lines (which need to be refactored ASAP) map out each 'row', create a button element, paste the value, and add an event listener. 
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
};

// FILTER DATASET FUNCTION
// A copy of the dataset is passed to this function, to filter a name such that it is within a certain size (due to screen limitations)
// current this size is set to 12. 
// Generates a random number, check the size, regenerates if too long. 
// Once sucessfull, the playerCard object is now updaded with the new reference. 
// filter dataset to get a random value;
// Optional take into account selected league
function filterDataset(flagLeagueSelected, playerData) {

    randomPlayerNumber = Math.floor(Math.random() * playerData.length)

    let nameFilter = playerData[randomPlayerNumber]["Name"].toUpperCase();
    
    while (nameFilter.length > 12){
        randomPlayerNumber = Math.floor(Math.random() * playerData.length);
        nameFilter = playerData[randomPlayerNumber]["Name"].toUpperCase();
    }
    playerCard = playerData[randomPlayerNumber];
    return nameFilter;
};

//Generate Grid Function
// creates a grid size, based on the playerCard's player name, then generates X / Y length grid as per difficulty and player length,
// the elements are then added to a "grid" on the html, with a max length and ID that can be target later in the code 
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
};

// GENERATE ELEMENT FUNCTION
// simple function to create an element - take a node type, and a parent node, and add them to a page, then return this newly created node. 
function generateElement(type, parent, ...options){
    let newNode = document.createElement(type);
    parent.appendChild(newNode);
    return newNode;
};

// HANDLE GUESS FUNCTION
// started when a guess is sucessfull - the data is pushed into a guess list, and then each character is filtered as a correct, partial, or incorrect.
// Score is computed and added to the profile. Div colors are changed using add/remove classes
// If the last word is correct, or lines are exceeded, game moves onto endGame function/state. 
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

            };

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
            };
        };
    };
    if (guess == targetName){
        endGame(win);
       
    } else if (inputGridRows == (currentLine+1)){
        endGame(lose);
    }
    currentLine++;
    currentWord = "";
};

// This function is called when the game ends via win , loss, or manual cancel of the game
// DIsplay a player card to show the target player, compute points, update profile, and then
// reset all the game status in order to restart the game. 
function endGame(condition){

    headingWLModal.textContent = `You ${condition} in ${timeMinutes.textContent} minutes and ${timeSeconds.textContent} seconds!`;
   
    fillPlayerCard();
    buttonWL.click();

    // score updating - 
    if (condition == win){
        currentScore += 25;
        profileDefault.setScore(currentScore);
        localStorage.setItem("currentScore", `${currentScore}`);
        playerScore.textContent = profileDefault.getScore();
        if (secondCounter < 60){

        }
    };

    //reset game states
    svgStopIcon.style.display = "none";
    svgPlayIcon.style.display = "";
    flagGameEnded = true;
    flagGameActive = false;
    buttonGameStateDisplay.textContent = "Play";
    clearTimeout(inactiveTimer);
    clearInterval(gameTimer);

};

// Player card pop up is filled with data only when the game ends. Accesses the player object and takes data across to the display fields in the modal. 
function fillPlayerCard(){
    
    tdName.textContent = targetName;
    tdKitNumber.textContent = playerData[randomPlayerNumber]["Kit Number"];
    tdClub.textContent  = playerData[randomPlayerNumber]["Club"];
    tdNationality.textContent  = playerData[randomPlayerNumber]["Nationality"];
    tdAge.textContent  = playerData[randomPlayerNumber]["Age"];
    tdPosition.textContent  = playerData[randomPlayerNumber]["Position"];
    imgPlayerPhoto.setAttribute("src", `${ playerData[randomPlayerNumber]["Photo"]}`);
    imgPlayerPhoto.style.width = "300px";

};

//////////////////////////////////// EVENT HANDLERS ///////////////////////////////////////////

//// Start game Button / Initialisation 
// This function is called when the game starts, it handles the initalisation of the game, variables, 
// new player generations, starts the game timer, generates a new grid, resets all the existing buttons. 
// Multiple other functions are called from this to each do thier respective processes.
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

// states for the game when started. 
function setGameStartStates(){
    flagStartGame = true;
    flagGameEnded = false;
    flagGameActive = true;
};

// Reset active variables when the game is started. Generate a new set of data/variables if required. 
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
    
    //remove all player info from previous game. 
    tdName.textContent = "";
    tdKitNumber.textContent = "";
    tdClub.textContent  = "";
    tdNationality.textContent  = "";
    tdAge.textContent  = "";
    tdPosition.textContent  = "";
    imgPlayerPhoto.setAttribute("src", "");

    //clue box reset all variables.
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
            }, []); // Function to find unique leters inside the target word. Take the target name, split into array, reduce it down by returning an accumualtor
            // that is pushing unique elements only into the new Array. 
        
    

};

// stop watch reset function - cancels the stop watch when called. Resets the text content of the values. 
function resetStopwatch(){
    secondCounter = 0;
    timeSeconds.textContent = 0;
    timeMinutes.textContent = 0;


};
  
// Generic key press listener - this is a function that checks of the game has started, then resets an inactive timer (used for popup hints),
// and passes the input to the keyinput handler (This function is shared for both the div key inputs, as well as keyboard key input)
function keyPress(event){
    if (!flagGameActive) return;
    resetInactiveTimer();
    keyInput = event.target.textContent;
    handleKeyInput(keyInput);
};

// Once the key input is accepted, this function handles the input by adding them to a current word and then maps the word to the grid. 
// Only valid keys are accepted, and only enter at end of lines, will trigger the next state of handling guesses. 
function handleKeyInput(keyInput){
   
    currentWord = updateWord(currentWord, keyInput);
    mapCurrentWordToLine(currentWord, currentLine);
           
    if (currentWord.length == targetName.length && keyInput == "\u23CE"){
        handleGuess()
    }
};


// UPDATE WORD FUNCTION
// appends the current word/line with a new text subject to certain conditions such as ignore enter/del keys.
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

// maps the current word onto the line by grabbing the element at a grid location, and then changing the text content. 
function mapCurrentWordToLine(currentWord, currentLine){
    let y = currentLine;

    for (let x = 0; x < targetName.length ; x++){
        let divAtIndex = document.getElementById(`${x}.${y}`);
        divAtIndex.textContent = currentWord[x];
    }

};

// TRIGGER SETTINGS BUTTON EVENT LISTENER
// upon click of the settings button, the 'hidden' html button open the settings modal. 
function triggerSettings(){
    settingsButton.click();
};

// HELP BUTTON EVENT LISTENER
// upon click of the HELP button, the 'hidden' html button open the HELP modal. 
function triggerHelp(){
    buttonModalInstructionsTrigger.click();
}

// function to reset/remove focus on buttons as this was preventing keyinput. 
function resetFocus(){
    hintsButton.blur();
    settingsButton.blur();
    buttonStartGame.blur();
    document.body.focus();
};

//// REVEAL HINTS EVENT 
// Upon click of the reveal hint button from the modal hints, this function will handle the input of using gems/normal
// clues. First checks the lines left, and if available, then checks how many clues left, if all of them are used, it 
// will not reveal the name. If all valid, then generates and reveals a random clue from the cluemap object. 
// then displays one of the 6 clues, for the photo e.g. the original blurry photo, is replaced by a less blurry photo. 
function revealHint() {
    
    if (!flagCluesActive) return;
    if (flagGameActive){

        if (currentLine+1 == inputGridRows){
            let newText = generateElement("p", clueContainer);
            clueContainer.textContent = "Last line left - no more clues"
            flagCluesActive = false;
            return;
        }
        
        if (cluesUsed.length == 6){
            
            let newText = generateElement("p", clueContainer);
            clueContainer.textContent = "HA nice try, the name wont be revealed. No more clues!"
            flagCluesActive = false;
            return;
        }
         //generate random number for the 6 different clues

        randomClueNumber = Math.floor(Math.random()*6);
        while (cluesUsed.includes(randomClueNumber)){
            randomClueNumber = Math.floor(Math.random()*6);
        };
             
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
    };
};

////////// TIMER FUNCTIONS
//on load , start timer for 3 seconds, and then pop up the instructions modal. 

window.onload = function(){
    setTimeout(function() {
        
        buttonModalInstructionsTrigger.click();
    }, 3000);
};

//////// INACTIVE TIMER
// if the user does not enter any letters (thus not resetting the timer), the hints box will pop up.
// this is to incentive users to use hints and be forced to make a tradeoff of lines. Alternatively,
// Gems will be available to use for a free clue, gems are the backbone for monetisation, and allowing
// players to purchase them for real money
function resetInactiveTimer(){
    clearTimeout(inactiveTimer);
    inactiveTimer = setTimeout(function() {
        buttonHints.click();
    }, 60000);
};

// game timer starts at the start of a game - a generic variable is incremented by 1, and seconds/minutes 
// are derived from the mod and division of this number. 
function startGameTimer(){
    
    gameTimer = setInterval(function() {
        secondCounter++;
        timeSeconds.textContent = secondCounter%60;
        timeMinutes.textContent = Math.floor(secondCounter/60);

    }, 1000);

};
