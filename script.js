const verbs = [

["be","was/were","been"],
["begin","began","begun"],
["break","broke","broken"],
["bring","brought","brought"],
["buy","bought","bought"],
["catch","caught","caught"],
["choose","chose","chosen"],
["come","came","come"],
["do","did","done"],
["drink","drank","drunk"],
["drive","drove","driven"],
["eat","ate","eaten"],
["fall","fell","fallen"],
["feel","felt","felt"],
["find","found","found"],
["fly","flew","flown"],
["forget","forgot","forgotten"],
["get","got","gotten"],
["give","gave","given"],
["go","went","gone"],
["grow","grew","grown"],
["have","had","had"],
["hear","heard","heard"],
["hide","hid","hidden"],
["hold","held","held"],
["keep","kept","kept"],
["know","knew","known"],
["leave","left","left"],
["lose","lost","lost"],
["make","made","made"],
["meet","met","met"],
["put","put","put"],
["read","read","read"],
["ride","rode","ridden"],
["run","ran","run"],
["say","said","said"],
["see","saw","seen"],
["sell","sold","sold"],
["send","sent","sent"],
["sing","sang","sung"],
["sit","sat","sat"],
["sleep","slept","slept"],
["speak","spoke","spoken"],
["spend","spent","spent"],
["stand","stood","stood"],
["steal","stole","stolen"],
["swim","swam","swum"],
["take","took","taken"],
["teach","taught","taught"],
["tell","told","told"],
["think","thought","thought"],
["throw","threw","thrown"],
["understand","understood","understood"],
["wake up","woke","woken"],
["wear","wore","worn"],
["win","won","won"],
["write","wrote","written"]

];

let current = 0;
let xp = Number(localStorage.getItem("xp")) || 0;
let level = Number(localStorage.getItem("level")) || 1;

updateStats();

function showScreen(id){
document.querySelectorAll(".screen")
.forEach(s=>s.classList.remove("active"));

document.getElementById(id)
.classList.add("active");
}

function goHome(){
showScreen("menu");
}

function startLearn(){
showScreen("learn");
loadVerb();
}

function loadVerb(){

document.getElementById("infinitive").textContent =
verbs[current][0].toUpperCase();

document.getElementById("past").textContent =
verbs[current][1].toUpperCase();

document.getElementById("participle").textContent =
verbs[current][2].toUpperCase();

}

function nextVerb(){

current++;

if(current>=verbs.length){
current=0;
}

loadVerb();

}

function prevVerb(){

current--;

if(current<0){
current=verbs.length-1;
}

loadVerb();

}

function speakVerb(){

let speech =
new SpeechSynthesisUtterance(
verbs[current][0]
);

speech.lang = "en-US";

speechSynthesis.speak(speech);

}

function updateStats(){

document.getElementById("xp").textContent = xp;
document.getElementById("level").textContent = level;

}

let examIndex = 0;
let score = 0;
let correctAnswer = "";

function startExam(){

showScreen("exam");

examIndex = 0;
score = 0;

newQuestion();

}

function newQuestion(){

const random =
verbs[Math.floor(Math.random()*verbs.length)];

const type =
Math.floor(Math.random()*6);

switch(type){

case 0:

document.getElementById("question").textContent =
`${random[0]} → Past Tense`;

correctAnswer = random[1];

break;

case 1:

document.getElementById("question").textContent =
`${random[0]} → Past Participle`;

correctAnswer = random[2];

break;

case 2:

document.getElementById("question").textContent =
`${random[1]} → Infinitive`;

correctAnswer = random[0];

break;

case 3:

document.getElementById("question").textContent =
`${random[2]} → Infinitive`;

correctAnswer = random[0];

break;

case 4:

document.getElementById("question").textContent =
`${random[1]} → Past Participle`;

correctAnswer = random[2];

break;

case 5:

document.getElementById("question").textContent =
`${random[2]} → Past Tense`;

correctAnswer = random[1];

break;

}

document.getElementById("answer").value="";
document.getElementById("feedback").textContent="";

document.getElementById("bar").style.width =
(examIndex*10)+"%";

}

function checkAnswer(){

const user =
document.getElementById("answer")
.value
.trim()
.toLowerCase();

const answers =
correctAnswer
.toLowerCase()
.split("/");

if(answers.includes(user)){

score++;

xp += 10;

document.getElementById("feedback").textContent =
"✅ Correct";

document.getElementById("feedback").style.color =
"green";

}else{

document.getElementById("feedback").textContent =
"❌ Correct: " + correctAnswer;

document.getElementById("feedback").style.color =
"red";

}

examIndex++;

if(examIndex>=10){

setTimeout(()=>{

if(xp >= level*100){

level++;

alert(
"🎉 LEVEL UP!\n\nYou reached level " +
level
);

}

localStorage.setItem("xp",xp);
localStorage.setItem("level",level);

updateStats();

alert(
"📋 EXAM FINISHED\n\n" +
"Score: " +
score +
"/10"
);

goHome();

},800);

return;

}

setTimeout(newQuestion,800);

}

let selected = [];
let lock = false;

function startMemory(){

showScreen("memory");

createMemoryBoard();

}

function createMemoryBoard(){

const board =
document.getElementById("memoryBoard");

board.innerHTML = "";

selected = [];

const sample =
verbs
.sort(()=>Math.random()-0.5)
.slice(0,6);

let cards = [];

sample.forEach(v=>{

cards.push({
text:v[0],
pair:v[1]
});

cards.push({
text:v[1],
pair:v[0]
});

});

cards.sort(()=>Math.random()-0.5);

cards.forEach(card=>{

const div =
document.createElement("div");

div.className =
"memoryCard hidden";

div.dataset.text =
card.text;

div.dataset.pair =
card.pair;

div.textContent =
card.text;

div.onclick =
()=>flipCard(div);

board.appendChild(div);

});

}

function flipCard(card){

if(lock) return;

if(card.classList.contains("matched"))
return;

card.classList.remove("hidden");

selected.push(card);

if(selected.length===2){

lock = true;

setTimeout(checkPair,700);

}

}

function checkPair(){

const a = selected[0];
const b = selected[1];

if(
a.dataset.text === b.dataset.pair &&
b.dataset.text === a.dataset.pair
){

a.classList.add("matched");
b.classList.add("matched");

xp += 5;

localStorage.setItem("xp",xp);

updateStats();

}else{

a.classList.add("hidden");
b.classList.add("hidden");

}

selected = [];
lock = false;

}