<?php
error_reporting(0) ;
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Usuario {
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
    
    private function checkSenha($usuario, $senha){
        $retorno = false;
        
        $query = "SELECT login FROM usuarios 
            WHERE id_usuario = :usuario 
            AND senha LIKE :senha";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $usuario);
        oci_bind_by_name($res, ":senha", $senha);
        
        if(@oci_execute($res)){
            $mod = oci_fetch_assoc($res);
            if($mod["LOGIN"] !== NULL){
                $retorno = true;
            }
        }
        
        oci_free_statement($res);
        
        return $retorno;
    }
    
    public function listar($ativo = true){
        $data = array();
        $error = NULL;
        $empresa = $this->session->getItem("eagleEmpresa");
        
        $query = "SELECT * FROM usuarios 
                  WHERE empresa = :empresa
                  ORDER BY nome";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":empresa", $empresa);
        if(!@oci_execute($res)){
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
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function listarG($grupo, $ativo = true){
        $data = array();
        $error = NULL;
        $empresa = $this->session->getItem("eagleEmpresa");
        $fltGrupo = "";
        
        if(!empty($grupo)){
            $fltGrupo = "AND grupo='".$grupo."'";
        }
        
        ###################################################
        ###############        TOTAL       ################
        ###################################################
        
        $query = "SELECT count(*) AS total FROM usuarios 
                  WHERE empresa = :empresa ".$fltGrupo."";
        $res1 = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res1, ":empresa", $empresa);
        @oci_execute($res1);
        $mod1 = oci_fetch_assoc($res1);
        $totalRegistros = $mod1['TOTAL'];
        
        
        ###################################################
        ###############        GRID        ################
        ###################################################
        
        $query = "SELECT * FROM usuarios 
                  WHERE empresa = :empresa
                  ".$fltGrupo."
                  ORDER BY nome";
        
        $query = "SELECT * FROM ( SELECT t1.*, ROWNUM rn FROM ($query) t1 ) WHERE rn BETWEEN ".($_REQUEST['start']+1)." AND " . ($_REQUEST['start']+$_REQUEST['limit']);
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":empresa", $empresa);
        if(!@oci_execute($res)){
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
            "success" => is_null($error),
            "data" => $data,
            "total" => $totalRegistros,
            "error" => $error
        );
    }
    
    public function adicionar($params){
        $error = NULL;
        $nome = utf8_decode($params["nome"]);
        
        $query = "INSERT INTO usuarios (nome, login, senha, email, empresa, central, grupo, ativo) 
            VALUES (:nome, :login, :senha, :email, :empresa, :central, :grupo, :ativo)";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":nome", $nome);
        oci_bind_by_name($res, ":login", $params["login"]);
        oci_bind_by_name($res, ":senha", $params["senha"]);
        oci_bind_by_name($res, ":email", $params["email"]);
        oci_bind_by_name($res, ":empresa", $params["empresa"]);
        oci_bind_by_name($res, ":central", $params["central"]);
        oci_bind_by_name($res, ":grupo", $params["grupo"]);
        oci_bind_by_name($res, ":ativo", $params["ativo"]);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function alterar($params){
        $error = NULL;
        $nome = utf8_decode($params["nome"]);
        
        $query = "UPDATE usuarios SET nome = :nome, 
            login = :login, email = :email, 
            empresa = :empresa, central = :central, 
            grupo = :grupo, ativo = :ativo 
            WHERE id_usuario = :id_usuario";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":id_usuario", $params["idUsuario"]);
        oci_bind_by_name($res, ":nome", $nome);
        oci_bind_by_name($res, ":login", $params["login"]);
        oci_bind_by_name($res, ":email", $params["email"]);
        oci_bind_by_name($res, ":empresa", $params["empresa"]);
        oci_bind_by_name($res, ":central", $params["central"]);
        oci_bind_by_name($res, ":grupo", $params["grupo"]);
        oci_bind_by_name($res, ":ativo", $params["ativo"]);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function listarOperacoes(){
        $query = "SELECT o.id_operacao, o.nome, o.descricao, o.padrao FROM operacoes o, operacoes_usuarios ou 
                WHERE ou.usuario = :usuario AND ou.operacao = o.id_operacao";
        $res = oci_parse($this->db->getCon(), $query);
        
        $usuario = $this->session->getItem("eagleIdUsuario");
        oci_bind_by_name($res, ":usuario", $usuario);
        
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
    
    public function enviarMensagem($to){
        $data = array();
        $error = NULL;
        
        $query = "";
        
        return array(
            "success" => true,
            "data" => $data,
            "error" => $error
        );
    }
    
    public function checkPermissao($modulo){
        $data = array();
        $error = NULL;
        $usuario = $this->session->getItem("eagleIdUsuario");
        
        $query = "SELECT COUNT(*) AS ck FROM usuarios u, permissoes_grupos pg "
                ."WHERE u.id_usuario = :usuario AND u.grupo = pg.grupo AND pg.modulo = :modulo";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $usuario);
        oci_bind_by_name($res, ":modulo", $modulo);
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            $ck = oci_fetch_assoc($res);
            $data[] = array(
                "permissao" => ($ck["CK"]>0)
            );
        }
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "data" => $data
        );
    }
    
    public function checkLogin($login){
        $existe = false;
        $error = NULL;
        
        $query = "SELECT login FROM usuarios WHERE login LIKE :login";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":login", $login);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            $mod = oci_fetch_assoc($res);
            
            if($mod["LOGIN"] !== NULL){
                $existe = true;
            }
        }
        
        return array(
            "success" => is_null($error),
            "existe" => $existe,
            "error" => $error
        );
    }
    
    public function alterarSenha($usuario, $senhaAntiga, $senhaNova){
        $error = NULL;
        
        if(!$this->checkSenha($usuario, $senhaAntiga)){
            return array(
                "success" => false,
                "error" => "senha_invalida"
            );
        }else{
            $query = "UPDATE usuarios SET senha = :senha WHERE id_usuario = :usuario";
            $res = oci_parse($this->db->getCon(), $query);
            oci_bind_by_name($res, "senha", $senhaNova);
            oci_bind_by_name($res, "usuario", $usuario);
            
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
}