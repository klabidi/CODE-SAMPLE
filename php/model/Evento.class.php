<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");
include(documentRoot() . "/viewport/php/util/GeoCielo.class.php");

class Evento{
    private $db;
    private $session;
    private $geo;
    
    public function __construct(){
        $this->db = new OracleCielo();
        $this->session = new Session();
        $this->geo = new GeoCielo($this->db->getCon());
        
        // Se a sessão não estiver salva redireciona para a tela de login
        if (!$this->session->verificarSessao("eagleIdUsuario")) {
            header("Location: " .  baseUrl());
        }
    }
    
    public function listar($placa, $dataParametro, $diaAnterior = "false"){
        $error = NULL;
        $data = array();
        $queryDiaAnterior = "";
        $cv = "T";
        
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
        $dataAnterior = date("dmY", strtotime($dataParametro)-1);
        
        if($diaAnterior === "true"){
            $queryDiaAnterior = "
            UNION ALL
            SELECT id_evento, TO_CHAR(data_hora, 'DD/MM/YYYY HH24:MI:SS') AS data_hora, 
                   latitude, longitude, codigo, descricao, com_parametro,
                   pkg_eventos.getParametroDescricao(codigo, parametro, enviada_recebida, acessorio, '<br>') AS parametro, 
                   enviada_recebida, requerente, DECODE(meio_conexao,'S','SAT','GPRS') AS conexao  
            FROM monitoramento.evento_".$dataAnterior."
            WHERE placa = :placa AND cliente_visualiza = :cv";
        }
        
        $query = "SELECT * FROM (
            SELECT id_evento, TO_CHAR(data_hora, 'DD/MM/YYYY HH24:MI:SS') AS data_hora, 
                   latitude, longitude, codigo, descricao, com_parametro,
                   pkg_eventos.getParametroDescricao(codigo, parametro, enviada_recebida, acessorio, '<br>') AS parametro, 
                   enviada_recebida, requerente, DECODE(meio_conexao,'S','SAT','GPRS') AS conexao  
            FROM monitoramento.evento_".$dataBusca."
            WHERE placa = :placa AND cliente_visualiza = :cv
            $queryDiaAnterior
        )";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":placa", $placa);
        oci_bind_by_name($res, ":cv", $cv);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($row = oci_fetch_assoc($res)){
                $data[] = array(
                    "idEvento" => $row["ID_EVENTO"],
                    "dataHora" => $row["DATA_HORA"],
                    "latitude" => str_replace(",", ".", $row["LATITUDE"]),
                    "longitude" => str_replace(",", ".", $row["LONGITUDE"]),
                    "descricao" => utf8_encode($row["DESCRICAO"]),
                    "parametro" => utf8_encode(str_replace("\\n", "<br/>", $row["PARAMETRO"])),
                    "comParametro" => ($row["COM_PARAMETRO"] === "T") ? true : false,
                    "enviado" => ($row["ENVIADA_RECEBIDA"] === "E") ? true : false,
                    "requerente" => utf8_encode($row["REQUERENTE"]),
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
    
    public function getLocalizacaoReferencia($lat, $lon){
        $empresa = $this->session->getItem("eagleEmpresa");
        $lat = str_replace(".", ",", $lat);
        $lon = str_replace(".", ",", $lon);

        $queryref = "SELECT descricao, distancia FROM (
                        SELECT * FROM (
                            SELECT descricao, ROUND(pkg_geo.getDistancia(:latitude,:longitude,latitude,longitude),3) AS distancia 
                            FROM pontos_referencia WHERE lat_min>:latitude AND lat_max<:latitude AND lon_min>:longitude AND lon_max<:longitude AND empresa = :empresa
                        ) ORDER BY distancia
                    ) WHERE ROWNUM = 1";
        $resref = oci_parse($this->db->getCon(), $queryref);
        oci_bind_by_name($resref, ":latitude", $lat);
        oci_bind_by_name($resref, ":longitude", $lon);
        oci_bind_by_name($resref, ":empresa", $empresa);

        if(!@oci_execute($resref)){
            $error = oci_error($resref);
        }else{
            $mod2 = oci_fetch_assoc($resref);
            $referencia = ucwords($mod2["DESCRICAO"]);
            $distancia = (float)str_replace(",",".",$mod2["DISTANCIA"]);
        }

        if($distancia>=1)
            $referencia .= " a ".round($distancia)." km";
        else if($max>0)
            $referencia .= (round(($distancia*1000))<=100)?" (No Local)":" a ".round(($distancia*1000))." metros";
        else
            $referencia = "-";

        $localizacao = utf8_encode($this->geo->getLocal($lat, $lon));
        
        oci_free_statement($resref);
        
        return array(
            "success" => is_null($error),
            "data" => array(
                "localizacao" => utf8_encode($localizacao),
                "referencia" => utf8_encode($referencia)
            ),
            "error" => $error
        );
    }
}