<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/functions/sql.php");
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class EventoCfg {
    private $db;
    private $session;
    
    public function __construct(){
        $this->db = new OracleCielo();
        $this->session = new Session();
        if (!$this->session->verificarSessao("eagleIdUsuario")) {
            header("Location: ". baseUrl());
        }
    }
    
    public function listar($operacao){
        $data = array();
        $error = NULL;
        $er = "R";
        $acessorio = "F";
        
        $query = "SELECT pkg_eventos.getDescricaoDefault(codigo, 'R', 'F') AS descricao, codigo, situacoes.descricao AS desc_situacao, situacao  
                  FROM notificacoes_eventos_cfg 
                  LEFT JOIN situacoes ON situacoes.id_situacao = notificacoes_eventos_cfg.situacao 
                  WHERE operacao = :operacao";
        $res = oci_parse($this->db->getCon(), $query);
        
        $bind = oci_bind_by_name($res, ":operacao", $operacao);
        
        if(!@oci_execute($res) || !$bind){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "descricao" => utf8_encode($mod["DESCRICAO"]),
                    "codigo"=> (int)$mod["CODIGO"],
                    "operacao"=> (int)$operacao,
                    "desc_situacao" => utf8_encode($mod["DESC_SITUACAO"]),
                    "idSituacao"=> (int)$mod["SITUACAO"],
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
    
    public function listarEventosEmpresa($operacao, $envio=false){
        $data = array();
        $error = NULL;
        $er = ($envio)?"E":"R";
        $cv = "T";
        
        $query = "  SELECT DISTINCT em.descricao, em.codigo, em.com_parametro, em.acessorio, 'F' AS acessorio_interno 
                    FROM monitoramento.evento_modelo em, veiculos v 
                    WHERE v.placa IN (" . sqlPlacasUsuario("empresa") . ") 
                    AND em.modelo = v.modelo_aparelho AND em.enviada_recebida = :er AND em.cliente_visualiza = :cv 
                    AND  em.codigo NOT IN (SELECT distinct(codigo) FROM notificacoes_eventos_cfg WHERE operacao = :operacao) 
                    UNION ALL 
                    SELECT DISTINCT INITCAP(ev.descricao), ev.codigo, ev.com_parametro, ev.acessorio,acessorio_interno 
                    FROM monitoramento.evento_veiculo ev, veiculos v 
                    WHERE ev.placa IN (" . sqlPlacasUsuario("empresa") . ") 
                    AND v.placa = ev.placa AND ev.enviada_recebida = :er AND ev.cliente_visualiza = :cv 
                    AND ev.codigo NOT IN (SELECT codigo FROM notificacoes_mensagens_cfg) 
                    AND ev.codigo NOT IN (SELECT distinct(codigo) FROM notificacoes_eventos_cfg WHERE operacao = :operacao)";
        $res = oci_parse($this->db->getCon(), $query);
        
        $empresa = $this->session->getItem("eagleEmpresa");
        $usuario = $this->session->getItem("eagleIdUsuario");
        oci_bind_by_name($res, ":empresa", $empresa);
        oci_bind_by_name($res, ":usuario", $usuario);
        oci_bind_by_name($res, ":operacao", $operacao);
        oci_bind_by_name($res, ":er", $er);
        oci_bind_by_name($res, ":cv", $cv);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "descricao" => utf8_encode($mod["DESCRICAO"]),
                    "codigo" => (int)$mod["CODIGO"],
                    "acessorio" => ($mod["ACESSORIO"]=="T"),
                    "acessorioInterno" => ($mod["ACESSORIO_INTERNO"]=="T")
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
        $data = json_decode($data);
        
        $operacao   = $data->operacao;
        $codigo     = $data->codigo;
        $idSituacao = $data->idSituacao;
        
        $sql_ins = "INSERT INTO notificacoes_eventos_cfg (operacao, codigo, situacao) VALUES (:operacao, :codigo, :situacao)";	
        $res = oci_parse($this->db->getCon(), $sql_ins);
        
        oci_bind_by_name($res, ":operacao", $operacao);
        oci_bind_by_name($res, ":codigo", $codigo);
        oci_bind_by_name($res, ":situacao", $idSituacao);
        
        
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
        $data = json_decode($data);
        
        $operacao   = $data->operacao;
        $codigo     = $data->codigo;
        
        $sql_ins = "DELETE FROM notificacoes_eventos_cfg WHERE operacao = :operacao AND codigo = :codigo";
        $res = oci_parse($this->db->getCon(), $sql_ins);
        
        $empresa = $this->session->getItem("eagleEmpresa");
        oci_bind_by_name($res, ":operacao", $operacao);
        oci_bind_by_name($res, ":codigo", $codigo);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        oci_free_statement($res);

        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    
    /*******************************/
    
    public function listarMsg($operacao){
        $data = array();
        $error = NULL;
        $er = "R";
        $acessorio = "F";
        
        $query = "SELECT macro, situacoes.descricao AS desc_situacao, situacao  
                  FROM notificacoes_macros_cfg 
                  LEFT JOIN situacoes ON situacoes.id_situacao = notificacoes_macros_cfg.situacao 
                  WHERE operacao = :operacao";
        $res = oci_parse($this->db->getCon(), $query);
        
        $bind = oci_bind_by_name($res, ":operacao", $operacao);
        
        if(!@oci_execute($res) || !$bind){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "macro" => utf8_encode($mod["MACRO"]),
                    "operacao"=> (int)$operacao,
                    "desc_situacao" => utf8_encode($mod["DESC_SITUACAO"]),
                    "idSituacao"=> (int)$mod["SITUACAO"],
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
    
    
    public function inserirMsg($data){
        $data = json_decode($data);
        
        $operacao   = $data->operacao;
        $mensagem   = $data->mensagem;
        $idSituacao = $data->idSituacao;
        
        $sql_ins = "INSERT INTO notificacoes_macros_cfg (operacao, macro, situacao) VALUES (:operacao, :mensagem, :situacao)";	
        $res = oci_parse($this->db->getCon(), $sql_ins);
        
        oci_bind_by_name($res, ":operacao", $operacao);
        oci_bind_by_name($res, ":mensagem", $mensagem);
        oci_bind_by_name($res, ":situacao", $idSituacao);
        
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        oci_free_statement($res);

        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function removerMsg($data){
        $data = json_decode($data);
        
        $operacao   = $data->operacao;
        $macro      = $data->macro;
        
        $sql_ins = "DELETE FROM notificacoes_macros_cfg WHERE operacao = :operacao AND macro = :macro";
        $res = oci_parse($this->db->getCon(), $sql_ins);
        
        $empresa = $this->session->getItem("eagleEmpresa");
        oci_bind_by_name($res, ":operacao", $operacao);
        oci_bind_by_name($res, ":macro", $macro);
        
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