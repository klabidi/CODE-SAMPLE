<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Teclado {
    private $db;
    private $session;
    private static $TextType  = 1; // Mensagem de Text Livre
    private static $MacroType = 2; // Mensagem deve ser numero com 2 digitos (Ex:01)
    private static $AnswType  = 3; // Mensagem deve ser Texto Livre + As Perguntas Concatenadas por &;
    
    public function __construct(){
        $this->db = new OracleCielo();
        $this->session = new Session();
        
        // Se a sessão não estiver salva redireciona para a tela de login
        if (!$this->session->verificarSessao("eagleIdUsuario")) {
            header("Location: " .  baseUrl());
        }
    }
    
    public function listarVeiculosTeclado(){
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
    
    public function listarMacros($placa = null, $envio = true){
        $data = array();
        $error = NULL;
        $er = ($envio)?"E":"R";
        $usuario = $this->session->getItem("eagleIdUsuario");
        
        if($placa == null){
            $query = "  SELECT DISTINCT mensagem AS msg FROM monitoramento.mensagem_alfa 
                        WHERE enviada_recebida = :er AND placa IN (
                          SELECT ov.placa FROM operacoes_veiculos ov, operacoes_usuarios ou
                          WHERE ov.operacao = ou.operacao AND ou.usuario = :usuario 
                        )";
            $res = oci_parse($this->db->getCon(), $query);
            @oci_bind_by_name($res, ":usuario", $usuario);
            @oci_bind_by_name($res, ":er", $er);
        }
        else{
            $query = "SELECT mensagem AS msg, n_msg AS macro FROM monitoramento.mensagem_alfa 
                      WHERE enviada_recebida = :er AND placa = :placa ORDER BY n_msg";
            $res = oci_parse($this->db->getCon(), $query);
            @oci_bind_by_name($res, ":placa", $placa);
            @oci_bind_by_name($res, ":er", $er);
        }
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "macro" => sprintf('%02d',$mod["MACRO"]),
                    "mensagem" => $mod["MSG"]
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
    
    public function enviarMensagensVeiculos($placas, $mensagem, $tipo, $satelite = false){
        $data = array();
        $error = NULL;
        $usuario = strtoupper($this->session->getItem("eagleLogin"));
        $usuarioSessao = $this->session->getItem("eagleIdUsuario");
        $mensagem = utf8_decode($mensagem);
        
        $t1=4; $t2=5;
        $fim = "#"; $acess = "T"; $con = "G"; 
        $sat = ($satelite)?"T":"F";
        
        $query_vtec = "SELECT va.acessorio AS versao FROM monitoramento.veiculo_acessorio va, monitoramento.acessorios ac
                       WHERE ac.id_acessorio = va.acessorio AND va.placa = :placa AND (ac.tipo_acessorio = :t1 or ac.tipo_acessorio = :t2)";
        $res_vtec = oci_parse($this->db->getCon(), $query_vtec);
        
        $queryLOG = "BEGIN PKG_NOTIFICACOES.notifyMessageResponse(
                        :usuarioEnvio,
                        :placa,
                        '',
                        :msg,
                        SYSDATE);
                      END;";
        
        $sql_ins = "INSERT INTO monitoramento.msg (id_msg, placa, inicio, mensagem, fim, data_db, requerente, acessorio, tipo_conexao, sat)
                    VALUES (monitoramento.seq_msg.nextval, :placa, :codigo, :mensagem, :fim, SYSDATE, :usuario, :acessorio, :conexao, :satelite)";	
        $res_ins = oci_parse($this->db->getCon(), $sql_ins);
        
        foreach($placas as $placa){
            oci_bind_by_name($res_vtec, ":placa", $placa);
            oci_bind_by_name($res_vtec, ":t1", $t1);
            oci_bind_by_name($res_vtec, ":t2", $t2);
            
            $resLOG = oci_parse($this->db->getCon(), $queryLOG);
            oci_bind_by_name($resLOG, ":usuarioEnvio", $usuarioSessao);
            oci_bind_by_name($resLOG, ":placa", $placa);
            oci_bind_by_name($resLOG, ":msg", $mensagem);
            @oci_execute($resLOG);
            
            if(!@oci_execute($res_vtec)){
                 $error = oci_error($res_vtec);
            }else{
                $mod_vtec = oci_fetch_assoc($res_vtec);

                if($mod_vtec['VERSAO']==3||$mod_vtec['VERSAO']==4){
                    if($tipo != Teclado::$TextType){
                        $error = "Tipo Inválido p/ Placa: ".$placa;
                        break;
                    } 
                    $cod = "05@"; 
                    //$msg = date("Hidm").$this->cleanText($mensagem);
                    $msg = date("Hidm").$mensagem;
                    oci_bind_by_name($res_ins, ":codigo", $cod);
                    oci_bind_by_name($res_ins, ":mensagem", $msg);
                }
                elseif($mod_vtec['VERSAO']==24||$mod_vtec['VERSAO']>=31){
                    if($tipo != Teclado::$TextType)
                        $cod = "0400~"; 
                    elseif($tipo != Teclado::$MacroType)
                        $cod = "0401~"; 
                    elseif($tipo != Teclado::$AnswType)
                        $cod = "0402~";
                    else{
                        $error = "Tipo Inválido p/ Placa: ".$placa;
                        break;
                    }
                    //$msg = date("Hidm").$this->cleanText($mensagem);
                    $msg = date("Hidm").$mensagem;
                    oci_bind_by_name($res_ins, ":codigo", $cod);
                    oci_bind_by_name($res_ins, ":mensagem", $msg);
                }
                else{
                    if($tipo != Teclado::$TextType)
                        $mark = "00"; 
                    elseif($tipo != Teclado::$MacroType)
                        $mark = "00"; 
                    elseif($tipo != Teclado::$AnswType)
                        $mark = "01"; 
                    else{
                        $error = "Tipo Inválido p/ Placa: ".$placa;
                        break;
                    }
                    $cod = "26@";
                    //$msg = $mark.date("Hidm").$this->cleanText($mensagem);
                    $msg = $mark.date("Hidm").$mensagem;
                    oci_bind_by_name($res_ins, ":codigo", $cod);
                    oci_bind_by_name($res_ins, ":mensagem", $msg);
                }

                oci_bind_by_name($res_ins, ":placa", $placa);
                oci_bind_by_name($res_ins, ":fim", $fim);
                oci_bind_by_name($res_ins, ":usuario", $usuario);
                oci_bind_by_name($res_ins, ":acessorio", $acess);
                oci_bind_by_name($res_ins, ":conexao", $con);
                oci_bind_by_name($res_ins, ":satelite", $sat);
                
                if(!@oci_execute($res_ins)){
                    $error = oci_error($res_ins);
                    break;
                }
            }
	}
        oci_free_statement($res_vtec);
        oci_free_statement($res_ins);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }

}