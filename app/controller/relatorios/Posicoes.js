Ext.define("Eagle.controller.relatorios.Posicoes", {
    extend: "Ext.app.Controller",
    models: [],
    stores: [
        "VeiculosTree"
    ],
    views: [
        "relatorios.posicoes.Panel"
    ],
    
    refs: [{
        ref: "treepanel",
        selector: "relatorios_posicoes_panel > panel[region=west] > treepanel"
    }],
    
    init: function(){
        this.control({
            "relatorios_posicoes_panel > panel[region=west] > treepanel": {
                beforeitemexpand: this.onBeforeItemExpand
            },
            "relatorios_posicoes_panel > panel[region=west] button[action=filtrar]": {
                click: this.onFiltrarClick
            },
            "relatorios_posicoes_panel > panel[region=center] > toolbar [action=exportaPrint]": {
                click: this.onPrintClick
            },
            "relatorios_posicoes_panel > panel[region=center] > toolbar [action=exportaXls]": {
                click: this.onXlsClick
            },
            "relatorios_posicoes_panel > panel[region=center] > toolbar [action=exportaPdf]": {
                click: this.onPdfClick
            }
        });
    },
    
    onBeforeItemExpand: function(node){
        if(node.get("type") === "operacao"){
            this.getTreepanel().collapseAll();
        }
    },
    
    onFiltrarClick: function(button){
        var panel = button.up("relatorios_posicoes_panel").down("panel[region=center]"),
            treepanel = button.up("panel").down("treepanel"),
            form = button.up("panel").down("form"),
            veiculo,
            values;
        
        button.up("relatorios_posicoes_panel").mask("Carregando...");
        if(treepanel.getSelection().length > 0 && treepanel.getSelection()[0].get("leaf") && form.isValid()){
            veiculo = treepanel.getSelection()[0].getId();
            values = form.getValues();

            panel.loader = {
                url: "php/reports/posicao/",
                params: {
                    placa: veiculo,
                    dataIni: values.dataIni,
                    dataFim: values.dataFim
                }
            };
            panel.getLoader().load({
                callback: function(){
                    button.up("relatorios_posicoes_panel").unmask();
                }
            });
        }else{
            button.up("relatorios_posicoes_panel").unmask();
        }
    },
    
    onPrintClick: function(button){
        document.getElementById("html").value = document.getElementById("posicao").innerHTML;
        document.getElementById("form").action = 'php/reports/posicao/imprimir.php';
        document.getElementById("form").submit();
    },
    
    onXlsClick: function(button){
        document.getElementById("html").value = document.getElementById("posicao").innerHTML;
        document.getElementById("form").action = 'php/reports/posicao/xls.php';
        document.getElementById("form").submit();
    },
    
    onPdfClick: function(button){
        document.getElementById("html").value = document.getElementById("posicao").innerHTML;
        document.getElementById("form").action = 'php/reports/posicao/pdf.php';
        document.getElementById("form").submit();
    }
    
});