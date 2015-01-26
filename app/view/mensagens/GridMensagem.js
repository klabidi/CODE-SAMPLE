Ext.define("Eagle.view.mensagens.GridMensagem", {
    extend: "Ext.form.Panel",
    alias: "widget.grid_mensagem_form",
    
    requires: [
        "Ext.layout.container.Column", 
        "Ext.form.FieldSet",
        "Ext.form.field.Hidden"
    ],
    
    autoScroll: true,
    border: false,
    layout: {
        type: "hbox",
        align: "stretch"
    },
    viewModel: true,
    loadMask: true,
    
    initComponent: function(){
        Ext.apply(this, {
            fieldDefaults: {
                labelAlign: 'left',
                labelWidth: 90,
                anchor: '100%',
                msgTarget: 'side'
            },
            items: [{ 
                xtype: 'grid',
                autoScroll: true,
                border: true,
                plugins: ["gridfilters"],
                publishes: "selection",
                store: "MensagensHistoricos",
                maxHeight: 150,
                columns: {
                    items: [
                        {
                            text: "Data / Hora", 
                            dataIndex: "data",
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Mensagem", 
                            dataIndex: "mensagem", 
                            flex: 2,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Enviado Por", 
                            dataIndex: "enviado", 
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Recebido Por", 
                            dataIndex: "recebido", 
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        }
                    ]
                }
            }]
        });
        
        this.callParent(arguments);
    }
});