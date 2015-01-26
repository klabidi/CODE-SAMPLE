<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/functions/sql.php");
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

/**
 * Description of VeiculoLimite
 *
 * @author backes
 */
class VeiculoLimite {
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
    
    public function listarAcessorios(){
        $data = array();
        $error = NULL;
        
        $idUsuario = $this->session->getItem("eagleIdUsuario");
        
        $query = "SELECT v.placa, MAX(ma.ref_tabela) AS ref_rpm, mp.tipo_controle_velocidade  
                  FROM monitoramento.multi_veiculo_config mc, monitoramento.multi_acessorios ma, veiculos v, monitoramento.modelo_aparelho mp
                  WHERE v.modelo_aparelho = mp.id_modelo AND ma.ref_tabela (+)= :ref_rpm AND ma.id_acessorio (+)= mc.acessorio AND mc.placa (+)= v.placa
                  AND v.placa IN (" . sqlPlacasUsuario() . ") GROUP BY v.placa, mp.tipo_controle_velocidade";
        $res = oci_parse($this->db->getCon(), $query);
        
        $ref_rpm = "MS_RPM";
        oci_bind_by_name($res, ":usuario", $idUsuario);
        oci_bind_by_name($res, ":ref_rpm", $ref_rpm);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $rpm = (strlen($mod["REF_RPM"])>0);
                
                switch($mod["TIPO_CONTROLE_VELOCIDADE"]){
                    case 1:
                        $velocidade = true;
                        $velocidade_chuva = true;
                        $aviso_motorista = true;
                    break;
                    case 2:
                        $velocidade = true;
                        $velocidade_chuva = true;
                        $aviso_motorista = true;
                    break;
                    case 3:
                        $velocidade = true;
                        $velocidade_chuva = false;
                        $aviso_motorista = false;
                    break;
                    case 4:
                        $velocidade = true;
                        $velocidade_chuva = true;
                        $aviso_motorista = true;
                    break;
                    case 5:
                        $velocidade = true;
                        $velocidade_chuva = false;
                        $aviso_motorista = false;
                    break;
                    default:
                        $velocidade = false;
                        $velocidade_chuva = false;
                        $aviso_motorista = false;
                    break;
                }

                $data[] = array(
                    "placa" => $mod["PLACA"],
                    "velocidade" => $velocidade,
                    "velocidadeChuva" => $velocidade_chuva,
                    "avisoMotorista" => $aviso_motorista,
                    "rpm" => $rpm,
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
    
    public function listar(){
        $data = array();
        $error = NULL;
        $idUsuario = $this->session->getItem("eagleIdUsuario");
        
        $query = "SELECT * FROM (SELECT id_veiculo_limite, placa, velocidade, velocidade_chuva, rpm_maximo, rpm_minimo, 
                    temperatura1_maxima, temperatura1_minima, temperatura2_maxima, temperatura2_minima,
                    temperatura3_maxima, temperatura3_minima, row_number() OVER (PARTITION BY placa ORDER BY data DESC) rn 
                  FROM veiculos_limites WHERE placa IN 
                    (" . sqlPlacasUsuario() . ")
                  ) WHERE rn = 1";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":usuario", $idUsuario);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idLimite" => (int)$mod["ID_VEICULO_LIMITE"],
                    "placa" => $mod["PLACA"],
                    "velocidade" => (int)$mod["VELOCIDADE"],
                    "velocidadeChuva" => (int)$mod["VELOCIDADE_CHUVA"],
                    "rpmMaximo" => (int)$mod["RPM_MAXIMO"],
                    "rpmMinimo" => (int)$mod["RPM_MINIMO"]
                );
            }
        }
        
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
    public function salvar($data){
        $error = NULL;
        $idUsuario = $this->session->getItem("eagleIdUsuario");
        
        $query = "INSERT INTO veiculos_limites 
                  (placa, velocidade, velocidade_chuva, rpm_maximo, rpm_minimo, 
                   data, usuario) 
                  VALUES (:placa, :velocidade, :velocidade_chuva, :rpm_maximo, 
                  :rpm_minimo, SYSDATE, :usuario)";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":placa", $data["placa"]);
        oci_bind_by_name($res, ":velocidade", $data["velocidade"]);
        oci_bind_by_name($res, ":velocidade_chuva", $data["velocidadeChuva"]);
        oci_bind_by_name($res, ":rpm_maximo", $data["rpmMaximo"]);
        oci_bind_by_name($res, ":rpm_minimo", $data["rpmMinimo"]);
        oci_bind_by_name($res, ":usuario", $idUsuario);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
}