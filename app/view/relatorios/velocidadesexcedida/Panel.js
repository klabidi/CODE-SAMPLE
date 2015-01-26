Ext.define("Eagle.view.relatorios.velocidadesexcedida.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.relatorios_velocidadesexcedida_panel",
    requires: [
        "Ext.form.RadioGroup"
    ],
    border: false,
    autoScroll: false,
    layout: "border",
    title: "Velocidade Excedida",
    icon: "resources/images/16/ios7-speedometer-outline.png",
    initComponent: function(){
        Ext.apply(this, {
            items: [{
                buttons: [{
                    action: "filtrar",
                    text: "Filtrar"
                }],
                collapsible: true,
                border: false,
                items: [{
                    allowBlank: false,
                    displayField: "nome",
                    forceSelection: true,
                    fieldLabel: "Operação",
                    name: "operacao",
                    store: "OperacoesUsuario",
                    valueField: "idOperacao",
                    xtype: "combobox"
                },{
                    allowBlank: false,
                    columns: [100, 100],
                    fieldLabel: "Relatório",
                    items: [
                        {boxLabel: "Detalhado", name: "relatorio", inputValue: 1},
                        {boxLabel: "Resumido", name: "relatorio", inputValue: 2},
                    ],
                    vertical: true,
                    xtype: "radiogroup"
                },{
                    allowBlank: false,
                    columns: [100, 100],
                    disabled: true,
                    fieldLabel: "Tipo",
                    items: [
                        {boxLabel: 'Veículo',  name: 'tipo', inputValue: 1},
                        {boxLabel: 'Condutor', name: 'tipo', inputValue: 2}
                    ],
                    name: "tipo",
                    vertical: true,
                    xtype: "radiogroup"
                },{
                    xtype: "combobox",
                    name: "condutor",
                    store: "Condutores",
                    fieldLabel: "Condutor",
                    allowBlank: false,
                    displayField: "nome",
                    valueField: "idCondutor",
                    queryMode: "local",
                    forceSelection: true,
                    disabled: true
                },{
                    xtype: "combobox",
                    name: "placa",
                    store: "VeiculosOperacoes",
                    allowBlank: false,
                    fieldLabel: "Veículo",
                    displayField: "placa",
                    valueField: "placa",
                    queryMode: "local",
                    forceSelection: true,
                    disabled: true
                },{
                    allowBlank: false,
                    fieldLabel: "Data Início",
                    name: "dataIni",
                    value: new Date(),
                    xtype: "datefield"
                },{
                    allowBlank: false,
                    fieldLabel: "Data Fim",
                    name: "dataFim",
                    value: new Date(),
                    xtype: "datefield"
                }],
                layout: "form",
                resizable: true,
                region: "west",
                title: "Filtro",
                width: "25%",
                xtype: "form"
            },{
                autoScroll: true,
                region: "center",
                xtype: "panel",
                border: false,
                tbar: [
                    "->",
                    {
                        tooltip:'Imprimir relatório',
                        icon: 'resources/images/16/printer1.png',
                        action: 'exportaPrint'
                    },{
                        tooltip:'Exportar .xls',
                        icon: 'resources/images/16/xls.png',
                        action: 'exportaXls'
                    },{
                        tooltip:'Exportar .pdf',
                        icon: 'resources/images/16/pdf.png',
                        action: 'exportaPdf'
                    }
                ]
            }]
        });
        
        this.callParent(arguments);
    }
});