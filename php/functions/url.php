<?php
/**
 * Retorna a url base do sistema independentemente se for produçao ou desenvolvimento
 * @param String $path
 * @return string url ex: http://monitoramento.cielo.ind.br/eagle4/
 */
function baseUrl($path = ""){
    $scheme = filter_input(INPUT_SERVER, "REQUEST_SCHEME");
    $host = filter_input(INPUT_SERVER, "HTTP_HOST");
    $prefix = filter_input(INPUT_SERVER, "CONTEXT_PREFIX");
    
    if($host === "localhost"){
        $prefix = "/eagle-4";
    }
    
    $url = $scheme . "://" . $host . $prefix . "/" . $path;
    
    return $url;
}

/**
 * Retorna o caminho dos diretorios da raiz ate o diretorio base do sistema
 * @return String
 */
function documentRoot(){
    if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost")
        return filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT")."/eagle-4";
    else
        return filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT");
}