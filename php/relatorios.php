<?php
include("model/Relatorio.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Relatorio();

switch ($action){
    case "listar":
        echo json_encode(array(
            "success" => true,
            "data" => array(
                array(
                    "id" => 1,
                    "title" => "Posicoes",
                    "subtitle" => "Relatorio de posicoes do veiculo.",
                    "url" => "php/reports/posicao/"
                ),
                array(
                    "id" => 2,
                    "title" => "Eventos",
                    "subtitle" => "Relatorio de eventos do veiculo.",
                    "url" => "php/reports/evento/"
                ),
                array(
                    "id" => 3,
                    "title" => "Velocidade Excedida",
                    "subtitle" => "Relatorio com os eventos de velocidade excedida.",
                    "url" => "php/reports/velocidade_excedida/"
                )
            )
        ));
        break;
    
    case "listarVeiculosTree":
        echo json_encode($mod->listarVeiculosTree());
        break;
    
    case "listarUsuariosTree":
        echo json_encode($mod->listarUsuariosTree());
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}