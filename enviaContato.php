<style type="text/css">
body {
  background: #ffffff;
}
</style>
<?php

if(isset($_POST['url']) && strlen($_POST['url']) == '0' ) {
if(isset($_POST['acao']) && $_POST['acao'] == 'enviar'){

  $nome         = $_POST['nome'];
  $telefone     = $_POST['telefone'];
  $email        = $_POST['email'];
  $mensagem     = $_POST['mensagem'];
  $formulario   = "Mensagem do Formulário de Contato - Meta Consultas";
  $data         = date('d/m/Y H:i');

    if($nome == '' || $telefone == '' || $email == '' || $mensagem == ''){

          echo '<script>alert("Por favor, Preencha todos os campos corretamente !");location.href="contato.html"</script>';

    }else{

  require_once("phpmailer/class.phpmailer.php");

  // Inicia a classe PHPMailer
  $mail = new PHPMailer();
  $mail->CharSet = "UTF-8";
  
  // Define os dados do servidor e tipo de conexão
  $mail->IsSMTP();
  $mail->Host = "smpt.skymail.net.br";
  $mail->SMTPAuth = true;
  $mail->Port     = '587';
  $mail->SMTPSecure = 'tsl'; 
  $mail->Username = 'webmaster@metaconsultas.com.br';
  $mail->Password = '&^}2PFa&Y7hVtEt';
  
  // Define o remetente
  $mail->From     =  $_POST['email'];
  $mail->FromName =  $_POST['nome'];
  $mail->Sender   = 'contato@metaconsultas.com.br';
  
  // Define os destinatário(s)
  $mail->AddAddress('contato@metaconsultas.com.br');
  
  //$mail->AddCC('contato@site.com.br', 'Ciclano'); // Copia
  //$mail->AddBCC('fulano@site.com.br', 'Fulano da Silva'); // Cópia Oculta
  
  // Define os dados técnicos da Mensagem
  $mail->IsHTML(true); // Define que o e-mail será enviado como HTML
  //$mail->CharSet = 'iso-8859-1'; // Charset da mensagem (opcional)
  
  // Define a mensagem (Texto e Assunto)
  $mail->Subject  = $formulario; // Assunto da mensagem
  $mail->Body     = '

                      <div style="border: 1px solid #f0f0f0; background:#ffffff; font-size:1em; color:#454545; margin:0px auto; padding:1em; overflow:hidden;">
                        
                        <p style="width:100%; float:left; margin-bottom:2px; color:#735aaa; font-size:1.6em;"> '.$formulario.'</p>              

                        <p style="width:100%; float:left; margin-bottom:1px; font-size:1.2em;"> <strong style="color:#735aaa;">Nome:</strong> '.$nome.' </p>
                        <p style="width:100%; float:left; margin-bottom:1px; font-size:1.2em;"> <strong style="color:#735aaa;">E-mail:</strong> '.$email.' </p>
                        <p style="width:100%; float:left; margin-bottom:1px; font-size:1.2em;"> <strong style="color:#735aaa;">Telefone:</strong> '.$telefone.' </p>
                        <p style="width:100%; float:left; margin-bottom:0px; font-size:1.2em;"> <strong style="color:#735aaa;">Mensagem:</strong> '.$mensagem.' </p>
                        <p style="width:100%; float:left; margin-bottom:2px; color:#3c2754; font-size:1.2em; border-top:1px #e9e9e9 solid; padding-top:5px;"> <strong>Enviado pelo site:</strong> www.metaconsultas.com.br <br><br> <strong>Data de envio:</strong> '.$data.' </p>
                      
                      </div>
                      
                    ';

  $mail->AltBody = " \r\n :)";
  
  // Define os anexos (opcional)
  //$mail->AddAttachment("c:/temp/documento.pdf", "novo_nome.pdf");  // Insere um anexo
  
  // Envia o e-mail
  $enviado = $mail->Send();
  // Limpa os destinatários e os anexos
  $mail->ClearAllRecipients();
  $mail->ClearAttachments();
  
  // Exibe uma mensagem de resultado
  if ($enviado) {

              echo '
                     <div style="max-width:320px; padding:50px; border:3px solid #735aaa; color:#735aaa; font-family: tahoma; background:#f7f7f7; text-align:center; font-weight:800; margin:180px auto;">
                     
                        <p style="font-size:1.3em;">Obrigado!</p> 
                        <p style="font-size:1.1em;"> Mensagem enviada com sucesso !</p>

                     </div>

                    ';
            
              echo    '<meta HTTP-EQUIV="Refresh" CONTENT="2;URL=contato.html">';

    } else {
            
            echo "Não foi possível enviar o e-mail.";
            echo "<b>Informações do erro:</b> " . $mail->ErrorInfo;
    }

  }//If Verifica Campos em Brancos
 }//Fecha Condição se alguém Clicar no botão
}//Fecha verifica se é url vazia
?>