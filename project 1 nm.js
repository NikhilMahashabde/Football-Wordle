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
let settingsButton = document.querySelector("#settingsButton");
let hintsButton = document.querySelector("#hintsButton");
let clueContainer = document.getElementById("clueContainer");


///// EVENT LISTNERS
//static event listeners
buttonStartGame.addEventListener('click', resetFocus);
hintsButton.addEventListener('click', resetFocus);
settingsButton.addEventListener('click', resetFocus);


////// GLOBAL VARIABLES
let test = 1;
let targetName = "";
let currentWord = "";
let currentLine = "";
let wordGuessList = []; 
let inputGridRows = 8;
let gridLength = 10;
let playerData;
let cluesUsed = [];

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

//Dataset containers and - tba import from excel or JSON real list 



// keyboard keyset to display
let displayKeysMap = {
    topRow: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P" ],
    middleRow: ["A", "S", "D", "F", "G", "H", "J", "K", "L", "\u2612"],
    bottomRow: ["Z", "X", "C", "V", "B", "N", "M", "ENTER"]
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
    
    while (nameFilter.length > 15){
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

    if (!flagGameActive){
        flagStartGame = true;
        flagGameEnded = false;
        cluesUsed.length = 0;
        flagCluesActive = true;
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
        clueContainer.textContent = "";

    } else if (flagGameActive == true){
        flagStartGame = false;
        endGame()
        
        buttonStartGame.textContent = "Start Game"
    };
   
};
  
function keyPress(event){
    if (!flagGameActive) return;
    keyInput = event.target.textContent;
    console.log(keyInput)
    handleKeyInput(keyInput);
}

function handleKeyInput(keyInput){

    currentWord = updateWord(currentWord, keyInput) 
    mapCurrentWordToLine(currentWord, currentLine);
    console.log(currentWord);
        
    if (currentWord.length == targetName.length && keyInput == "ENTER"){
        handleGuess()
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


document.addEventListener('keydown', (event) => {
    document.body.focus();
    document.activeElement.blur();
    if (!flagGameActive) return;
    keyInput = event.key.toUpperCase();
    keyInput == "BACKSPACE" ? keyInput = "\u2612" : keyInput;
    
    if (!validKeys.includes(keyInput)) return;
    console.log(document.activeElement)
    handleKeyInput(keyInput);

    // Alert the key name and key code on keydown
});

function resetFocus(){
    hintsButton.blur();
    settingsButton.blur();
    buttonStartGame.blur();
    document.body.focus();
};



function revealHint(){
    
    if (!flagCluesActive) return;
    if (flagGameActive){
        //generate random number for the 6 different clues
        
        if (cluesUsed.length == 6){
            console.log(clueContainer.textContent);
            let newText = generateElement("p", clueContainer);
            newText.textContent = "No clues left!"
            flagCluesActive = false;
            return;
        }

        randomClueNumber = Math.floor(Math.random()*6);
        while (cluesUsed.includes(randomClueNumber)){
            randomClueNumber = Math.floor(Math.random()*6);
        }
             
        //map the clues to each object's props
        // depending on which one, do/display something
        let cluetype = clueToKeyMap[randomClueNumber];
        console.log(cluetype)
        switch (cluetype){

            case "Photo": 
            let clueImage = generateElement("img", clueContainer)
            clueImage.setAttribute("src", playerData[randomPlayerNumber][clueToKeyMap[randomClueNumber]])
            clueImage.classList.add("playerImage")

            break;
            default:
                let newText = generateElement("p", clueContainer);
                newText.textContent = playerData[randomPlayerNumber][clueToKeyMap[randomClueNumber]];
                
            break;
        }
        cluesUsed.push(randomClueNumber);
                
    //increse line counter and fill the line with -----

    } else {
        clueContainer.textContent = "Game not started. Start game first!"
    }

   
}