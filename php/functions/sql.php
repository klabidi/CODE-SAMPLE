<?php
function sqlPlacasUsuario($tipo = ""){
    if($tipo === ""){
        return "SELECT ov.placa from operacoes_veiculos ov, operacoes_usuarios ou
                WHERE ov.operacao = ou.operacao
                AND ou.usuario = :usuario";
    }
    
    if($tipo === "operacao"){
        return "SELECT ov.placa FROM operacoes_veiculos ov, operacoes_usuarios ou 
                WHERE ov.operacao = ou.operacao 
                AND ou.usuario = :usuario 
                AND ou.operacao = :operacao";
    }
    
    if($tipo === "empresa"){
        return "SELECT v.placa FROM veiculos v, usuarios u 
                WHERE v.empresa = u.empresa 
                AND u.id_usuario = :usuario 
                AND v.empresa = :empresa";
    }
}