const TOKEN_RECEITA = "a280c8e68113df9337c17d8fb1216be1"

async function buscaDadosReceita(cpf) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://api.cpfcnpj.com.br/${TOKEN_RECEITA}/7/${cpf}`,
            type: 'GET',
            dataType: 'text',
            timeout: 0,
            success: function(response) {
                //let selectGenero = document.getElementById("selctGenero")
                let dtNasc = $("#inptDtNascimento").val()
                try {
                    const data = typeof response === 'string' ? JSON.parse(response) : response;
                    console.log(` retorno API Receita ${data.status}`)

                    if (data.status != 0) {
                        if(dtNasc == data.nascimento) {
                            $("#inptNome").val(data.nome)
                            $("#inptDtNascimento").val(data.nascimento)
                            //selectGenero.value = data.genero
                            document.getElementById("inptNome").setAttribute("disabled", "");
                        } else {
                            alert("Usuário já cadastrado no sistema, porém dados informados estão incompatíveis! Favor entrar em contato pelo whatsapp para validar informações")
                        }
                    }
                    resolve()
                } catch (error) {
                    console.log(error)
                }
            },
            error: (error) => {
                console.log(error);
                resolve()
            }
        });
    });
}