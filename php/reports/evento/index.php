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
    
$placa	 = filter_input(INPUT_POST, "placa");
$dataIni = filter_input(INPUT_POST, "dataIni");
$dataFim = filter_input(INPUT_POST, "dataFim");

list($diaIni, $mesIni, $anoIni) = explode("/", $dataIni);
list($diaFim, $mesFim, $anoFim) = explode("/", $dataFim);

$qtdDias = mktime(00, 00, 00, $mesFim, $diaFim, $anoFim) - mktime(00, 00, 00, $mesIni, $diaIni, $anoIni);
$qtdDias = ($qtdDias / 86400) + 1; // Transforma o intervalo em dias e adiciona 1

$sqlVeic = "SELECT e.nome AS nome_empresa, v.frota, v.marca_veiculo 
            FROM veiculos v
            JOIN empresas e ON e.id_empresa=v.empresa
            WHERE placa = '".$placa."'";
$resVeic =  oci_parse($OraCielo->getCon(), $sqlVeic);
            @oci_execute($resVeic);
$dadoVeic=  oci_fetch_assoc($resVeic);
$empresa =  $dadoVeic["NOME_EMPRESA"];
$frota   =  $dadoVeic["FROTA"];
$marca   =  $dadoVeic["MARCA_VEICULO"];
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="ISO-8859-1">
        <link rel="stylesheet" href="resources/css/relatorios_layout.css">
    </head>
    <body>
        <div id="content">
            
            <div id="evento">
            
                <form method="POST" id="form" target="_blank">
                    <input type="hidden" name="html" id="html"/>
                </form>

                <div id="title">Relatório de Eventos</div>

                <table>
                    <tr>
                        <th>Período</th>
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
                            <th>Descrição</th>
                            <th>Parâmetro</th>
                            <th>Hora</th>
                            <th>Hora DB</th>
                            <th>Requerente</th>
                            <th>Modo</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Local</th>
                        </tr>
                    <?php
                        $sql = "SELECT
                                    e.id_evento, 
                                    e.placa, 
                                    e.parametro, 
                                    e.requerente, 
                                    CASE WHEN e.enviada_recebida='E'
                                        THEN 'ENVIADA'
                                        ELSE 'RECEBIDA'
                                    END AS enviada_recebida, 
                                    CASE WHEN e.meio_conexao='S'
                                        THEN 'Satélite'
                                        ELSE 'GPRS'
                                    END AS meio_conexao,
                                    TO_CHAR(e.data_hora, 'HH24:mi') AS data_hora, 
                                    TO_CHAR(e.data_db, 'HH24:mi') AS data_db, 
                                    e.latitude, 
                                    e.longitude, 
                                    emod.descricao 
                                FROM monitoramento.evento_".$dataAtual." e 
                                JOIN monitoramento.evento_modelo emod ON emod.codigo=e.codigo AND emod.acessorio=e.acessorio AND emod.enviada_recebida=e.enviada_recebida AND emod.modelo=e.modelo_aparelho 
                                WHERE e.placa = '".$placa."' 
                                AND e.data_hora >= TO_DATE('".$dataAtual." 00:00', 'DDMMYYYY HH24:mi')
                                AND e.data_hora < TO_DATE('".$dataAtual." 23:59', 'DDMMYYYY HH24:mi')
                                UNION
                                SELECT
                                    e.id_evento, 
                                    e.placa, 
                                    e.parametro, 
                                    e.requerente, 
                                    CASE WHEN e.enviada_recebida='E'
                                        THEN 'ENVIADA'
                                        ELSE 'RECEBIDA'
                                    END AS enviada_recebida,
                                    CASE WHEN e.meio_conexao='S'
                                        THEN 'Satélite'
                                        ELSE 'GPRS'
                                    END AS meio_conexao, 
                                    TO_CHAR(e.data_hora, 'HH24:mi') AS data_hora,
                                    TO_CHAR(e.data_db, 'HH24:mi') AS data_db,
                                    e.latitude, 
                                    e.longitude, 
                                    evei.descricao 
                                FROM monitoramento.evento_".$dataAtual." e 
                                JOIN monitoramento.evento_veiculo evei on evei.codigo=e.codigo AND evei.acessorio=e.acessorio AND evei.enviada_recebida=e.enviada_recebida AND evei.placa=e.placa 
                                WHERE e.placa = '".$placa."' 
                                AND e.data_hora >= TO_DATE('".$dataAtual." 00:00', 'DDMMYYYY HH24:mi')
                                AND e.data_hora < TO_DATE('".$dataAtual." 23:59', 'DDMMYYYY HH24:mi')
                                ORDER BY data_hora DESC";

                        $res = oci_parse($OraCielo->getCon(), $sql);
                        oci_execute($res);

                        while($row = oci_fetch_assoc($res)): ?>
                            <tr>
                                <td><?=$row['MEIO_CONEXAO']?></td>
                                <td><?=$row['DESCRICAO']?></td>
                                <td><?=$row['PARAMETRO']?></td>
                                <td><?=$row['DATA_HORA']?></td>
                                <td><?=$row['DATA_DB']?></td>
                                <td><?=$row['REQUERENTE']?></td>
                                <td><?=$row['ENVIADA_RECEBIDA']?></td>
                                <td><?=$row['LATITUDE']?></td>
                                <td><?=$row['LONGITUDE']?></td>
                                <td><?=$GeoCielo->getLocal($row['LATITUDE'], $row['LONGITUDE'])?></td>
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