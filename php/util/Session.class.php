<?php
class Session{
    public function __construct(){
        session_start();
    }
    
    public function setItem($index, $value){
        $_SESSION[$index] = $value;
        return $value;
    }
    
    public function getItem($index){
        return $_SESSION[$index];
    }
    
    public function destruir(){
        return session_destroy();
    }
    
    public function getSessao(){
        return $_SESSION;
    }
    
    public function verificarSessao($index){
        return ($_SESSION[$index] !== NULL);
    }
}