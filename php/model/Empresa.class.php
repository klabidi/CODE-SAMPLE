<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Empresa {
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
    
    public function listar(){
        $data = array();
        $error = NULL;
        $login = $this->session->getItem("eagleLogin");
        $empresaUser = $this->session->getItem("eagleEmpresa");
        
        if($login === 'backes'){
            $query = "SELECT * FROM empresas 
                      WHERE ativa = 'T' 
                      ORDER BY nome";
            $res = oci_parse($this->db->getCon(), $query);
        }else{
            $query = "SELECT * FROM empresas 
                      WHERE ativa = 'T' 
                      AND id_empresa = :empresaUser 
                      ORDER BY nome";
            $res = oci_parse($this->db->getCon(), $query);
            oci_bind_by_name($res, ":empresaUser", $empresaUser);
        }
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idEmpresa" => (int)$mod["ID_EMPRESA"],
                    "nome" => utf8_encode($mod["NOME"]),
                    "fantasia" => utf8_encode($mod["FANTASIA"]),
                    "fisicaJuridica" => $mod["FISICA_JURIDICA"],
                    "cpfCnpj" => $mod["CPF_CNPJ"],
                    "endereco" => utf8_encode($mod["ENDERECO"]),
                    "cidade" => utf8_encode($mod["CIDADE"]),
                    "estado" => utf8_encode($mod["ESTADO"]),
                    "cep" => $mod["CEP"],
                    "telefone" => $mod["TELEFONE"],
                    "ativa" => $mod["ATIVA"],
                    "central" => $mod["CENTRAL"],
                    "bloqueio" => $mod["BLOQUEIO"]
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