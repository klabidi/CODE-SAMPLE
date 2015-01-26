<?php
#############################################

if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
require_once(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
require_once(documentRoot() . "/viewport/php/util/GeoCielo.class.php");

$OraCielo=new OracleCielo();
$GeoCielo = new GeoCielo($OraCielo->getCon());
      
#############################################
    
$usuario = filter_input(INPUT_POST, "usuario");
$mensagem= filter_input(INPUT_POST, "mensagem");
$dataIni = filter_input(INPUT_POST, "dataIni");
$dataFim = filter_input(INPUT_POST, "dataFim");
$horaIni = filter_input(INPUT_POST, "horaIni");
$horaFim = filter_input(INPUT_POST, "horaFim");
list($d, $m, $y) = explode("/", $dataIni);

#############################################

if(!empty($mensagem)){
    $flt = "AND UPPER(nm.mensagem) LIKE UPPER('%".$mensagem."%') ";
}

$flt .= "AND n.data >= TO_DATE('".$dataIni." ".$horaIni."', 'DD/MM/YYYY HH24:MI') 
         AND n.data < TO_DATE('".$dataFim." ".$horaFim."', 'DD/MM/YYYY HH24:MI')+1";

#############################################

$sql = "SELECT n.id_notificacao, 
                CASE 
                  WHEN n.tipo=2 THEN 'Enviada' 
                  WHEN n.tipo=4 THEN 'Respondeu' 
                END as tipo, 
                nm.placa, 
                nm.usuario, 
                nm.usuario_rsp, 
                nm.remetente AS usuario_envia, 
                u.nome AS usuario_recebe, 
                nm.mensagem, 
                TO_CHAR(n.data, 'DD/MM/YYYY HH24:MI') AS data 
        FROM notificacoes_mensagens nm, notificacoes n, usuarios u 
        WHERE n.mensagem = nm.id_notificacao_mensagem 
        AND (nm.usuario = ".$usuario." OR nm.usuario_rsp = ".$usuario.") 
        AND u.id_usuario (+)= nm.usuario_rsp 
        ".$flt." 
        ORDER BY n.data";
$res = oci_parse($OraCielo->getCon(), $sql);
oci_execute($res);

#############################################

?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="ISO-8859-1">
        <link rel="stylesheet" href="resources/css/relatorios_layout.css">
    </head>
    <body>
        <div id="content">
            
            <div id="notific">
            
                <form method="POST" id="form" target="_blank">
                   <input type="hidden" name="html" id="html" />
                </form>

                <div id="title">Notificações por Usuários</div>

                <table>
                    <tr>
                        <th>Data / Hora</th> 
                        <th>Enviado por</th>
                        <th>Envio / Resposta</th>
                        <th>Recebido por</th>
                        <th>Mensagem</th>
                    </tr>
                    <?php while($row = oci_fetch_assoc($res)): ?>
                    <tr>
                        <td><?=$row['DATA']?></td>
                        <td><?=$row['USUARIO_ENVIA']?></td>
                        <td><?=$row['TIPO']?></td>
                        <td><?=$row['USUARIO_RECEBE']?><?=$row['PLACA']?></td>
                        <td><?=utf8_decode($row['MENSAGEM'])?></td>
                    </tr>
                    <?php
                    endwhile;
                    oci_free_statement($res);
                    ?>
                </table>
            
            </div>
                
        </div>
    </body>
</html>