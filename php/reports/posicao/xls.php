<?php
header("Content-type: application/vnd.ms-excel");
header("Content-Type: application/force-download");
header("Content-Disposition: attachment; filename=relatorio_posicao.xls");
header("Pragma: no-cache");

echo filter_input(INPUT_POST, "html");