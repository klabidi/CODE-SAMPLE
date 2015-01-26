<?php
include("model/Teclado.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Teclado();

switch ($action){
    case "listarVeiculosTeclado":
        echo json_encode($mod->listarVeiculosTeclado());
        break;
    
    case "listarMacros":
        $placa = filter_input(INPUT_POST, "placa");
        $envio = filter_input(INPUT_POST, "envio");
        $placa = ($placa=="null")?null:$placa;
        $envio = ($envio=="false")?false:true;
        echo json_encode($mod->listarMacros($placa, $envio));
        break;
    
    case "enviarMensagensVeiculos":
        $placas = explode(",", filter_input(INPUT_POST, "placasSel"));
        $tipo = filter_input(INPUT_POST, "tipo");
        
        if($tipo === "3"){
            $pergunta = filter_input(INPUT_POST, "pergunta");
            $resposta1 = filter_input(INPUT_POST, "resposta1");
            $resposta2 = filter_input(INPUT_POST, "resposta2");
            $resposta3 = filter_input(INPUT_POST, "resposta3");
            
            $mensagem = $pergunta . "&" . $resposta1 . "&" . $resposta2 . "&" . $resposta3;
        }else{
            $mensagem = filter_input(INPUT_POST, "mensagem");
        }
        
        echo json_encode($mod->enviarMensagensVeiculos($placas, $mensagem, $tipo));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " . baseUrl());
        break;
}