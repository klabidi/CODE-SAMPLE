<?php

if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost"){
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/eagle-4/viewport/resources/mpdf/mpdf.php");
}else{
    include_once(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT") . "/viewport/resources/mpdf/mpdf.php");
}

$dados = filter_input(INPUT_POST, 'html');

$documentTemplate = 
'<html>
    <head>
        <meta charset="ISO-8859-1">
        <link rel="stylesheet" href="../../../resources/css/relatorios_layout.css">
    </head>
    <body>
        <div id="content">'.$dados.'</div>
    </body>
</html>';

$mpdf = new mPDF();

$mpdf->ignore_invalid_utf8 = true;
        
$mpdf->WriteHTML(utf8_encode($documentTemplate));

$mpdf->Output();

exit();

?>