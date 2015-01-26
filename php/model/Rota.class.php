<?php
error_reporting(0) ;
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/functions/sql.php");
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");
include(documentRoot() . "/viewport/php/util/GeoCielo.class.php");

class Rota {
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
    
    public function listaVeiculosBuffer($operacao, $data_busca=null){
        $data = Array();
        $error = NULL;
        $data_default = strtotime('-1 year');
        $ultimo_status = 'T';
        $data_busca = is_null($data_busca)?date("YmdHi",$data_default):$data_busca;
        $empresa = $this->session->getItem("eagleEmpresa");
        $usuario = $this->session->getItem("eagleIdUsuario");
        
        $query = "  SELECT rt.id_rota, rt.placa, v.frota, TO_CHAR(rt.data_hora, 'DD/MM/YYYY HH24:MI') AS data_hora, rt.ignicao,
                    TO_CHAR(rt.data_banco,'HH24:MI:SS:MM:DD:YYYY') AS data_banco, rt.latitude, rt.longitude, rt.angulo, vu.odometro,
                    CASE WHEN rt.ignicao='T' AND rt.velocidade>0 THEN 'Em Movimento'
                    WHEN rt.ignicao='T' AND rt.velocidade=0 THEN 'Parado' ELSE 'Desligado' END AS situacao, s.descricao AS situacao2,
                    rt.velocidade, rt.emergencia, rt.atualizada, rt.bloqueio, rt.conexao, cn.nome AS condutor, vu.ultimo_ms, vu.ultimo_ms_dt
                    FROM rotas rt, veiculos v, monitoramento.veiculo_ult_registros vu, condutores cn, veiculos_situacoes vs, situacoes s
                    WHERE rt.placa = v.placa AND cn.id_condutor(+)= v.condutor AND vu.placa = v.placa AND vs.placa (+)= rt.placa
                    AND rt.data_banco > TO_DATE(:data_busca,'YYYYMMDDhh24mi') AND s.id_situacao (+)= vs.situacao AND vs.ultima (+)= :ultimo_status
                    AND v.placa IN (" . sqlPlacasUsuario("operacao") . ")";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $usuario);
        oci_bind_by_name($res, ":operacao", $operacao);
        oci_bind_by_name($res, ":data_busca", $data_busca);
        oci_bind_by_name($res, ":ultimo_status", $ultimo_status);

        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            $data_ultima = $data_default;
            while($mod = oci_fetch_assoc($res)){
                $data_banco = explode(":",$mod["DATA_BANCO"]);
                $data_banco = mktime($data_banco[0], $data_banco[1], $data_banco[2], $data_banco[3], $data_banco[4], $data_banco[5]);                
                $data_ultima = ($data_banco>$data_ultima)?$data_banco:$data_ultima;
                
                $data[] = Array(
                    "idRota" => $mod["ID_ROTA"],
                    "veiculo" => Array(
                        "placa" => $mod["PLACA"],
                        "frota" => $mod["FROTA"]
                    ),
                    "condutor" => ucwords(utf8_encode($mod["CONDUTOR"])),
                    "data" => $mod["DATA_HORA"],
                    "ultima" => date("YmdHi",$data_ultima),
                    "ignicao" => ($mod["IGNICAO"]=="T")?true:false,
                    "situacao" => $mod["SITUACAO"],
                    "situacao2" => ucwords(utf8_encode($mod["SITUACAO2"])),
                    "velocidade" => $mod["VELOCIDADE"],
                    "latitude" => str_replace(",", ".", $mod["LATITUDE"]),
                    "longitude" => str_replace(",", ".", $mod["LONGITUDE"]),
                    "hodometro" => str_replace(",", ".", $mod["ODOMETRO"]),
                    "angulo" => (int)$mod["ANGULO"],
                    "emergencia" => ($mod["EMERGENCIA"]=="T")?true:false,
                    "atualizada" => ($mod["ATUALIZADA"]=="T")?true:false,
                    "bloqueio" => ($mod["BLOQUEIO"]=="T")?true:false,
                    "conexao" => $mod["CONEXAO"]
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
    
    public function getLocalizacaoReferencia($id, $placa, $lat, $lon){
        $querybuff = "SELECT id_rota_buffer, localizacao, referencia FROM rotas_buffers WHERE id_rota_buffer = :id";
        $resbuff = oci_parse($this->db->getCon(), $querybuff);
        oci_bind_by_name($resbuff, ":id", $id);

        if(!@oci_execute($resbuff)){
            $error = oci_error($resbuff);
        }else{
            $mod = oci_fetch_assoc($resbuff);
        }
        
        if(strlen($mod["ID_ROTA_BUFFER"]) === 0){
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
            
            $localizacao = $this->geo->getLocal($lat, $lon);
            
            $querybuffins = "INSERT INTO rotas_buffers (id_rota_buffer, placa, localizacao, referencia) VALUES(:id_rota, :placa, :localizacao, :referencia)";
            $resbuffins = oci_parse($this->db->getCon(), $querybuffins);
            oci_bind_by_name($resbuffins, ":id_rota", $id);
            oci_bind_by_name($resbuffins, ":placa", $placa);
            oci_bind_by_name($resbuffins, ":referencia", $referencia);
            oci_bind_by_name($resbuffins, ":localizacao", $localizacao);
            if(!@oci_execute($resbuffins)){
                $error = oci_error($resbuffins);
            }
            oci_free_statement($resbuffins);
        }
        else{
            $referencia = $mod["REFERENCIA"];
            $localizacao = $mod["LOCALIZACAO"];
        }
        oci_free_statement($resbuff);
        
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
?>