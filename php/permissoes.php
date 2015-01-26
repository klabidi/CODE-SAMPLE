<?php
include("model/Permissao.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Permissao();

switch ($action){
    case "getModulos": 
        $grupo = filter_input(INPUT_POST, "grupo");
        
        echo json_encode($mod->getModulos($grupo));
        break;
    
    case "listarGrupo":
        echo json_encode($mod->listarGrupo());
        break;
    
    case "listarPermissoesGrupo":
        echo json_encode($mod->listarPermissoesGrupo());
        break;
    /**/
    case "remPermissao":
        $grupo  = filter_input(INPUT_POST, "grupo");
        $modulo = filter_input(INPUT_POST, "modulo");
        echo json_encode($mod->remPermissao($grupo, $modulo));
        break;
    
    case "addPermissao":
        $grupo  = filter_input(INPUT_POST, "grupo");
        $modulo = filter_input(INPUT_POST, "modulo");
        echo json_encode($mod->addPermissao($grupo, $modulo));
        break;
    /**/
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " . baseUrl());
        break;
}