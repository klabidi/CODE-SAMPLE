Ext.define("Eagle.controller.principal.Principal", {
    extend: "Ext.app.Controller",
    models: [],
    stores: [],
    views: [
        "principal.Panel",
        "principal.mapa.Panel"
    ],
    
    refs: [{
        ref: "streetPanel",
        selector: "principal_panel > panel[region=center] > panel[itemId=street_view_panel]"
    },{
        ref: "gridButtonGroup",
        selector: "viewport > panel[region=north] > toolbar > buttongroup[itemId=gridButtonGroup]"
    }],
    
    init: function(){
        this.control({
            "principal_mapa_panel": {
                streetcloseclick: this.fecharStreetView,
                streetstatuschanged: this.mensagemStatus
            }
        });
    },
    
    fecharStreetView: function(){
        var button = this.getGridButtonGroup()
                         .down("button[action=mostrarStreetView]");
        
        button.setPressed(false);
    },
    
    mensagemStatus: function(mapa, status){
        var streetPanel = this.getStreetPanel(),
            msg;
        
        if(status === 'ZERO_RESULTS')
            msg = 'Imagem Não Disponível <img src="viewport/resources/images/mapa_icons/no-image.jpg>"';
        else if(status === 'UNKNOWN_ERROR')
            msg = 'Erro desconhecido.';
        
        streetPanel.update(msg);
    }
});