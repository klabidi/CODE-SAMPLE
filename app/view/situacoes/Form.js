Ext.define("Eagle.view.situacoes.Form", {
    extend: "Ext.form.Panel",
    alias: "widget.situacoes_form",
    
    requires: [
        "Ext.form.field.Hidden"
    ],
    
    layout: "form",
    
    initComponent: function(){
        Ext.apply(this, {
            defaults: {
                xtype: "textfield"
            },
            items: [{
                xtype: "hidden",
                name: "idSituacao"
            },{
                xtype: "textfield",
                fieldLabel: "Descrição",
                name: "descricao",
                allowBlank: false
            }]
        });
        
        this.callParent(arguments);
    }
});
