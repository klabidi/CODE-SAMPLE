<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class PontoAlvo {
    private $db;
    private $session;
    
    public function __construct(){
        $this->db = new OracleCielo();
        $this->session = new Session();
        if (!$this->session->verificarSessao("eagleIdUsuario")) {
            header("Location: ".baseUrl());
        }
    }
    
    public function listar(){
        $data = array();
        $error = NULL;

        $query = "SELECT pa.placa, pa.distancia, pa.data, pa.empresa, pr.id_referencia, pr.descricao desc_referencia 
                  FROM pontos_alvo pa 
                  JOIN pontos_referencia pr ON pa.referencia = pr.id_referencia 
                  WHERE pa.empresa = :empresa";
        $res = oci_parse($this->db->getCon(), $query);
        
        $empresa = $this->session->getItem("eagleEmpresa");
        oci_bind_by_name($res, ":empresa", $empresa);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "placa" => $mod["PLACA"],
                    "idReferencia" => (int)$mod["ID_REFERENCIA"],
                    "descReferencia" => utf8_encode($mod["DESC_REFERENCIA"]),
                    "distancia" => ((float)str_replace(",", ".",$mod["DISTANCIA"]))*1000,
                    "empresa" => (int)$mod["EMPRESA"],
                    "data" => $mod["DATA"]
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
    
    public function adicionarOuAlterar($data){
        $empresa = (int)$data["empresa"];
        
        if($empresa === 0){
            return $this->add($data);
        }else{
            return $this->alterar($data);
        }
    }
    
    public function add($data){
        $error = null;
        
        $placa = $data["placa"];
        $distancia = str_replace(".", ",", (((float)$data["distancia"]) / 1000));
        $referencia = (int)$data["idReferencia"];
        $empresa = (int)$this->session->getItem("eagleEmpresa");
        
        $query = "INSERT INTO pontos_alvo (placa, referencia, distancia, empresa, data) 
                  VALUES (:placa, :referencia, :distancia, :empresa, sysdate)";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":placa", $placa);
        oci_bind_by_name($res, ":referencia", $referencia);
        oci_bind_by_name($res, ":distancia", $distancia);
        oci_bind_by_name($res, ":empresa", $empresa);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function alterar($data){
        $error = null;
        
        $placa = $data["placa"];
        $distancia = str_replace(".", ",", (((float)$data["distancia"]) / 1000));
        $referencia = (int)$data["idReferencia"];
        $empresa = (int)$this->session->getItem("eagleEmpresa");
        
        $query = "UPDATE pontos_alvo 
                    SET distancia = :distancia 
                  WHERE placa = :placa 
                    AND referencia = :referencia 
                    AND empresa = :empresa";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":placa", $placa);
        oci_bind_by_name($res, ":referencia", $referencia);
        oci_bind_by_name($res, ":distancia", $distancia);
        oci_bind_by_name($res, ":empresa", $empresa);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function excluir($data){
        $error = null;
        
        $placa = $data["placa"];
        $referencia = (int)$data["idReferencia"];
        $empresa = (int)$this->session->getItem("eagleEmpresa");
        
        $query = "DELETE FROM pontos_alvo 
                  WHERE referencia = :referencia 
                  AND placa = :placa 
                  AND empresa = :empresa";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":placa", $placa);
        oci_bind_by_name($res, ":referencia", $referencia);
        oci_bind_by_name($res, ":empresa", $empresa);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
}