<?php
include("model/Estado.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Estado();

switch ($action){
    case "listarEstados":
        echo json_encode($mod->listarEstados());
        break;
    
    case "listarEstadosCidades":
        echo json_encode($mod->listarEstadosCidades());
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}