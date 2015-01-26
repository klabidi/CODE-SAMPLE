<!DOCTYPE html>
<html>
    <head>
        <meta charset="ISO-8859-1">
        <link rel="stylesheet" href="../../../resources/css/relatorios_layout.css">
    </head>
    <body>
        <div id="content">
        <?php echo filter_input(INPUT_POST, "html"); ?>
        </div>
    </body>
</html>

<script>
    window.print();
    setTimeout(function(){ window.close(); }, 100);
</script>