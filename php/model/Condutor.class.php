<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Condutor {
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
    
    public function listar($ativo = true){
        $data = array();
        $error = NULL;
        $empresa = $this->session->getItem("eagleEmpresa");
        
        $query = "SELECT e.nome AS nome_empresa, c.empresa, c.id_condutor, c.nome, c.cpf, c.identidade, c.telefone, c.celular, c.data_nascimento, c.matricula, c.ativo, v.placa 
                  FROM condutores c
                  JOIN empresas e ON e.id_empresa = c.empresa
                  LEFT JOIN veiculos v ON v.condutor = c.id_condutor
                  WHERE c.empresa = :empresa 
                  ORDER BY c.nome";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":empresa", $empresa);
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idCondutor" => (int)$mod["ID_CONDUTOR"],
                    "nome" => utf8_encode($mod["NOME"]),
                    "cpf" => $mod["CPF"],
                    "rg" => $mod["IDENTIDADE"],
                    "telefone" => $mod["TELEFONE"],
                    "celular" => $mod["CELULAR"],
                    "data_nascimento" => $mod["DATA_NASCIMENTO"],
                    "matricula" => $mod["MATRICULA"],
                    "empresa" => $mod["NOME_EMPRESA"],
                    "empresaId" => $mod["EMPRESA"],
                    "ativo" => ($mod["ATIVO"] === "T") ? true : false, 
                    "placa" => $mod["PLACA"]
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
    
     public function listarCombobox(){
        $data = array();
        $error = NULL;
        $empresa = $this->session->getItem("eagleEmpresa");
        
        $query = "SELECT c.id_condutor, c.nome 
                  FROM condutores c 
                  JOIN empresas e ON e.id_empresa = c.empresa 
                  LEFT JOIN veiculos v ON v.condutor = c.id_condutor 
                  WHERE c.empresa = :empresa 
                  AND c.ativo = 'T'
                  ORDER BY c.nome";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":empresa", $empresa);
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idCondutor" => (int)$mod["ID_CONDUTOR"],
                    "nome" => utf8_encode($mod["NOME"])
                );
            }
        }
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "data" => $data
        );
    }
    
    public function adicionar($params){
        $error = NULL;
        $nome   = utf8_decode($params["nome"]);
        $sinais = utf8_decode($params["sinais"]);
        $dt_nasc= $params["data_nascimento"];
        
        $query = "INSERT INTO condutores (id_condutor,
                                        nome, 
                                        cpf, 
                                        identidade, 
                                        telefone, 
                                        celular, 
                                        data_nascimento, 
                                        matricula, 
                                        empresa, 
                                        ativo
                              ) VALUES (monitoramento.seq_condutor.NEXTVAL,
                                        :nome, 
                                        :cpf, 
                                        :rg, 
                                        :telefone, 
                                        :celular, 
                                        :data_nascimento, 
                                        :matricula, 
                                        :empresa, 
                                        'T'
                              )";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":nome", $nome);
        oci_bind_by_name($res, ":cpf", $params["cpf"]);
        oci_bind_by_name($res, ":rg", $params["rg"]);
        oci_bind_by_name($res, ":telefone", $params["telefone"]);
        oci_bind_by_name($res, ":celular", $params["celular"]);
        oci_bind_by_name($res, ":data_nascimento", $dt_nasc);
        oci_bind_by_name($res, ":matricula", $params["matricula"]);
        oci_bind_by_name($res, ":empresa", $params["empresa"]);
                
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
        $sinais = utf8_decode($params["sinais"]);
        $ativo  = ($params["ativo"] === true) ? "T" : "F";
        $dt_nasc= $params["data_nascimento"];
                
        $query = "UPDATE condutores SET 
                         nome = :nome, 
                         cpf = :cpf, 
                         identidade = :rg, 
                         telefone = :telefone, 
                         celular = :celular, 
                         data_nascimento = :data_nascimento, 
                         matricula = :matricula, 
                         empresa = :empresa, 
                         ativo = :ativo 
                   WHERE id_condutor = :id_condutor";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":id_condutor", $params["idCondutor"]);
        oci_bind_by_name($res, ":nome", $nome);
        oci_bind_by_name($res, ":cpf", $params["cpf"]);
        oci_bind_by_name($res, ":rg", $params["rg"]);
        oci_bind_by_name($res, ":telefone", $params["telefone"]);
        oci_bind_by_name($res, ":celular", $params["celular"]);
        oci_bind_by_name($res, ":data_nascimento", $dt_nasc);
        oci_bind_by_name($res, ":matricula", $params["matricula"]);
        oci_bind_by_name($res, ":empresa", $params["empresaId"]);
        oci_bind_by_name($res, ":ativo", $ativo);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function excluir($id){
        $error = NULL;
        
        $query = "DELETE FROM condutores WHERE id_condutor = :id_condutor";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":id_condutor", $id);
        
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