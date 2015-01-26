<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");
include(documentRoot() . "/viewport/php/util/GeoCielo.class.php");

class Dashboard {
    private $db;
    private $session;
    private $geo;

    public function __construct() {
        $this->db = new OracleCielo();
        $this->session = new Session();
        $this->geo = new GeoCielo($this->db->getCon());
        if (!$this->session->verificarSessao("eagleIdUsuario")) {
            header("Location: ". baseUrl());
        }
    }
    
    public function listarTempoMovimento($operacao) {
        $error = NULL;
        $data = array();
        $array = array();
        $placas = array();
        $array_gb = array();
        $usuario = $this->session->getItem("eagleIdUsuario");

        /*$query = "SELECT ov.placa FROM operacoes_veiculos ov, operacoes_usuarios ou, rotas r 
                  WHERE ov.operacao = ou.operacao AND ou.usuario = :usuario AND ou.operacao = :operacao AND r.placa = ov.placa";*/
        $query = "SELECT ov.placa FROM operacoes_veiculos ov, operacoes_usuarios ou, rotas r, monitoramento.veiculo_ult_registros vu
                  WHERE ov.operacao = ou.operacao AND ou.usuario = :usuario AND ou.operacao = :operacao AND r.placa = ov.placa
                  AND vu.placa = ov.placa";

        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $usuario);
        oci_bind_by_name($res, ":operacao", $operacao);
        if (!oci_execute($res)) {
            $error = oci_error($res);
        } else {
            oci_fetch_all($res, $placas);
        }
        oci_free_statement($res);

        $query_plcs = "''";
        $z = 0;
        foreach ($placas["PLACA"] as $placa) {
            $query_plcs .= (empty($query_plcs)) ? "" : ",";
            $query_plcs .= "'" . $placa . "'";
            $z++;
            if ($z >= 1000)
                break; /* Limite de 1000 argumentos no SQL */
        }

        $query = "SELECT SUM(distancia) AS distancia, SUM(horimetro) AS horimetro,TO_CHAR(MIN(data_hora),'DD/MM/YYYY HH24:MI') AS data_ini, 
                  TO_CHAR(MAX(data_hora)+1/1440,'DD/MM/YYYY HH24:MI') AS data_fim, placa, status, MAX(velocidade) AS velocidade, COUNT(*) AS total FROM (   
                    SELECT MIN(data_hora) AS data_hora, placa, SUM(distancia) AS distancia, SUM(horimetro) AS horimetro, MAX(velocidade) AS velocidade,  
                    CASE WHEN MAX(ignicao)=1 AND MAX(velocidade)>0 THEN 'A' WHEN MAX(ignicao)=1 AND MAX(velocidade)=0 THEN 'P' ELSE 'D' END AS status
                    FROM monitoramento.rota_" . date("dmY") . "
                    WHERE placa IN (" . $query_plcs . ") GROUP BY placa, TO_CHAR(data_hora,'HH24MI')
                ) GROUP BY placa, status";
        
        $res = oci_parse($this->db->getCon(), $query);

        if (!@oci_execute($res)) {
            $error = oci_error($res);
        } else {
            while ($row = oci_fetch_assoc($res)) {
                $data_db = $this->getDateTime($row["DATA_INI"]);
                $data_aux = $array[$row["PLACA"]]["data_inicio"];
                $data_ini = (empty($data_aux)) ? $data_db : $data_aux;
                $data_ini = ($data_ini > $data_db) ? $data_db : $data_ini;

                $data_db = $this->getDateTime($row["DATA_FIM"]);
                $data_aux = $array[$row["PLACA"]]["data_final"];
                $data_fim = (empty($data_aux)) ? $data_db : $data_aux;
                $data_fim = ($data_fim < $data_db) ? $data_db : $data_fim;

                $array[$row["PLACA"]]["data_inicio"] = $data_ini;
                $array[$row["PLACA"]]["data_final"] = $data_fim;
                
                if($row["DISTANCIA"]>0)
                    $array[$row["PLACA"]]["distancia"] += $row["DISTANCIA"];
                
                if($row["HORIMETRO"]>0)
                    $array[$row["PLACA"]]["horimetro"] += $row["HORIMETRO"];
                
                $vel_aux = $array[$row["PLACA"]]["velocidade"];
                $vel_max = (empty($vel_aux)) ? $row["VELOCIDADE"] : $vel_aux;
                $array[$row["PLACA"]]["velocidade"] = $vel_max;
                
                $array[$row["PLACA"]][$row["STATUS"]] = $row["TOTAL"];
            }
            oci_free_statement($res);

            /* Verificacao se existe algum GB configurado nos veículos */
            $query_ck = "SELECT COUNT(*) AS ck FROM monitoramento.multi_veiculo_config mc, monitoramento.multi_acessorios ma WHERE mc.acessorio = ma.id_acessorio
                         AND (ma.ref_tabela = :ref_consumo OR ma.ref_tabela = :ref_odometro OR ma.ref_tabela = :ref_horimetro) AND mc.placa IN (" . $query_plcs . ")";
            $res_ck = oci_parse($this->db->getCon(), $query_ck);
            
            $ref_consumo = "MS_CONSUMO_COMB";
            $ref_odometro = "MS_ODOMETRO";
            $ref_horimetro = "MS_HORIMETRO";
            oci_bind_by_name($res_ck, ":ref_consumo", $ref_consumo);
            oci_bind_by_name($res_ck, ":ref_odometro", $ref_odometro);
            oci_bind_by_name($res_ck, ":ref_horimetro", $ref_horimetro);
            
            if (!oci_execute($res_ck)) {
                $error = oci_error($res_ck);
            } else {
                $ck = oci_fetch_assoc($res_ck);
                if($ck["CK"]>0){
                    $query_gb = "SELECT MAX(ms_consumo_comb)-MIN(ms_consumo_comb) AS litros, 
                                 MAX(ms_odometro)-MIN(ms_odometro) AS distancia, 
                                 MAX(ms_horimetro)-MIN(ms_horimetro) AS horimetro, 
                                 placa, MAX(data_hora) FROM monitoramento.evento_" . date("dmY") . " 
                                 WHERE codigo = :gb_cod AND placa IN (" . $query_plcs . ") group BY placa";
                    $res_gb = oci_parse($this->db->getCon(), $query_gb);
                    
                    $gb_cod = 250;
                    oci_bind_by_name($res_gb, ":gb_cod", $gb_cod);
                    
                    if (!oci_execute($res_gb)) {
                        $error = oci_error($res_gb);
                    } else {
                        oci_fetch_all($res_gb, $array_gb, null, null, OCI_FETCHSTATEMENT_BY_ROW);
                    }
                    oci_free_statement($res_gb);
                }
                oci_free_statement($res_ck);
            }
            /********/
        }
        foreach ($placas["PLACA"] as $placa){
            $array_plc["andando"] = 0;
            $array_plc["parado"] = 0;
            $array_plc["desligado"] = 100;
            $array_plc["velocidade"] = 0;
            $array_plc["distancia"] = -1;
            $array_plc["horimetro"] = -1;
            $array_plc["litros"] = -1;
            $array_plc["consumo"] = -1;
                
            $array_plc["placa"] = $placa;
            if (isset($array[$placa]["data_inicio"])) {
                $total = ($array[$placa]["data_final"] - $array[$placa]["data_inicio"]) / 60;
                
                $parteA = $array[$placa]["A"];
                $parteA = (empty($parteA)) ? 0 : (int) $parteA;
                $array_plc["andando"] = $this->getPercent($total, $parteA);

                $parteP = $array[$placa]["P"];
                $parteP = (empty($parteP)) ? 0 : (int) $parteP;
                $array_plc["parado"] = $this->getPercent($total, $parteP);

                $array_plc["desligado"] = $this->getPercent($total, $total - $parteA - $parteP);
                
                $array_plc["velocidade"] = $array[$placa]["velocidade"];
                $array_plc["distancia"] = $this->nvl($array[$placa]["distancia"],-1);
                $array_plc["horimetro"] = $this->nvl($array[$placa]["horimetro"],-1);

                foreach ($array_gb as $row) {
                    if($row["PLACA"]==$placa){
                        $array_plc["litros"] = $this->nvl($row["LITROS"],-1);
                        $array_plc["distancia"] = $this->nvl(($row["DISTANCIA"]*1000),$array_plc["distancia"]);
                        $array_plc["horimetro"] = $this->nvl($row["HORIMETRO"],$array_plc["horimetro"]);
                        $array_plc["consumo"] = ($row["LITROS"]>0 && $row["DISTANCIA"]>0)?round($row["DISTANCIA"]/$row["LITROS"],2):-1;
                        break;
                    }
                }
                $row=null;
            }
                            
            $data[] = array(
                "placa" => $array_plc["placa"],
                "andando" => (int)$array_plc["andando"],
                "parado" => (int)$array_plc["parado"],
                "desligado" => (int)$array_plc["desligado"],
                "movimento" => array(
                    (int)$array_plc["andando"],
                    (int)$array_plc["parado"],
                    (int)$array_plc["desligado"]
                ),
                "velocidade" => (int)$array_plc["velocidade"],
                "distancia" => (int)$array_plc["distancia"],
                "horimetro" => (int)$array_plc["horimetro"],
                "litros" => (float)$array_plc["litros"],
                "consumo" => (float)$array_plc["consumo"]
                /*,"total" => $total,
                "parteA" => $parteA,
                "parteB" => $parteP*/
            );
        }

        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function listarDetalheMovimento($placa) {
        $error = NULL;
        $data = array();
        
        if(is_null($placa)){
            return array("success" => false, "error" => "Placa Invalida");
        }
        
        /* Verifica se a placa é do usuário p/ segurança */ 
        $query_ck = "SELECT COUNT(*) AS ck FROM operacoes_veiculos ov, operacoes_usuarios ou
                     WHERE ov.operacao = ou.operacao AND ou.usuario = :usuario AND ov.placa = :placa";
        $res_ck = oci_parse($this->db->getCon(), $query_ck);  
        $usuario = $this->session->getItem("eagleIdUsuario");
        $bind = oci_bind_by_name($res_ck, ":usuario", $usuario);
        $bind = oci_bind_by_name($res_ck, ":placa", $placa); 
        if (!oci_execute($res_ck)){
            $error = oci_error($res_ck);
        } else {
            $ck = oci_fetch_assoc($res_ck);
            $error = ($ck["CK"]==0)?"Placa Nao Permitida p/ Usuario":null;
        }
        if(!is_null($error)){
            return array("success" => false, "error" => $error);
        }
        oci_free_statement($res_ck);
        /***/
        
        $query_ck = "SELECT COUNT(*) AS ck FROM monitoramento.multi_veiculo_config mc, monitoramento.multi_acessorios ma 
                     WHERE mc.acessorio = ma.id_acessorio AND (ref_tabela = :ref_rpm OR ref_tabela = :ref_temperatura OR ref_tabela = :ref_consumo) AND placa = :placa";
        $res_ck = oci_parse($this->db->getCon(), $query_ck);

        $ref_rpm = "MS_RPM";
        $ref_temperatura = "MS_TEMPERATURA";
        $ref_consumo = "MS_CONSUMO_COMB";
        oci_bind_by_name($res_ck, ":ref_rpm", $ref_rpm);
        oci_bind_by_name($res_ck, ":ref_temperatura", $ref_temperatura);
        oci_bind_by_name($res_ck, ":ref_consumo", $ref_consumo);
        oci_bind_by_name($res_ck, ":placa", $placa);
        
        if (!oci_execute($res_ck)) {
            $error = oci_error($res_ck);
        } else {
            $ck = oci_fetch_assoc($res_ck);
            if($ck["CK"]>0){
                $query = "SELECT TO_CHAR(data_hora,'DD/MM/YYYY HH24:MI') AS data_hora, 
                          ms_velocidade AS velocidade, NVL(ms_rpm,-1) AS rpm,
                          NVL(SUBSTR(ms_temperatura,0,3),-1) AS temperatura1,
                          NVL(SUBSTR(ms_temperatura,4,3),-1) AS temperatura2, 
                          NVL(SUBSTR(ms_temperatura,7,3),-1) AS temperatura3,
                          ms_consumo_comb AS consumo 
                          FROM monitoramento.evento_" . date("dmY") . "
                          WHERE placa = :placa AND codigo = :gb_cod 
                          AND ms_velocidade IS NOT NULL ORDER BY data_hora";
                $res = oci_parse($this->db->getCon(), $query);
                
                $gb_cod = 250;
                oci_bind_by_name($res, ":gb_cod", $gb_cod);
                oci_bind_by_name($res, ":placa", $placa);
            }
            else{
                $query = "SELECT TO_CHAR(data_hora,'DD/MM/YYYY HH24:MI') AS data_hora, velocidade, status4 AS chuva, -1 AS rpm, 
                          -1 AS temperatura1,  -1 AS temperatura2, -1 AS temperatura3
                          FROM monitoramento.rota_" . date("dmY") . " WHERE placa = :placa ORDER BY data_hora";
                $res = oci_parse($this->db->getCon(), $query);
                
                oci_bind_by_name($res, ":placa", $placa);
            }
            
            if (!oci_execute($res)) {
                $error = oci_error($res);
            } else {
                while ($row = oci_fetch_assoc($res)) {
                    $data[] = array(
                        "dataHora" => $row["DATA_HORA"],
                        "velocidade" => (int)$row["VELOCIDADE"],
                        "chuva" => ($row["CHUVA"]==1)?true:false,
                        "rpm" => (int)$row["RPM"],
                        "temperatura1" => $row["TEMPERATURA1"],
                        "temperatura2" => $row["TEMPERATURA2"],
                        "temperatura3" => $row["TEMPERATURA3"],
                        "consumo" => (float)str_replace(",",".",$row["CONSUMO"])
                    );
                }
            }
            oci_free_statement($res);
        }
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function listarTrajetoDiario($placa) {
        $error = NULL;
        $data = array();
        
        $query_ini = "SELECT * FROM (SELECT TO_CHAR(data_hora,'DD/MM/YYYY HH24:MI') AS data_hora, lat, lon
                      FROM monitoramento.rota_".date("dmY")." WHERE placa = :placa ORDER BY data_hora) WHERE ROWNUM = 1";
        $res_ini = oci_parse($this->db->getCon(), $query_ini);
        oci_bind_by_name($res_ini, ":placa", $placa);
        
        if(!@oci_execute($res_ini)){
            $error = oci_error($res_ini);
        }else{
            $mod_ini = oci_fetch_assoc($res_ini);
            
            if($mod_ini===false){
                oci_free_statement($res_ini);
                $query_ini = "SELECT TO_CHAR(SYSDATE,'DD/MM/YYYY HH24:MI') AS data_hora, latitude AS lat, longitude AS lon
                              FROM rotas WHERE placa = :placa";
                $res_ini = oci_parse($this->db->getCon(), $query_ini);
                oci_bind_by_name($res_ini, ":placa", $placa);
                
                if(!@oci_execute($res_ini)){
                    $error = oci_error($res_ini);
                }
                $mod_ini = oci_fetch_assoc($res_ini);
            }
            
            $horaAnterior = $this->getDateTime(date("d").'/'.date("m").'/'.date("Y").' 00:00');
            $horaAtual = $this->getDateTime($mod_ini["DATA_HORA"]);
            
            $lat =$mod_ini["LAT"];
            $lon = $mod_ini["LON"];
            $cidadeAtual = utf8_encode($this->geo->getCidade($lat, $lon));
            if($horaAtual!==false){
                $data[] = array(
                    "dataAnterior" => $horaAnterior,
                    "dataAtual" => $horaAtual,
                    "cidade" => $cidadeAtual,
                    "horaTesteAnterior" => date("d/m/Y H:i",$horaAnterior),
                    "hotaTesteAtual" => date("d/m/Y H:i",$horaAtual)
                );
            }
            $cidadeAnterior = $cidadeAtual;
            $horaAnterior = $horaAtual;
        
            $query = "  SELECT TO_CHAR(data_hora,'DD/MM/YYYY HH24:MI') AS data_hora, lat, lon  
                        FROM monitoramento.rota_".date("dmY")."  
                        WHERE placa = :placa AND TO_CHAR(data_hora,'HH24:MI')
                        IN ( '00:00','00:30','01:00','01:30','02:00','02:30','03:00','03:30','04:00',
                             '04:30','05:00','05:30','06:00','06:30','07:00','07:30','08:00','08:30','09:00',
                             '09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00',
                             '14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00',
                             '19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00','23:30')
                        ORDER BY data_hora";
            $res = oci_parse($this->db->getCon(), $query);
            oci_bind_by_name($res, ":placa", $placa);

            if(!@oci_execute($res)){
                $error = oci_error($res);
            }else{
                while($mod = oci_fetch_assoc($res)){
                    $lat = $mod["LAT"];
                    $lon = $mod["LON"];
                    $horaAtual = $this->getDateTime($mod["DATA_HORA"]);
                    $cidadeAtual = utf8_encode($this->geo->getCidade($lat, $lon));

                    if($cidadeAnterior!==$cidadeAtual){
                        $data[] = array(
                                    "dataAnterior" => $horaAnterior,
                                    "dataAtual" => $horaAtual,
                                    "cidade" => $cidadeAtual,
                                    "horaTesteAnterior" => date("d/m/Y H:i",$horaAnterior),
                                    "hotaTesteAtual" => date("d/m/Y H:i",$horaAtual)
                                  );
                    }else{
                        /* Substitui somente o último horario se for a mesma cidade */
                        if(count($data)>0){
                            $data[count($data)-1]["dataAtual"]=$horaAtual;
                            $data[count($data)-1]["hotaTesteAtual"]=date("d/m/Y H:i",$horaAtual);
                        }
                    }
                    $horaAnterior = $horaAtual;
                    $cidadeAnterior = $cidadeAtual;
                }
            }
            oci_free_statement($res);
        }
        oci_free_statement($res_ini);
        $data = array_reverse($data);
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }

    private function getDateTime($data) {
        //echo $date."<br/>";
        $s = explode(" ", $data);
        $d = explode("/", $s[0]);
        $h = explode(":", $s[1]);
        return @mktime($h[0], $h[1], 0, $d[1], $d[0], $d[2]);
    }

    private function getPercent($total, $parte) {
        $total = ($total==0)?1:$total;
        $aux = $parte * 100.0;
        return round($aux / $total);
    }
    
    private function nvl($valor, $ret) {
        return (is_null($valor))?$ret:$valor;
    }

}

//$d = new Dashboard();
//print_r($d->listarTempoMovimento(12));