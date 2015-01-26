<?php
include("model/Dashboard.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Dashboard();

switch ($action){
    case "listarTempoMovimento":
        $operacao = filter_input(INPUT_POST, "operacao");
        
        echo json_encode($mod->listarTempoMovimento($operacao));
        break;
    
    case "listarDetalheMovimento":
        $placa = filter_input(INPUT_POST, "placa");
        
        echo json_encode($mod->listarDetalheMovimento($placa));
        break;
    
    case "listarTrajetoDiario":
        $placa = filter_input(INPUT_POST, "placa");
        
        echo json_encode($mod->listarTrajetoDiario($placa));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}