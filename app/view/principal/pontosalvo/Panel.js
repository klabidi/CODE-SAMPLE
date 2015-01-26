Ext.define("Eagle.view.principal.pontosalvo.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.principal_panel_pontosalvo_panel",
    
    viewModel: true,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    
    initComponent: function(){
        Ext.apply(this, {
            items: [{
                xtype: "fieldset",
                layout: "hbox",
                border: false,
                padding: "10 10 0 10",
                items: [{
                    xtype: "checkbox",
                    padding: "0 10 0 0",
                    checked: true,
                    reference: "pontosReferenciaCheckbox"
                },{
                    xtype: "combobox",
                    store: "PontosReferencia",
                    displayField: "descricao",
                    valueField: "idPontoReferencia",
                    itemId: "pontosReferenciaCombo",
                    queryMode: "local",
                    flex: 1,
                    emptyText: "Referência",
                    bind: {
                        disabled: "{!pontosReferenciaCheckbox.checked}"
                    }
                }]
            },{
                xtype: "fieldset",
                layout: "hbox",
                border: false,
                padding: "0 10 0 10",
                items: [{
                    xtype: "checkbox",
                    padding: "0 10 0 0",
                    reference: "veiculosCheckbox"
                },{
                    xtype: "combobox",
                    store: "VeiculosEmpresa",
                    displayField: "placa",
                    valueField: "placa",
                    itemId: "veiculosCombo",
                    queryMode: "local",
                    flex: 1,
                    emptyText: "Veículo",
                    bind: {
                        disabled: "{!veiculosCheckbox.checked}"
                    }
                }]
            },{
                xtype: "grid",
                itemId: "grid",
                columns: [],
                tools: [{
                    action: "adicionar",
                    type: "plus",
                    tooltip: "Adicionar"
                }],
                selType: 'cellmodel',
                plugins: {
                    ptype: "cellediting",
                    clicksToEdit: 2,
                    pluginId: "cellediting"
                },
                padding: 10,
                title: "Veículos",
                flex: 1,
                border: true,
                viewConfig: {
                    emptyText: "Selecione um filtro",
                    deferEmptyText: false
                }
            }]
        });
        
        this.callParent(arguments);
    }
});