
//Dataset container - tba import from excel or JSON real list 
let dataset = [
    {name: "L. Messi", club: "barcelona", league: "Laliga"}, 
    {name: "Christiano Ronaldo", club: "al-hilal", league: "EPL"}
]


// function to generate random name from the list of players. 
// Optional take into account selected league

let flagsLeagueSelected = {
    "La Liga": false, 
    "EPL": true,
}


// function to filter / create sublist 

function filterDataset(flagsLeagueSelected, dataset) {

    let selectedName = "messi";

    return selectedName;
}


// select random name from filtered list

let targetName = filterDataset(flagsLeagueSelected, dataset)

let gridLength = targetName.length;



//grid container create
let guessContainer = document.getElementById("GuessContainer");    

//loop over and create N lines 

    for (let i =0; i<gridLength; i++){
        let newNode = generateElement("input",guessContainer );
        console.log(newNode);
        
    }

    //


//element generate function to avoid repitition
function generateElement(type, parent){
    let newNode = document.createElement(`"${type}"`);
    parent.appendChild(newNode);
    return newNode
}