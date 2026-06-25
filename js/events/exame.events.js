const input = document.querySelector('#search-input-exame');
const dvSuggestion = document.querySelector('.suggestions');
let suggestions = "";
let searchBoxExameList=[];
let exameCalculate=[];

$("#search-input-exame").keyup(delay( (e) => {
    loading();
}, '5'));
$("#search-input-exame").keyup(delay( (e) => {
    removeLoading();
}, '2990'));
$("#search-input-exame").keyup(delay( (e) => {
    getDataSearch(e);
}, '3000'));

function loading() {
    dvSuggestion.innerHTML = '';
    dvSuggestion.style.background = '#ffffff03';
    dvSuggestion.innerHTML += '<img src=".././img/loading-gif.gif" style="width: 30px; height: 30px; position: relative; left: 40%; top:30px;"> ';
}
function removeLoading() {
    dvSuggestion.innerHTML = '<ul></ul>';
    dvSuggestion.style.background = '#fff';
    suggestions = document.querySelector('.suggestions ul');

    suggestions.addEventListener('click', useSuggestion);
}

function search(str) {
    let results = [];
    const val = str.toLowerCase();

    for (i = 0; i < searchBoxExameList.length; i++) {
        results.push(searchBoxExameList[i]);
    }

    return results;
}

function searchHandler(e) {
    const inputVal = e.target.value;
    let results = [];
    if (inputVal.length > 0) {
        results = search(inputVal);
    }
    showSuggestions(results, inputVal);
}

function showSuggestions(results, inputVal) {
    suggestions.innerHTML = '';
    if (results.length > 0) {
        suggestions.style.padding = '15px 0 0 0';
        for (i = 0; i < results.length; i++) {
            let item = results[i];
            let mnemonic = item.split(" - ")

            suggestions.innerHTML += `<li onclick="getExameByMnemonic('${mnemonic[0]}')" >${item}</li>`;
        }
        suggestions.classList.add('has-suggestions');
    } else {
        suggestions.innerHTML = '';
        suggestions.classList.remove('has-suggestions');
    }
}

function useSuggestion(e) {
    input.value = e.target.innerText;
    input.focus();
    results = [];
    suggestions.innerHTML = '';
    suggestions.classList.remove('has-suggestions');

    showCalcExames()
}

input.addEventListener('focus', (e) => {
    if(e.target.value == 'search') {
        e.target.value = ''
        showSuggestions(0, e.target.value)
    } else {
        e.target.value = e.target.value
    }
})

input.addEventListener('focusout', (e) => {
    if(e.target.value == '') {
        e.target.value = 'search'
        showSuggestions(0, e.target.value)
    } else {
        e.target.value = e.target.value
    }
})

input.addEventListener('change', (e) => {
    if(e.target.value == '')
        showSuggestions(0, e.target.value)
})

function closeToogle() {
    $(".exameCalculated").toggle("slide", {
        direction: "right"
    })
    results=[]
    exameCalculate=[]
}

function showCalcExames()
{
    const blcExameDados = $(".dataExame")
    /*const blcExame = $(".exameCalculated").css('display')
    if(blcExame === 'none') {
        $(".exameCalculated").toggle("slide", {
            direction: "right"
        })
    }*/

    if(blcExameDados.css('display') == 'none') {
        blcExameDados.toggle();
    }
}

function contentExameCalculate()
{
    let html = "";
    $.each(exameCalculate, (i, data) => {
        let preco = data.preco > 0 ? data.preco : "Consulta";

        html = html +
            "<div class='card' style='background: #b72f2fa6'>"+
            "<div class='card-body'>"+
            "<h5 class='card-title'>"+ data.mnemonic +
            "<a href='#' style='color: #0f3c76; float: right; position: relative; top: 15px;' class='card-link'>Preço: <label style='font-weight: 700;'>"+preco+"</label></a>"+
            "</h5>"+
            "</div></div>";
    })

    $("#contentExameCalculated").html(html);
    totalExameCalculate();
}

function totalExameCalculate()
{
    let html = "";
    let total = Number(0);
    $.each(exameCalculate, (i, d) => {
        total = total+ Number(d.preco);
    })

    if(total === 0)
        html = html + "<b>Sob Consulta</b>";
    else
        html = html + "<b>"+total.toLocaleString(undefined, {minimumFractionDigits: 2})+"</b>";
    $("#totalizadorExameCalculate").html(html)
}