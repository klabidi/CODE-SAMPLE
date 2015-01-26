<?php
include("model/VeiculoLimite.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new VeiculoLimite();

switch ($action){
    case "listar":
        echo json_encode($mod->listar());        
        break;
    
    case "listarAcessorios":
        echo json_encode($mod->listarAcessorios());
        break;
    
    case "criar":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        
        echo json_encode($mod->salvar($data));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " . baseUrl());
        break;
}