<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Notificacao {
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
    
    public function enviarMensagensUsuarios($usuarios, $mensagem, $resposta){
        $error = NULL;
        $usuarioSessao = $this->session->getItem("eagleIdUsuario");
        
        foreach($usuarios as $usuario){
            
            if(!empty($resposta)){
                
                $queryLOG = "BEGIN PKG_NOTIFICACOES.notifyMessageResponse(
                                :usuarioEnvio,
                                null,
                                :usuarioRecebe,
                                :msg,
                                SYSDATE);
                            END;";
                $resLOG = oci_parse($this->db->getCon(), $queryLOG);
                oci_bind_by_name($resLOG, ":usuarioEnvio", $usuarioSessao);
                oci_bind_by_name($resLOG, ":usuarioRecebe", $usuario);
                oci_bind_by_name($resLOG, ":msg", $mensagem);
                if(!@oci_execute($resLOG)){
                    $error = oci_error($resLOG);
                }
                oci_free_statement($resLOG);
            
            }else{
            
                $query = "BEGIN PKG_NOTIFICACOES.notifyMessageUser(
                            :usuarioEnvio,
                            :usuarioRecebe,
                            :msg);
                          END;";
                $res = oci_parse($this->db->getCon(), $query);
                oci_bind_by_name($res, ":usuarioEnvio", $usuarioSessao);
                oci_bind_by_name($res, ":usuarioRecebe", $usuario);
                oci_bind_by_name($res, ":msg", $mensagem);

                if(!@oci_execute($res)){
                    $error = oci_error($res);
                }
                oci_free_statement($res);
                
            }
            
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function listarMensagens($visualizada = false){
        $data = array();
        $error = NULL;
        $tipo = 2;
        $visualizada = ($visualizada)?"T":"F";
                
        $query = "SELECT * FROM (SELECT n.id_notificacao, 
                      n.tipo, 
                      TO_CHAR(n.data, 'DD/MM/YYYY HH24:MI') AS data_notificacao, 
                      nm.remetente, 
                      nm.mensagem, 
                      nm.placa, 
                      v.frota,
                      nm.usuario 
                FROM notificacoes n, notificacoes_visualizacao nv, notificacoes_mensagens nm, veiculos v 
                WHERE nv.usuario = :usuario 
                AND nv.visualizada = :visualizada 
                AND n.tipo = :tipo 
                AND n.mensagem IS NOT NULL 
                AND nv.notificacao = n.id_notificacao 
                AND n.mensagem = nm.id_notificacao_mensagem 
                AND v.placa (+)= nm.placa ORDER BY n.data DESC) WHERE ROWNUM < 100";
        $res = oci_parse($this->db->getCon(), $query);
        
        $sessionIdUsuario = $this->session->getItem("eagleIdUsuario");
        $bind = oci_bind_by_name($res, ":usuario", $sessionIdUsuario);
        $bind = oci_bind_by_name($res, ":visualizada", $visualizada);
        $bind = oci_bind_by_name($res, ":tipo", $tipo);
        
        if(!@oci_execute($res) || !$bind){
            $error = oci_error($res);
        }else{
            $visualizada = "T";
            $query_cnt = "SELECT COUNT(*) AS cnt FROM notificacoes_visualizacao WHERE notificacao = :notificacao AND visualizada = :visualizada";
            $res_cnt = oci_parse($this->db->getCon(), $query_cnt);
            
            while($mod = oci_fetch_assoc($res)){
                $bind = oci_bind_by_name($res_cnt, ":notificacao", $mod["ID_NOTIFICACAO"]);
                $bind = oci_bind_by_name($res_cnt, ":visualizada", $visualizada);
                
                if(!@oci_execute($res_cnt) || !$bind){
                    $error = oci_error($res_cnt);
                }else{
                    $mod_cnt = oci_fetch_assoc($res_cnt);
                }
                
                $rand = rand(0,100);
                $data[] = array(
                    "idNotificacao" => (int)$mod["ID_NOTIFICACAO"],
                    "tipo" => (int)$mod["TIPO"],
                    "data" => $mod["DATA_NOTIFICACAO"],
                    "visualizada" => false,
                    "visualizacoes" => (int)$mod_cnt["CNT"],
                    "remetente" => utf8_encode($mod["REMETENTE"]),
                    "usuario" => (int)$mod["USUARIO"],
                    "mensagem" => utf8_encode(str_replace("\\n", "<br/>", $mod["MENSAGEM"])),
                    "veiculo" => array(
                        "placa" => $mod["PLACA"],
                        "frota" => $mod["FROTA"]
                    ),
                    "random" => $rand
                );
            }
        }
        oci_free_statement($res_cnt);
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function listarEventos($visualizada = false){
        $data = array();
        $error = NULL;
        $tipo = 1;
        $visualizada = ($visualizada)?"T":"F";
        
        $query = "SELECT n.id_notificacao, 
                      n.tipo, 
                      TO_CHAR(n.data, 'DD/MM/YYYY HH24:MI') AS data_notificacao, 
                      ne.placa, 
                      pkg_eventos.getDescricao(ne.placa,ne.codigo,'R','F') AS descricao, 
                      pkg_eventos.getParametroDescricao(ne.codigo, parametro, 'R', 'F', '<br/>') AS parametro 
                FROM notificacoes n, notificacoes_visualizacao nv, notificacoes_eventos ne 
                WHERE nv.usuario = :usuario 
                AND nv.visualizada = :visualizada 
                AND n.tipo = :tipo 
                AND n.evento IS NOT NULL 
                AND nv.notificacao = n.id_notificacao 
                AND n.evento = ne.id_notificacao_evento";
        $res = oci_parse($this->db->getCon(), $query);
        
        $sessionIdUsuario = $this->session->getItem("eagleIdUsuario");
        $bind = oci_bind_by_name($res, ":usuario", $sessionIdUsuario);
        $bind = oci_bind_by_name($res, ":visualizada", $visualizada);
        $bind = oci_bind_by_name($res, ":tipo", $tipo);
        
        if(!@oci_execute($res) || !$bind){
            $error = oci_error($res);
        }else{
            $visualizada = "T";
            $query_cnt = "SELECT COUNT(*) AS cnt FROM notificacoes_visualizacao WHERE notificacao = :notificacao AND visualizada = :visualizada";
            $res_cnt = oci_parse($this->db->getCon(), $query_cnt);
            
            while($mod = oci_fetch_assoc($res)){
                $bind = oci_bind_by_name($res_cnt, ":notificacao", $mod["ID_NOTIFICACAO"]);
                $bind = oci_bind_by_name($res_cnt, ":visualizada", $visualizada);
                
                if(!@oci_execute($res_cnt) || !$bind){
                    $error = oci_error($res_cnt);
                }else{
                    $mod_cnt = oci_fetch_assoc($res_cnt);
                }
                
                $rand = rand(0,100);
                $data[] = array(
                    "idNotificacao" => (int)$mod["ID_NOTIFICACAO"],
                    "tipo" => (int)$mod["TIPO"],
                    "data" => $mod["DATA_NOTIFICACAO"],
                    "visualizada" => false,
                    "visualizacoes" => (int)$mod_cnt["CNT"],
                    "descricao" => utf8_encode($mod["DESCRICAO"]),
                    "parametro" => utf8_encode(str_replace("\\n", "<br/>", $mod["PARAMETRO"])),
                    "veiculo" => array(
                        "placa" => $mod["PLACA"]
                    ),
                    "random" => $rand
                );
            }
        }
        oci_free_statement($res_cnt);
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function listarInformacoes($visualizada = false){
        $data = array();
        $error = NULL;
        $tipo = 3;
        $visualizada = ($visualizada)?"T":"F";
        
        $query = "SELECT n.id_notificacao, 
                         n.tipo, 
                         TO_CHAR(n.data, 'DD/MM/YYYY HH24:MI') AS data_notificacao,
                         nn.remetente, 
                         nn.descricao, 
                         nn.url 
                   FROM notificacoes n, notificacoes_visualizacao nv, notificacoes_informacoes nn 
                   WHERE nv.usuario = :usuario 
                   AND nv.visualizada = :visualizada 
                   AND n.tipo = :tipo 
                   AND n.informacao IS NOT NULL 
                   AND nv.notificacao = n.id_notificacao 
                   AND n.informacao = nn.id_notificacao_informacao";
        $res = oci_parse($this->db->getCon(), $query);
        
        $sessionIdUsuario = $this->session->getItem("eagleIdUsuario");
        oci_bind_by_name($res, ":usuario", $sessionIdUsuario);
        oci_bind_by_name($res, ":visualizada", $visualizada);
        oci_bind_by_name($res, ":tipo", $tipo);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            $visualizada = "T";
            $query_cnt = "SELECT COUNT(*) AS cnt FROM notificacoes_visualizacao WHERE notificacao = :notificacao AND visualizada = :visualizada";
            $res_cnt = oci_parse($this->db->getCon(), $query_cnt);
            
            while($mod = oci_fetch_assoc($res)){
                $bind = oci_bind_by_name($res_cnt, ":notificacao", $mod["ID_NOTIFICACAO"]);
                $bind = oci_bind_by_name($res_cnt, ":visualizada", $visualizada);
                
                if(!@oci_execute($res_cnt) || !$bind){
                    $error = oci_error($res_cnt);
                }else{
                    $mod_cnt = oci_fetch_assoc($res_cnt);
                }
                
                $rand = rand(0,100);
                $data[] = array(
                    "idNotificacao" => (int)$mod["ID_NOTIFICACAO"],
                    "tipo" => (int)$mod["TIPO"],
                    "data" => $mod["DATA_NOTIFICACAO"],
                    "visualizada" => false,
                    "visualizacoes" => (int)$mod_cnt["CNT"],
                    "remetente" => utf8_encode($mod["REMETENTE"]),
                    "descricao" => utf8_encode($mod["DESCRICAO"]),
                    "url" => $mod["URL"],
                    "random" => $rand
                );
            }
        }
        oci_free_statement($res_cnt);
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function listarVisualizadores($notificacao){
        $data = array();
        $error = NULL;
        $visualizada = "T";
        
        $query = "SELECT u.id_usuario, u.nome, TO_CHAR(nv.data, 'DD/MM HH24:MI') AS data FROM notificacoes_visualizacao nv, usuarios u "
                ."WHERE nv.notificacao = :notificacao AND u.id_usuario = nv.usuario AND nv.visualizada = :visualizada";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":notificacao", $notificacao);
        oci_bind_by_name($res, ":visualizada", $visualizada);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idUsuario" => (int)$mod["ID_USUARIO"],
                    "nome" => $mod["NOME"],
                    "data" => $mod["DATA"]
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
    
    public function getInformacaoAtualizacao($tipo){
        $data = array();
        $error = NULL;
        
        $data[] = $tipo."1234";
        
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function marcarVisualizada($idNotificacao){
        $error = NULL;
        $visualizada = 'T';
        
        $query = "UPDATE notificacoes_visualizacao "
                . "SET visualizada = :visualizada, data = SYSDATE "
                . "WHERE notificacao = :notificacao "
                . "AND usuario = :usuario";
        $res = oci_parse($this->db->getCon(), $query);
        
        $sessionIdUsuario = $this->session->getItem("eagleIdUsuario");
        $bind = oci_bind_by_name($res, ":visualizada", $visualizada);
        $bind = @oci_bind_by_name($res, ":notificacao", $idNotificacao);
        $bind = @oci_bind_by_name($res, ":usuario", $sessionIdUsuario);
        
        if(!@oci_execute($res) || !$bind){
           $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function setLidaTodasMsgs(){
        $sessionIdUsuario   = $this->session->getItem("eagleIdUsuario");
        $error              = NULL;
        $visualizada        = 'F';
        $tipo               = 2;
        
        $query = "SELECT * FROM (SELECT n.id_notificacao 
                  FROM notificacoes n, notificacoes_visualizacao nv, notificacoes_mensagens nm, veiculos v 
                  WHERE nv.usuario = :usuario 
                  AND nv.visualizada = :visualizada 
                  AND n.tipo = :tipo 
                  AND n.mensagem IS NOT NULL 
                  AND nv.notificacao = n.id_notificacao 
                  AND n.mensagem = nm.id_notificacao_mensagem 
                  AND v.placa (+)= nm.placa ORDER BY n.data DESC) WHERE ROWNUM < 100";
        $res = oci_parse($this->db->getCon(), $query);
        
        oci_bind_by_name($res, ":usuario", $sessionIdUsuario);
        oci_bind_by_name($res, ":visualizada", $visualizada);
        oci_bind_by_name($res, ":tipo", $tipo);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
               $this->marcarVisualizada($mod["ID_NOTIFICACAO"]);
            }
        }
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function listarMensagemHistorico($usuarioPlaca){
        $error  = NULL;
        $row    = '';
        $concat = '';
        //$placas   = "AWW2932";
        
        foreach($usuarioPlaca as $row){
            $concat .= "'".$row."',";
        }
        
        $concat = substr($concat,0,-1);
        
        //echo $concat;
        $query =  "SELECT * FROM (
                        SELECT  CASE 
                                  WHEN n.tipo=2 THEN nm.placa 
                                  WHEN n.tipo=4 THEN nm.remetente 
                                END enviado_por, 
                                CASE 
                                  WHEN n.tipo=2 THEN 'Sistema' 
                                  WHEN n.tipo=4 THEN nm.placa 
                                END recebido_por, 
                                nm.mensagem, 
                                TO_CHAR(n.data, 'DD/MM/YYYY HH24:MI') AS data
                        FROM notificacoes_mensagens nm, notificacoes n 
                        WHERE (n.tipo = 2 OR n.tipo = 4) 
                        AND n.mensagem = nm.id_notificacao_mensagem 
                        AND (nm.placa in ($concat) OR nm.usuario in ($concat))
                        ORDER BY n.data
                    ) WHERE ROWNUM < 21";
        //echo $query;
        $res = oci_parse($this->db->getCon(), $query);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
               $data[] = array(
                    "enviado" => $mod["ENVIADO_POR"],
                    "recebido" => $mod["RECEBIDO_POR"],
                    "mensagem" => $mod["MENSAGEM"],
                    "data" => $mod["DATA"]
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

    private function cleanText($string){
	$string = utf8_decode($string);
	$string = strtr($string, "ŠŒŽšœžŸ¥µÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ><´`~^¨@&!?", "SOZsozYYuAAAAAAACEEEEIIIIDNOOOOOOUUUUYsaaaaaaaceeeeiiiionoooooouuuuyy           ");
	$string = preg_replace("@(--|\#|\*|;|=|\'|\")@s", "", $string);
	$string = str_replace("\\", " ", $string);
	$string = trim(preg_replace('/(\\s+)/', ' ', $string));
	return $string;
    }
}