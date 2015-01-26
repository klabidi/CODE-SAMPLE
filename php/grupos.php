<?php
include("model/Grupo.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Grupo();

switch ($action){
    case "listar":
        echo json_encode($mod->listar());
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " . baseUrl());
        break;
}