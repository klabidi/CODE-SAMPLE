<?php
include("model/Notificacao.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Notificacao();

switch ($action){
    case "listarMensagens":
        echo json_encode($mod->listarMensagens()); 
        break;
    
    case "listarEventos":
        echo json_encode($mod->listarEventos());
        break;
    
    case "listarInformacoes":
        echo json_encode($mod->listarInformacoes());
        break;
    
    case "listarVisualizadores":
        $array = $mod->listarVisualizadores(filter_input(INPUT_GET, "idNotificacao"));
        if($array["success"]===true){
            $return = "";
            foreach ($array["data"] as $visualizador) {
                $return .= $visualizador["nome"]." - ".$visualizador["data"]."<br>";
            }
            echo $return;
        }
        else
            echo $array["error"];
        break;
    
    case "marcarVisualizada":
        $idNotificacao = filter_input(INPUT_POST, "idNotificacao");
        
        echo json_encode($mod->marcarVisualizada($idNotificacao));
        break;
    
    case "enviarMensagensVeiculos":
        $placas = json_decode(filter_input(INPUT_POST, "placas"));
        $mensagem = filter_input(INPUT_POST, "mensagem");
        
        echo json_encode($mod->enviarMensagensVeiculos($placas, $mensagem));
        break;
    
    case "enviarMensagensUsuarios":
        $usuarios = explode(",", (filter_input(INPUT_POST, "usuarios")));
        $mensagem = filter_input(INPUT_POST, "mensagem");
        $resposta = filter_input(INPUT_POST, "idNotificacao");
        
        echo json_encode($mod->enviarMensagensUsuarios($usuarios, $mensagem, $resposta));
        break;
    
    case "getInformacaoAtualizacao":
        echo json_encode($mod->getInformacaoAtualizacao(filter_input(INPUT_POST, "tipo")));
        break;
    
    case "setLidaTodasMsgs":
        echo json_encode($mod->setLidaTodasMsgs());
        break;
    
    case "listarMensagemHistorico":
        $usuarioPlaca = explode(",", (filter_input(INPUT_POST, "usuarioPlaca")));
        echo json_encode($mod->listarMensagemHistorico($usuarioPlaca));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " .  baseUrl());
        break;
}