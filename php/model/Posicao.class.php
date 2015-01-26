<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Posicao{
    private $db;
    private $session;
    
    public function __construct(){
        $this->db = new OracleCielo();
        $this->session = new Session();
        
        // Se a sessão não estiver salva redireciona para a tela de login
        if (!$this->session->verificarSessao("eagleIdUsuario")) {
            header("Location: " .  baseUrl());
        }
    }
    
    public function listar($placa, $dataParametro, $diaAnterior = "false"){
        $error = NULL;
        $data = array();
        $queryDiaAnterior = "";
        
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
            if($ck["CK"]==0) $error = "Placa Não Permitida p/ Usuário";
        }
        if(!is_null($error))
            return array("success" => false,"error" => $error);
        oci_free_statement($res_ck);
        /***/
        
        $dataBusca = date("dmY", strtotime($dataParametro));
        $dataAnterior = date("dmY", strtotime($dataParametro) - 1);
        
        if($diaAnterior == "true"){
            $queryDiaAnterior = "
            UNION ALL
            
            SELECT  id_rota, placa, lat AS latitude, lon AS longitude, 
                    velocidade, distancia, angulo,
                    TO_CHAR(data_hora, 'DD/MM/YYYY HH24:MI:SS') AS data_hora,
                    DECODE(ignicao,'1','T','F') AS ignicao,
                    DECODE(status2,'1','T','F')           AS emergencia,
                    DECODE(atualizada,'1','T','F')        AS atualizada,
                    DECODE(bloqueio,'1','T','F')          AS bloqueio,
                    DECODE(tipo_conexao,'S','SAT','GPRS') AS conexao
            FROM monitoramento.rota_".$dataAnterior."
            WHERE placa = :placa";
        }
        
        $query = "SELECT * FROM (
            SELECT  id_rota, placa, lat AS latitude, lon AS longitude, 
                    velocidade, distancia, angulo,
                    TO_CHAR(data_hora, 'DD/MM/YYYY HH24:MI:SS') AS data_hora,
                    DECODE(ignicao,'1','T','F') AS ignicao,
                    DECODE(status2,'1','T','F')           AS emergencia,
                    DECODE(atualizada,'1','T','F')        AS atualizada,
                    DECODE(bloqueio,'1','T','F')          AS bloqueio,
                    DECODE(tipo_conexao,'S','SAT','GPRS') AS conexao
            FROM monitoramento.rota_".$dataBusca."
            WHERE placa = :placa
            $queryDiaAnterior
        )";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":placa", $placa);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($row = oci_fetch_assoc($res)){
                $data[] = array(
                            "idPosicao" => $row["ID_ROTA"],
                            "dataHora" => $row["DATA_HORA"],
                            "latitude" => str_replace(",", ".", $row["LATITUDE"]),
                            "longitude" => str_replace(",", ".", $row["LONGITUDE"]),
                            "velocidade" => $row["VELOCIDADE"],
                            "distancia" => $row["DISTANCIA"],
                            "angulo" => $row["ANGULO"],
                            "ignicao" => ($row["IGNICAO"] === "T") ? true : false,
                            "emergencia" => ($row["EMERGENCIA"] === "T") ? true : false,
                            "atualizada" => ($row["ATUALIZADA"] === "T") ? true : false,
                            "bloqueio" => ($row["BLOQUEIO"] === "T") ? true : false,
                            "conexao" => $row["CONEXAO"]
                        );
            }
        }
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
}