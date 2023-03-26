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

///// EVENT LISTNERS
//static event listeners


////// GLOBAL VARIABLES

let targetName = "";
let currentWord = "";
let currentLine = "";
let wordGuessList = []; 
let inputGridRows = 8;
let gridLength = 10;
let playerData;

///// FLAGS /////

let flagStartGame = false;
let flagGameActive = false;
let flagGameEnded = false; 

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

//Dataset containers and - tba import from excel or JSON real list 



// keyboard keyset to display
let displayKeysMap = {
    topRow: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P" ],
    middleRow: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "\u2612"],
    bottomRow: ["Z", "X", "C", "V", "B", "N", "M", "ENTER"]
}

//game difficulty map 
let mapDifficulty = {
    easy: 8,
    medium: 7,
    hard: 6,
}

///////////////////////////////// PAGE INITIALISATION /////////////////////////////
//generate the keyboard appearance and layout. 

// keyboard
displayKeyboard(displayKeysMap);
generateGrid();

////////////////////////////////// FUNCTIONS ///////////////////////////

function displayKeyboard(displayKeysMap){
    keyboardContainerTopRowDiv.textContent = "";
    keyboardContainerMiddleRowDiv.textContent = '';
    keyboardContainerBottomRowDiv.textContent - '';

    displayKeysMap.topRow.forEach(element => {
        let key = generateElement("div", keyboardContainerTopRowDiv)
        key.classList.add("keyboardKeys");
        key.textContent = element;
        key.addEventListener("click", event => {keyPress(event)});
    });

    displayKeysMap.middleRow.forEach(element => {
        let key = generateElement("div", keyboardContainerMiddleRowDiv)
        key.textContent = element;
        if(key.textContent == "\u2612"){
            key.classList.add("deleteKey");
        }
        key.classList.add("keyboardKeys")
        key.addEventListener("click", event => {keyPress(event)});
    });
    displayKeysMap.bottomRow.forEach(element => {
        let key = generateElement("div", keyboardContainerBottomRowDiv)
        key.textContent = element;
        if (key.textContent == "ENTER"){
            key.classList.add("enterKey");
        }
        key.classList.add("keyboardKeys");
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
    while (nameFilter.length > 10){
        nameFilter = playerData[randomPlayerNumber]["Name"].toUpperCase();
    }
    return nameFilter;
}


//generate grid
function generateGrid(){

    containerLetterOutput.style.gridTemplateColumns = `repeat(${gridLength}, clamp(32px, 7vw, 60px)`;
  
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

                let divKeyInput = keyboardContainer.querySelectorAll("div > div > div");
                divKeyInput.forEach(element => {
                    if (element.textContent == lastGuess[x]){
                        element.classList.add("letterIncludes");
                    }
                });

            } else {
                let divKeyInput = keyboardContainer.querySelectorAll("div > div > div");
                divKeyInput.forEach(element => {
                    if (element.textContent == lastGuess[x]){
                        element.classList.add("notInWord");
                    }
                });

            }

            if (lastGuess[x] == targetName[x]){
                let divGuessIncludes = document.getElementById(`${x}.${lastLine}`);
                divGuessIncludes.classList.add("letterCorrect");
               
                let divKeyInput = keyboardContainer.querySelectorAll("div > div > div");
                divKeyInput.forEach(element => {
                    if (element.textContent == lastGuess[x]){
                        element.classList.add("letterCorrect");
                        
                    }
                });
            }
        }
    }
    if (guess == targetName){
        //reset game states
        console.log('you win', targetName)
        endGame();
       
    } else if (inputGridRows == (currentLine+1)){
        console.log('you lose', targetName)
        endGame();
    }
    currentLine++;
    currentWord = "";
}

function endGame(){
    flagGameEnded = true;
    flagGameActive = false;
    buttonStartGame.textContent = "Play Again"
}

//////////////////////////////////// EVENT HANDLERS ///////////////////////////////////////////

//start button feature
function startGameInit(){

    if (flagGameActive == false ){
        flagStartGame = true;
        flagGameEnded = false;
        currentWord  = "";
        currentLine = 0;
        inputGridRows = mapDifficulty[selectInputDifficulty.value];
        targetName = filterDataset(flagLeagueSelected, playerData);
        gridLength = targetName.length;
        containerLetterOutput.textContent = "";
        generateGrid();
        flagGameActive = true;
        buttonStartGame.textContent = "Stop Game"
        flagStartGame = false;

        divKeyInput = keyboardContainer.querySelectorAll("div > div > div")
        divKeyInput.forEach(divElement => {
            divElement.classList.remove("letterCorrect", "notInWord", "letterIncludes")
        })

    } else if (flagGameActive == true){
        flagStartGame = false;
        endGame()
        buttonStartGame.textContent = "Start Game"
    }
   
}
  
function keyPress(event){

    if (flagGameActive){
        keyInput = event.target.textContent;
        currentWord = updateWord(currentWord, keyInput) 
        mapCurrentWordToLine(currentWord, currentLine);

        if (currentWord.length == targetName.length && keyInput == "ENTER"){
            handleGuess()
        } 
    }
}

///// updatedword
function updateWord(wordToUpdate, keyInput) {
    
    switch (keyInput){
        case ("\u2612"):
            return (wordToUpdate.substring(0,wordToUpdate.length-1));

        break;
        case ("ENTER"):
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
