<?php
include("model/Veiculo.class.php");
$action = filter_input(INPUT_GET, "action");
$mod = new Veiculo();

switch ($action){
    case "listarUsuario":
        echo json_encode($mod->listarUsuario());
        break;
    
    case "listarUsuarioCompleto":
        echo json_encode($mod->listarUsuarioCompleto());
        break;
    
    case "listarEmpresa":
        echo json_encode($mod->listarEmpresa());
        break;
    
    case "listarEmpresaCompleto":
        echo json_encode($mod->listarEmpresaCompleto());
        break;
    
    case "listarMacros":
        $placa = filter_input(INPUT_POST, "placa");
        echo json_encode($mod->listarMacros($placa));
        break;
    
    case "listarComandos":
        $placa = filter_input(INPUT_POST, "placa");
        echo json_encode($mod->listarComandos($placa));
        break;
    
    case "listarOperacao":
        $operacao = filter_input(INPUT_POST, "operacao");
        echo json_encode($mod->listarOperacao($operacao));
        break;
    
    case "enviarComando":
        $post = $_POST;
        
        $codigo = $post["codigo"];
        $placa = $post["placa"];
        $satelite = $post["satelite"];
        $acessorio= $post["acessorio"];
        $acessorioInterno = $post["acessorioInterno"];
        $parametros = array();
        $temParametro = true;
        $numParametro = 0;
        
        while($temParametro){
            if($post["parametro".$numParametro]){
                $parametros[] = $post["parametro".$numParametro];
                $numParametro++;
            }else{
                $temParametro = false;
            }
        }
        
        echo json_encode($mod->enviarComando($placa, $codigo, $parametros, $acessorio, $acessorioInterno, $satelite));
        break;
    
    case "listarComandosEspera":
        $placa = filter_input(INPUT_POST, "placa");
        
        echo json_encode($mod->listarComandosEspera($placa));
        break;
    
    case "excluirComandosEspera":
        $rec = json_decode(filter_input(INPUT_POST, "data"));
        
        echo $rec->idComando;
        break;
    
    case "listarInformacoes":
        $placa = filter_input(INPUT_POST, "placa");
        
        echo json_encode($mod->listarInformacoes($placa));
        break;
    
    case "listar":
        echo json_encode($mod->listar());
        break;
    
    case "adicionar":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        
        echo json_encode($mod->adicionar($data));
        break;
    
    case "alterar":
        $data = json_decode(filter_input(INPUT_POST, "data"), true);
        
        echo json_encode($mod->alterar($data));
        break;
    
    default:
        // Se não receber nenhuma action, retorna para a tela de login
        header("Location: " . baseUrl());
        break;
}