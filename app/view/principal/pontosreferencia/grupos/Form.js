Ext.define("Eagle.view.principal.pontosreferencia.grupos.Form", {
    extend: "Ext.form.Panel",
    alias: "widget.principal_pontosreferencia_grupos_form",
    
    border: false,
    margin: 5,
    
    initComponent: function(){
        Ext.apply(this, {
            defaults: {
                anchor: "100%",
                xtype: "textfield"
            },
            items: [{
                xtype: "hidden",
                name: "idReferenciaGrupo"
            },{
                allowBlank: false, 
                fieldLabel: "Nome", 
                name: "nome" 
            }],
            layout: "form"
        });
        
        this.callParent(arguments);
    }
});