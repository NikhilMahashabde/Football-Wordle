
//Dataset container - tba import from excel or JSON real list 
let dataset = [
    {name: "L. Messi", club: "barcelona", league: "Laliga"}, 
    {name: "Christiano Ronaldo", club: "al-hilal", league: "EPL"}
]

// keyboard keyset to display
let displayKeysMap = {
    topRow: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "del"],
    middleRow: ["a", "s", "d", "f", "g", "h", "j", "k", "l", "enter"],
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

    let selectedName = "Christiano Ronaldo";

    return selectedName;
}


// select random name from filtered list

let targetName = filterDataset(flagsLeagueSelected, dataset);

let gridLength = targetName.length;



//grid container create
let containerLetterOutput = document.getElementById("containerLetterOutput");    
containerLetterOutput.style.gridTemplateColumns = `repeat(${gridLength}, 100px)`;

//loop over and create N lines 

for (j=0; j<difficultMap[currentDifficulty]; j++){
    for (let i =0; i<gridLength; i++){
        let newNode = generateElement("div", containerLetterOutput, 'id="sadgasg"', 'class="hi"');
        newNode.classList.add("charInputBox");
        newNode.maxLength = 1;
        newNode.id = `0.${i}`;
    }
}
   
    //


//element generate function to avoid repitition
function generateElement(type, parent, ...options){

    console.log(options[0], options[1])
    let newNode = document.createElement(type);
    parent.appendChild(newNode);
    return newNode
}