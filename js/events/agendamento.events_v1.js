function collapseControl(activated) {
    let btnProx = document.getElementById("prox")
    btnProx.innerHTML = ""
    let openCollapse = document.querySelector('.collapse.show');
    if (openCollapse) {
        let bsCollapse = new bootstrap.Collapse(openCollapse, { toggle: false });
        bsCollapse.hide();
    }

    let nextCollapse = document.getElementById(activated);
    if (nextCollapse) {
        let bsCollapse = new bootstrap.Collapse(nextCollapse);
        bsCollapse.show();
    }
}


function getEspecialidade(selectedId, selectedTxt) {
    AGENDAMENTO.especialidade_id = selectedId
    AGENDAMENTO.especialidade_nome = selectedTxt
    

    schedullingResume("show", "Especialidade", selectedTxt)

    buscarprocedimentos(selectedId)
}

function aplicarDesconto(valorOriginal) {
    return DATAPROCEDIMENTO.valorDesconto || valorOriginal;
}

function getProcedimento(id, txt, valor, proc_object) {
    AGENDAMENTO.procedimento_id = id
    AGENDAMENTO.procedimento_nome = txt
    AGENDAMENTO.valor = valor;

    explodeDataProcedimento(proc_object, id)

    schedullingResume("show", "Procedimento", txt)
    enabledNext("collapseUnidades")
    buscarUnities()
}

function explodeDataProcedimento(object, id) {
    $.each(object.data.content, function (i, d) {
        if(d.procedimento_id == id) {
            const regex = /\[INICIO:(\d+)\]\s*\[TERMINO:(\d+)\]\s*\[\$:(\d+)\]/;
            const match = d.preparo.match(regex);
            
            if (match) {
                DATAPROCEDIMENTO.inicio = parseInt(match[1]);
                DATAPROCEDIMENTO.termino = parseInt(match[2]);
                DATAPROCEDIMENTO.valorDesconto = parseInt(match[3]);
            } else {
                console.error("Formato da string inválido");
            }
        }
    })
}

function getUnities(unidade, txt, endereco) {
    AGENDAMENTO.unidade_id = unidade
    if(unidade == 0)
        AGENDAMENTO.local_id = 1
    else
        AGENDAMENTO.local_id = 14

    AGENDAMENTO.unidade_nome = txt
    AGENDAMENTO.unidade_end = endereco
    
    schedullingResume("show", "Unidade", txt)
    getMedicsByHour();
    collapseControl("collapseProfessional")

}

function getProfessionalDateHour(index, idProf, nameProf, date, hour) {
    $('#getHourByDayServiceModal').modal('hide');
    AGENDAMENTO.profissional_id = idProf
    AGENDAMENTO.profissional_nome = nameProf
    AGENDAMENTO.data = date
    AGENDAMENTO.horario = hour
    let dataBr = date.substr(8, 2)+"/"+date.substr(5,2)+"/"+date.substr(0,4)
    let hora = hour.substr(0, 5)

    $(".list_hour").css("background", "#fff")
    $("#hourChoose_"+idProf+"_"+date.substr(8, 2)+"_"+index).css("background", "#cdcdff")

    document.getElementById("inptCpf").removeAttribute("disabled");
    document.getElementById("inptDtNascimento").removeAttribute("disabled");

    schedullingResume("show", "Profissional", nameProf)
    schedullingResume("show", "Data", dataBr)
    schedullingResume("show", "Horario", hora)
    //enabledBtnBack()
    collapseControl("collapseDadosPessoais")
}

function getPacientes(nome) {
    schedullingResume("show", "Paciente", nome)
    //enabledBtnBack()
    confirmacaoAgendamento()
    collapseControl("collapseConfirmacao")
}

function enabledNext(next) {
    let btnProx = document.getElementById("prox")
    btnProx.style.display = "block";

    let btn = document.createElement("button")
    btn.classList.add("btn", "btn-primary", "btn-next")

    btn.setAttribute("onclick", "collapseControl('"+next+"', 0)")
    
    btn.appendChild(document.createTextNode("Próximo"));

    btnProx.innerHTML = "";
    btnProx.appendChild(btn)
}
function closeNextBtn() {
    let btnProx = document.getElementById("prox")
    btnProx.style.display = "none";
}

function enabledBtnBack() {
    let btnBack = document.getElementById("back")
    btnBack.style.display = "block";

    let btn = document.createElement("button")
    btn.classList.add("btn", "btn-primary", "btn-back")

    btn.setAttribute("onclick", "voltarAba()")
    
    btn.appendChild(document.createTextNode("Voltar"));

    btnBack.innerHTML = "";
    btnBack.appendChild(btn)
}




function closeLocalsModal() {
    const localsModal = document.getElementById("localsModal")
    localsModal.remove();
}

function openModal(){
    // console.log(horarios_drs)
    const myModal = new bootstrap.Modal(document.getElementById('exampleModal'))
    myModal.show();
}
let ElementsShow = []

function schedullingResume( display, selected, selectedTxt ) {
    console.log(selectedTxt)
    if(display == "show") {
        document.getElementById("agendamento-txt").style.display = "none"
        document.getElementById("agendamento-resume-selected").style.display = "block"

        let existingIndex = ElementsShow.findIndex(item => item.hasOwnProperty(selected));

        if (existingIndex !== -1) {
            ElementsShow[existingIndex][selected] = selectedTxt;
        } else {
            ElementsShow.push({ [selected]: selectedTxt });
        }
    
        atualizarResumoAgendamento()

    } else {
        document.getElementById("agendamento-txt").style.display = "block"
        document.getElementById("agendamento-resume-selected").style.display = "none"
    }
}

function atualizarResumoAgendamento() {
    let container = document.getElementById("agendamento-resume-selected");
    let containerMobile = document.getElementById("breadcrumb-mobile");

    container.innerHTML = "";
    containerMobile.innerHTML = "";
    let ul = document.createElement("ul");
    let ol = document.createElement("ol");
    ol.classList.add("breadcrumb")

    ElementsShow.forEach(item => {
        let li = document.createElement("li");
        let liMob = document.createElement("li");
        liMob.classList.add("breadcrumb-item", "active")
        let li2 = document.createElement("li");
        li2.classList.add("linha-vertical")
        let p = document.createElement("p");
        let pMob = document.createElement("p");

        p.textContent = `${Object.keys(item)[0]}: ${Object.values(item)[0]}`;
        liMob.textContent = `${Object.values(item)[0]}`;

        li.appendChild(p)
        ul.appendChild(li)
        ol.appendChild(liMob)

        if(Object.keys(item)[0] != "Paciente")
            ul.appendChild(li2)

        
    });

    container.appendChild(ul);
    containerMobile.appendChild(ol);
}

function fMasc(objeto,mascara) {
    obj=objeto
    masc=mascara
    setTimeout("fMascEx()",1)
}
    
function fMascEx() {
    obj.value=masc(obj.value)
}

function mCPF(cpf){
    cpf=cpf.replace(/\D/g,"")
    cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
    cpf=cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
    return cpf
}

function validarCPF(cpf) {
    // Remover pontos e traço
    cpf = cpf.replace(/[.\-]/g, '');

    // Verificar se tem 11 dígitos
    if (!/^\d{11}$/.test(cpf)) return false;

    // Eliminar CPFs inválidos conhecidos
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Calcular os dígitos verificadores
    let soma = 0, resto;

    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(10))) return false;

    return true;
}

function validatePhoneNumber(input) {
    const phoneRegex = /^\(\d{2}\)-\d{5} \d{4}$/;
    return phoneRegex.test(input);
}

function applyPhoneMask(inputElement) {
    inputElement.addEventListener("input", (event) => {
        let value = event.target.value.replace(/\D/g, ""); // Remove tudo que não for número
        
        if (value.length > 2) {
            value = `(${value.slice(0, 2)})${value.slice(2)}`;
        }
        if (value.length > 11) {
            value = `${value.slice(0, 9)}-${value.slice(9, 13)}`;
        }
        
        event.target.value = value;
    });
}

function applyDateMask(inputElement) {
    inputElement.addEventListener("input", (event) => {
        let value = event.target.value.replace(/\D/g, ""); // Remove tudo que não for número
        
        if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        if (value.length > 5) {
            value = `${value.slice(0, 5)}/${value.slice(5, 9)}`;
        }
        
        event.target.value = value;
    });
}

function validClientExists() {
    if($("#inptNome").val() == "" || $("#inptCpf").val() == "" || $("#inptDtNascimento").val() == "" ) {
        alert("É necessário preencher os campos: Nome, CPF, Data Nascimento, Sexo, Celular e Como nos conheceu.")
    }
}

function enabledClientsInputs(created) {
    // document.getElementById("inptCpf").removeAttribute("disabled");
    document.getElementById("inptNome").removeAttribute("disabled");
    // document.getElementById("inptDtNascimento").removeAttribute("disabled");
    document.getElementById("inptEmail").removeAttribute("disabled");
    document.getElementById("inptCelular").removeAttribute("disabled");
    document.getElementById("inptEndereco").removeAttribute("disabled");
    document.getElementById("inptNumero").removeAttribute("disabled");
    document.getElementById("inptBairro").removeAttribute("disabled");
    document.getElementById("inptCidade").removeAttribute("disabled");
    document.getElementById("inptEstado").removeAttribute("disabled");
    document.getElementById("inptCep").removeAttribute("disabled");
    document.getElementById("inptComplemento").removeAttribute("disabled");
    document.getElementById("selctGenero").removeAttribute("disabled");
    if(created) {
        document.getElementById("selctOrigem").removeAttribute("disabled");
        //document.getElementById("inptObservacao").removeAttribute("disabled");
    }
}

function clearDataPacientInputs() {
    document.getElementById("inptNome").value = ""
    document.getElementById("inptEmail").value = ""
    //document.getElementById("inptDtNascimento").value = ""
    document.getElementById("inptEndereco").value = ""
    document.getElementById("inptNumero").value = ""
    document.getElementById("inptBairro").value = ""
    document.getElementById("inptCidade").value = ""
    document.getElementById("inptEstado").value = ""
    document.getElementById("inptCep").value = ""
    document.getElementById("inptComplemento").value = ""
    document.getElementById("inptCelular").value = ""
    AGENDAMENTO.paciente_id = ""
    AGENDAMENTO.paciente = ""
    AGENDAMENTO.email = ""
    AGENDAMENTO.celular = ""
}

function enabledBtnUpdatedClientsvalues() {
    document.getElementById("btnAtualizarValoresPaciente").style.display = "block"
    document.getElementById("naoTenhoCpf").style.display = "none"
    document.getElementById("limparCampos").style.display = "block"
}

function confirmacaoAgendamento() {
    let parent = document.getElementById('confirmacao-here');
    parent.innerHTML = "";
    let dataBr = AGENDAMENTO.data.substr(8, 2)+"/"+AGENDAMENTO.data.substr(5,2)+"/"+AGENDAMENTO.data.substr(0,4)
    let hora = AGENDAMENTO.horario.substr(0, 5)
    let value = AGENDAMENTO.valor.slice(0, -2) + ',' + AGENDAMENTO.valor.slice(-2);
    let valueDesconto = aplicarDesconto(AGENDAMENTO.valor)
    valueDesconto = valueDesconto.toString().slice(0, -2) + ',' + valueDesconto.toString().slice(-2);

    let card = document.createElement("div");
    card.className = "card border-primary mb-3";
    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${AGENDAMENTO.paciente.toUpperCase()}</h5>
            <p class="card-text">
                Consulta com o(a) Dr(a) ${AGENDAMENTO.profissional_nome}<br>
                <strong>Especialidade:</strong> ${AGENDAMENTO.especialidade_nome}, <strong>Procedimento:</strong> ${AGENDAMENTO.procedimento_nome}<br>
                <strong>Valor:</strong> R$ ${value} <span style='font-size: 10px;'>(Cartão ou Pix)</span><br>
                <strong>Valor:</strong> R$ ${valueDesconto} <span style='font-size: 10px;'>(Pagamento em dinheiro)</span><br>
                <strong>Na data:</strong> ${dataBr} às ${hora}<br>
                <strong>Na unidade:</strong> ${AGENDAMENTO.unidade_nome}, <strong>Endereço:</strong> ${AGENDAMENTO.unidade_end}
            </p>
            <p><strong>Deseja confirmar esse agendamento?</strong></p>
            <button id="sendAppointment" style="width:200px;" onclick="appointmentSubmit()" class="btn btn-success">Sim</button>
            <a id="cancelAppointment" href="agendamento.html" style="width:200px;" class="btn btn-danger">Não</a>
            <button id="closeAllPage" style="width:200px;display:none;" onclick="location.reload()" class="btn btn-info">Fechar</button>
        </div>
    `;
    //let container = document.getElementById("agendamento-resume-selected");
    //container.innerHTML = "";
    
    parent.appendChild(card);
}

const cep = document.querySelector('#inptCep');

const showData = (result) => {
    if(result) {
        let endereco = result.logradouro.replace(/-.*/, '')
        document.querySelector("#inptEndereco").value = endereco
        document.querySelector("#inptBairro").value = result.bairro
        document.querySelector("#inptCidade").value = result.localidade
        document.querySelector("#inptEstado").value = result.estado
    }
};
/* hi hi hi*/
cep.addEventListener("blur",(e)=>{
    console.log("blur")
    let search = cep.value.replace("-","");
    const options = {
        method : 'GET',
        mode : 'cors',
        cache :'default'
    };
    fetch(`https://viacep.com.br/ws/${search}/json/`,options)
    .then(response => {response.json() 
        .then( data => showData(data));
    })
    .catch(e => console.log('Deu erro: ' + e,mensage));
});