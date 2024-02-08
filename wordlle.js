const letters=document.querySelectorAll(".scoreboard-letter");
const loadingDiv=document.querySelector(".info-bar");
const ANSWER_LENGHT=5;
const ROUNDS= 6

async function init() {
let currentGuess=""; //this is a buffer.
let currentRow=0;
let isloading; true;

const res = await fetch("https://words.dev-apis.com/word-of-the-day");
// res is a shorthand for response,  /word-of-the-day?random=1  adding that gives a new word every single time
const resObj = await res.json();
const word = resObj.word.toUpperCase();
const wordParts = word.split("");
const map = makeMap(wordParts);
let done = false;
setloading(false);
isloading; false




function addletter(letter){
    if (currentGuess.length<ANSWER_LENGHT){
        //add letter to the end
        currentGuess += letter;
    } else{
        //replace the last letter
        currentGuess = currentGuess.substring(0, currentGuess.length - 1 )+letter
    };

     letters[ANSWER_LENGHT* currentRow + currentGuess.length - 1].innerText=letter;
}

async function commit() {
    if (currentGuess.length !== ANSWER_LENGHT) {
        // If the current guess length is not equal to the answer length, do nothing
        return;
    }
    
    isloading = true;
    setloading(true);
    const res = await fetch ("https://words.dev-apis.com/validate-word", {
        method:"POST",
        body: JSON.stringify({word:currentGuess})
        //this will post stringfy the word to api to validate five letter word.
    });
    const resObj = await res.json();
    const validWord = resObj.validWord;

    isloading = false;
    setloading(false);

    if (!validWord) {
        markInvalidWord();
        return;
    }
    


    const guessParts = currentGuess.split("");

    for (let i = 0; i < ANSWER_LENGHT; i++) {
        if (guessParts[i] === wordParts[i]) {
            // If the guessed letter is at the correct position, mark it as "correct"
            letters[currentRow * ANSWER_LENGHT + i].classList.add("correct");
            map[guessParts[i]]--;
        } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
            // If the guessed letter is part of the word but not at the correct position, mark it as "close"
            letters[currentRow * ANSWER_LENGHT + i].classList.add("close");
            map[guessParts[i]]--;
        }
    }
    
    currentRow++;
    
    if (currentGuess===word){
        //win
    alert("you win!");
    document.querySelector(".brand").classList.add("winner");   
    done = true;
    return;
    }else if (currentRow === ROUNDS) {
        alert(`you lose, the word was ${word}`);
        done = true;
    }
    currentGuess = "";
}


function backspace(){
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[ANSWER_LENGHT * currentRow + currentGuess.length].innerText="";
    //When the backspace key is pressed, delete the last letter.
}

function markInvalidWord(){
//    alert("not a valid word");
 for (let i=0; i < ANSWER_LENGHT; i++) {
    letters [currentRow * ANSWER_LENGHT + i].classList.remove("invalid");


    setTimeout(function ()  {
        letters [currentRow * ANSWER_LENGHT + i].classList.add("invalid");
    }, 10 );
 }
}



document.addEventListener('keydown', function handleKeyPress(event){
    if(done || isloading ){
        // if it's done OR loading do nothing. you can not press keys when it's loading or game is over.
        return;
    }



    const action=event.key;
    if (action==="Enter"){
        commit();
    } else if (action==="Backspace"){
        backspace();
    } else if(isLetter(action)){
        addletter(action.toLocaleUpperCase())
    } else{
        //do nothing
    }
    function isLetter(letter) {
        return /^[a-zA-Z]$/.test(letter);
      }
    });}

function setloading(isloading){
    loadingDiv.classList.toggle("show", isloading);

}
function makeMap(array){
    const obj={};
    for (let i = 0; i < array.length; i++){
        const letter = array[i]
        if (obj[letter] ){
            obj[letter]++;
        } else{
            obj[letter] = 1;
        }
        
    }return obj;
}   


init();
