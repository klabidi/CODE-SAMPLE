<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Situacao {
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
    
    public function listar($page, $limit){
        $sessionEmpresa = $this->session->getItem("eagleEmpresa");
        $inicio = ($page - 1) * $limit;
        $fim = $page * $limit;
        $error = NULL;
        
        $data = array();
        $error = NULL;
        $query = "SELECT * FROM situacoes WHERE empresa = :empresa";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":empresa", $sessionEmpresa);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idSituacao" => $mod["ID_SITUACAO"],
                    "descricao" => utf8_encode($mod["DESCRICAO"]),
                    "idEmpresa" => (int)$mod["EMPRESA"]
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
    
    public function criar($data){
        $data = json_decode($data);
        $error = NULL;
        
        $empresaSession = $this->session->getItem("eagleEmpresa");
        $descricao = utf8_decode($data->descricao);
        
        $query = "INSERT INTO situacoes (descricao, empresa) "
                . "VALUES (:descricao, :empresa)";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":descricao", $descricao);
        oci_bind_by_name($res, ":empresa", $empresaSession);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function alterar($data){
        $data = json_decode($data);
        $error = NULL;
        
        $query = "UPDATE situacoes 
                  SET descricao = :descr 
                  WHERE id_situacao = :idSituacao";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":idSituacao", $data->idSituacao);
        oci_bind_by_name($res, ":descr", utf8_decode($data->descricao));
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function excluir($data){
        $data = json_decode($data);
        $error = NULL;
        
        $query = "DELETE situacoes WHERE id_situacao = :idSituacao";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":idSituacao", $data->idSituacao);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
}