<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class SituacaoMacro {
    private $db;
    private $session;
    
    public function __construct(){
        $this->db = new OracleCielo();
        $this->session = new Session();
        
        // Se a sessão não estiver salva redireciona para a tela de login
        if (!$this->session->verificarSessao("eagleIdUsuario")) {
            header("Location: " . baseUrl());
        }
    }
    
    public function listar(){
        $data = array();
        $error = NULL;
        $empresa = $this->session->getItem("eagleEmpresa");
        
        $query = "SELECT * FROM situacoes WHERE empresa = :empresa";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":empresa", $empresa);
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idSituacao" => (int)$mod["ID_SITUACAO"],
                    "descricao" => utf8_encode($mod["DESCRICAO"]),
                    "cpf" => (int)$mod["EMPRESA"]
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
    
    public function inserir($data){
        $error = NULL;
        $empresa = $this->session->getItem("eagleEmpresa");
        $descricao = utf8_decode($data["descricao"]);
        
        $query = "INSERT INTO situacoes (descricao, empresa) VALUES (:descricao, :empresa)";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":descricao", $descricao);
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
    
    public function editar($data){
        $error = NULL;
        $idSituacao = $data["idSituacao"];
        $descricao = utf8_decode($data["descricao"]);
        $empresa = $this->session->getItem("eagleEmpresa");
        
        $query = "UPDATE situacoes SET descricao = :descricao 
                  WHERE empresa = :empresa 
                  AND id_situacao = :id_situacao";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":descricao", $descricao);
        oci_bind_by_name($res, ":empresa", $empresa);
        oci_bind_by_name($res, ":id_situacao", $idSituacao);
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function remover($data){
        $error = NULL;
        $idSituacao = $data["idSituacao"];
        $empresa = $this->session->getItem("eagleEmpresa");
        
        $query = "DELETE situacoes WHERE empresa = :empresa AND id_situacao = :id_situacao";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":empresa", $empresa);
        oci_bind_by_name($res, ":id_situacao", $idSituacao);
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