Ext.define("Eagle.view.eventoscfg.Form", {
    extend: "Ext.form.Panel",
    alias: "widget.eventoscfg_form",
    
    requires: [
        "Ext.form.field.Hidden"
    ],
    
    layout: "form",
    
    initComponent: function(){
        Ext.apply(this, {
            items: [{
                xtype: "hidden",
                name: "operacao"
            },{
                xtype: "combobox",
                fieldLabel: "Evento",
                name: "codigo",
                allowBlank: false,
                queryMode: 'local',
                displayField: "descricao",
                valueField: "codigo",
                store: "EventosCfgCombo"
            },{
                xtype: "combobox",
                name: "idSituacao",
                fieldLabel: "Situação",
                displayField: "descricao",
                valueField: "idSituacao",
                store: "Situacoes"
            }]
        });
        
        this.callParent(arguments);
    }
});
