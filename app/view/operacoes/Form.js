Ext.define("Eagle.view.operacoes.Form", {
    extend: "Ext.form.Panel",
    alias: "widget.operacoes_form",
    
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
                name: "idOperacao"
            },{
                fieldLabel: "Nome",
                name: "nome",
                allowBlank: false,
                minLength: 3,
                maxLength: 20
            },{
                xtype: "textarea",
                fieldLabel: "Descrição",
                name: "descricao",
                allowBlank: false,
                minLength: 10,
                maxLength: 400,
                resizable: true
            }]
        });
        
        this.callParent(arguments);
    }
});
