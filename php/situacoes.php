<?php
include("model/Situacao.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Situacao();

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
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}