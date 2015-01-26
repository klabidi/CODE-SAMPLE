Ext.define("Eagle.view.principal.Grid", {
    extend: "Ext.grid.Panel",
    alias: "widget.principal_grid",
    
    requires: [
        "Ext.ux.form.SearchField",
        "Ext.grid.column.Widget",
        "Ext.sparkline.Line",
        "Ext.grid.plugin.RowExpander",
        "Ext.grid.filters.Filters",
        "Ext.grid.column.Action"
    ],
    
    border: false,
    store: "Rotas",
    loadMask: true,
    selType: "checkboxmodel",
    
    stateId: "estadoVeiculosPrincipalGrid", //adiciona id único para o componente
    stateful: true, //seta o stateful para salvar o estado do componente em cookie
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(this, {
            columns: {
                items: [{
                    text: "Placa",
                    dataIndex: "placa",
                    width: 100,
                    itemId: "veiculo_column_grid_principal",
                    renderer: function(value){
                        return "<a class='enableclick' onclick='fireEvent(\"veiculo_column_grid_principal\", \"veiculoclick\", \""+value+"\")'>" + value + "</a>";
                    },
                    filter: {
                        type: "string",
                        itemDefaults: {
                            emptyText: 'Filtro...'
                        }
                    }
                },{
                    text: "Frota",
                    dataIndex: "frota",
                    width: 100,
                    filter: {
                        type: "string",
                        itemDefaults: {
                            emptyText: 'Filtro...'
                        }
                    }
                },{
                    text: "Data",
                    dataIndex: "data",
                    width: 150,
                    renderer: function(value){
                        return Ext.Date.format(value, "d/m/Y H:i");
                    },
                    filter: "date"
                },{
                    text: "Condutor",
                    dataIndex: "condutor",
                    flex: 1,
                    filter: {
                        type: "string",
                        itemDefaults: {
                            emptyText: 'Filtro...'
                        }
                    }
                },{
                    text: "Status",
                    dataIndex: "situacao",
                    flex: 1,
                    filter: {
                        type: "list",
                        options: ["Desligado", "Ligado", "Em Movimento"]
                    }
                },{
                    text: "Situação",
                    dataIndex: "situacao2",
                    flex: 1,
                    /*renderer: function(value, meta){
                        if(meta.record.get("situacao2")){
                            meta.style = "color:green";
                            return value;
                        }else{
                            return value;
                        }
                    },*/
                    filter: {
                        type: "string",
                        itemDefaults: {
                            emptyText: 'Filtro...'
                        }
                    }
                },{
                    text: "Velocidade",
                    dataIndex: "velocidade",
                    width: 100,
                    filter: {
                        type: "numeric",
                        itemDefaults: {
                            emptyText: 'Filtro...'
                        }
                    }
                },{
                    text: "Localização",
                    dataIndex: "localizacao",
                    flex: 1,
                    filter: {
                        type: "string",
                        itemDefaults: {
                            emptyText: 'Filtro...'
                        }
                    }
                },{
                    text: "Referência",
                    dataIndex: "referencia",
                    flex: 1,
                    filter: {
                        type: "string",
                        itemDefaults: {
                            emptyText: 'Filtro...'
                        }
                    }
                }]
            },
            dockedItems: [{
                dock: "top",
                xtype: "toolbar",
                items: [{
                    xtype: "button",
                    icon: "resources/images/16/ios7-refresh-empty.png",
                    action: "refresh",
                    tooltip: "Recarregar o Grid"
                },{
                    xtype: "button",
                    icon: "resources/images/16/ios7-close-empty.png",
                    action: "clearAll",
                    tooltip: "Limpar Todas as Seleções do Grid"
                },{
                    xtype: "combobox",
                    action: "filtrarOperacao",
                    displayField: "nome",
                    valueField: "idOperacao",
                    store: "OperacoesUsuario",
                    editable: false
                },{
                    xtype: "button",
                    action: "comandosEspera",
                    icon: "resources/images/16/ios7-stopwatch-outline.png",
                    tooltip: "Comandos em Espera Para Envio",
                    hidden: true
                },{
                    xtype: "button",
                    action: "pontosAlvo",
                    icon: "resources/images/16/ios7-location-outline.png",
                    text: "Pontos Alvo"
                },"->",{
                    xtype: "checkbox",
                    action: "autoRefresh",
                    fieldLabel: "Atualização Automática",
                    labelWidth: 145,
                    value: true
                }]
            }],
            plugins: ["gridfilters", {
                ptype: "rowexpander",
                rowBodyTpl: new Ext.XTemplate(
                    "<p>Localização: {localizacao}</p>"
                )
            }],
            selModel: {
                showHeaderCheckbox: true,
                pruneRemoved: false,
                ignoreRightMouseSelection: true,
                listeners: {
                    beforeselectall: function(){
                        return me.fireEvent("beforeselectall", me);
                    },
                    beforedeselectall: function(){
                        return me.fireEvent("beforedeselectall", me);
                    },
                    selectall: function(){
                        return me.fireEvent("selectall", me);
                    },
                    deselectall: function(){
                        return me.fireEvent("deselectall", me);
                    }
                }
            },
            viewConfig: {
                trackOver: true,
                markDirty:false
            }
        });
        
        this.callParent(arguments);
    }
});