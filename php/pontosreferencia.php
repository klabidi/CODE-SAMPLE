<?php
include("model/PontoReferencia.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new PontoReferencia();

switch ($action){
    case "listar":
        echo json_encode($mod->listar());
        break;
    
    case "criar":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->criar($data));
        break;
    
    case "alterar":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->editar($data));
        break;
    
    case "excluir":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->excluir($data["idPontoReferencia"]));
        break;
    
    case "listarGrupos":
        echo json_encode($mod->listarGrupos());
        break;
    
    case "criarGrupos":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->criarGrupos($data));
        break;
    
    case "editarGrupos":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->editarGrupos($data));
        break;
    
    case "excluirGrupos":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        echo json_encode($mod->excluirGrupos($data["idReferenciaGrupo"]));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}