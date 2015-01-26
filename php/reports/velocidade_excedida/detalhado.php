<?php
#############################################

if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
require_once(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
require_once(documentRoot() . "/viewport/php/util/GeoCielo.class.php");
require_once(documentRoot() . "/viewport/php/util/Session.class.php"); 

$OraCielo=new OracleCielo();
$GeoCielo = new GeoCielo($OraCielo->getCon());
$Session = new Session();

include(documentRoot() . "/viewport/php/functions/sql.php");

#############################################

$idUser     = $Session->getItem("eagleIdUsuario");
$empresa    = $Session->getItem("eagleEmpresa");
$placa      = $_REQUEST["placa"];
$condutor   = $_REQUEST["condutor"];
$dataIni    = $_REQUEST["dataIni"];
$dataFim    = $_REQUEST["dataFim"];
$tipo       = $_REQUEST["tipo"];
$operacao   = $_REQUEST["operacao"];
$countTot   = 0;

list($diaIni, $mesIni, $anoIni) = explode("/", $dataIni);
list($diaFim, $mesFim, $anoFim) = explode("/", $dataFim);

$qtdDias = mktime(00, 00, 00, $mesFim, $diaFim, $anoFim) - mktime(00, 00, 00, $mesIni, $diaIni, $anoIni);
$qtdDias = ($qtdDias / 86400) + 1; // Transforma o intervalo em dias e adiciona 1

$compSql = '';

if($tipo=='2'){
    
    $compSql .= " AND vel.condutor = '".$condutor."'";
    $orderBy  = " ORDER BY c.nome, vel.data_hora ASC";
    
}else{
    
    $compSql .= " AND vel.placa = '".$placa."'";
    $compSql .= " AND vel.placa IN (" . sqlPlacasUsuario('operacao') . ")";
    $orderBy  = " ORDER BY vel.placa, vel.data_hora ASC";
     
}

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
            
            <div id="vel_exedida">
            
                <form method="POST" id="form" target="_blank">
                   <input type="hidden" name="html" id="html" />
                </form>

                <div id="title">Relatório Detalhado de Velocidade Excedida</div>

                <table>
                    <tr>
                        <th>Período</th>
                    </tr>
                    <tr>
                        <td align='center'><?=$dataIni?> a <?=$dataFim?></td>
                    </tr>
                </table>

                <table>
                    <?php 
                    for($w = 0; $w < $qtdDias; $w++):

                        $timestampAtual     = mktime(0, 0, 0, $mesIni, $diaIni + $w, $anoIni);
                        $dataAtual          = date("dmY", $timestampAtual); 
                        $dataAtualFormat    = date("d/m/Y", $timestampAtual);
                        $count              = 0;

                        $sql = "SELECT 
                                    vel.placa, 
                                    vel.descricao, 
                                    TO_CHAR(vel.data_hora, 'HH24:mi') AS data_hora, 
                                    vel.velocidade, 
                                    vel.parametro, 
                                    vel.latitude, 
                                    vel.longitude, 
                                    c.nome 
                                FROM monitoramento.velocidade_excedida vel 
                                LEFT JOIN condutores c ON c.id_condutor=vel.condutor 
                                WHERE  vel.data_hora >= TO_DATE('".$dataAtual." 00:00', 'DDMMYYYY HH24:mi')
                                AND vel.data_hora < TO_DATE('".$dataAtual." 23:59', 'DDMMYYYY HH24:mi') 
                                AND vel.velocidade > 0  
                                ".$compSql." 
                                ".$orderBy.""; 

                        $res = oci_parse($OraCielo->getCon(), $sql);
                        if($tipo==1){
                            oci_bind_by_name($res, ":usuario", $idUser); 
                            oci_bind_by_name($res, ":operacao", $operacao);
                        }
                        oci_execute($res);
                        $qtdDados = oci_fetch_all($res, $row);

                        if($qtdDados>0){

                            ?>
                            <tr>
                                <td colspan="20"></td>
                            </tr>
                            <tr>
                                <th>Data</th>
                                <td colspan="7"><?=$dataAtualFormat?></td>
                            </tr>
                            <tr>
                                <th>Placa</th>
                                <th>Condutor</th>
                                <th>Hora</th>
                                <th>Velocidade</th>
                                <th>Descrição</th>
                                <th>Local</th>
                            </tr>
                            <?php

                            for($i=0; $i<$qtdDados; $i++): 
                                ?>
                                <tr>
                                    <td><?=$row['PLACA'][$i]?></td>
                                    <td><?=(!empty($row['NOME'][$i]))?$row['NOME'][$i]:"-"?></td>
                                    <td><?=$row['DATA_HORA'][$i]?></td>
                                    <td><?=$row['VELOCIDADE'][$i]?></td>
                                    <td><?=$row['DESCRICAO'][$i]?></td>
                                    <td><?=$GeoCielo->getLocal($row['LATITUDE'][$i], $row['LONGITUDE'][$i])?></td>
                                </tr>
                                <?php 
                                $count++;
                                $countTot++;
                            endfor;  
                            ?>
                            <tr>
                                <th colspan="6">Total de Excessos dia <?=$dataAtualFormat?>: <?=$count?></th>
                            </tr>
                    <?php }
                    oci_free_statement($res);

                    endfor; ?>
                </table>
                <table>
                    <tr>
                        <td colspan="20"></td>
                    </tr>
                    <tr>
                        <th>Total de Excessos <?=$dataIni?> a <?=$dataFim?>: <?=$countTot?></th>
                    </tr>
                </table>
                
            </div>
            
        </div>
    </body>
</html>