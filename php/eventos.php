<?php
include("model/Evento.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Evento();

switch ($action){
    case "listar":
        $placa = filter_input(INPUT_POST, "placa");
        $data = (filter_input(INPUT_POST, "data") === NULL) ? date("d-m-Y") : filter_input(INPUT_POST, "data");
        $diaAnterior = filter_input(INPUT_POST, "diaAnterior");
        
        echo json_encode($mod->listar($placa, $data, $diaAnterior));
        break;
    
    case "getLocalRef":
        $latitude = filter_input(INPUT_POST, "latitude");
        $longitude = filter_input(INPUT_POST, "longitude");
        
        echo json_encode($mod->getLocalizacaoReferencia($latitude, $longitude));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}