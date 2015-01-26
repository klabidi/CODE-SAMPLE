<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");
}
include(documentRoot() . "/viewport/php/util/OracleCielo.class.php");
include(documentRoot() . "/viewport/php/util/Session.class.php");

class Permissao {
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
    
    public function getFilhos($grupo, $moduloPai){
        $data = array();

        $sql = " SELECT DISTINCT(pm.id_permissao_modulo), pm.descricao, pm.icone, pm.modulo_pai, 
                        (select count(*) from permissoes_grupos pgg where grupo = :grupo and modulo = pm.id_permissao_modulo) AS checked 
                 FROM permissoes_modulos pm 
                 LEFT JOIN permissoes_grupos pg ON pm.id_permissao_modulo=pg.modulo 
                 WHERE pm.modulo_pai=".$moduloPai." 
                 ORDER BY pm.descricao"; 
        
        $res = oci_parse($this->db->getCon(), $sql);
        oci_bind_by_name($res, ":grupo", $grupo);
        @oci_execute($res);

        while($row = oci_fetch_assoc($res)){ 
                $permissao = ($row["CHECKED"] == 1)?true:false;

                $subModulo = $this->getFilhos($grupo, $row['ID_PERMISSAO_MODULO']);

                if($subModulo > 0){
                    $data[] = array(
                                'text' => utf8_encode($row['DESCRICAO']),
                                'id' => $row['ID_PERMISSAO_MODULO'],
                                'checked' => $permissao, 
                                'expanded' => true,
                                'grupo' => $grupo,
                                'children' => $subModulo
                            );
                }else{
                    $data[] = array(
                                'text' => utf8_encode($row['DESCRICAO']),
                                'id' => $row['ID_PERMISSAO_MODULO'],
                                'checked' => $permissao, 
                                'expanded' => true,
                                'grupo' => $grupo,
                                'leaf' => true
                            );
                }
        }
        OCIFreeStatement($res);

        return $data;
        
    }
    
    public function getModulos($grupo){
        $data = array();
        
        $sql = " SELECT DISTINCT(pm.id_permissao_modulo), pm.descricao, pm.icone, pm.modulo_pai, 
                        (select count(*) from permissoes_grupos pgg where grupo = :grupo and modulo = pm.id_permissao_modulo) AS checked 
                 FROM permissoes_modulos pm 
                 LEFT JOIN permissoes_grupos pg ON pm.id_permissao_modulo=pg.modulo 
                 WHERE pm.modulo_pai is null 
                 ORDER BY pm.descricao"; 
        $res = oci_parse($this->db->getCon(), $sql);
        oci_bind_by_name($res, ":grupo", $grupo);
        @oci_execute($res);

        while($row = oci_fetch_assoc($res)){ 
                $permissao = ($row["CHECKED"] == 1)?true:false;
                
                $subModulo = $this->getFilhos($grupo, $row['ID_PERMISSAO_MODULO']);
                
                if($subModulo > 0){
                    
                    $data[] = array(
                                'text' => utf8_encode($row['DESCRICAO']),
                                'id' => $row['ID_PERMISSAO_MODULO'],
                                'checked' => $permissao, 
                                'expanded' => true,
                                'grupo' => $grupo,
                                'children' => $subModulo
                            );
                    
                }else{
                    
                    $data[] = array(
                                'text' => utf8_encode($row['DESCRICAO']),
                                'id' => $row['ID_PERMISSAO_MODULO'],
                                'checked' => $permissao, 
                                'expanded' => true,
                                'grupo' => $grupo,
                                'leaf' => true
                            );
                    
                }
        }
        OCIFreeStatement($res);
        
        //print_r($data);
        
        return array(
            'success' => true,
            'children' => $data
        );
        
        /*
        return array(
            "success" => true,
            "children" => array(
                array(
                    "text" => "teste",
                    "leaf" => true
                ),
                array(
                    "text" => "teste 2",
                    "leaf" => true
                ),
                array(
                    "text" => "teste 3",
                    "children" => array(
                        "text" => "teste 4",
                        "leaf" => true
                    )
                )
             )
        );
        */
        
    }
    
    public function remPermissao($grupo, $modulo){
        
        if(!empty($grupo) && !empty($modulo)){
                
            $sql = "DELETE permissoes_grupos 
                    WHERE modulo = :modulo AND grupo = :grupo";
            
            $res = oci_parse($this->db->getCon(), $sql);
            oci_bind_by_name($res, ":grupo", $grupo);
            oci_bind_by_name($res, ":modulo", $modulo);
            
            if(!@oci_execute($res)){
                $error = oci_error($res);
            }else{
                /** function que remove os filhos ***/
                $this->remPermissaoFilho($grupo, $modulo);
            }
            
            oci_free_statement($res);
             
            return array(
                "success" => is_null($error),
                "error" => $error
            );
            
        }//if()
        
    }
    
    public function remPermissaoFilho($grupo, $modulo){
        
        $sql = "SELECT id_permissao_modulo AS modulo_filho FROM permissoes_modulos pm 
                JOIN permissoes_grupos pg ON pg.modulo = pm.id_permissao_modulo
                WHERE pg.grupo = :grupo
                AND pm.modulo_pai = :modulo";
        $res = oci_parse($this->db->getCon(), $sql);
        oci_bind_by_name($res, ":grupo", $grupo);
        oci_bind_by_name($res, ":modulo", $modulo);
        @oci_execute($res);
        
        while($row = oci_fetch_assoc($res)){
            
            $sql1 = "DELETE permissoes_grupos 
                      WHERE modulo = :modulo_filho AND grupo = :grupo";

            $res1 = oci_parse($this->db->getCon(), $sql1);
            oci_bind_by_name($res1, ":grupo", $grupo);
            oci_bind_by_name($res1, ":modulo_filho", $row['MODULO_FILHO']);
            @oci_execute($res1);
            
            /** function que remove os filhos ***/
            $this->remPermissaoFilho($grupo, $row['MODULO_FILHO']);
            
        }
        
        return "success";
        
    }
    
    public function addPermissao($grupo, $modulo){
        $sql = "INSERT INTO permissoes_grupos(modulo, grupo) 
                                       VALUES(:modulo, :grupo)";
        
        $res = oci_parse($this->db->getCon(), $sql);
        oci_bind_by_name($res, ":grupo", $grupo);
        oci_bind_by_name($res, ":modulo", $modulo);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            /** function que marca os pais **/
            $this->addPermissaoPai($grupo, $modulo);
        }
        
        oci_free_statement($res);
        
        return array(
            "success" => is_null($error),
            "error" => $error
        );
    }
    
    public function addPermissaoPai($grupo, $modulo){
        
        $sql = "SELECT pm.modulo_pai FROM permissoes_modulos pm 
                JOIN permissoes_grupos pg ON pg.modulo = pm.id_permissao_modulo
                WHERE pg.grupo = :grupo 
                AND pm.id_permissao_modulo = :modulo";
        //echo $sql;
        $res = oci_parse($this->db->getCon(), $sql);
        oci_bind_by_name($res, ":grupo", $grupo);
        oci_bind_by_name($res, ":modulo", $modulo);
        @oci_execute($res);
        
        while($row = oci_fetch_assoc($res)){
            
            $sql1 = "INSERT INTO permissoes_grupos(modulo, grupo)
                                           VALUES(:modulo_pai, :grupo)";
            
            $res1 = oci_parse($this->db->getCon(), $sql1);
            oci_bind_by_name($res1, ":grupo", $grupo);
            oci_bind_by_name($res1, ":modulo_pai", $row['MODULO_PAI']);
            @oci_execute($res1);
            
            /** function que remove os filhos ***/
            $this->addPermissaoPai($grupo, $row['MODULO_PAI']);
            
        }
        
        return "success";
        
    }
    
    public function listarGrupo(){
        $data = array();
        $error = NULL;
        $empresa = $this->session->getItem("eagleEmpresa");
        
        
        ###################################################
        ###############        GRID        ################
        ###################################################
        
        $query = "SELECT id_grupo, descricao 
                  FROM grupos 
                  ORDER BY id_grupo";
        
        $res = oci_parse($this->db->getCon(), $query);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($mod = oci_fetch_assoc($res)){
                $data[] = array(
                    "idGrupo" => (int)$mod["ID_GRUPO"],
                    "descricao" => utf8_encode($mod["DESCRICAO"])
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
    
    public function listarPermissoesGrupo(){
        $error = NULL;
        $data = array();
        $grupo = $this->session->getItem("eagleGrupo");
        
        $query = "SELECT pm.id_permissao_modulo 
                  FROM permissoes_modulos pm 
                  JOIN permissoes_grupos pg ON pm.id_permissao_modulo = pg.modulo 
                  WHERE pg.grupo = :grupo";
        $res = oci_parse($this->db->getCon(), $query);
        oci_bind_by_name($res, ":grupo", $grupo);
        
        if(!@oci_execute($res)){
            $error = oci_error($res);
        }else{
            while($row = oci_fetch_assoc($res)){
                $data[] = (int)$row["ID_PERMISSAO_MODULO"];
            }
        }
        
        return array(
            "success" => is_null($error),
            "data" => $data,
            "error" => $error
        );
    }
    
}