Ext.define("Eagle.view.situacoes.Window", {
    extend: "Ext.window.Window",
    alias: "widget.situacoes_window",
    
    requires: [
        "Eagle.view.situacoes.Form"
    ],
    
    title: "Manutenção de Situações de Veículo",
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
                xtype: "situacoes_form"
            }]
        });
        
        this.callParent(arguments);
    }
});