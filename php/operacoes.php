<?php
include("model/Operacao.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Operacao();

switch ($action){
    case "listar":
        $page = filter_input(INPUT_POST, "page");
        $limit = filter_input(INPUT_POST, "limit");
        echo json_encode($mod->listar($page, $limit));
        break;
    
    case "criar":
        echo json_encode($mod->criar(filter_input(INPUT_POST, "data")));
        break;
    
    case "alterar":
        echo json_encode($mod->alterar(filter_input(INPUT_POST, "data")));
        break;
    
    case "excluir":
        echo json_encode($mod->excluir(filter_input(INPUT_POST, "data")));
        break;
    
    case "listarVeiculos":
        $operacao = filter_input(INPUT_POST, "operacao");
        
        echo json_encode($mod->listarVeiculos($operacao));
        break;
    
    case "listarUsuarios":
        $operacao = filter_input(INPUT_POST, "operacao");
        
        echo json_encode($mod->listarUsuarios($operacao));
        break;
    
    case "addVeiculo":
        $operacao = filter_input(INPUT_POST, "operacao");
        $placa = filter_input(INPUT_POST, "placa");
        
        echo json_encode($mod->addVeiculo($operacao, $placa));
        break;
    
    case "addUsuario":
        $operacao = filter_input(INPUT_POST, "operacao");
        $usuario = filter_input(INPUT_POST, "usuario");
        
        echo json_encode($mod->addUsuario($operacao, $usuario));
        break;
    
    case "removerVeiculo":
        $operacao = filter_input(INPUT_POST, "operacao");
        $placa = filter_input(INPUT_POST, "placa");
        
        echo json_encode($mod->removerVeiculo($operacao, $placa));
        break;
    
    case "removerUsuario":
        $error = NULL;
        
        $operacao = filter_input(INPUT_POST, "operacao");
        $usuario = filter_input(INPUT_POST, "usuario");
        
        echo json_encode($mod->removerUsuario($operacao, $usuario));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}