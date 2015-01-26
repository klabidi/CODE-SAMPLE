Ext.define("Eagle.view.eventoscfg.MsgForm", {
    extend: "Ext.form.Panel",
    alias: "widget.msgcfg_form",
    
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
                fieldLabel: "Macros",
                name: "mensagem",
                allowBlank: false,
                queryMode: 'local',
                displayField: "mensagem",
                valueField: "mensagem",
                store: "MensagensMacros"
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
