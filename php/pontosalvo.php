<?php
include("model/PontoAlvo.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new PontoAlvo();

switch ($action){
    case "listar":
        echo json_encode($mod->listar());
        break;
    
    case "adicionaroualterar":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->adicionarOuAlterar($data));
        break;
    
    case "add":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->add($data));
        break;
    
    case "alterar":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->alterar($data));
        break;
    
    case "excluir":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->excluir($data));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}