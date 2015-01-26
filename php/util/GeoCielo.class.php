<?php
if(filter_input(INPUT_SERVER, "SERVER_NAME") !== "localhost"){
    require_once("/home/mapa/www/includes/MapScript.class.php");
}

class GeoCielo{
    private $con = null;
    private $map = null;

    function __construct($conexao){
        if($conexao){
            $this->con = $conexao;
        }else{
            require_once("OracleCielo.class.php");
            $OraCon = new OracleCielo();
            $this->con = $OraCon->getCon();
        }
        
        if(filter_input(INPUT_SERVER, "SERVER_NAME") !== "localhost"){
            $this->map = new MapScript("busca.map");
        }
    }

    function __destruct(){
        $this->con = null;
    }

    public function getDistancia($X1,$Y1,$X2,$Y2){
        $MX1 = 0;
        $MX2 = 0;
        $MY1 = 0;
        $MY2 = 0;

        $MX1 = min($X1, $X2);
        $MX2 = max($X1, $X2);
        $MY1 = min($Y1, $Y2);
        $MY2 = max($Y1, $Y2);

        $MLSel = $MX2 - $MX1;
        $MASel = $MY2 - $MY1;

        $result = sqrt(($MLSel * $MLSel) +($MASel * $MASel));
        $result *= 101;
        $result = $result + ($result*0.1);
        return $result;
    }

    public function getLocal($lat, $lon){
        if(!empty($lon) && !empty($lat) && $lat<0 && filter_input(INPUT_SERVER, "SERVER_NAME")!=="localhost"){	
            $lon = str_replace(",",".",$lon);
            $lat = str_replace(",",".",$lat);
            $this->map->localizaEndereco($lon, $lat);
            $Municipio = $this->map->retornaDadosPais();
            $Logradouro = $this->map->retornaLogradouro();
            $cidade = $Municipio[0];
            $estado = $Municipio[1];
            $logradouro = $Logradouro;
            if(!empty($logradouro))
                $rua = "na ".$logradouro."";
            else
                $rua = $logradouro;

            return "".$cidade." - ".$estado." ".$rua."";
        }
        else
            return  " - ";
    }
    
    public function getCidade($lat, $lon){
        if(!empty($lon) && !empty($lat) && $lat<0 && filter_input(INPUT_SERVER, "SERVER_NAME")!=="localhost"){
            $lon = str_replace(",",".",$lon);
            $lat = str_replace(",",".",$lat);
            $this->map->localizaEndereco($lon, $lat);
            $municipio = $this->map->retornaDadosPais();
            $cidade = $municipio[0];
            $estado = $municipio[1];
            
            return $cidade." - ".$estado;
        }else{
            return " - ";
        }
    }
	
  
}
?>


