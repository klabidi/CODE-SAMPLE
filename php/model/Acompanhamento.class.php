<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");
include(documentRoot() . "/viewport/php/util/GeoCielo.class.php");

class Acompanhamento {
    private $db;
    private $session;
    private $geo;

    public function __construct() {
        $this->db = new OracleCielo();
        $this->session = new Session();
        $this->geo = new GeoCielo($this->db->getCon());
        if (!$this->session->verificarSessao("eagleIdUsuario")) {
            header("Location: ". baseUrl());
        }
    }
    
    public function listar($operacao) {
        $data = array();
        $usuarioSessao = $this->session->getItem("eagleIdUsuario");
        $error = NULL;
        
        $query = "  SELECT vs.placa, s.descricao AS situacao, TO_CHAR(vs.data_inicio, 'DD/MM/YYYY HH24:MI') AS data_inicio, to_char(NVL(vs.data_fim, SYSDATE), 'DD/MM/YYYY HH24:mi') AS data_fim,
                           c.nome AS condutor, pkg_eventos.getDescricao(vs.placa, ne.codigo, 'R', 'F') AS evento, ne.parametro, nm.mensagem, u.nome AS usuario
                    FROM veiculos_situacoes vs, situacoes s, notificacoes n, notificacoes_eventos ne, notificacoes_mensagens nm, usuarios u, condutores c, veiculos v
                    WHERE vs.ultima = 'T' AND s.id_situacao = vs.situacao AND n.id_notificacao (+)= vs.notificacao AND v.placa = vs.placa AND c.id_condutor (+)= v.condutor
                    AND ne.id_notificacao_evento (+)= n.evento AND nm.id_notificacao_mensagem (+)= n.mensagem
                    AND u.id_usuario (+)= vs.usuario AND vs.placa IN (
                          SELECT ov.placa FROM operacoes_veiculos ov, operacoes_usuarios ou, rotas r, monitoramento.veiculo_ult_registros vu
                          WHERE ov.operacao = ou.operacao AND ou.usuario = :usuario AND ou.operacao = :operacao AND r.placa = ov.placa
                          AND vu.placa = ov.placa 
                    )";
        
        $res =  oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $usuarioSessao);
        oci_bind_by_name($res, ":operacao", $operacao);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "placa" => $mod["PLACA"],
                    "situacao" => utf8_encode($mod["SITUACAO"]),
                    "data_inicio" => $mod["DATA_INICIO"],
                    "data_fim" => $mod["DATA_FIM"],
                    "evento" => utf8_encode($mod["EVENTO"]),
                    "parametro" => $mod["PARAMETRO"],
                    "mensagem" => $mod["MENSAGEM"],
                    "condutor" => ucwords(strtolower($mod["CONDUTOR"])),
                    "usuario" => $mod["USUARIO"]
                );
            }
        }
        oci_free_statement($res);
        
        //echo $this->getDiferencaDatas("01/10/2010 10:00", "10/11/2010 11:00");
        
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function listarDetalhado($placa) {
        $data   = array();
        $error  = NULL;
        $er     = "R";
        $ac     = "F";
        $ultima = "T";
                
        $query = "SELECT vs.placa, s.descricao AS situacao, TO_CHAR(vs.data_inicio, 'DD/MM/YYYY HH24:MI') AS data_inicio, to_char(NVL(vs.data_fim, SYSDATE), 'DD/MM/YYYY HH24:mi') AS data_fim, 
                         pkg_eventos.getDescricao(vs.placa, ne.codigo, :er, :ac) AS evento, ne.parametro, nm.mensagem 
                  FROM veiculos_situacoes vs, situacoes s, notificacoes n, notificacoes_eventos ne, notificacoes_mensagens nm, usuarios u 
                  WHERE s.id_situacao = vs.situacao AND n.id_notificacao (+)= vs.notificacao AND ne.id_notificacao_evento (+)= n.evento 
                  AND nm.id_notificacao_mensagem (+)= n.mensagem AND u.id_usuario (+)= vs.usuario AND vs.placa = :placa 
                  AND data_inicio > (
                    SELECT TO_DATE(TO_CHAR(data_inicio,'DDMMYYYY'),'DDMMYYYY') FROM veiculos_situacoes WHERE placa = vs.placa AND ultima = :ultima
                  )";

        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":placa", $placa);
        oci_bind_by_name($res, ":er", $er);
        oci_bind_by_name($res, ":ac", $ac);
        oci_bind_by_name($res, ":ultima", $ultima);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
               $data[] = array(
                    "placa" => $mod["PLACA"],
                    "situacao" => utf8_encode($mod["SITUACAO"]),
                    "data_inicio" => $mod["DATA_INICIO"],
                    "data_fim" => $mod["DATA_FIM"],
                    "evento" => utf8_encode($mod["EVENTO"]),
                    "parametro" => $mod["PARAMETRO"],
                    "mensagem" => $mod["MENSAGEM"],
                    "condutor" => ucwords(strtolower($mod["CONDUTOR"])),
                    "usuario" => $mod["USUARIO"]
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
    
    public function getDiferencaDatas($data_ini, $data_fim) {
        
        // Define os valores a serem usados
        /*$dt_ini = date("d/m/Y", strtotime($data_ini));
        $dt_fim = date("d/m/Y", strtotime($data_fim));*/
        $dt_ini = $data_ini;
        $dt_fim = $data_fim;
        $hr_ini = date("H:i", strtotime($data_ini));
        $hr_fim = date("H:i", strtotime($data_fim));
        /*$hr_ini = date("H:i", strtotime($data_ini));
        $hr_fim = date("H:i", strtotime($data_fim));
        */
        /* caucula diferença dos dias*/
        
        $time_inicial = $this->geraTimestamp($dt_ini);
        
        $time_final = $this->geraTimestamp($dt_fim);
        
        $diferenca = $time_final - $time_inicial; // 19522800 segundos
        
        $dias = (int)floor( $diferenca / (60 * 60 * 24)); // 225 dias
        
        /* caucula diferença das horas*/
        
        // Converte as duas datas para um objeto DateTime do PHP
        // PARA O PHP 5.3 OU SUPERIOR
        $inicio = DateTime::createFromFormat('H:i', $hr_ini);
        // PARA O PHP 5.2
        //$inicio = date_create_from_format('H:i', $hr_ini);

        $fim = DateTime::createFromFormat('H:i', $hr_fim);
        //$fim = date_create_from_format('H:i', $hr_fim);
        
        $intervalo = $fim->diff($inicio);

        // Formata a diferença de horas para
        // aparecer no formato 00:00:00 na página
        
        if($dias!=0){
            if($dias!=1){
                return $dias." dias e ".$intervalo->format('%H:%I');
            }else{
                return $dias." dia e ".$intervalo->format('%H:%I');
            }
        }else{
            return $intervalo->format('%H:%I');
        }
        
        //echo $dias." dias ".$intervalo->format('%H:%I');
        
    }
    
    function geraTimestamp($data) {
        $partes = explode('/', $data);
        return mktime(0, 0, 0, $partes[1], $partes[0], $partes[2]);
    }
    
        
}
