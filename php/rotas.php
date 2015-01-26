<?php
include("model/Rota.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Rota();

switch ($action){
    case "listarVeiculos":
        $ultimaBusca = filter_input(INPUT_POST, "ultimaBusca");
        $operacao = filter_input(INPUT_POST, "operacao");
        
        echo json_encode($mod->listaVeiculosBuffer($operacao, $ultimaBusca));
        break;
    
    case "getLocalRef":
        echo json_encode(
                $mod->getLocalizacaoReferencia(filter_input(INPUT_POST, "idRota")
                        , filter_input(INPUT_POST, "veiculo")
                        , filter_input(INPUT_POST, "latitude")
                        , filter_input(INPUT_POST, "longitude"))
             );
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}