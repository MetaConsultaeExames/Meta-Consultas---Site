const BASEURL = "https://api.feegow.com/v1/api/";
/** PROD */ // const API = "https://labcare.com.br/api";
/** DEV */   const API = "http://localhost/labcare/api";
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3MjcyODk1ODYsImxpY2Vuc2VJRCI6NjA1OH0.LbYHCRrJMy4N9ljqJ1C7eV4ooKaao9E429Mue0mU5cI";
const HEADER = 
    "x-access-token: " + TOKEN;
const procedimento = 1;


function getMedicsByHour() {
    $.post(API + "/agendamento",
    {
        "tipo": "E",
        "unidade_id": AGENDAMENTO.unidade_id,
        "especialidade_id": AGENDAMENTO.especialidade_id
    },
    function(data, status) {
        if(data.data != null && data.data.length > 0) {
            let parent = document.getElementById('horarios-profissional-here');
            parent.innerHTML = "";

            $.each(data.data, function(index, object) {
                let diasDisponiveis = ""; // nova lista de dias

                let orderedDates = Object.keys(object.data).sort();
                $.each(orderedDates, function(i, date){
                    let dateValue = object.data[date];

                    if(dateValue.length > 0) {
                        // Convertendo para "DD/MM/YYYY - Dia da Semana"
                        const partes = date.split('-');
                        const dataObj = new Date(partes[0], partes[1] - 1, partes[2]);
                        
                        const diasSemana = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
                        const diaSemana = diasSemana[dataObj.getDay()];
                        const dataBr = date.substr(8, 2)+"/"+date.substr(5,2)+"/"+date.substr(0,4);
                        const labelDia = `${dataBr} - ${diaSemana}`;

                        // ID único do botão
                        const diaId = `dia_${object.profissional_id}_${i}`;

                        diasDisponiveis += `
                            <li class='list-group-item list-dia' id="${diaId}" 
                                style="cursor:pointer; color: #46bee6;font-weight: 600;" 
                                onclick="showHourModal('${object.profissional_id}', '${object.profissional_nome}', '${date}', '${JSON.stringify(dateValue).replace(/"/g, '&quot;')}')">
                                ${labelDia}
                            </li>
                        `;
                    }
                });

                let value = AGENDAMENTO.valor.slice(0, -2) + ',' + AGENDAMENTO.valor.slice(-2);
                let valueDesconto = aplicarDesconto(AGENDAMENTO.valor)
                valueDesconto = valueDesconto.slice(0, -2) + ',' + valueDesconto.slice(-2);

                let photo = object.profissional_photo;

                let row = `
                    <div class='row justify-content-md-center'>
                        <div class='col-12' style='padding:25px;'>
                            <div class='card' id='${object.profissional_id}'>
                                <div class='card-header'>
                                    <div class='row'>
                                        <div class='col-3'>
                                            <img style='min-width:90px;' src='${photo}'>
                                        </div>
                                        <div id='div-dados-profissional' class='col-9'>
                                            <h6 class='pag-dinheiro' title='cartao ou pix!'>
                                                <span class='pag-dinheiro-span'>Cartão ou Pix</span><br>
                                                Valor: <span style='color:#ff5555;'>R$ ${value}</span> ou 
                                            </h6>
                                            <h6 class='pag-dinheiro' title='Pagamento em dinheiro!'>
                                                <span class='pag-dinheiro-span'>Pagamento em dinheiro</span><br>
                                                Valor: <span style='color:#ff5555;'>R$ ${valueDesconto}</span>
                                            </h6>
                                            <h5 class='prof-nome'>${object.profissional_tratamento} ${object.profissional_nome}</h5>
                                            <p style='color: #46bee6;margin: 10px;'>CRM: <span style='font-weight:600;'>${object.profissional_crm}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div class='card-body'>
                                    <ul class='list-group'>
                                        ${diasDisponiveis}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = row;
                parent.appendChild(tempDiv);
            });
        } else {
            alert("Informamos que infelizmente, não temos disponibilidade desta especialidade nos proximos 20 dias na unidade escolhida. Porém você pode optar por agendar em outra unidade próxima!")
            location.reload();
        }
    });
}

function showHourModal(profissional_id, profissional_nome, date, horariosJson) {
    const horarios = JSON.parse(horariosJson.replace(/&quot;/g, '"'));
    const hourContainer = document.getElementById('hourHere');
    hourContainer.innerHTML = "";

    horarios.forEach((hour, i) => {
        const hora = hour.substr(0, 5);
        const item = document.createElement("div");
        item.className = "col-12";
        item.innerHTML = `
            <li class='list_hour' 
                style="cursor:pointer; color: #46bee6;font-weight: 600;"
                id='hourChoose_${profissional_id}_${date.substr(8, 2)}_${i}' 
                onclick='getProfessionalDateHour(${i}, ${profissional_id}, "${profissional_nome}" , "${date}", "${hour}")'>
                ${hora}
            </li>
            <hr>
        `;
        hourContainer.appendChild(item);
    });

    // Abrir o modal
    $('#getHourByDayServiceModal').modal('show');
}

function buscarUnities() {
    $.ajax({
        url: API + "/agendamento/?unidades=unity",
        method: "get",
        success: (obj) => {
            if(obj.data != null) {
                let parent = document.getElementById('unidades-here');
                parent.innerHTML = ""
                
                $.each(obj.data.content, function(i, d) {
                    $.each(d, function(x, y){
                        let card = "<div class='col-lg-6 col-sm-12 card-unities'>"+
                            "<div class='card'>"+
                                "<div class='card-body'>"+
                                "<h5 class='card-title'>"+y.nome_fantasia+"</h5>"+
                                "<p class='card-text'>"+ y.endereco +"<br>"+y.bairro+","+y.cidade+"</p>"+
                                "<button onclick='getUnities("+y.unidade_id+", \""+y.nome_fantasia+"\", \""+y.endereco+"\")' class='btn btn-primary'>Selecionar</a>"+
                            "</div>"+
                        "</div>";

                        let tempDiv = document.createElement('div');
                        tempDiv.innerHTML = card.trim();
                        let cardNode = tempDiv.firstChild;

                        parent.appendChild(cardNode)
                    })
                })
            }
        },
        complete: () => {
            console.log('get Locals')
        }

    })
}

async function getAllAgendamentosofAnyPatient() {
    $.ajax({
        url: API + "/agendamento/?searchAppoints=1",
        method: "get",
        success: (obj) => {
            if(obj.data != null) {
                let parent = document.getElementById('selected-here');
                parent.innerHTML = ""
                
                console.log(obj.data.content)
                $.each(obj.data.content, function(i, d) {
                    let innertable = "<tr>"+
                        "<td><p>"+ y.endereco +"<br>"+y.bairro+","+y.cidade+"</p></td>"+
                    "</tr>";

                    let tempDiv = document.createElement('div');
                    tempDiv.innerHTML = card.trim();
                    let cardNode = tempDiv.firstChild;

                    parent.appendChild(cardNode)
                })
            }
        },
        complete: () => {
            console.log('get Agendamentos')
        }

    })
}

async function buscarEspecialidades() {
    console.log(API + "/agendamento/?especialidades=espec")
    $.ajax({
        url: API + "/agendamento/?especialidades=espec",
        method: "get",
        success: (obj) => {
            if(obj.data != null ) {
                let parent = document.getElementById('selected-here');
                let selectList = document.createElement("select");
                selectList.id = "id_especialidade";
                selectList.classList.add("form-select","form-select-lg","mb-12")

                selectList.onchange = function() {
                    let selectedOption = this.options[this.selectedIndex];
                    let selectedText = selectedOption.text; 
                    let selectedId = selectedOption.value;

                    getEspecialidade(selectedId, selectedText);
                };

                parent.appendChild(selectList);

                $('<option>').val(0).text("Selecione").appendTo(selectList);
                $.each(obj.data.content, function (i, d) {
                    if(d.exibir_agendamento_online == 1) {
                        $('<option>')
                            .val(d.especialidade_id)
                            .text(d.nome)
                            .appendTo(selectList);
                    }
                })
            }
        },
        complete: (d) => {
        },
        error: (e) => {
            console.log(e)
        },
    });
}

async function buscarClientes(datanasc, cpf, clear) {
    if(clear) 
        clearDataPacientInputs()

    let cpftratado = cpf.replace(".", "").replace(".", "").replace("-", "");

    await buscarFeegowOrigens();

    $.ajax({
        url: API + "/agendamento/?pacient=busca&cpf="+ cpftratado,
        method: "get",
        success: (obj) => {
            let btnSalvar = document.getElementById("btnEnviarDadosClient")

            if(obj.data != null ) {
                if(obj.data.content == "Paciente não encontrado") {
                    enabledClientsInputs(1)
                    btnSalvar.style.display = "block";
                } else {
                    let nasc = obj.data.content.nascimento.replace("-", "/")
                    if(nasc.replace("-", "/") == datanasc) {
                        AGENDAMENTO.paciente_id = obj.data.content.id
                        AGENDAMENTO.email = obj.data.content.email[0]
                        AGENDAMENTO.paciente = obj.data.content.nome
                        AGENDAMENTO.celular = obj.data.content.celulares[0]
                        
                        let selectGenero = document.getElementById("selctGenero")
                        let selectOrigem = document.getElementById("selctOrigem")

                        document.getElementById("inptNome").value = obj.data.content.nome
                        document.getElementById("inptEmail").value = obj.data.content.email[0]
                        document.getElementById("inptDtNascimento").value = nasc.replace("-", "/")
                        document.getElementById("inptEndereco").value = obj.data.content.endereco
                        document.getElementById("inptNumero").value = obj.data.content.numero
                        document.getElementById("inptBairro").value = obj.data.content.bairro
                        document.getElementById("inptCidade").value = obj.data.content.cidade
                        document.getElementById("inptEstado").value = obj.data.content.estado
                        document.getElementById("inptCep").value = obj.data.content.cep
                        document.getElementById("inptComplemento").value = obj.data.content.complemento ?? ""
                        document.getElementById("inptCelular").value = obj.data.content.celulares[0] ?? ""

                        document.getElementById("inptCpf").setAttribute("disabled", "");
                        document.getElementById("inptDtNascimento").setAttribute("disabled", "");
                        
                        selectGenero.value = obj.data.content.sexo === "Masculino" ? "M" : "F";

                        selectOrigem.value = obj.data.content.origem_id
                        console.log(obj.data.content)
                        console.log(selectOrigem)
                        if (!selectOrigem.value || selectOrigem.value === "0") {
                            console.warn("Origem ID não encontrado nas opções:", obj.data.content.origem_id);
                        }
                        
                        enabledBtnUpdatedClientsvalues()
                        btnSalvar.style.display = "block";
                    } else {
                        alert("Usuário já cadastrado no sistema, porém dados informados estão incompatíveis! Favor entrar em contato pelo whatsapp para validar informações")
                    }
                }
            } else {
                enabledClientsInputs(1)
                btnSalvar.style.display = "block";
            }
        },
        complete: (d) => {
        },
        error: (e) => {
            console.log(e)
        },
    });
}

async function enviarDadosCliente(hollback = false) {
    let pacientNome = document.getElementById("inptNome").value
    let cpfFull = document.getElementById("inptCpf").value
    let dataNascimento = document.getElementById("inptDtNascimento").value
    let pacientEmail = document.getElementById("inptEmail").value
    let pacientGenero = document.getElementById("selctGenero").value
    let pacientCelular = document.getElementById("inptCelular").value
    let pacientCep = document.getElementById("inptCep").value
    let pacientEndereco = document.getElementById("inptEndereco").value
    let pacientComplemento = document.getElementById("inptComplemento").value
    let pacientNumero = document.getElementById("inptNumero").value
    let pacientBairro = document.getElementById("inptBairro").value
    let pacientCidade = document.getElementById("inptCidade").value
    let pacientEstado = document.getElementById("inptEstado").value
    let pacientOrigens = document.getElementById("selctOrigem").value
    //let pacientObservacao = document.getElementById("inptObservacao").value
    pacientNome = pacientNome.toUpperCase()

    if( pacientNome == "" || cpfFull == "" || pacientGenero == "" || dataNascimento == "" || pacientCelular == "" || pacientOrigens == "0") {
        alert("É necessário preencher os campos obrigatórios: Nome, CPF, Data Nascimento, Sexo e Como nos conheceu.")
        enabledClientsInputs()
        buscarClientes($("#inptDtNascimento").val(), $("#inptCpf").val(), false);
        buscarFeegowOrigens();
        $("#inptNome").focus()
        exit
    }

    let celTratado = pacientCelular.replace("(", "")
    let celTratad = celTratado.replace(")", "")
    let celTrat = celTratad.replace("-", "")
    let cell = celTrat.replace(" ", "")

    let cpftratado = cpfFull.replace(".", "")
    let cpftratd = cpftratado.replace(".", "")
    let cpf = cpftratd.replace("-", "")
    let pacientNascimento = dataNascimento.substr(6, 4) + "-" + dataNascimento.substr(3, 2) +"-"+ dataNascimento.substr(0, 2)

    if ( AGENDAMENTO.paciente_id ) {
        // Editar paciente
        // foi habilitado a edição dos dados
        $.ajax({
            url: API + "/agendamento/?pacientEdit=edit&pacienteId="+AGENDAMENTO.paciente_id+"&pacienteNome="+ pacientNome +"&pacientOrigens=" + pacientOrigens +
                "&pacientCep="+ pacientCep +"&pacientComplemento="+pacientComplemento+"&pacientGenero="+pacientGenero+
                "&cpf="+ cpf +"&pacientNascimento="+ pacientNascimento +"&pacientCelular="+ cell +"&pacientEmail="+ pacientEmail +
                "&pacientEndereco="+ pacientEndereco +"&pacientNumero="+ pacientNumero +"&pacientBairro="+ pacientBairro +"&pacientCidade="+ pacientCidade +"&pacientEstado="+ pacientEstado,
            method: "get",
            success: (obj) => {
                if(obj.data != null ) {
                    if(obj.data.content) {
                        if(AGENDAMENTO.email == "")
                            AGENDAMENTO.email = pacientEmail
                        if(AGENDAMENTO.paciente == "")
                            AGENDAMENTO.paciente = pacientNome
                        if(AGENDAMENTO.celular == "")
                            AGENDAMENTO.celular = pacientCelular
                        
                        if(hollback === false) {
                            getPacientes(AGENDAMENTO.paciente)
                        } else {
                            alert("Cadastro realizado com sucesso!");
                        }
                    }
                } else {
                    enabledClientsInputs()
                }
                $("#btnEnviarDadosClient").css("display", "none")
            },
            complete: (d) => {
                console.log("Complete: "+d)
            },
            error: (e) => {
                console.log("error: "+e)
            },
        });
    } else { 
        $.ajax({
            url: API + "/agendamento/?pacientCreate=create&pacienteNome="+ pacientNome +
                "&pacientCep="+ pacientCep +"&pacientComplemento="+pacientComplemento+"&pacientGenero="+pacientGenero+"&pacientOrigens=" + pacientOrigens +
                "&cpf="+ cpf +"&pacientNascimento="+ pacientNascimento +"&pacientCelular="+ cell +"&pacientEmail="+ pacientEmail +
                "&pacientEndereco="+ pacientEndereco +"&pacientNumero="+ pacientNumero +"&pacientBairro="+ pacientBairro +"&pacientCidade="+ pacientCidade +"&pacientEstado="+ pacientEstado,
            method: "get",
            success: (obj) => {
                if(obj.data != null ) {
                    if(obj.data.content) {
                        AGENDAMENTO.paciente_id = obj.data.content.paciente_id
                        AGENDAMENTO.email = pacientEmail
                        AGENDAMENTO.paciente = pacientNome
                        AGENDAMENTO.celular = pacientCelular
    
                        if(hollback === false) {
                            getPacientes(AGENDAMENTO.paciente)
                        } else {
                            alert("Cadastro realizado com sucesso!");
                        }
                    }
                } else {
                    enabledClientsInputs(1)
                }
            },
            complete: (d) => {
            },
            error: (e) => {
                console.log(e)
            },
        });
    }
    if(hollback === false)
        getPacientes(AGENDAMENTO.paciente)
}

async function buscarprocedimentos(especialidade) {

    $.ajax({
        url: API + "/agendamento/?procedimento="+ especialidade,
        method: "get",
        success: (obj) => {
            if(obj.data != null ) {
                let parent = document.getElementById('procedimento-here');
                parent.innerHTML = "";

                let selectList = document.createElement("select");
                selectList.id = "id_procedimento";
                selectList.classList.add("form-select","form-select-lg","mb-12")

                var h = document.createElement("H5");
                h.style.cssText = "margin-top: 25px;";
                var t = document.createTextNode("Selecione um Procedimento");
                h.appendChild(t);

                selectList.onchange = function() {

                    let selectedOption = this.options[this.selectedIndex]; // Obtém a opção selecionada
                    let selectedText = selectedOption.text; // Texto da opção
                    let selectedId = selectedOption.value; // ID da especialidade
                    let selectedValor = selectedOption.getAttribute("data-valor"); // Valor da especialidade


                    getProcedimento(selectedId, selectedText, selectedValor);
                };
                parent.appendChild(h)
                parent.appendChild(selectList)

                $('<option>').val(0).text("Selecione").appendTo(selectList);
                let contem = 0
                $.each(obj.data.content, function (i, d) {
                    if(especialidade == 106 && d.especialidade_id[0] == especialidade) {
                        if(d.procedimento_id == 418) {
                            contem = 1
                            $('<option>')
                                .val(d.procedimento_id)
                                .text(d.nome)
                                .attr("data-valor", d.valor)
                                .appendTo(selectList);
                        }
                    }
                    if(especialidade != 106 && d.especialidade_id[0] == especialidade) {
                        contem = 1
                        $('<option>')
                            .val(d.procedimento_id)
                            .text(d.nome)
                            .attr("data-valor", d.valor)
                            .appendTo(selectList);
                    }
                    if(contem == 0) {
                        if(d.especialidade_id[0] == 1) 
                            $('<option>').val(d.procedimento_id).text(d.nome).appendTo(selectList);
                    }
                })
            }
        },
        complete: (d) => {
        },
        error: (e) => {
            console.log(e)
        },
    });
}

async function appointmentSubmit() {
    let data = AGENDAMENTO.data.substr(8, 2) + "-" + AGENDAMENTO.data.substr(5, 2) +"-"+ AGENDAMENTO.data.substr(0, 4)
    let cell = AGENDAMENTO.celular.replace(" ", "")
    
    $.ajax({
        url: API + "/agendamento/?newAppoint=create&localId="+ AGENDAMENTO.local_id + "&profissionalId="+ AGENDAMENTO.profissional_id + "&valor=" + AGENDAMENTO.valor +
            "&pacienteId="+ AGENDAMENTO.paciente_id +"&especialidadeId="+ AGENDAMENTO.especialidade_id +"&procedimentoId="+ AGENDAMENTO.procedimento_id +
            "&data="+ data +"&hora="+ AGENDAMENTO.horario +"&celular="+ cell +"&email="+ AGENDAMENTO.email,
        method: "get",
        success: (obj) => {
            if(obj.data != null ) {
                if(obj.data.content.agendamento_id) {
                    alert("Agendamento realizado com sucesso! Não esqueça de salvar o agendamento em sua agenda!")
                    //location.reload();
                    $("#sendAppointment").css("display", "none")
                    $("#cancelAppointment").css("display", "none")
                    $("#closeAllPage").css("display", "block")
                } else {
                    alert(obj.data.content)
                }
            }
        },
        complete: (d) => {
        },
        error: (e) => {
            console.log(e)
        },
    });
}

async function buscarFeegowOrigens(origemId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: API + "/agendamento/?pacientOrigens=origem",
            method: "get",
            success: (obj) => {
                if (obj.data != null) {
                    let selectList = document.getElementById("selctOrigem");
                    selectList.innerHTML = ""; // Limpa o select
                    $('<option>').val(0).text("Selecione").appendTo(selectList);

                    // Popula as opções
                    $.each(obj.data.content, function (i, d) {
                        $('<option>').val(d.origem_id).text(d.nome_origem).appendTo(selectList);
                    });

                    // Se um origemId foi passado, define o valor
                    if (origemId) {
                        selectList.value = origemId;
                    }
                    resolve(); // Resolve a Promise quando terminar
                }
            },
            error: (e) => {
                console.log(e);
                reject(e); // Rejeita a Promise em caso de erro
            },
        });
    });
}