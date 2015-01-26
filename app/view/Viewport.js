Ext.define("Eagle.view.Viewport", {
    extend: "Ext.Viewport",
    layout: "border",
    requires: [
        "Ext.layout.container.Border",
        "Ext.tab.Panel",
        "Ext.ux.GMapPanel",
        "Ext.Img",
        "Ext.container.ButtonGroup"
    ],

    initComponent: function(){
        Ext.apply(this, {
            items: [{
                xtype: "panel",
                region: "north",
                border: false,
                dockedItems: [{
                    xtype: "toolbar",
                    dock: "top",
                    items: [{
                        xtype: "image",
                        src: "resources/images/index/header.png",
                        border: false
                    },"->",{
                        itemId: "gridButtonGroup",
                        xtype: "buttongroup",
                        border: false,
                        items: [{
                            action: "mostrarStreetView",
                            icon: "resources/images/16/eye.png",
                            tooltip: "Mostrar/Ocultar StreetView",
                            enableToggle: true,
                            pressed: false
                        },{
                            action: "mostrarGrid",
                            icon: "resources/images/16/navicon.png",
                            tooltip: "Mostrar/Ocultar Grid",
                            enableToggle: true,
                            pressed: true
                        }],
                        hidden: true
                    },{
                        itemId: "defaultButtonGroup",
                        xtype: "buttongroup",
                        border: false,
                        items: [{
                            hidden: true,
                            action: "mostrarAvisos",
                            icon: "resources/images/index/alerta.gif",
                            tooltip: "Visualizar avisos"
                        },{
                            action: "trocarVisualizacao",
                            icon: "resources/images/16/ios7-eye-outline.png",
                            tooltip: "Trocar Visualização",
                            hidden: true
                        }]
                    },"-",{
                        xtype: "tbtext",
                        text: ""
                    },{
                        itemId: "sairButtonGroup",
                        xtype: "buttongroup",
                        border: false,
                        items: [{
                            action: "ajudar",
                            icon: "resources/images/16/help.png",
                            tooltip: "Central de Ajuda",
                            menu: [{
                                action: "sobre",
                                icon: "resources/images/16/ios7-information-outline.png",
                                text: "Sobre"
                            },{
                                action: "contato",
                                icon: "resources/images/16/ios7-telephone-outline.png",
                                text: "Contato"
                            },{
                                action: "download",
                                icon: "resources/images/16/ios7-download-outline.png",
                                text: "Downloads"
                            }]
                        },{
                            action: "sair",
                            text: "Sair",
                            icon: "resources/images/16/eject.png",
                            tooltip: "Sair do Eagle 4"
                        }]
                    }]
                }]
            },{
                xtype: "notificacoes_panel",
                region: "east"
            },{
                xtype: "panel",
                region: "center",
                layout: "fit",
                border: false,
                items: [{
                    xtype: "tabpanel",
                    layout: "fit",
                    border: false,
                    tabPosition: "left",
                    tabRotation: 0,
                    items: [{
                        xtype: "dashboard_panel",
                        icon: "resources/images/16/ios7-pulse-strong.png",
                        tooltip: "Dashboard",
                        hidden: !Eagle.permissao.verificarPermissao(5)
                    },{
                        xtype: "principal_panel",
                        icon: "resources/images/16/earth.png",
                        tooltip: "Mapa e Grid Principal",
                        hidden: !Eagle.permissao.verificarPermissao(6)
                    },{
                        xtype: "acompanhamento_panel",
                        icon: "resources/images/16/ios7-pricetags.png",
                        tooltip: "Acompanhamento de Situações",
                        hidden: !Eagle.permissao.verificarPermissao(14)
                    },{
                        xtype: "manutencoespanel",
                        icon: "resources/images/16/ios7-gear.png",
                        tooltip: "Cadastros e Manutenções",
                        hidden: !Eagle.permissao.verificarPermissao(7)
                    },{
                        xtype: "relatorios_panel",
                        icon: "resources/images/16/pie-graph.png",
                        tooltip: "Relatórios",
                        disabled: false,
                        hidden: !Eagle.permissao.verificarPermissao(12)
                    }]
                }]
            }]
        });
        
        this.callParent(arguments);
    }
});