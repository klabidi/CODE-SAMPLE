Ext.define("Eagle.controller.relatorios.Notificacoes", {
    extend: "Ext.app.Controller",
    models: [
        //"MensagemMacro"
    ],
    stores: [
        //"MensagensMacros",
        "VeiculosTree",
        "UsuariosTree"
    ],
    views: [
        "relatorios.notificacoes.Panel"
    ],
    
    refs: [{
        ref: "treepanel",
        selector: "relatorios_notificacoes_panel > panel[region=west] > treepanel"
    },{
        ref: "panel",
        selector: "relatorios_notificacoes_panel"
    }],
    
    init: function(){
        this.control({
            "relatorios_notificacoes_panel > panel[region=west] button[action=filtrar]": {
                click: this.onFiltrarClick
            },
            "relatorios_notificacoes_panel > panel[region=center] > toolbar [action=exportaPrint]": {
                click: this.onPrintClick
            },
            "relatorios_notificacoes_panel > panel[region=center] > toolbar [action=exportaXls]": {
                click: this.onXlsClick
            },
            "relatorios_notificacoes_panel > panel[region=center] > toolbar [action=exportaPdf]": {
                click: this.onPdfClick
            }
        });
    },
    
    onFiltrarClick: function(button){
        var panel = button.up("relatorios_notificacoes_panel").down("panel[region=center]"),
            treepanel = button.up("panel").down("treepanel"),
            form = button.up("panel").down("form"),
            dado, values;
        
        button.up("relatorios_notificacoes_panel").mask("Carregando...");
        if(treepanel.getSelection().length > 0 && form.isValid()){
            dado = treepanel.getSelection()[0].getId();
            values = form.getValues();
            
            if(values.hidden=='veiculo'){
                panel.loader = {
                    url: "php/reports/notificacao/notVeiculo.php",
                    params: {
                        placa: dado,
                        mensagem: values.mensagemField,
                        dataIni: values.dataIni,
                        dataFim: values.dataFim,
                        horaIni: values.horaIni,
                        horaFim: values.horaFim
                    }
                };
            }else if(values.hidden=='usuario'){
                panel.loader = {
                    url: "php/reports/notificacao/notUsuario.php",
                    params: {
                        usuario: dado,
                        mensagem: values.mensagemField,
                        dataIni: values.dataIni,
                        dataFim: values.dataFim,
                        horaIni: values.horaIni,
                        horaFim: values.horaFim
                    }
                };
            }
            
            panel.getLoader().load({
                callback: function(){
                    button.up("relatorios_notificacoes_panel").unmask();
                }
            });
        }else{
            button.up("relatorios_notificacoes_panel").unmask();
        }
    },
    
    onPrintClick: function(button){
        document.getElementById("html").value = document.getElementById("notific").innerHTML;
        document.getElementById("form").action = 'php/reports/notificacao/imprimir.php';
        document.getElementById("form").submit();
    },
    
    onXlsClick: function(button){
        document.getElementById("html").value = document.getElementById("notific").innerHTML;
        document.getElementById("form").action = 'php/reports/notificacao/xls.php';
        document.getElementById("form").submit();
    },
    
    onPdfClick: function(button){
        document.getElementById("html").value = document.getElementById("notific").innerHTML;
        document.getElementById("form").action = 'php/reports/notificacao/pdf.php';
        document.getElementById("form").submit();
    }
    
});