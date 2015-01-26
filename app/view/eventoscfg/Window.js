Ext.define("Eagle.view.eventoscfg.Window", {
    extend: "Ext.window.Window",
    alias: "widget.eventoscfg_window",
    
    requires: [
        "Eagle.view.eventoscfg.Form"
    ],
    
    title: "Configuração",
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
                xtype: "eventoscfg_form"
            }]
        });
        
        this.callParent(arguments);
    }
});