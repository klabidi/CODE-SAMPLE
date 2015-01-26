Ext.define("Eagle.view.principal.mapa.Panel", {
    extend: "Ext.ux.GMapPanel",
    alias: "widget.principal_mapa_panel",
    
    initComponent: function(){
        Ext.apply(this, {
            mapOptions: {
                zoom: 4,
                scaleControl: true,
                center: {
                    lat: -28.2620,
                    lng: -52.4102
                }
            }
        });
        
        this.callParent(arguments);
    }
});