<?php
include("model/EventoCfg.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new EventoCfg();

switch ($action){
    case "listar":
        $operacao = filter_input(INPUT_POST, "operacao");
        echo json_encode($mod->listar($operacao));
        break;
    
    case "listarEventosEmpresa":
        $operacao = filter_input(INPUT_POST, "operacao");
        echo json_encode($mod->listarEventosEmpresa($operacao));
        break;
    
    case "inserir":
        echo json_encode($mod->inserir(filter_input(INPUT_POST, "data")));
        break;
    
    case "remover":
        echo json_encode($mod->remover(filter_input(INPUT_POST, "data")));
        break;
    
    case "listarMsg":
        $operacao = filter_input(INPUT_POST, "operacao");
        echo json_encode($mod->listarMsg($operacao));
        break;
    
    case "inserirMsg":
        echo json_encode($mod->inserirMsg(filter_input(INPUT_POST, "data")));
        break;
    
    case "removerMsg":
        echo json_encode($mod->removerMsg(filter_input(INPUT_POST, "data")));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}