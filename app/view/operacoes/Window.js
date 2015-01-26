Ext.define("Eagle.view.operacoes.Window", {
    extend: "Ext.window.Window",
    alias: "widget.operacoes_window",
    
    requires: [
        "Eagle.view.operacoes.Form"
    ],
    
    title: "Manutenção de Operações",
    width: 400,
    border: false,
    modal: true,
    layout: "fit",
    
    initComponent: function(){
        Ext.apply(this, {
            buttons: [{
                text: "Salvar",
                action: "salvar"
            },{
                text: "Cancelar",
                action: "cancelar"
            }],
            items: [{
                xtype: "operacoes_form"
            }]
        });
        
        this.callParent(arguments);
    }
});