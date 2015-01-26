<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
require_once(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
require_once(documentRoot() . "/viewport/php/util/GeoCielo.class.php");
$db=new OracleCielo();
$geo = new GeoCielo($db->getCon());

$placa	 = filter_input(INPUT_POST, "placa");
$dataIni = filter_input(INPUT_POST, "dataIni");
$dataFim = filter_input(INPUT_POST, "dataFim");

#############################################

$sql = "SELECT e.nome AS nome_empresa, v.frota, v.marca_veiculo 
            FROM veiculos v
            JOIN empresas e ON e.id_empresa=v.empresa
            WHERE placa = '".$placa."'";
$res =  oci_parse($db->getCon(), $sql);
            oci_execute($res);
$dadoVeic=  oci_fetch_assoc($res);
$empresa =  $dadoVeic["NOME_EMPRESA"];
$frota   =  $dadoVeic["FROTA"];
$marca   =  $dadoVeic["MARCA_VEICULO"];
oci_free_statement($res);

list($diaIni, $mesIni, $anoIni) = explode("/", $dataIni);
list($diaFim, $mesFim, $anoFim) = explode("/", $dataFim);

$qtdDias = mktime(00, 00, 00, $mesFim, $diaFim, $anoFim) - mktime(00, 00, 00, $mesIni, $diaIni, $anoIni);
$qtdDias = ($qtdDias / 86400) + 1; // Transforma o intervalo em dias e adiciona 1
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="ISO-8859-1">
        <link rel="stylesheet" href="resources/css/relatorios_layout.css">
    </head>
    <body>
        <div id="content">
            
            <div id="posicao">
            
                <form method="POST" id="form" target="_blank">
                   <input type="hidden" name="html" id="html" />
                </form>

                <div id="title">Relatório de Posição</div>

                <table>
                    <tr>
                        <th>Periodo</th>
                        <th>Placa</th>
                        <th>Frota</th>
                        <th>Empresa</th>
                        <th>Marca / Modelo</th>
                    </tr>
                    <tr>
                        <td align='center'><?=$dataIni?> a <?=$dataFim?></td>
                        <td align='center'><?=$placa?></td>
                        <td align='center'><?=$frota?></td>
                        <td align='center'><?=$empresa?></td>
                        <td align='center'><?=$marca?></td>
                    </tr>
                </table>
                <table>
                    <?php 
                    for($i = 0; $i < $qtdDias; $i++):
                        $timestampAtual = mktime(0, 0, 0, $mesIni, $diaIni + $i, $anoIni);
                        $dataAtual      = date("dmY", $timestampAtual); 
                        $dataAtualFormat= date("d/m/Y", $timestampAtual);
                    ?>
                        <tr>
                            <td colspan="20"></td>
                        </tr>
                        <tr>
                            <th>Data</th>
                            <td colspan="7"><?=$dataAtualFormat?></td>
                        </tr>
                        <tr>
                            <th>Conexão</th>
                            <th>Hora</th>
                            <th>Velocidade</th>
                            <th>Ignição</th>
                            <th>Bloqueio</th>
                            <th>Emergência</th>
                            <th>Local</th>
                        </tr>
                    <?php
                        $sql = "SELECT
                                    TO_CHAR(r.data_hora, 'HH24:mi') AS hora,
                                    r.lat,
                                    r.lon,
                                    r.velocidade,
                                    r.distancia,
                                    r.bateria,
                                    r.bateria_interna,
                                    CASE WHEN r.tipo_conexao='S'
                                      THEN 'Satélite'
                                      ELSE 'GPRS'
                                    END AS tipo_conexao,
                                    CASE
                                      WHEN r.bloqueio = 1 THEN 'Sim'
                                      WHEN r.bloqueio = 0 THEN 'Não'
                                    END bloqueio,
                                    CASE WHEN r.status2=1
                                        THEN 'Sim'
                                        ELSE 'Não'
                                    END AS emergencia,
                                    CASE
                                      WHEN r.ignicao = 1 THEN 'Ligada'
                                      WHEN r.ignicao = 0 THEN 'Desligada'
                                    END ignicao
                                FROM monitoramento.rota_".$dataAtual." r
                                WHERE r.placa = '".$placa."'
                                AND r.data_hora >= TO_DATE('".$dataAtual." 00:00', 'DDMMYYYY HH24:mi')
                                AND r.data_hora < TO_DATE('".$dataAtual." 23:59', 'DDMMYYYY HH24:mi')
                                ORDER BY r.data_hora DESC";

                        $res = oci_parse($db->getCon(), $sql);
                        oci_execute($res);

                        while($row = oci_fetch_assoc($res)): ?>
                            <tr>
                                <td><?=$row['TIPO_CONEXAO']?></td>
                                <td><?=$row['HORA']?></td>
                                <td><?=$row['VELOCIDADE']?></td>
                                <td><?=$row['IGNICAO']?></td>
                                <td><?=$row['BLOQUEIO']?></td>
                                <td><?=$row['EMERGENCIA']?></td>
                                <td><?=$geo->getLocal($row['LAT'], $row['LON'])?></td>
                            </tr>
                        <?php 
                        endwhile;
                        oci_free_statement($res);
                        ?>
                <?php endfor; ?>
                </table>
                
            </div>
                
        </div>
    </body>
</html>