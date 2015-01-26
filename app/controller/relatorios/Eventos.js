Ext.define("Eagle.controller.relatorios.Eventos", {
    extend: "Ext.app.Controller",
    models: [],
    stores: [
        "VeiculosTree"
    ],
    views: [
        "relatorios.eventos.Panel"
    ],
    
    refs: [{
        ref: "treepanel",
        selector: "relatorios_eventos_panel > panel[region=west] > treepanel"
    }],
    
    init: function(){
        this.control({
            "relatorios_eventos_panel > panel[region=west] > treepanel": {
                beforeitemexpand: this.onBeforeItemExpand
            },
            "relatorios_eventos_panel > panel[region=west] button[action=filtrar]": {
                click: this.onFiltrarClick
            },
            "relatorios_eventos_panel > panel[region=center] > toolbar [action=exportaPrint]": {
                click: this.onPrintClick
            },
            "relatorios_eventos_panel > panel[region=center] > toolbar [action=exportaXls]": {
                click: this.onXlsClick
            },
            "relatorios_eventos_panel > panel[region=center] > toolbar [action=exportaPdf]": {
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
        var panel = button.up("relatorios_eventos_panel").down("panel[region=center]"),
            treepanel = button.up("panel").down("treepanel"),
            form = button.up("panel").down("form"),
            veiculo,
            values;
        
        button.up("relatorios_eventos_panel").mask("Carregando...");
        if(treepanel.getSelection().length > 0 && form.isValid()){
            veiculo = treepanel.getSelection()[0].getId();
            values = form.getValues();

            panel.loader = {
                url: "php/reports/evento/",
                params: {
                    placa: veiculo,
                    dataIni: values.dataIni,
                    dataFim: values.dataFim
                }
            };
            panel.getLoader().load({
                callback: function(){
                    button.up("relatorios_eventos_panel").unmask();
                }
            });
        }else{
            button.up("relatorios_eventos_panel").unmask();
        }
    },
    
    onPrintClick: function(button){
        document.getElementById("html").value = document.getElementById("evento").innerHTML;
        document.getElementById("form").action = 'php/reports/evento/imprimir.php';
        document.getElementById("form").submit();
    },
    
    onXlsClick: function(button){
        document.getElementById("html").value = document.getElementById("evento").innerHTML;
        document.getElementById("form").action = 'php/reports/evento/xls.php';
        document.getElementById("form").submit();
    },
    
    onPdfClick: function(button){
        document.getElementById("html").value = document.getElementById("evento").innerHTML;
        document.getElementById("form").action = 'php/reports/evento/pdf.php';
        document.getElementById("form").submit();
    }
    
});