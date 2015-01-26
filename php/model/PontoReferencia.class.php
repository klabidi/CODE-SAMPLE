<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class PontoReferencia {
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

        $query = "SELECT r.id_referencia, r.descricao, g.id_referencia_grupo AS grupo, g.nome AS grupo_descricao, r.observacao, r.endereco, r.cidade, r.latitude, r.longitude
                  FROM pontos_referencia r, pontos_referencia_grupos g WHERE r.empresa = :empresa AND g.id_referencia_grupo (+)= r.grupo";
        $res = oci_parse($this->db->getCon(), $query);
        
        $empresa = $this->session->getItem("eagleEmpresa");
        oci_bind_by_name($res, ":empresa", $empresa);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idPontoReferencia" => (int)$mod["ID_REFERENCIA"],
                    "descricao" => utf8_encode(ucwords($mod["DESCRICAO"])),
                    "grupo" => (int)$mod["GRUPO"],
                    "grupoDescricao" => utf8_encode(ucwords($mod["GRUPO_DESCRICAO"])),
                    "observacao" => utf8_encode($mod["OBSERVACAO"]),
                    "endereco" => utf8_encode($mod["ENDERECO"]),
                    "cidade" => utf8_encode($mod["CIDADE"]),
                    "latitude" => str_replace(",", ".", $mod["LATITUDE"]),
                    "longitude" => str_replace(",", ".", $mod["LONGITUDE"])
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
    
    public function listarGrupos(){
        $data = array();
        $error = NULL;

        $query = "SELECT id_referencia_grupo, nome FROM pontos_referencia_grupos WHERE empresa = :empresa";
        $res = oci_parse($this->db->getCon(), $query);
        
        $empresa = $this->session->getItem("eagleEmpresa");
        oci_bind_by_name($res, ":empresa", $empresa);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idReferenciaGrupo" => (int)$mod["ID_REFERENCIA_GRUPO"],
                    "nome" => utf8_encode(ucwords($mod["NOME"]))
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
        $error = null;
        
        $descricao = utf8_decode($data["descricao"]);
        $empresa = (int)$this->session->getItem("eagleEmpresa");
        $grupo = ((int)$data["grupo"] !== 0) ? (int)$data["grupo"] : null;
        $observacao = utf8_decode($data["observacao"]);
        $endereco = utf8_decode($data["endereco"]);
        $cidade = utf8_decode($data["cidade"]);
        $latitude = str_replace(".",",",number_format($data["latitude"], 6));
        $longitude = str_replace(".",",",number_format($data["longitude"], 6));
        
        $query = "INSERT INTO pontos_referencia (id_referencia, descricao, empresa, grupo, observacao, endereco, cidade, latitude, longitude) 
                  VALUES (monitoramento.seq_referencia.nextval, :descricao, :empresa, :grupo, :observacao, :endereco, :cidade, :latitude, :longitude)";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":descricao", $descricao);
        oci_bind_by_name($res, ":empresa", $empresa);
        oci_bind_by_name($res, ":grupo", $grupo);
        oci_bind_by_name($res, ":observacao", $observacao);
        oci_bind_by_name($res, ":endereco", $endereco);
        oci_bind_by_name($res, ":cidade", $cidade);
        oci_bind_by_name($res, ":latitude", $latitude);
        oci_bind_by_name($res, ":longitude", $longitude);
        
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
        $error = null;
        
        $descricao = utf8_decode($data["descricao"]);
        $grupo = ((int)$data["grupo"] !== 0) ? (int)$data["grupo"] : null;
        $observacao = utf8_decode($data["observacao"]);
        $endereco = utf8_decode($data["endereco"]);
        $cidade = utf8_decode($data["cidade"]);
        $latitude = str_replace(".",",",number_format($data["latitude"], 6));
        $longitude = str_replace(".",",",number_format($data["longitude"], 6));
        
        $query = "UPDATE pontos_referencia SET descricao = :descricao, 
            grupo = :grupo, observacao = :observacao, endereco = :endereco, 
            cidade = :cidade, latitude = :latitude, longitude = :longitude 
            WHERE id_referencia = :id";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":id", $data["idPontoReferencia"]);
        oci_bind_by_name($res, ":descricao", $descricao);
        oci_bind_by_name($res, ":grupo", $grupo);
        oci_bind_by_name($res, ":observacao", $observacao);
        oci_bind_by_name($res, ":endereco", $endereco);
        oci_bind_by_name($res, ":cidade", $cidade);
        oci_bind_by_name($res, ":latitude", $latitude);
        oci_bind_by_name($res, ":longitude", $longitude);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function excluir($id){
        $error = null;
        
        $query = "DELETE FROM pontos_referencia WHERE id_referencia = :id";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":id", $id);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function criarGrupos($data){
        $error = null;
        
        $nome = utf8_decode($data["nome"]);
        $empresa = (int)$this->session->getItem("eagleEmpresa");
        
        $query = "INSERT INTO pontos_referencia_grupos (id_referencia_grupo, nome, empresa) 
                  VALUES (monitoramento.seq_grupo_referencia.nextval, :nome, :empresa)";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":nome", $nome);
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
    
    public function editarGrupos($data){
        $error = null;
        
        $id   = (int)$data["idReferenciaGrupo"];
        $nome = utf8_decode($data["nome"]);
        
        $query = "UPDATE pontos_referencia_grupos SET 
                    nome = :nome 
                  WHERE id_referencia_grupo = :id";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":id", $id);
        oci_bind_by_name($res, ":nome", $nome);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function excluirGrupos($id){
        $error = null;
        
        $query = "DELETE FROM pontos_referencia_grupos WHERE id_referencia_grupo = :id";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":id", $id);
        
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