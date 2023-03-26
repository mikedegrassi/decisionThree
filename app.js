import {DecisionTree} from "./libraries/decisiontree.js"
import {VegaTree} from "./libraries/vegatree.js"

//Headers
//"PassengerId","Survived","Pclass","Name","Sex","Age","SibSp","Parch","Ticket","Fare","Cabin","Embarked"

//
// DATA
//
const csvFile = "data/tested.csv"
const trainingLabel = "Survived"
const ignored = ["PassengerId", "Survived", "Name", "Parch", "Fare", "Embarked", "Ticket"];

let labelOne
let labelTwo
let labelThree
let labelFour

let amountCorrect = 0;
let wrongPredicted = 0;

let deadIsDead = 0;
let survivedIsDead = 0;
let deadNotdead = 0;
let survivedHasSurvived = 0;
let accuracyLabel;




let decisionTree;

//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })

    labelOne = document.getElementById('one')
    labelTwo = document.getElementById('two')
    labelThree = document.getElementById('three')
    labelFour = document.getElementById('four')
    accuracyLabel = document.getElementById('label')
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    data.sort(() => (Math.random() - 0.5));

    console.log(data)

    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)

    // maak het algoritme aan
    decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel,
        maxTreeDepth: 4
    })

    // Save JSON
    let json = decisionTree.toJSON()

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())

    let survived = 0;

    // todo : maak een prediction met een sample uit de testdata
    for (let i = 0; i < 83; i++) {
        let passenger = trainData[i]
        let passengerPrediction = decisionTree.predict(passenger)
        console.log(`Survived : ${passengerPrediction}`)
        testPassenger(testData[i]);
        (passenger.Survived == 1) ? survived++ : "-";
    }

    let accuracy = Math.round(amountCorrect / 83 * 100);
   accuracyLabel.innerHTML = `${accuracy}%`

    labelOne.innerHTML = deadIsDead
    labelTwo.innerHTML = survivedIsDead
    labelThree.innerHTML = deadNotdead
    labelFour.innerHTML = survivedHasSurvived

    // todo : bereken de accuracy met behulp van alle test data

}

function testPassenger(passenger) {
    // kopie van passenger maken, zonder het "survived" label
    const passengerWithoutLabel = {...passenger}
    delete passengerWithoutLabel.Survived


    // prediction
    let prediction = decisionTree.predict(passengerWithoutLabel)
    console.log(passenger.Survived)
    console.log(amountCorrect)

    // vergelijk de prediction met het echte label
    let message = (prediction == passenger.Survived) ? amountCorrect++ : wrongPredicted++;

    if (prediction == 0 && passenger.Survived == 0) {
        deadIsDead++
    } else if (prediction == 0 && passenger.Survived == 1) {
        deadNotdead++
    } else if (prediction == 1 && passenger.Survived == 0) {
        survivedIsDead++
    } else if (prediction == 1 && passenger.Survived == 1) {
        survivedHasSurvived++
    }
}


loadData()