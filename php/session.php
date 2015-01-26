<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost")
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/php/functions/url.php");
else
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/php/functions/url.php");

include(documentRoot() . "/viewport/php/util/Session.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Session();

switch ($action){
    case "setItem":
        $index = filter_input(INPUT_POST, "index");
        $value = filter_input(INPUT_POST, "value");
        echo json_encode($mod->setItem($index, $value));
        break;
    
    case "getItem":
        $index = filter_input(INPUT_POST, "index");
        echo json_encode($mod->getItem($index));
        break;
    
    case "destruir":
        echo json_encode($mod->destruir());
        break;
    
    case "verificar":
        $index = $_REQUEST["index"];
        if($mod->getItem($index) !== NULL){
            echo json_encode(true);
        }else{
            echo json_encode(false);
        }
        break;
    
    case "getSessao":
        echo json_encode($mod->getSessao());
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " . baseUrl());
        break;
}