Ext.define("Eagle.view.relatorios.notificacoes.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.relatorios_notificacoes_panel",
    requires: [
        "Ext.form.RadioGroup",
        "Ext.layout.container.Accordion"
    ],
    autoScroll: false,
    layout: "border",
    title: "Notificações",
    icon: "resources/images/16/ios7-lightbulb-outline.png",
    border: false,
    initComponent: function(){
        Ext.applyIf(this, {
            items: [{
                resizable: true,
                region: "west",
                title: "Filtro",
                width: "25%",
                collapsible: true,
                buttons: [{
                    action: "filtrar",
                    text: "Filtrar"
                }],
                layout: {
                    type: 'accordion',
                    titleCollapse: false,
                    animate: true,
                    activeOnTop: true,
                    border: false
                },
                items: [{
                    title: 'Veículo', 
                    layout: {
                        type: "vbox",
                        border: false,
                        align: "stretch"
                    },
                    items: [{
                        flex: 1,
                        rootVisible: false,
                        scroll: "vertical",
                        store: "VeiculosTree",
                        xtype: "treepanel",
                        border: false
                    },{
                        layout: "form",
                        xtype: "form",
                        border: false,
                        items: [{
                            xtype: 'hiddenfield',
                            name: 'hidden',
                            value: 'veiculo'
                        },/*{
                            xtype: "combobox",
                            fieldLabel: "Mensagem",
                            name: "mensagemField",
                            store: "MensagensMacros",
                            //queryMode: "local",
                            //valueField: "mensagem",
                            displayField: "mensagem"
                        },*/
                        {
                            xtype: "textfield",
                            fieldLabel: "Mensagem",
                            name: "mensagemField",
                            displayField: "mensagem"
                        },{
                            allowBlank: false,
                            fieldLabel: "Data Início",
                            name: "dataIni",
                            value: new Date(),
                            xtype: "datefield"
                        },{
                            allowBlank: false,
                            fieldLabel: "Data Fim",
                            name: "dataFim",
                            value: new Date(),
                            xtype: "datefield"
                        },{
                            fieldLabel: "Hora Início",
                            emptyText: "Hora Início",
                            format: "H:i",
                            name: "horaIni",
                            value: "00:00",
                            xtype: "timefield"
                        },{
                            fieldLabel: "Hora Fim",
                            emptyText: "Hora Fim",
                            format: "H:i",
                            name: "horaFim",
                            value: "23:59",
                            xtype: "timefield"
                        }]
                    }]
                },{
                    title: 'Usuário',
                    layout: {
                        type: "vbox",
                        align: "stretch"
                    },
                    items: [{
                        border: false,
                        flex: 1,
                        rootVisible: false,
                        scroll: "vertical",
                        store: "UsuariosTree",
                        xtype: "treepanel"
                    },{ 
                        layout: "form",
                        xtype: "form",
                        border: false,
                        items: [{
                            xtype: 'hiddenfield',
                            name: 'hidden',
                            value: 'usuario'
                        },{
                            xtype: "textfield",
                            fieldLabel: "Mensagem",
                            name: "mensagemField",
                            displayField: "mensagem"
                        },{
                            allowBlank: false,
                            fieldLabel: "Data Início",
                            name: "dataIni",
                            value: new Date(),
                            xtype: "datefield"
                        },{
                            allowBlank: false,
                            fieldLabel: "Data Fim",
                            name: "dataFim",
                            value: new Date(),
                            xtype: "datefield"
                        },{
                            fieldLabel: "Hora Início",
                            emptyText: "Hora Início",
                            format: "H:i",
                            name: "horaIni",
                            value: "00:00",
                            xtype: "timefield"
                        },{
                            fieldLabel: "Hora Fim",
                            emptyText: "Hora Fim",
                            format: "H:i",
                            name: "horaFim",
                            value: "23:59",
                            xtype: "timefield"
                        }]
                    }]
                }]
                
            },{
                border: false,
                autoScroll: true,
                region: "center",
                xtype: "panel",
                tbar: [
                    "->",
                    {
                        tooltip:'Imprimir relatório',
                        icon: 'resources/images/16/printer1.png',
                        action: 'exportaPrint'
                    },{
                        tooltip:'Exportar .xls',
                        icon: 'resources/images/16/xls.png',
                        action: 'exportaXls'
                    },{
                        tooltip:'Exportar .pdf',
                        icon: 'resources/images/16/pdf.png',
                        action: 'exportaPdf'
                    }
//                    {
//                        xtype: 'button',
//                        //text: 'Exportação',
//                        icon: 'resources/images/16/ios7-more-outline.png',
//                        menu: [{
//                            text:'Inprimir',
//                            icon: 'resources/images/16/ios7-printer-outline.png',
//                            action: 'exportaPrint'
//                        },{
//                            text:'Xls',
//                            icon: 'resources/images/16/xls.png',
//                            action: 'exportaXls'
//                        },{
//                            text:'Pdf',
//                            icon: 'resources/images/16/pdf.png',
//                            action: 'exportaPdf'
//                        }]
//                    }
                ]
            }]
        });
        
        this.callParent(arguments);
    }
});