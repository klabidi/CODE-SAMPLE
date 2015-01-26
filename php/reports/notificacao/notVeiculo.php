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
    
$placa	  = filter_input(INPUT_POST, "placa");
$mensagem = filter_input(INPUT_POST, "mensagem");
$dataIni  = filter_input(INPUT_POST, "dataIni");
$dataFim  = filter_input(INPUT_POST, "dataFim");
$horaIni  = filter_input(INPUT_POST, "horaIni");
$horaFim  = filter_input(INPUT_POST, "horaFim");
list($d, $m, $y) = explode("/", $dataIni);

#############################################

if(!empty($mensagem)){
    $flt = "AND UPPER(nm.mensagem) LIKE UPPER('%".$mensagem."%') ";
}

$flt .= "AND n.data >= TO_DATE('".$dataIni." ".$horaIni."', 'DD/MM/YYYY HH24:MI') 
         AND n.data < TO_DATE('".$dataFim." ".$horaFim."', 'DD/MM/YYYY HH24:MI')+1";

#############################################

$sql = "SELECT  CASE 
                  WHEN n.tipo=2 THEN nm.placa 
                  WHEN n.tipo=4 THEN nm.remetente 
                END enviado_por, 
                CASE 
                  WHEN n.tipo=2 THEN 'Sistema' 
                  WHEN n.tipo=4 THEN nm.placa 
                END recebido_por, 
                nm.mensagem, 
                TO_CHAR(n.data, 'DD/MM/YYYY HH24:MI') AS data
        FROM notificacoes_mensagens nm, notificacoes n 
        WHERE (n.tipo = 2 OR n.tipo = 4) 
        AND n.mensagem = nm.id_notificacao_mensagem 
        AND nm.placa = '".$placa."' 
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
            
                <div id="title">Notificações por Veículos</div>

                <table>
                    <tr>
                        <th>Data / Hora</th> 
                        <th>Enviado por</th>
                        <th>Recebido por</th>
                        <th>Mensagem</th>
                    </tr>
                    <?php while($row = oci_fetch_assoc($res)): ?>
                    <tr>
                        <td><?=$row['DATA']?></td>
                        <td><?=$row['ENVIADO_POR']?></td>
                        <td><?=$row['RECEBIDO_POR']?></td>
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