<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Operacao {
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
        
        $data = array();
        $error = NULL;
        $query = "SELECT * FROM ( "
                . "SELECT ROWNUM as linha, operacoes.* FROM operacoes WHERE empresa = :empresa "
                . ") WHERE linha > :inicio AND linha <= :fim";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":empresa", $sessionEmpresa);
        oci_bind_by_name($res, ":inicio", $inicio);
        oci_bind_by_name($res, ":fim", $fim);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idOperacao" => $mod["ID_OPERACAO"],
                    "nome" => utf8_encode($mod["NOME"]),
                    "descricao" => utf8_encode($mod["DESCRICAO"]),
                    "padrao" => ($mod["PADRAO"]==="T")?true:false
                );
            }
        }
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "data" => $data
        );
    }
    
    public function criar($data){
        $data = json_decode($data);
        $error = NULL;
        
        $empresaSession = $this->session->getItem("eagleEmpresa");
        $nome = utf8_decode($data->nome);
        $descricao = utf8_decode($data->descricao);
        
        $query = "INSERT INTO operacoes (nome, descricao, empresa) "
                . "VALUES (:nome, :descricao, :empresa)";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":nome", $nome);        
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
        
        $idOperacao = $data->idOperacao;
        $nome = utf8_decode($data->nome);
        $descricao = utf8_decode($data->descricao);
        
        $query = "UPDATE operacoes "
                . "SET nome = :nome, "
                . "    descricao = :descricao "
                . "WHERE id_operacao = :idOperacao";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":idOperacao", $idOperacao);
        oci_bind_by_name($res, ":nome", $nome);        
        oci_bind_by_name($res, ":descricao", $descricao);
        
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
        
        $query = "DELETE FROM operacoes WHERE id_operacao = :idOperacao";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":idOperacao", $data->idOperacao);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function listarVeiculos($idOperacao){
        $data = array();
        $error = NULL;
        
        $query = "select v.* "
                . "from veiculos v, operacoes_veiculos o "
                . "where o.placa = v.placa "
                . "and o.operacao = :operacao";
        $res = oci_parse($this->db->getCon(), $query);
        $bind = @oci_bind_by_name($res, ":operacao", $idOperacao);
        
        if(!@oci_execute($res) || !$bind){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "placa" => $mod["PLACA"],
                    "marca" => utf8_encode($mod["MARCA_VEICULO"]),
                    "cor" => utf8_encode($mod["COR"]),
                    "empresa" => (int)$mod["EMPRESA"]
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
    
    public function listarUsuarios($idOperacao){
        $data = array();
        $error = NULL;
        
        $query = "select u.* "
                . "from usuarios u, operacoes_usuarios o "
                . "where o.usuario = u.id_usuario "
                . "and o.operacao = :operacao";
        $res = oci_parse($this->db->getCon(), $query);
        $bind = @oci_bind_by_name($res, ":operacao", $idOperacao);
        
        if(!@oci_execute($res) || !$bind){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idUsuario" => (int)$mod["ID_USUARIO"],
                    "nome" => utf8_encode($mod["NOME"]),
                    "login" => $mod["LOGIN"],
                    "email" => $mod["EMAIL"],
                    "empresa" => (int)$mod["EMPRESA"],
                    "central" => (int)$mod["CENTRAL"],
                    "grupo" => (int)$mod["GRUPO"],
                    "ativo" => ($mod["ATIVO"] === "T") ? true : false
                );
            }
        }
        oci_free_statement($res);
        
        return array(
            "data" => $data
        );
    }
    
    public function addVeiculo($idOperacao, $placa){
        $error = NULL;
        $bind = true;
        
        $query = "INSERT INTO operacoes_veiculos (operacao, placa) "
                . "VALUES (:op, :pl)";
        $res = oci_parse($this->db->getCon(), $query);
        
        $bind = @oci_bind_by_name($res, ":op", $idOperacao);
        $bind = @oci_bind_by_name($res, ":pl", $placa);
        
        if(!@oci_execute($res) || !$bind){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function removerVeiculo($idOperacao, $placa){
        $error = NULL;
        $bind = true;
        
        $query = "DELETE FROM operacoes_veiculos "
                . "WHERE operacao = :op AND placa = :pl";
        $res = oci_parse($this->db->getCon(), $query);
        
        $bind = @oci_bind_by_name($res, ":op", $idOperacao);
        $bind = @oci_bind_by_name($res, ":pl", $placa);
        
        if(!@oci_execute($res) || !$bind){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function addUsuario($idOperacao, $usuario){
        $error = NULL;
        $bind = true;
        
        $query = "INSERT INTO operacoes_usuarios (operacao, usuario) "
                . "VALUES (:op, :us)";
        $res = oci_parse($this->db->getCon(), $query);
        
        $bind = @oci_bind_by_name($res, ":op", $idOperacao);
        $bind = @oci_bind_by_name($res, ":us", $usuario);
        
        if(!@oci_execute($res) || !$bind){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function removerUsuario($idOperacao, $usuario){
        $error = NULL;
        $bind = true;
        
        $query = "DELETE FROM operacoes_usuarios "
                . "WHERE operacao = :op AND usuario = :us";
        $res = oci_parse($this->db->getCon(), $query);
        
        $bind = @oci_bind_by_name($res, ":op", $idOperacao);
        $bind = @oci_bind_by_name($res, ":us", $usuario);
        
        if(!@oci_execute($res) || !$bind){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
}