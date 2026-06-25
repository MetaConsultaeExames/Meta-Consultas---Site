function getDataSearch(exam) {
    $.ajax({
        url: API + "/SearchExames?key=" + exam.target.value,
        method: "get",
        success: (obj) => {
            searchBoxExameList=[];
            $.each(obj.data, function (i, d) {
                const name    = d.name.length > 35 ? d.name.substr(0, 45)+"..." : d.name;
                const synonim = d.synonim.length  > 25 ? d.synonim.substr(0, 45) + "..." : d.synonim;
                const exame = d.mnemonic +" - "+name +", "+synonim;

                searchBoxExameList.push(exame);
            })
        },
        complete: () => {
            searchHandler(exam)
        },
    });
}

function getExamesDetalhes()
{
    $.ajax({
        url: API + "/ExamesDestaque",
        method: "get",
        success: (obj) => {
            console.log(obj)
            let html = "";
           $.each(obj.data, (i, d) => {
               let preco = d.preco > 0 ? d.preco : "Sob Consulta";
               html = html +
                   "<div class='col-md-4'>"+
                   "<div class='card' style='width: 18rem;'>"+
                   "<div class='card-body'>"+
                   "<h5 class='card-title'>"+ d.mnemonic +"</h5>"+
                   "<img src='.././img/share.png' onclick='showCalcExames();getExameByMnemonic(\""+d.mnemonic+"\")' style='position: absolute; top: 10%; right: 10%; width: 15px; cursor:pointer;'>"+
                   "<h6 class='card-subtitle mb-2 text-muted'></h6>"+
                   "<p class='card-text'>"+ d.name +"</p>"+
                   "<a href='#' class='card-link'>Preço: <label style='font-weight: 700;'>"+preco.replace(".", ',')+"</label></a>"+
                   "</div></div></div>";
           })
            $(".examesDetalhes").html(html);
        }
    });
}

function getExameByMnemonic(data)
{
    let validate=false;
    $.each(exameCalculate, (i, d) => {
        if(d.mnemonic === data)
            validate=false;
    })
    if(validate === false) {
        let html = "";
        $.ajax({
            url: API + "/ExamesDestaque?mnemonic=" + data,
            method: "get",
            success: (obj) => {
                $.each(obj.data, (i, d) => {
                    exameCalculate.push({
                        mnemonic: d.mnemonic,
                        name: d.name,
                        preco: d.preco
                    })
                    let sinonimo = (d.synonim) ? d.synonim : "Nenhum Sinônimo para esse exame";
                    let precoConvert = (d.preco > 0) ? d.preco.replace('.', ',') : 'Sob Consulta'
                    html = html +
                        "<h3 style='color: rgb(70, 190, 230);'>"+d.name+"</h3>" +
                        "<p><span style='font-size:22px;color: rgb(70, 190, 230); font-weight:700;'> Valor R$ "+ precoConvert +" </span> </p>" +
                        "<p><b> Também conhecido como: </b> " + sinonimo + "</p>" +
                        "<p style='font-weight: 700;color:#735aaa;'> O que é " + d.name + "?</p>" +
                        "<p style='text-align: left; padding: 20px;' >" + d.interpretation + "</p>"

                    $(".dataExame").html(html);
                })
            },
            complete: () => {
                contentExameCalculate();
            }
        });
    } else {
        alert("exame já incluso para cálculo");
    }
}