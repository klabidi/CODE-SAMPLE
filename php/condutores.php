<?php
include("model/Condutor.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Condutor();

switch ($action){
    case "listar":
        echo json_encode($mod->listar());
        break;
    
    case "adicionar":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        
        echo json_encode($mod->adicionar($data));
        break;
    
    case "alterar":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        
        echo json_encode($mod->alterar($data));
        break;
    
    case "excluir":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->excluir($data["idCondutor"]));
        break;
    
    case "listarCombobox":
        echo json_encode($mod->listarCombobox());
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}