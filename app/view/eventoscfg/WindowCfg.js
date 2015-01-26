Ext.define("Eagle.view.eventoscfg.WindowCfg", {
    extend: "Ext.window.Window",
    alias: "widget.windowcfg",
    
    title: "Configuração de Eventos",
    height: 400,
    width: 500,
    border: false,
    layout: "fit",
    
    initComponent: function(){
        Ext.apply(this, {
            items: [{
                xtype: "panel",
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                },
                border: false,
                items: [{
                    xtype: "eventoscfg_grid",
                    flex: 1
                    
                },{
                    title: 'Configuração de Mensagens',
                    xtype: "msgcfg_grid",
                    flex: 1
                }]
            }]
        });
        
        this.callParent(arguments);
    }
});