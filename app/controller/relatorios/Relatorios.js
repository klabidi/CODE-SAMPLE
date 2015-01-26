Ext.define("Eagle.controller.relatorios.Relatorios", {
    extend: "Ext.app.Controller",
    models: [],
    stores: [
        "Relatorios"
    ],
    views: [
        "relatorios.Panel"
    ],
    
    init: function(){
        this.control({
            "relatorios_panel": {
                relatorioclick: this.onRelatorioClick
            }
        });
    },
    
    onRelatorioClick: function(relatorio){
        var tabpanel = Ext.ComponentQuery.query("relatorios_panel > tabpanel")[0],
            panel;
        
        panel = tabpanel.down(relatorio);
        
        if(!panel){
            panel = tabpanel.add({
                xtype: relatorio,
                closable: true
            });
        }
        
        tabpanel.setActiveTab(panel);
    }
});