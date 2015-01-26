<?php
header('Content-Type: text/html; charset=ISO-8859-1');
if(filter_input(INPUT_SERVER, "SERVER_NAME") === "localhost")
    include(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT")."/eagle-4/viewport/php/util/Session.class.php");
else
    include(filter_input(INPUT_SERVER, "CONTEXT_DOCUMENT_ROOT")."/viewport/php/util/Session.class.php");

$session = new Session();
$idUsuario = $session->getItem("eagleIdUsuario");
if($idUsuario === NULL){
    header("Location: ../");
}
?>
<!DOCTYPE html>
<html lang="pt-BR">  
    <head>
        <meta charset="ISO-8859-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <title>.:: Eagle 4 - Monitoramento Veícular ::.</title>
        <link rel="stylesheet" href="resources/css/splashscreen.css" />
        <link rel="stylesheet" href="resources/ext-5.0.0/packages/ext-theme-crisp/build/resources/ext-theme-crisp-all-debug.css" />
        <link rel="stylesheet" href="resources/ext-5.0.0/ux/css/LiveSearchGridPanel.css" />
        <link rel="stylesheet" href="resources/ext-5.0.0/ux/css/statusbar.css" />
        <link rel="stylesheet" href="resources/css/extcustom.css" />
        <link rel="stylesheet" href="resources/css/notificacoes.css" />
        <link rel="stylesheet" href="resources/css/eventos.css" />

        <script type="text/javascript" src="resources/ext-5.0.0/build/ext-debug.js"></script>
        <script type="text/javascript" src="resources/ext-5.0.0/build/packages/ext-locale/build/ext-locale-pt_BR-debug.js"></script>
        
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&sensor=false&language=pt-BR"></script>
        <script type="text/javascript" src="http://www.google.com/jsapi"></script>
        
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
        <script type="text/javascript" src="resources/highcarts-4.0.3/highcharts.js"></script>
        <script type="text/javascript" src="resources/highcarts-4.0.3/modules/data.js"></script>
        <script type="text/javascript" src="resources/highcarts-4.0.3/modules/exporting.js"></script>

        <script type="text/javascript" src="resources/ext-5.0.0/ux/GMapPanel.js"></script>
        <script type="text/javascript" src="resources/ext-5.0.0/ux/StatusBar.js"></script>
        <script type="text/javascript" src="resources/ext-5.0.0/ux/LiveSearchGridPanel.js"></script>
        <script type="text/javascript" src="resources/ext-5.0.0/ux/SearchField.js"></script>
        <script type="text/javascript" src="resources/ext-5.0.0/ux/FeedReader.js"></script>
<!--        <script type="text/javascript" src="resources/ext-5.0.0/ux/exporter/Exporter-all.js"></script>-->
        <script type="text/javascript" src="resources/js/eagle.js"></script>

        <script type="text/javascript" src="app.js"></script>
    </head>
    <body>
        <div id="splashscreen"></div>
    </body>
</html>