/////////////////////// GLOBAL BINDINGS ////////////////////////////////////

///// NODE ELEMENTS /////

// elements targets for global use. 
let keyboardContainerTopRowDiv = document.getElementById("keyboardContainerTopRow");
let keyboardContainerMiddleRowDiv = document.getElementById("keyboardContainerMiddleRow");
let keyboardContainerBottomRowDiv = document.getElementById("keyboardContainerBottomRow");
let selectInputDifficulty = document.getElementById("selectDifficulty");
let containerLetterOutput = document.getElementById("containerLetterOutput"); 
let buttonStartGame = document.getElementById("startGame")

///// EVENT LISTNERS
//static event listeners


////// GLOBAL VARIABLES

let currentDifficulty = "";
let targetName = "";
let currentWord = "";
let currentLine = "";
let wordGuessList = []; 

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
    topRow: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "del"],
    middleRow: ["a", "s", "d", "f", "g", "h", "j", "k", "l", "Enter"],
    bottomRow: ["z", "x", "c", "v", "b", "n", "m"]
}

//game difficulty map 
let difficultMap = {
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
        key.classList.add("keyboardKeys");
        key.addEventListener("click", event => {keyPress(event)});
    });
}

// filter dataset to get a random value;
// Optional take into account selected league
function filterDataset(flagLeagueSelected, dataset) {

    let selectedName = "messi".toLowerCase();
    return selectedName;
}


//random data generate value;
//function etc
// function to generate random name from the list of players. 


//generate grid
function generateGrid(){

    let gridLength = targetName.length;
    containerLetterOutput.style.gridTemplateColumns = `repeat(${gridLength}, 50px)`;

    for (y=0; y<difficultMap[currentDifficulty]; y++){
        for (let x = 0; x<gridLength; x++){
            let newNode = generateElement("div", containerLetterOutput, 'id="sadgasg"', 'class="hi"');
            newNode.classList.add("charInputBox");
            newNode.maxLength = 1;
            newNode.id = `${x}.${y}`;
        }
    }
}

//element generate function to avoid repitition
function generateElement(type, parent, ...options){
    
    let newNode = document.createElement(type);
    parent.appendChild(newNode);
    return newNode
}


function handleGuess(){

    wordGuessList.push(currentWord);
    lastGuess = currentWord;
    let lastLine = currentLine;
    currentWord = "";
    currentLine++;
    
    for (guess of wordGuessList){
        console.log(guess, targetName)
         
        for (let x = 0; x < lastGuess.length; x++){
            if (targetName.includes(lastGuess[x])){
                let divGuessIncludes = document.getElementById(`${x}.${lastLine}`);
                divGuessIncludes.classList.add("letterIncludes");
            }

            if (lastGuess[x] == targetName[x]){
                let divGuessIncludes = document.getElementById(`${x}.${lastLine}`);
                divGuessIncludes.classList.add("letterCorrect");
                //highlight the letter on keyboard
                //highlight the cell 
            }

        }

        if (guess == targetName){
            //reset game states
            console.log('you win')
            startGameInit();
        } 
    }
}



//////////////////////////////////// EVENT HANDLERS ///////////////////////////////////////////

//start button feature
function startGameInit(){

    if (flagGameActive == false ){
        flagGameEnded = false;
        flagStartGame = true;
        currentWord  = "";
        currentLine = 0;
        currentDifficulty = selectInputDifficulty.value;
        containerLetterOutput.textContent = "";
        targetName = filterDataset(flagLeagueSelected, dataset);
        generateGrid();
        flagGameActive = true;
        buttonStartGame.textContent = "Stop Game"
        flagStartGame = false;

    } else if (flagGameActive == true){
        flagStartGame = false;
        flagGameActive = false;
        flagGameEnded = true;
        //call function to end game. 
        buttonStartGame.textContent = "Start Game"
    }
   
}

  
//handle logic for key press event. 

function keyPress(event){

    if (flagGameActive){
        keyInput = event.target.textContent;
        currentWord = updateWord(currentWord, keyInput) 
        mapCurrentWordToLine(currentWord, currentLine);

        if (currentWord.length == 5 && keyInput == "Enter"){
            handleGuess()
        }
        if (flagGameEnded){
            
        }

    }

    
      
}


///// updatedword
//add logic here for delete and enter
function updateWord(wordToUpdate, keyInput) {
    console.log(keyInput);
    switch (keyInput){
        case ("del"):
            return (wordToUpdate.substring(0,wordToUpdate.length-1));

        break;
        case ("Enter"):
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
