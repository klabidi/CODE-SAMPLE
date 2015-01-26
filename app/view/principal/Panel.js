Ext.define("Eagle.view.principal.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.principal_panel",
    
    layout: "border",
    border: false,
    itemId: "principal",
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(me, {
            defaults: {
                border: false
            },
            items: [{
                xtype: "panel",
                region: "center",
                layout: "border",
                items: [{
                    xtype: "principal_mapa_panel",
                    region: "center"
                },{
                    itemId: "street_view_panel",
                    xtype: "panel",
                    region: "east",
                    collapsed: true,
                    hidden: true,
                    resizable: true,
                    width: "40%",
                    listeners: {
                        collapse: function(panel){
                            panel.hide();
                        }
                    }
                },{
                    itemId: "panelRoteirizadorView",
                    xtype: "panel",
                    region: "west",
                    autoScroll: true,
                    collapsed: true,
                    resizable: true,
                    hidden: true,
                    minWidth: 270,
                    width: 270,
                    border: false,
                    layout: "anchor",
                    defaults: {
                        anchor: "100%"
                    },
                    listeners: {
                        collapse: function(panel){
                            panel.hide();
                        }
                    },
                    items: [{
                        xtype: "principal_mapa_roteirizador_grid",
                    },{
                        xtype: "panel",
                        border: false,
                        html: "<div id='divRoteirizacaoResult'></div>"
                    }]
                }]
            },{
                xtype: "tabpanel",
                region: "south",
                collapsible: false,
                defaults: {
                    border: false
                },
                split: true,
                height: "50%",
                stateId: "estadoSouthPanelPrincipalPanel",
                stateful: true,
                items: [{
                    title: "Veículos",
                    layout: "fit",
                    icon: "resources/images/16/truck-outline.png",
                    items: [{
                        xtype: "principal_grid"
                    }]
                },{
                    title: "Pontos de Referência",
                    layout: "fit",
                    icon: "resources/images/16/ios7-location-outline.png",
                    items: [{
                        xtype: "principal_pontosreferencia_grid"
                    }]
                }]
            }]
        });
        
        me.callParent(arguments);
    },
    
    expandStreetViewPanel: function(){
        var panel = this.down("panel > panel[itemId=street_view_panel]");
        
        panel.show();
        panel.expand();
    },
    
    collapseStreetViewPanel: function(){
        var panel = this.down("panel > panel[itemId=street_view_panel]");
        
        panel.collapse();
    }
});