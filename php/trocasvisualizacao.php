<?php
include("model/TrocaVisualizacao.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new TrocaVisualizacao();

switch ($action){
    case "trocar":
        $usuario = filter_input(INPUT_POST, "usuario");
        $senha = filter_input(INPUT_POST, "senha");
        
        echo json_encode($mod->trocar($usuario, $senha));
        break;
    
    case "voltar":
        echo json_encode($mod->voltar());
        break;
    
    case "checkVisualizacao":
        echo json_encode($mod->checkVisualizacao());
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " . baseUrl());
        break;
}