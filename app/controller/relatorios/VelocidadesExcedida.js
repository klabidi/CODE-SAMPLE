Ext.define("Eagle.controller.relatorios.VelocidadesExcedida", {
    extend: "Ext.app.Controller",
    models: [
        "Operacao",
        "Condutor",
        "Veiculo"
    ],
    stores: [
        "OperacoesUsuario",
        "Condutores",
        "VeiculosOperacoes"
    ],
    views: [
        "relatorios.velocidadesexcedida.Panel"
    ],
    
    refs: [{
        ref: "treepanel",
        selector: "relatorios_velocidadesexcedida_panel > panel[region=west] > treepanel"
    }],
    
    init: function(){
        this.control({
            "relatorios_velocidadesexcedida_panel > panel[region=west] > combobox[name=operacao]": {
                change: this.onOperacaoChange
            },
            "relatorios_velocidadesexcedida_panel > panel[region=west] > radiogroup[name=tipo]": {
                change: this.onTipoChange
            },
            "relatorios_velocidadesexcedida_panel > panel[region=west] button[action=filtrar]": {
                click: this.onFiltrarClick
            },
            "relatorios_velocidadesexcedida_panel > panel[region=center] > toolbar [action=exportaPrint]": {
                click: this.onPrintClick
            },
            "relatorios_velocidadesexcedida_panel > panel[region=center] > toolbar [action=exportaXls]": {
                click: this.onXlsClick
            },
            "relatorios_velocidadesexcedida_panel > panel[region=center] > toolbar [action=exportaPdf]": {
                click: this.onPdfClick
            }
        });
    },
    
    onOperacaoChange: function(combo, newValue){
        var tipoRadiogroup = combo.up("form").down("radiogroup[name=tipo]");
        
        tipoRadiogroup.enable();
        this.getCondutoresStore().load();
        this.getVeiculosOperacoesStore().load({
            params: {
                operacao: newValue
            }
        });
    },
    
    onTipoChange: function(radio, newValue){
        var placaCombobox = radio.up("form").down("combobox[name=placa]"),
            condutorCombobox = radio.up("form").down("combobox[name=condutor]");
        
        if(newValue.tipo === 1){
            placaCombobox.enable();
            condutorCombobox.disable();
        }else{
            condutorCombobox.enable();
            placaCombobox.disable();
        }
    },
    
    onFiltrarClick: function(button){
        var panel = button.up("relatorios_velocidadesexcedida_panel").down("panel[region=center]"),
            form = button.up("form"),
            values;
        
        values = form.getValues();
        
        button.up("relatorios_velocidadesexcedida_panel").mask("Carregando...");
        panel.loader = {
            url: (values.relatorio === 1) ? "php/reports/velocidade_excedida/detalhado.php" : "php/reports/velocidade_excedida/resumido.php",
            params: {
                placa:      values.placa,
                condutor:   values.condutor,
                tipo:       values.tipo,
                operacao:   values.operacao,
                dataIni:    values.dataIni,
                dataFim:    values.dataFim
            }
        };
        panel.getLoader().load({
            callback: function(){
                button.up("relatorios_velocidadesexcedida_panel").unmask();
            }
        });
    },
    
    onPrintClick: function(button){
        document.getElementById("html").value = document.getElementById("vel_excedida").innerHTML;
        document.getElementById("form").action = 'php/reports/velocidade_excedida/imprimir.php';
        document.getElementById("form").submit();
    },
    
    onXlsClick: function(button){
        document.getElementById("html").value = document.getElementById("vel_excedida").innerHTML;
        document.getElementById("form").action = 'php/reports/velocidade_excedida/xls.php';
        document.getElementById("form").submit();
    },
    
    onPdfClick: function(button){
        document.getElementById("html").value = document.getElementById("vel_excedida").innerHTML;
        document.getElementById("form").action = 'php/reports/velocidade_excedida/pdf.php';
        document.getElementById("form").submit();
    }
    
});