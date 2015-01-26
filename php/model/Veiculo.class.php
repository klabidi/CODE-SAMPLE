<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/functions/sql.php");
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Veiculo {
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
    
    public function listarTeclado(){
        $data = array();
        $error = NULL;
        $er = "R";

        $query = "SELECT UNIQUE ov.placa FROM operacoes_veiculos ov, operacoes_usuarios ou, monitoramento.evento_veiculo ev
                  WHERE ev.placa = ov.placa AND ov.operacao = ou.operacao AND ev.enviada_recebida = :er 
                  AND ou.usuario = :usuario AND ev.codigo IN (SELECT codigo FROM notificacoes_mensagens_cfg)";
        $res = oci_parse($this->db->getCon(), $query);
        
        $usuario = $this->session->getItem("eagleIdUsuario");
        $bind = oci_bind_by_name($res, ":usuario", $usuario);
        $bind = oci_bind_by_name($res, ":er", $er);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
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
    
    public function listarUsuario(){
        $data = array();
        $error = NULL;

        $query = sqlPlacasUsuario();
        $res = oci_parse($this->db->getCon(), $query);
        
        $usuario = $this->session->getItem("eagleIdUsuario");
        $bind = oci_bind_by_name($res, ":usuario", $usuario);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
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
    
    public function listarUsuarioCompleto(){
        $data = array();
        $error = NULL;

        $query = "SELECT ov.placa, v.frota, v.serial, v.marca_veiculo, c.nome AS condutor, v.ultima_conexao 
                  FROM operacoes_veiculos ov, operacoes_usuarios ou, condutores c, veiculos v
                  WHERE ov.operacao = ou.operacao AND ou.usuario = :usuario AND c.id_condutor (+)=  v.condutor AND ov.placa = v.placa";
        $res = oci_parse($this->db->getCon(), $query);
        
        $usuario = $this->session->getItem("eagleIdUsuario");
        $bind = oci_bind_by_name($res, ":usuario", $usuario);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "placa" => $mod["PLACA"],
                    "frota" => $mod["FROTA"],
                    "serial" => $mod["SERIAL"],
                    "marca" => $mod["MARCA_VEICULO"],
                    "condutor" => $mod["CONDUTOR"],
                    "ultima_conexao" => $mod["ULTIMA_CONEXAO"]
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
    
    public function listarEmpresa(){
        $data = array();
        $error = NULL;

        $query = "SELECT ve.placa FROM monitoramento.veiculo_empresa ve, usuarios u 
                  WHERE ve.empresa = u.empresa AND u.id_usuario = :usuario AND ve.empresa = :empresa";
        $res = oci_parse($this->db->getCon(), $query);
        
        $empresa = $this->session->getItem("eagleEmpresa");
        $usuario = $this->session->getItem("eagleIdUsuario");
        $bind = oci_bind_by_name($res, ":empresa", $empresa);
        $bind = oci_bind_by_name($res, ":usuario", $usuario);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
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
    
    public function listarEmpresaCompleto(){
        $data = array();
        $error = NULL;

        $query = "SELECT v.placa, v.frota, v.serial, v.marca_veiculo, c.nome AS condutor, v.ultima_conexao 
                  FROM condutores c, veiculos v, usuarios u, monitoramento.veiculo_empresa ve WHERE c.id_condutor (+)=  v.condutor AND u.empresa = ve.empresa 
                  AND ve.empresa = :empresa AND u.id_usuario = :usuario AND v.placa = ve.placa";
        $res = oci_parse($this->db->getCon(), $query);
        
        $empresa = $this->session->getItem("eagleEmpresa");
        $usuario = $this->session->getItem("eagleIdUsuario");
        $bind = oci_bind_by_name($res, ":empresa", $empresa);
        $bind = oci_bind_by_name($res, ":usuario", $usuario);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "placa" => $mod["PLACA"],
                    "frota" => $mod["FROTA"],
                    "serial" => $mod["SERIAL"],
                    "marca" => $mod["MARCA_VEICULO"],
                    "condutor" => $mod["CONDUTOR"],
                    "ultima_conexao" => $mod["ULTIMA_CONEXAO"]
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
    
    public function listarInformacoes($placa){
        $data = array();
        $data_a = array();
        $error = NULL;

        $query = "  SELECT v.placa, v.serial, e.nome AS empresa, v.marca_veiculo AS marca, v.cor, c.nome AS condutor, 
                    v.frota, m.nome AS aparelho, CASE WHEN v.satelite IS NULL THEN 'Não' ELSE 'Sim' END AS satelital
                    FROM veiculos v, condutores c, empresas e, monitoramento.modelo_aparelho m
                    WHERE v.placa = :placa AND v.condutor (+)= c.id_condutor AND v.empresa = e.id_empresa AND v.modelo_aparelho = m.id_modelo";
        $res = oci_parse($this->db->getCon(), $query);
        @oci_bind_by_name($res, ":placa", $placa);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            $query_a = "SELECT DISTINCT a.descricao FROM monitoramento.evento_veiculo ev, monitoramento.acessorios a
                        WHERE ev.placa = :placa AND ev.acessorio_id = a.id_acessorio";
            $res_a = oci_parse($this->db->getCon(), $query_a);
            @oci_bind_by_name($res_a, ":placa", $placa);
            
            if(!@oci_execute($res_a)){
                $error = oci_error($res_a);
            }else{
                while($mod_a = oci_fetch_assoc($res_a)){
                    $data_a[] = array(
                        "descricao" => utf8_encode($mod_a["DESCRICAO"])
                    );
                }
            }
            oci_free_statement($res_a);
            
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "placa" => $mod["PLACA"],
                    "serial" => $mod["SERIAL"],
                    "frota" => $mod["FROTA"],
                    "empresa" => utf8_encode($mod["EMPRESA"]),
                    "marca" => utf8_encode($mod["MARCA"]),
                    "cor" => utf8_encode(ucwords($mod["COR"])),
                    "condutor" => utf8_encode(ucwords($mod["CONDUTOR"])),
                    "aparelho" => utf8_encode($mod["APARELHO"]),
                    "acessorios" => $data_a,
                    "satelital" => ($mod["SATELITAL"]=="T")
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
    
    public function listarComandos($placa){
        $data = array();
        $error = NULL;
        $er = "E";
        $cv = "T";

        $query = "  SELECT em.gprs, em.satelite, em.descricao, em.codigo, em.com_parametro, em.acessorio, 'F' AS acessorio_interno
                    FROM monitoramento.evento_modelo em, veiculos v
                    WHERE v.placa = :placa AND em.modelo = v.modelo_aparelho AND em.enviada_recebida = :er AND em.cliente_visualiza = :cv
                    UNION ALL
                    SELECT ev.gprs, ev.satelite, ev.descricao, ev.codigo , ev.com_parametro, ev.acessorio,acessorio_interno
                    FROM monitoramento.evento_veiculo ev, veiculos v
                    WHERE ev.placa = :placa AND v.placa = ev.placa AND ev.enviada_recebida = :er AND ev.cliente_visualiza = :cv
                    AND ev.codigo NOT IN (SELECT codigo FROM notificacoes_mensagens_cfg)";
        $res = oci_parse($this->db->getCon(), $query);
        @oci_bind_by_name($res, ":placa", $placa);
        @oci_bind_by_name($res, ":er", $er);
        @oci_bind_by_name($res, ":cv", $cv);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            $query_p = "SELECT descricao, tamanho, sequencia FROM monitoramento.parametro_formatacao 
                        WHERE codigo = :codigo AND acessorio = :acessorio AND enviada_recebida = :er ORDER BY sequencia";
            $res_p = oci_parse($this->db->getCon(), $query_p);
            
            while($mod = oci_fetch_assoc($res)){
                $data_p = array();
                oci_bind_by_name($res_p, ":codigo", $mod["CODIGO"]);
                oci_bind_by_name($res_p, ":acessorio", $mod["ACESSORIO"]);
                oci_bind_by_name($res_p, ":er", $er);
                
                if(!@oci_execute($res_p)){
                    $error = oci_error($res_p);
                }else{
                    while($mod_p = oci_fetch_assoc($res_p)){
                        $data_p[] = array(
                            "descricao" => utf8_encode($mod_p["DESCRICAO"]),
                            "tamanho" => (int)$mod_p["TAMANHO"],
                            "sequencia" => (int)$mod_p["SEQUENCIA"],
                        );
                    }
                }
                
                $data[] = array(
                    "descricao" => utf8_encode($mod["DESCRICAO"]),
                    "codigo" => (int)$mod["CODIGO"],
                    "parametros" => $data_p,
                    "acessorio" => ($mod["ACESSORIO"]=="T"),
                    "acessorioInterno" => ($mod["ACESSORIO_INTERNO"]=="T"),
                    "satelite" => ($mod["SATELITE"]=="T")
                );
            }
            oci_free_statement($res_p);
        }
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function enviarComando($placa, $codigo, $parametros, $acessorio, $acessorioInterno, $satelite){
        $fim = "#";
        $satelite = ($satelite)?"T":"F";
        $conexao=($codigo==90 && $acessorio)?"S":"G";
        $usuario = strtoupper($this->session->getItem("eagleLogin"));

        if($codigo>99){
                if($acessorio){
                    $acessorio = "T";
                    $inicio = ($acessorioInterno)?"(":"~";
                }
                else {
                    $acessorio = "T";
                    $inicio = "]";
                }
        }
        else{
            if($acessorio){
                $acessorio = "T";
                $inicio = ($acessorioInterno)?")":"@";
            }
            else {
                $acessorio = "T";
                $inicio = ">";
            }
        }
        $codigo = ($codigo>99)?sprintf('%04d', $codigo):sprintf('%02d', $codigo);
        $codigo .= $inicio;

        $query_m = "SELECT m.fabricante FROM veiculos v, monitoramento.modelo_aparelho m ".
                   "WHERE m.id_modelo = v.modelo_aparelho AND v.placa = :placa";
        $res_m = oci_parse($this->db->getCon(), $query_m);
        oci_bind_by_name($res_m, ":placa", $placa);

        if(!@oci_execute($res_m)){
            $error = oci_error($res_m);
        }else{
            $mod_m = oci_fetch_assoc($res_m);
            $sep = ($mod_m["FABRICANTE"]==2||$mod_m["FABRICANTE"]==6)?",":"";
            $parametro = (is_array($parametros))?implode($sep, $parametros):null;

            $sql_ins = "INSERT INTO monitoramento.msg (id_msg, placa, inicio, mensagem, fim, data_db, requerente, acessorio, tipo_conexao, sat)
                        VALUES (monitoramento.seq_msg.nextval, :placa, :codigo, :mensagem, :fim, SYSDATE, :usuario, :acessorio, :conexao, :satelite)";	
            $res_ins = oci_parse($this->db->getCon(), $sql_ins);
            oci_bind_by_name($res_ins, ":placa", $placa);
            oci_bind_by_name($res_ins, ":codigo", $codigo);
            oci_bind_by_name($res_ins, ":mensagem", $parametro);
            oci_bind_by_name($res_ins, ":fim", $fim);
            oci_bind_by_name($res_ins, ":usuario", $usuario);
            oci_bind_by_name($res_ins, ":acessorio", $acessorio);
            oci_bind_by_name($res_ins, ":conexao", $conexao);
            oci_bind_by_name($res_ins, ":satelite", $satelite);

            if(!@oci_execute($res_ins)){
                $error = oci_error($res_ins);
            }
        }
        oci_free_statement($res_m);

        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function listarComandosEspera($placa = NULL){
        $data = array();
        $error = NULL;
        
        if($placa !== NULL){
            $query = "  SELECT id_msg, placa, requerente, sat, TO_CHAR(data_sys, 'DD/MM/YYYY HH24:MI') AS data_hora,
                        pkg_eventos.getDescricao(placa, TO_NUMBER(TRIM(TRANSLATE(inicio,'(~]@>',' '))), 'E', acessorio) AS comando, 
                        pkg_eventos.getParametroDescricao(TO_NUMBER(TRIM(TRANSLATE(inicio,'(~]@>',' '))), mensagem, 'E', acessorio, '<br>') AS parametro
                        FROM monitoramento.msg WHERE placa IN (
                          SELECT ov.placa FROM operacoes_veiculos ov, operacoes_usuarios ou
                          WHERE ov.operacao = ou.operacao AND ou.usuario = :usuario 
                          AND ov.placa LIKE :placa
                        )";
        }else{
            $query = "  SELECT id_msg, placa, requerente, sat, TO_CHAR(data_sys, 'DD/MM/YYYY HH24:MI') AS data_hora,
                        pkg_eventos.getDescricao(placa, TO_NUMBER(TRIM(TRANSLATE(inicio,'(~]@>',' '))), 'E', acessorio) AS comando, 
                        pkg_eventos.getParametroDescricao(TO_NUMBER(TRIM(TRANSLATE(inicio,'(~]@>',' '))), mensagem, 'E', acessorio, '<br>') AS parametro
                        FROM monitoramento.msg WHERE placa IN (
                          SELECT ov.placa FROM operacoes_veiculos ov, operacoes_usuarios ou
                          WHERE ov.operacao = ou.operacao AND ou.usuario = :usuario
                        )";
        }
        
        $usuario = $this->session->getItem("eagleIdUsuario");
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $usuario);
        
        if($placa !== NULL){
            oci_bind_by_name($res, ":placa", $placa);
        }
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idComando" => (int)$mod["ID_MSG"],
                    "placa" => $mod["PLACA"],
                    "comando" => $mod["COMANDO"],
                    "parametro" => $mod["PARAMETRO"],
                    "data" => $mod["DATA_HORA"],
                    "requerente" => $mod["REQUERENTE"],
                    "satelite" => ($mod["SAT"]=="T")
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
    
    public function listarOperacao($operacao){
        $data = array();
        $error = NULL;
        $usuario = $this->session->getItem("eagleIdUsuario");
        
        $query = "SELECT ov.placa 
                  FROM operacoes_veiculos ov, operacoes_usuarios ou
                  WHERE ov.operacao = ou.operacao 
                  AND ou.usuario = :usuario 
                  AND ov.operacao = :operacao";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $usuario);
        oci_bind_by_name($res, ":operacao", $operacao);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
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
    
    /***************************************************************************************************/
    public function listar($ativo = true){
        $data = array();
        $error = NULL;
        $empresa = $this->session->getItem("eagleEmpresa");
        
        $query = "SELECT e.nome AS nome_empresa, c.nome AS nome_condutor, v.placa, v.serial, v.modelo_aparelho, v.marca_veiculo, v.cor, v.central, v.satelite, v.frota, v.ultima_conexao 
                  FROM veiculos v 
                  JOIN empresas e ON e.id_empresa = v.empresa 
                  LEFT JOIN condutores c ON v.condutor = c.id_condutor 
                  WHERE v.empresa = :empresa 
                  ORDER BY v.placa";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":empresa", $empresa);
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "placa" => $mod["PLACA"],
                    "frota" => $mod["FROTA"],
                    "serial" => $mod["SERIAL"],
                    "marca" => $mod["MARCA_VEICULO"],
                    "condutor" => $mod["NOME_CONDUTOR"],
                    "empresa" => $mod["NOME_EMPRESA"],
                    "cor" => $mod["COR"],
                    "central" => $mod["CENTRAL"],
                    "satelite" => $mod["SATELITE"],
                    "ultimaConexao" => $mod["ULTIMA_CONEXAO"]
                    //"ativo" => ($mod["ATIVO"] === "T") ? true : false, 
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
    
    public function adicionar($params){
        $error = NULL;
        
        $query = "INSERT INTO veiculos (placa,
                                        serial, 
                                        empresa, 
                                        modelo_aparelho, 
                                        marca_veiculo, 
                                        cor, 
                                        condutor, 
                                        central, 
                                        satelite, 
                                        frota,
                                        ultima_posicao
                              ) VALUES (:placa, 
                                        :serial, 
                                        :empresa, 
                                        '', 
                                        :marca_veiculo, 
                                        :cor, 
                                        :condutor, 
                                        :central,
                                        :satelite,
                                        :frota,
                                        ''
                              )";
        
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":placa", $params["placa"]);
        oci_bind_by_name($res, ":serial", $params["serial"]);
        oci_bind_by_name($res, ":empresa", $params["empresa"]);
        oci_bind_by_name($res, ":marca_veiculo", $params["marca_veiculo"]);
        oci_bind_by_name($res, ":cor", $params["cor"]);
        oci_bind_by_name($res, ":condutor", $params["condutor"]);
        oci_bind_by_name($res, ":central", $params["central"]);
        oci_bind_by_name($res, ":satelite", $params["satelite"]);
        oci_bind_by_name($res, ":frota", $params["frota"]);
                
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
        $ativo  = ($params["ativo"] === true) ? "T" : "F";
                
        $query = "UPDATE veiculos SET 
                         placa          = :placa, 
                         serial         = :serial, 
                         empresa        = :empresa, 
                         marca_veiculo  = :marca_veiculo, 
                         cor            = :cor, 
                         condutor       = :condutor, 
                         central        = :central, 
                         satelite       = :satelite, 
                         frota          = :frota 
                   WHERE placa = :placa";
        
        $res = oci_parse($this->db->getCon(), $query);
         oci_bind_by_name($res, ":placa", $params["placa"]);
        oci_bind_by_name($res, ":serial", $params["serial"]);
        oci_bind_by_name($res, ":empresa", $params["empresa"]);
        oci_bind_by_name($res, ":marca_veiculo", $params["marca_veiculo"]);
        oci_bind_by_name($res, ":cor", $params["cor"]);
        oci_bind_by_name($res, ":condutor", $params["condutor"]);
        oci_bind_by_name($res, ":central", $params["central"]);
        oci_bind_by_name($res, ":satelite", $params["satelite"]);
        oci_bind_by_name($res, ":frota", $params["frota"]);
        
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