<?php
include("model/Acompanhamento.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Acompanhamento();

switch ($action){
    case "listar":
        $operacao = filter_input(INPUT_POST, "operacao");
        
        echo json_encode($mod->listar($operacao));
        break;
    
    case "listarDetalhado":
        $placa = filter_input(INPUT_POST, "placa");
        
        echo json_encode($mod->listarDetalhado($placa));
        break;
   
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}