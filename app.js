function check_current_question(){
    if(localStorage.getItem('current_question_id')){
        return localStorage.getItem('current_question_id');
    } else {
        localStorage.setItem('current_question_id','0');
        return localStorage.getItem('current_question_id')
    }
}

function get_current_value(){
    let list = document.querySelectorAll('.input-list');
    for(let i = 0; i < list.length; i++){
        if (list[i].checked){
            return list[i].id
        }
    }
}

function get_json_data(){
    if (localStorage.getItem('question')){
        return JSON.parse(localStorage.getItem('question'))
    }
}

function get_score(){
    if (localStorage.getItem('score')){
        return localStorage.getItem('score')
    } else {
        localStorage.setItem('score','0')
        return 0;
    }
}

function put_score(score){
    if (localStorage.getItem('score')){
        localStorage.removeItem('score')
        localStorage.setItem('score', score)
    }
}

let current = check_current_question();

let selector = {
    titleText: document.querySelector('#title-text'),
    response: document.querySelector('#response'),
    previous: document.querySelector('#previous'),
    next: document.querySelector('#next'),
    submit: document.querySelector('#submit'),
}

let score = get_score();

$.getJSON("document.json", function(data){
    if (! localStorage.getItem('question')){
        localStorage.setItem('question', JSON.stringify(data));
    }
    let countOfJson = data.length;
    document.getElementById('number').innerText += current;
    document.getElementById('question').innerText += countOfJson - 1;
    if (current < countOfJson) {
        selector.titleText.innerText += " " + data[current].question;
        data[current].reponses.map((item, key) => {
            key++;
            selector.response.innerHTML += `<div>
                          <input type="checkbox" id="${key}" name="${key}" value="${item}" class="input-list">
                          <label for="${key}">${item}</label>
                        </div>`;
            /* http://www.expertphp.in/article/how-to-select-only-one-checkbox-at-a-time-in-jquery-example */
            $('.input-list').on('change', function() {
                $('.input-list').not(this).prop('checked', false);
            });
        })
    } else {
        alert('Votre score est de : '+ get_score())
    }
}).fail(function(){
    console.log("An error has occurred.");
});

selector.submit.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    let data = get_json_data();
    if (get_current_value() == data[current].solution){
        score++
        put_score(score)
    }
    current++
    if (localStorage.getItem('current_question_id')){
        localStorage.removeItem('current_question_id');
        localStorage.setItem('current_question_id', current);
    }
    location.reload();
})