<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class TrocaVisualizacao {
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
    
    public function trocar($usuario, $senha){
        if(!$this->checkSenha($senha)){
            return array(
                "success" => false,
                "error" => "Senha incorreta"
            );
        }
        
        $retorno = false;
        $error = NULL;
        $query = "SELECT * 
                  FROM usuarios 
                  WHERE id_usuario = :usuario";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $usuario);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            $row = oci_fetch_assoc($res);
            
            if($row["ID_USUARIO"] !== NULL){
                $idUsuarioVisualizacao = $this->session->getItem("eagleIdUsuario");
                $this->session->setItem("eagleVisualizacaoIdUsuario", $idUsuarioVisualizacao);
                
                $this->session->setItem("eagleIdUsuario", $row["ID_USUARIO"]);
                $this->session->setItem("eagleNome", $row["NOME"]);
                $this->session->setItem("eagleLogin", $row["LOGIN"]);
                $this->session->setItem("eagleEmpresa", $row["EMPRESA"]);
                $this->session->setItem("eagleEmail", $row["EMAIL"]);
                $this->session->setItem("eagleGrupo", $row["GRUPO"]);
                
                $retorno = true;
            }
        }
        
        return array(
            "success" => is_null($error) && $retorno,
            "error" => $error
        );
    }
    
    public function voltar(){
        $retorno = false;
        $error = NULL;
        $usuario = $this->session->getItem("eagleVisualizacaoIdUsuario");
        $query = "SELECT * 
                  FROM usuarios 
                  WHERE id_usuario = :usuario";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $usuario);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            $row = oci_fetch_assoc($res);
            
            if($row["ID_USUARIO"] !== NULL){
                $this->session->setItem("eagleIdUsuario", $row["ID_USUARIO"]);
                $this->session->setItem("eagleNome", $row["NOME"]);
                $this->session->setItem("eagleLogin", $row["LOGIN"]);
                $this->session->setItem("eagleEmpresa", $row["EMPRESA"]);
                $this->session->setItem("eagleEmail", $row["EMAIL"]);
                $this->session->setItem("eagleGrupo", $row["GRUPO"]);
                
                $this->session->setItem("eagleVisualizacaoIdUsuario", NULL);
                
                $retorno = true;
            }
        }
        
        return array(
            "success" => is_null($error) && $retorno,
            "error" => $error
        );
    }
    
    public function checkSenha($senha){
        $retorno = false;
        $error = NULL;
        $login = $this->session->getItem("eagleLogin");
        $senhamd5 = md5($senha);
                
        $query = "SELECT login 
                  FROM usuarios 
                  WHERE login like :login 
                  AND senha = :senha";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":login", $login);
        oci_bind_by_name($res, ":senha", $senhamd5);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            $row = oci_fetch_assoc($res);
            
            if($row["LOGIN"] === $login){
                $retorno = true;
            }
        }
        
        return $retorno && is_null($error);
    }
    
    public function checkVisualizacao(){
        $visualizacao = !is_null($this->session->getItem("eagleVisualizacaoIdUsuario"));
        
        return array(
            "success" => true,
            "visualizacao" => $visualizacao
        );
    }
}