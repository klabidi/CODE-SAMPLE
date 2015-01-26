<?php
include("model/SituacaoMacro.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new SituacaoMacro();

switch ($action){
    case "listar":
        echo json_encode($mod->listar());
        break;
    
    case "inserir":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->inserir($data));
        break;
    
    case "editar":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->editar($data));
        break;
    
    case "remover":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->remover($data));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " . baseUrl());
        break;
}