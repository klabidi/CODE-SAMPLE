<?php
include("model/Posicao.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Posicao();

switch ($action){
    case "listar":
        $placa = filter_input(INPUT_POST, "placa");
        $data = filter_input(INPUT_POST, "data");
        $diaAnterior = filter_input(INPUT_POST, "diaAnterior");
        
        $data = ($data === NULL) ? date("d-m-Y") : $data;
        
        echo json_encode($mod->listar($placa, $data, $diaAnterior));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}