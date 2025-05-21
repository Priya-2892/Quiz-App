// window.onbeforeunload = function() {
//   return "Data will be refreshed if you reload the page, are you sure?";
// };

let amount_value = sessionStorage.getItem("amount");
let cat_value = sessionStorage.getItem("category");
let diff_value = sessionStorage.getItem("difficulty");
let type_value = sessionStorage.getItem("type");



let section = document.querySelector("section");
let container = document.createElement("div");
container.className = "container";
let heading = document.createElement("h1");
heading.innerText = "Let's Start Quiz";
section.appendChild(container).appendChild(heading);

let apiData;
let correctAnswer = [];
let userAnswer = [];
let res = "";
let quizIndex = 0;
let userTime = -1;

window.addEventListener("load", function () {
  fetch(`https://opentdb.com/api.php?amount=${amount_value}&category=${cat_value}&difficulty=${diff_value}&type=${type_value}`)
    .then((response) => response.json())
    .then((data) => {
      for (var i = 0; i < data.results.length; i++) {
        correctAnswer.push(decodeURIComponent(data.results[i].correct_answer));
      }
      displayData(data.results, correctAnswer, userAnswer);
      apiData = data.results.length;
      console.log(apiData);
    })
    .catch((err) => alert("Something went wrong:-", err));
});

// function to shuffle the array
function shuffleAllOptions(allOptions) {
  let currentIndex = allOptions.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [allOptions[currentIndex], allOptions[randomIndex]] = [
      allOptions[randomIndex],allOptions[currentIndex]];
  }
}

// function to store user response in the array
function storeResponse(quizBox) {
  if(quizBox[quizIndex]){
    let arrR = quizBox[quizIndex].querySelector('input[type="radio"]:checked');
    console.log(arrR);
    userAnswer[quizIndex] = arrR ? decodeURIComponent(arrR.value) : "";
    console.log(userAnswer);
    quizIndex++;
  } 
}

// handle next or back button
function buttonHandler(correctAnswer, userAnswer) {
  let nextBtnAll = document.querySelectorAll(".next-btn");
  let backBtnAll = document.querySelectorAll(".back-btn");

  let quizBox = document.querySelectorAll(".quiz-item-wraper");

  nextBtnAll.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      
      // here we selecet checked options
      storeResponse(quizBox);

      quizBox[idx].style.display = "none";
      if (idx < nextBtnAll.length - 1) {
        quizBox[idx + 1].style.display = "block";
      } else {
        showResult(correctAnswer, userAnswer);
      }
    });
  });

  backBtnAll.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      quizBox[idx].style.display = "block";
      if (idx < backBtnAll.length - 1) {
        quizBox[idx + 1].style.display = "none";
      }
      quizIndex--;
    });
  });
}
// function to set timer
function timer(correctAnswer, userAnswer){
  let sec = 30;
  var timer = setInterval(function(){
      document.getElementById('timer').innerHTML= '00:'+sec;
      sec--;
      userTime++;
      if (sec < 0) {
          clearInterval(timer);
            submitQuiz(correctAnswer, userAnswer);
      }
      if(userAnswer.length == apiData){
        clearInterval(timer);
        submitQuiz(correctAnswer, userAnswer);
      }
  }, 1000);
}

function submitQuiz(correctAnswer, userAnswer){
  let quizBox = document.querySelectorAll(".quiz-item-wraper");
            if(quizBox.length > 0){
              for(let i=0; i<apiData; i++){
                storeResponse(quizBox);
              }
            }

          showResult(correctAnswer, userAnswer);
}

//function to show the result
function showResult(correctAnswer, userAnswer) {
  let outputBox = document.createElement("div");
  outputBox.className = "output-box";
  container.innerHTML = `<h1>Result:- </h1> <p style="font-weight: 600; font-size: 18px;"> Time taken by user:- ${userTime} seconds </p>`;
  let score = 0;
  for (let i = 0; i < apiData; i++) {
    let resultItem = document.createElement("div");
    resultItem.className = "result-item";
    if (userAnswer[i] == correctAnswer[i]) {
      score++;
      resultItem.innerHTML = `
              <h3>Question ${i + 1}: Correct  </h3>
              <p><b>Your Answer:- </b>${userAnswer[i]}</p>
              <p><b>Correct Answer:-</b> ${correctAnswer[i]}</p> <hr>
          `;
    } else {
      resultItem.innerHTML = `
              <h3>Question ${i + 1}: Wrong </h3>
              <p><b>Your Answer:-</b> ${userAnswer[i]}</p>
              <p><b>Correct Answer:-</b> ${correctAnswer[i]}</p> <hr>
          `;
    }
    outputBox.appendChild(resultItem)
    container.appendChild(outputBox);
  }
  let scoreDisplay = document.createElement("h2");
  scoreDisplay.innerText = `Your Score: ${score} / ${correctAnswer.length}`;
  let hint = document.createElement("h3");
  hint.innerText = `To start the game again please reload the page...`;
  outputBox.appendChild(scoreDisplay);
  outputBox.appendChild(hint);
}

// function to display the data
function displayData(result, correctAnswer, userAnswer) {
  let row = document.createElement("div");
  row.className = "row d-flex justify-content-center";
  let col = document.createElement("div");
  col.className = "col-12 col-lg-9";

  result.forEach((data, index) => {
    let quiz_item_wraper = document.createElement("div");
    quiz_item_wraper.className = "quiz-item-wraper";
    quiz_item_wraper.style.display = index === 0 ? "block" : "none";
    //here we store all api options in custom array 
    let allOptions = [
      decodeURIComponent(data.correct_answer),
      decodeURIComponent(data.incorrect_answers[0]),
      decodeURIComponent(data.incorrect_answers[1]),
      decodeURIComponent(data.incorrect_answers[2]),
    ];
    // here we shuffle the array to store random indexing array in the DOM
    shuffleAllOptions(allOptions);

    quiz_item_wraper.innerHTML = `
                              <h4>Question/Prompt</h4>
                            <div class="question-wrap">
                                <p class="question"><span>${index+1}. &nbsp</span> ${decodeURIComponent(data.question)}</p>
                            </div>
                            <h4>Answers</h4>`;                         
                            allOptions.forEach((options, i) => {
                             let dom = allOptions[i] != "undefined" ? `<div class="options-wrap">
                                                            <label class="label">
                                                            <input type="radio" name="${index}" value="${allOptions[i]}"/>
                                                            <span class="option">${i+1}</span>
                                                            <span  class="ans-btn">${allOptions[i]}</span>
                                                          </label>  </div>` : "";
                              quiz_item_wraper.innerHTML += `${dom}`;
                              
                            });
                            let buttons = index >= 1 ? 
                            `<div class="comn-btn-wrap d-flex justify-content-evenly">
                                <button class="btn back-btn"><- Back</button>
                                <button class="btn next-btn">Next -></button>
                            </div>` : 
                            `<div class="comn-btn-wrap d-flex justify-content-center">
                                <button class="btn next-btn">Next -></button> 
                            </div>`;
    quiz_item_wraper.innerHTML += `${buttons}`;
    col.appendChild(quiz_item_wraper);
    row.appendChild(col);
  });
  container.appendChild(row);
  // handle buttons
  buttonHandler(correctAnswer, userAnswer);
  timer(correctAnswer, userAnswer); 
}
