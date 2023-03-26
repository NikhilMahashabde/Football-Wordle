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
let inputGridRows = "";
let gridLength = "";

///// FLAGS /////

let flagStartGame = false;
let flagGameActive = false;
let flagGameEnded = false; 

let flagLeagueSelected = {
    "La Liga": false, 
    "EPL": true,
}

///// DATASETS AND MAPS /////

//Dataset containers and - tba import from excel or JSON real list 
let dataset = [
    {name: "L. Messi", club: "barcelona", league: "Laliga"}, 
    {name: "Christiano Ronaldo", club: "al-hilal", league: "EPL"}
];

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
        key.classList.add("keyboardKeys")
        key.addEventListener("click", event => {keyPress(event)});
    });
    displayKeysMap.bottomRow.forEach(element => {
        let key = generateElement("div", keyboardContainerBottomRowDiv)
        key.textContent = element;
        if (key.textContent == "ENTER"){
            key.style.width = "82px";
        }
        key.classList.add("keyboardKeys");
        key.addEventListener("click", event => {keyPress(event)});
    });
}

// filter dataset to get a random value;
// Optional take into account selected league
function filterDataset(flagLeagueSelected, dataset) {
    //random data generate value;
    //function etc
    // function to generate random name from the list of players. 
    let selectedName = "MESSI".toUpperCase();
    return selectedName;
}


//generate grid
function generateGrid(){

    containerLetterOutput.style.gridTemplateColumns = `repeat(${gridLength}, 50px)`;
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
        console.log('you win')
        endGame();
       
    } else if (inputGridRows == (currentLine+1)){
        console.log('you lose')
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
        targetName = filterDataset(flagLeagueSelected, dataset);
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
