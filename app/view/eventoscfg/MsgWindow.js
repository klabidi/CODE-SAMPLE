Ext.define("Eagle.view.eventoscfg.MsgWindow", {
    extend: "Ext.window.Window",
    alias: "widget.msgcfg_window",
    
    requires: [
        "Eagle.view.eventoscfg.MsgForm"
    ],
    
    title: "Configuração de Mensagem",
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
                xtype: "msgcfg_form"
            }]
        });
        
        this.callParent(arguments);
    }
});