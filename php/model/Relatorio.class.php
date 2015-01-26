<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Relatorio{
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
    
    public function listarVeiculosTree(){
        $data = array();
        $usuario = $this->session->getItem("eagleIdUsuario");
        
        $query = "SELECT id_operacao, nome, padrao 
                  FROM operacoes op, operacoes_usuarios ou 
                  WHERE op.id_operacao = ou.operacao 
                  AND ou.usuario = :usuario";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $usuario);
        
        if(oci_execute($res)){
            while($mod = oci_fetch_assoc($res)){
                if($mod["PADRAO"] === "T"){
                    $data[] = array(
                        "id" => (int)$mod["ID_OPERACAO"],
                        "text" => utf8_encode($mod["NOME"]),
                        "type" => "operacao",
                        "children" => $this->getVeiculos((int)$mod["ID_OPERACAO"]),
                        "expanded" => true
                    );
                }else{
                    $data[] = array(
                        "id" => (int)$mod["ID_OPERACAO"],
                        "text" => utf8_encode($mod["NOME"]),
                        "type" => "operacao",
                        "children" => $this->getVeiculos((int)$mod["ID_OPERACAO"])
                    );
                }
            }
        }
        oci_free_statement($res);
        
        return array(
            'success' => true,
            "children" => $data
        );
    }
    
    public function listarUsuariosTree(){
        $data = array();
        $empresa = $this->session->getItem("eagleEmpresa");
        
        $query = "SELECT DISTINCT(id_operacao), nome, padrao 
                    FROM operacoes op, operacoes_usuarios ou 
                    WHERE op.id_operacao = ou.operacao 
                    AND op.empresa=:empresa
                    ORDER BY nome";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":empresa", $empresa);
        
        if(oci_execute($res)){
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "id" => (int)$mod["ID_OPERACAO"],
                    "text" => utf8_encode($mod["NOME"]),
                    "type" => "operacao",
                    "children" => $this->getUsuarios((int)$mod["ID_OPERACAO"]),
                    "expanded" => true
                );
            }
        }
        oci_free_statement($res);
        
        return array(
            'success' => true,
            "children" => $data
        );
    }
    
    private function getVeiculos($operacao){
        $data = array();
        
        if(!is_int($operacao)){
            return $data;
        }
        
        $query = "SELECT placa FROM operacoes_veiculos WHERE operacao = :operacao";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":operacao", $operacao);
        
        if(oci_execute($res)){
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "id" => $mod["PLACA"],
                    "text" => $mod["PLACA"],
                    "leaf" => true
                );
            }
        }
        oci_free_statement($res);
        
        return $data;
    }
    
    private function getUsuarios($operacao){
        $data = array();
        
        if(!is_int($operacao)){
            return $data;
        }
        
        $query = "SELECT usuario, u.nome FROM operacoes_usuarios 
                  JOIN usuarios u ON u.id_usuario = operacoes_usuarios.usuario 
                  WHERE operacao = :operacao"; 
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":operacao", $operacao);
        
        if(oci_execute($res)){
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "id" => $mod["USUARIO"],
                    "text" => $mod["NOME"],
                    "leaf" => true
                );
            }
        }
        oci_free_statement($res);
        
        return $data;
    }
}