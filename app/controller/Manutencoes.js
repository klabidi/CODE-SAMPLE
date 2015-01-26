Ext.define("Eagle.controller.Manutencoes", {
    extend: "Ext.app.Controller",
    models: [],
    stores: [],
    views: [
        "manutencoes.Panel"
    ],
    
    init: function(){
        this.control({
            "manutencoespanel": {
                afterrender: this.onRender
            }
        });
    },
    
    /**
     * Deixa a primeira tab com permissão que for encontrada como ativa.
     * @param {object} panel
     * @returns {Boolean}
     */
    onRender: function(panel){
        var tabpanel = panel.down("tabpanel"),
            tabbar = tabpanel.getTabBar(),
            items = tabbar.items.items,
            i = 0;
        
        for(; i < items.length; i++){
            if(items[i].isVisible()){
                tabpanel.setActiveTab(i);
                return true;
            }
        }
        return true;
    }
});