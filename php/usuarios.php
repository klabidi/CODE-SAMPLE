<?php
include("model/Usuario.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Usuario();

switch ($action){
    case "listar":
        echo json_encode($mod->listar());
        break;
    
    case "listarG":
        $params = filter_input(INPUT_POST, "grupo");
        echo json_encode($mod->listarG($params));
        break;
    
    case "adicionar":
        $params = json_decode(filter_input(INPUT_POST, "data"), true);
        $params["ativo"] = ($params["ativo"] === true) ? "T" : "F";
        
        if($params["senha"] === NULL){
            echo json_encode(array(
                "success" => false,
                "error" => "senha"
            ));
        }else{
            $params["senha"] = md5($params["senha"]);
            echo json_encode($mod->adicionar($params));
        }
        
        break;
    
    case "alterar":
        $params = json_decode(filter_input(INPUT_POST, "data"), true);
        $params["ativo"] = ($params["ativo"] === true) ? "T" : "F";
        
        $ret = $mod->alterar($params);
        
        if($ret["success"]){
            
            if($params["senha"] !== NULL){
                $params["senhaAntiga"] = md5($params["senhaAntiga"]);
                $params["senha"] = md5($params["senha"]);

                echo json_encode($mod->alterarSenha($params["idUsuario"], $params["senhaAntiga"], $params["senha"]));
            }else{
                echo $ret;
            }
            
        }else{
            echo $ret;
        }
        
        break;
    
    case "excluir":
        echo json_encode($mod->excluir());
        break;
    
    case "verificarLogin":
        $login = filter_input(INPUT_POST, "login");
        
        echo json_encode($mod->checkLogin($login));
        break;
    
    case "listarOperacoes":
        echo json_encode($mod->listarOperacoes());
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " . baseUrl());
        break;
}