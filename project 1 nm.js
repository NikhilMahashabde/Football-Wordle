
//Dataset container - tba import from excel or JSON real list 
let dataset = [
    {name: "L. Messi", club: "barcelona", league: "Laliga"}, 
    {name: "Christiano Ronaldo", club: "al-hilal", league: "EPL"}
]

// keyboard keyset to display
let displayKeysMap = {
    topRow: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "del"],
    middleRow: ["a", "s", "d", "f", "g", "h", "j", "k", "l", "Enter"],
    bottomRow: ["z", "x", "c", "v", "b", "n", "m"]
}
let keyboardContainerTopRowDiv = document.getElementById("keyboardContainerTopRow");
let keyboardContainerMiddleRowDiv = document.getElementById("keyboardContainerMiddleRow");
let keyboardContainerBottomRowDiv = document.getElementById("keyboardContainerBottomRow");

displayKeyboard(displayKeysMap);

function displayKeyboard(displayKeysMap){
    displayKeysMap.topRow.forEach(element => {
        let key = generateElement("div", keyboardContainerTopRowDiv)
        key.classList.add("keyboardKeys")
        key.textContent = element;
        key.addEventListener("click", event => {keyPress(event)});
        
    });

    displayKeysMap.middleRow.forEach(element => {
        let key = generateElement("div", keyboardContainerMiddleRowDiv)
        key.textContent = element;
        key.classList.add("keyboardKeys")
    });
    displayKeysMap.bottomRow.forEach(element => {
        let key = generateElement("div", keyboardContainerBottomRowDiv)
        key.textContent = element;
        key.classList.add("keyboardKeys")
    });
    

}




// function to generate random name from the list of players. 
// Optional take into account selected league

let flagsLeagueSelected = {
    "La Liga": false, 
    "EPL": true,
}

let currentDifficulty = "easy";
let difficultMap = {
    easy: 10,
    medium: 8,
    hard: 7,
}

// function to filter / create sublist 

function filterDataset(flagsLeagueSelected, dataset) {

    let selectedName = "Messi";

    return selectedName;
}


// select random name from filtered list

let targetName = filterDataset(flagsLeagueSelected, dataset);
let gridLength = targetName.length;


//grid container create
let containerLetterOutput = document.getElementById("containerLetterOutput");    
containerLetterOutput.style.gridTemplateColumns = `repeat(${gridLength}, 100px)`;

//loop over and create N lines 

for (y=0; y<difficultMap[currentDifficulty]; y++){
    for (let x = 0; x<gridLength; x++){
        let newNode = generateElement("div", containerLetterOutput, 'id="sadgasg"', 'class="hi"');
        newNode.classList.add("charInputBox");
        newNode.maxLength = 1;
        newNode.id = `${x}.${y}`;
    }
}
   
    //


//element generate function to avoid repitition
function generateElement(type, parent, ...options){
    
    let newNode = document.createElement(type);
    parent.appendChild(newNode);
    return newNode
}


//-----------------------------------------------
//handle logic for key press event. 

let currentWord = "";
let currentLine = 0;

function keyPress(event){
    keyInput = event.target.textContent;
    
    //while currentline < max line depending on difficulty>

    currentWord = updateWord(currentWord, keyInput) 
    console.log(currentWord, currentWord.length)
    mapCurrentWordToLine(currentWord, currentLine);

      
}

// updatedword
//add logic here for delete and enter
function updateWord(wordToUpdate, keyInput) {
    
    switch (keyInput){
        case ("del"):
            return (wordToUpdate.substring(0,wordToUpdate.length-1));

        break;
        case ("enter"):

        break;
        default:
            if (currentWord.length < targetName.length){
                return (wordToUpdate.concat(keyInput));
            } else {
                return wordToUpdate;
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
//