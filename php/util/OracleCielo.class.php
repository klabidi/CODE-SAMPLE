<?php 
class OracleCielo{
    private $monitDB="(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=0000000000)(PORT = 0000))(CONNECT_DATA = (SERVICE_NAME = 0000)(SERVER=0000)))";
    private $monitUser="00000";
    private $monitPass="0000";
    private $monitCharset="WE8ISO8859P1";

    public $conexao;

    function __construct(){
        $this->conexao= oci_connect($this->monitUser,$this->monitPass,$this->monitDB,$this->monitCharset);
    }

    function __destruct(){
        oci_close($this->conexao);
    }

    public function getCon(){
        return $this->conexao;
    }
}