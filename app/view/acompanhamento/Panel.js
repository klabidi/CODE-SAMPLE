Ext.define("Eagle.view.acompanhamento.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.acompanhamento_panel",
    
    requires: [
        "Ext.grid.filters.Filters",
        "Ext.grid.column.Widget",
        "Ext.form.field.ComboBox"
    ],
    
    border: false,
    layout: "fit",
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(me, {
            defaults: {
                border: false
            },
            dockedItems: [{ // Toolbar
                items: [{
                    action: "recarregar",
                    icon: "resources/images/16/ios7-refresh-empty.png",
                    tooltip: "Recarregar"
                },{
                    action: "filtrarOperacao",
                    displayField: "nome",
                    editable: false,
                    emptyText: "Operação",
                    valueField: "idOperacao",
                    store: "OperacoesUsuario",
                    xtype: "combobox"
                }],
                xtype: "toolbar"
            }],
            items: [{
                defaults: {
                    border: false,
                },
                xtype: "panel",
                layout: "border",
                stateful: true,
                items: [{ // Grid
                    itemId: "acompanhamento_panel_grid",
                    region: "center",
                    stateful: true, //seta o stateful para salvar o estado do componente em cookie
                    store: "Acompanhamentos",
                    xtype: "grid",
                    plugins: ["gridfilters"],
                    columns: [{
                        text: "Veículo",
                        dataIndex: "placa",
                        filter: "string",
                        width: 80,
                        renderer: function(value){
                            return "<a class='enableclick' onclick='fireEvent(\"acompanhamento_panel_grid\", \"veiculoclick\", \""+value+"\")'>" + value + "</a>";
                        },
                        filter: {
                            type: "string",
                            itemDefaults: {
                                emptyText: 'Filtro...'
                            }
                        }
                    },{
                        text: "Situação",
                        dataIndex: "situacao",
                        //align: "center",
                        width: 220,
                        renderer: function(value, meta){
                            return "<b>"+value+"</b>";
                        },
                        filter: {
                            type: "string",
                            itemDefaults: {
                                emptyText: 'Filtro...'
                            }
                        }
                    },{
                        text: "Data Inicial",
                        dataIndex: "data_inicio",
                        align: "center",
                        width: 130,
                        filter: {
                            type: "string",
                            itemDefaults: {
                                emptyText: 'Filtro...'
                            }
                        }
                    },{
                        text: "Tempo",
                        dataIndex: "data_inicio",
                        align: "center",
                        width: 80,
                        renderer: function(value, meta){
                            return dataDif(value);
                        },
                        filter: {
                            type: "string",
                            itemDefaults: {
                                emptyText: 'Filtro...'
                            }
                        }
                    },{
                        text: "Condutor",
                        dataIndex: "condutor",
                        align: "center",
                        flex: 2,
                        renderer: function(value){
                            return (value != '') ? value : "-";
                        },
                        filter: {
                            type: "string",
                            itemDefaults: {
                                emptyText: 'Filtro...'
                            }
                        }
                    },{
                        text: "Situação definida por",
                        width: 400,
                        renderer: function(value, meta){
                            if(meta.record.get("evento")){
                                if(meta.record.get("parametro")){
                                    return "<b>Evento:</b>  "+meta.record.get("evento")+" - "+meta.record.get("parametro");
                                }else{
                                    return "<b>Evento:</b>  "+meta.record.get("evento");
                                }
                            }else if(meta.record.get("mensagem")){
                                return "<b>Mensagem:</b>  "+meta.record.get("mensagem");
                            }else if(meta.record.get("usuario")){
                                return "<b>Usuário:</b>  "+meta.record.get("usuario");
                            }
                        },
                        filter: {
                            type: "string",
                            itemDefaults: {
                                emptyText: 'Filtro...'
                            }
                        }
                    }]
                }, { // detalhado
                    hidden: true,
                    border: true,
                    layout: "fit",
                    collapsible: true,
                    minWidth: 400,
                    region: "east",
                    resizable: true,
                    title: "Acompanhamento Detalhado",
                    titleAlign: "center",
                    xtype: "panel",
                    width: "80%",
                    items: [{
                        xtype: "panel",
                        itemId: "griddetalhado",
                        border: false,
                        layout: "fit",
                        items: [{ 
                            xtype: "grid",
                            width: "100%",
                            autoScroll: true,
                            border: false,
                            plugins: ["gridfilters"],
                            store: "AcompanhamentosDetalhados",
                            columns: [
                                {
                                    text: "Situação",
                                    dataIndex: "situacao",
                                    align: "center",
                                    flex: 1,
                                    renderer: function(value, meta){
                                        return "<b>"+value+"</b>";
                                    },
                                    filter: {
                                        type: "string",
                                        itemDefaults: {
                                            emptyText: 'Filtro...'
                                        }
                                    }
                                },{
                                    text: "Data Inicial",
                                    dataIndex: "data_inicio",
                                    align: "center",
                                    width: 130,
                                    filter: {
                                        type: "string",
                                        itemDefaults: {
                                            emptyText: 'Filtro...'
                                        }
                                    }
                                },{
                                    text: "Data Final",
                                    dataIndex: "data_fim",
                                    align: "center",
                                    width: 130,
                                    filter: {
                                        type: "string",
                                        itemDefaults: {
                                            emptyText: 'Filtro...'
                                        }
                                    }
                                },{
                                    text: "Tempo",
                                    dataIndex: "data_inicio",
                                    align: "center",
                                    width: 80,
                                    renderer: function(value, meta){
                                        return dataDif(value);
                                    },
                                    filter: {
                                        type: "string",
                                        itemDefaults: {
                                            emptyText: 'Filtro...'
                                        }
                                    }
                                },{
                                    text: "Situação definida por",
                                    width: 250,
                                    renderer: function(value, meta){
                                        if(meta.record.get("evento")){
                                            if(meta.record.get("parametro")){
                                                return "<b>Evento:</b>  "+meta.record.get("evento")+" - "+meta.record.get("parametro");
                                            }else{
                                                return "<b>Evento:</b>  "+meta.record.get("evento");
                                            }
                                        }else if(meta.record.get("mensagem")){
                                            return "<b>Mensagem:</b>  "+meta.record.get("mensagem");
                                        }else if(meta.record.get("usuario")){
                                            return "<b>Usuário:</b>  "+meta.record.get("usuario");
                                        }
                                    },
                                    filter: {
                                        type: "string",
                                        itemDefaults: {
                                            emptyText: 'Filtro...'
                                        }
                                    }
                                }
                            ]
                        }]
                    }]
                }]
            }]
        });
        
        me.callParent(arguments);
    }
});