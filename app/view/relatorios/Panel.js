Ext.define("Eagle.view.relatorios.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.relatorios_panel",
    
    autoScroll: true,
    layout: "fit",
    border: false,
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(this, {
            dockedItems: [{
                dock: "top",
                xtype: "toolbar",
                items: [{
                    xtype: "button",
                    action: "veiculos",
                    text: "Veículos",
                    icon: "resources/images/16/truck-outline.png",
                    menu: [{
                        xtype: "menuitem",
                        text: "Posições",
                        icon: "resources/images/16/ios7-navigate-outline.png",
                        handler: function(){
                            me.fireEvent("relatorioclick", "relatorios_posicoes_panel");
                        }
                    },{
                        xtype: "menuitem",
                        text: "Eventos",
                        icon: "resources/images/16/ios7-bell-outline.png",
                        handler: function(){
                            me.fireEvent("relatorioclick", "relatorios_eventos_panel");
                        }
                    },{
                        xtype: "menuitem",
                        text: "Notificações",
                        icon: "resources/images/16/ios7-lightbulb-outline.png",
                        handler: function(){
                            me.fireEvent("relatorioclick", "relatorios_notificacoes_panel");
                        }
                    },{
                        xtype: "menuitem",
                        text: "Velocidade Excedida",
                        icon: "resources/images/16/ios7-speedometer-outline.png",
                        handler: function(){
                            me.fireEvent("relatorioclick", "relatorios_velocidadesexcedida_panel");
                        }
                    }]
                }]
            }],
            items: [{
                xtype: "tabpanel",
                border: false
            }]
        });
        
        this.callParent(arguments);
    }
});