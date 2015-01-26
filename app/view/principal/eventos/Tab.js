Ext.define("Eagle.view.principal.eventos.Tab", {
    extend: "Ext.panel.Panel",
    alias: "widget.principal_eventos_tab",
    
    requires: [
        "Ext.grid.filters.Filters",
        "Ext.grid.feature.Summary",
        "Ext.form.field.Time",
        
        "Eagle.store.Posicoes",
        "Eagle.store.Eventos"
    ],
    
    border: false,
    closable: true,
    layout: "border",
    
    record: null,
    posicoesStore: null,
    eventosStore: null,
    filtroAtivo: null,
    
    initComponent: function(){
        var me = this,
            idTab = this.getItemId(),
            placa = idTab.replace("tab_", "");
        
        this.posicoesStore = Ext.create("Eagle.store.Posicoes");
        this.eventosStore = Ext.create("Eagle.store.Eventos");
        
        Ext.apply(me, {
            defaults: {
                border: false
            },
            dockedItems: {
                xtype: "toolbar",
                dock: "top",
                items: [{
                    action: "recarregar",
                    handler: function(comp){
                        comp.fireEvent("buttonclick", comp, idTab);
                    },
                    icon: "resources/images/16/ios7-refresh-empty.png",
                    tooltip: "Recarregar"
                },'-',{
                    name: "diaanterior",
                    fieldLabel: "Dia Anterior",
                    labelWidth: 73,
                    value: false,
                    xtype: "checkbox"
                },{
                    emptyText: "Data",
                    format: "d/m/Y",
                    listeners: {
                        select: function(comp, value){
                            comp.fireEvent("dataselect", comp, idTab, value);
                        }
                    },
                    maxValue: new Date(),
                    name: "data",
                    value: new Date(),
                    xtype: "datefield",
                    width: 100
                },"-",{
                    emptyText: "Hora Início",
                    format: "H:i",
                    name: "horaIni",
                    xtype: "timefield",
                    width: 100
                },{
                    emptyText: "Hora Fim",
                    format: "H:i",
                    name: "horaFim",
                    xtype: "timefield",
                    width: 100  
                },{
                    action: "filtrar",
                    handler: function(comp){
                        comp.fireEvent("buttonclick", comp, idTab);
                    },
                    icon: "resources/images/16/ios7-search.png",
                    tooltip: "Filtrar Horário Selecionado"
                },{
                    action: "limparFiltro",
                    handler: function(comp){
                        comp.fireEvent("buttonclick", comp, idTab);
                    },
                    icon: "resources/images/16/ios7-close-empty.png",
                    tooltip: "Limpar Filtro"
                },"->",{
                    action: "informacaoveiculo",
                    icon: "resources/images/16/ios7-information-outline.png",
                    tooltip: "Informações do Veículo",
                    handler: function(comp){
                        comp.fireEvent("buttonclick", comp, idTab);
                    }
                },{
                    action: "enviarmensagem",
                    icon: "resources/images/16/ios7-email-outline.png",
                    tooltip: "Enviar Mensagem",
                    handler: function(comp){
                        comp.fireEvent("buttonclick", comp, idTab);
                    }
                },{
                    action: "enviarcomando",
                    icon: "resources/images/16/ios7-paperplane-outline.png",
                    tooltip: "Enviar Comando",
                    handler: function(comp){
                        comp.fireEvent("buttonclick", comp, idTab);
                    }
                },{
                    action: "comandosespera",
                    icon: "resources/images/16/ios7-stopwatch-outline.png",
                    tooltip: "Comandos em Espera p/ Envio",
                    handler: function(comp){
                        comp.fireEvent("buttonclick", comp, idTab);
                    }
                },{
                    action: "cadastrarLimites",
                    icon: "resources/images/16/ios7-speedometer-outline.png",
                    tooltip: "Configuração de Limites",
                    handler: function(comp){
                        comp.fireEvent("buttonclick", comp, idTab);
                    }
                }]
            },
            items: [{
                xtype: "panel",
                region: "north",
                itemId: "veiculo_info",
                bodyStyle: "margin: auto;",
                data: me.record,
                tpl: new Ext.XTemplate(
                    "<table class='evento'>",
                        "<thead>",
                            "<tr>",
                                "<th></th>",
                                "<th>Placa</th>",
                                "<th>Frota</th>",
                                "<th>Data</th>",
                                "<th>Condutor</th>",
                                "<th>Situação</th>",
                                "<th>Velocidade</th>",
                                "<th>Localização</th>",
                                "<th>Referência</th>",
                            "</tr>",
                        "</thead>",
                        "<tbody>",
                            "<tr>",
                                "<td width='5px'><input type='checkbox' class='x-grid-row-checker' id='" + placa + "tabcheckbox' onClick='fireEvent(\"" + me.getItemId() + "\", \"checkboxclick\", \"{placa}\", this.checked)'></td>",
                                "<td width='100px'>{placa}</td>",
                                "<td>{frota}</td>",
                                "<td width='150px'>{data:this.dateFormat}</td>",
                                "<td>{condutor}</td>",
                                "<td width='125px'>{situacao}</td>",
                                "<td width='100px'>{velocidade}</td>",
                                "<td>{localizacao}</td>",
                                "<td>{referencia}</td>",
                            "</tr>",
                        "</tbody>",
                    "</table>",
                    {
                        dateFormat: function(value){
                            return Ext.Date.format(value, "d/m/Y H:i");
                        }
                    }
                )
            },{
                xtype: "panel",
                region: "center",
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                items: [{
                    xtype: "grid",
                    itemId: "posicoesGrid",
                    title: "Posições",
                    bufferedRenderer: true,
                    flex: 1,
                    selType: "checkboxmodel",
                    selModel: {
                        listeners: {
                            beforeselectall: function(){
                                me.fireEvent("beforeselectall", me, idTab);
                            },
                            selectall: function(){
                                me.fireEvent("selectall", me, idTab);
                            },
                            beforedeselectall: function(){
                                me.fireEvent("beforedeselectall", me, idTab);
                            },
                            deselectall: function(){
                                me.fireEvent("deselectall", me, idTab);
                            }
                        }
                    },
                    store: me.posicoesStore,
                    plugins: ["gridfilters"],
                    listeners: {
                        itemmouseenter: function(comp, record){
                            var grid = me.down("panel[region=center] > grid[itemId=posicoesGrid]");
                            grid.fireEvent("posicoesmouseenter", grid, idTab, record);
                        },
                        itemmouseleave: function(comp, record){
                            var grid = me.down("panel[region=center] > grid[itemId=posicoesGrid]");
                            grid.fireEvent("posicoesmouseleave", grid, idTab, record);
                        },
                        select: function(comp, record){
                            var grid = me.down("panel[region=center] > grid[itemId=posicoesGrid]");
                            grid.fireEvent("posicoesselect", grid, idTab, record);
                        },
                        deselect: function(comp, record){
                            var grid = me.down("panel[region=center] > grid[itemId=posicoesGrid]");
                            grid.fireEvent("posicoesdeselect", grid, idTab, record);
                        }
                    },
                    columns: [
                        {
                            text: "Data",
                            dataIndex: "dataHora",
                            width: 150,
                            renderer: function(value){
                                return Ext.Date.format(value, "d/m/Y H:i");
                            }
                        },{
                            text: "Velocidade",
                            dataIndex: "velocidade",
                            flex: 1,
                            filter: {
                                type: "number",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Ignição",
                            dataIndex: "ignicao",
                            flex: 1,
                            renderer: function(value){
                                return (value) ? "Ligada" : "Desligada";
                            },
                            filter: {
                                type: "boolean",
                                noText: "Desligada",
                                yesText: "Ligada"
                            }
                        },{
                            text: "Emergência",
                            dataIndex: "emergencia",
                            flex: 1,
                            renderer: function(value){
                                return (value) ? "Sim" : "Não";
                            },
                            filter: "boolean"
                        },{
                            text: "Conexão",
                            dataIndex: "conexao",
                            flex: 1,
                            filter: {
                                type: "list",
                                options: ["GPRS", "SAT"]
                            }
                        }
                    ]
                },{
                    xtype: "grid",
                    itemId: "eventosGrid",
                    title: "Eventos",
                    bufferedRenderer: false,
                    flex: 1,
                    selType: "checkboxmodel",
                    selModel: {
                        showHeaderCheckbox: false,
                        renderer: function(val, meta, record){
                            if(!record.get("latitude") || !record.get("longitude"))
                                return null;
                            
                            meta.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
                            return '<div class="' + Ext.baseCSSPrefix + 'grid-row-checker">&#160;</div>';
                        }
                    },
                    store: me.eventosStore,
                    plugins: [
                        "gridfilters",
                        {
                            ptype: "rowexpander",
                            rowBodyTpl: new Ext.XTemplate(
                                "{parametro:this.parametroFormat}",
                                "{localizacao:this.localizacaoFormat}",
                                "{referencia:this.referenciaFormat}",
                                {
                                    parametroFormat: function(value){
                                        if(value !== "")
                                            return "<span>"+value+"</span><br/>";
                                        else
                                            return "";
                                    }
                                },{
                                    localizacaoFormat: function(value){
                                        if(value !== "")
                                            return "<span><b>Localização:</b> "+value+"</span><br/>";
                                        else
                                            return "";
                                    }
                                },{
                                    referenciaFormat: function(value){
                                        if(value !== "")
                                            return "<span><b>Referência:</b> "+value+"</span>";
                                        else
                                            return "";
                                    }
                                }
                            )
                        }
                    ],
                    viewConfig: {
                        listeners: {
                            expandbody: function(rowNode, record){
                                var grid = me.down("panel[region=center] > grid[itemId=eventosGrid]");
                                grid.fireEvent("eventosexpandbody", grid, idTab, record);
                            }
                        }
                    },
                    listeners: {
//                        itemmouseenter: function(comp, record){
//                            var grid = me.down("panel[region=center] > grid[itemId=posicoesGrid]");
//                            grid.fireEvent("posicoesmouseenter", grid, idTab, record);
//                        },
//                        itemmouseleave: function(comp, record){
//                            var grid = me.down("panel[region=center] > grid[itemId=posicoesGrid]");
//                            grid.fireEvent("posicoesmouseleave", grid, idTab, record);
//                        },
                        select: function(comp, record){
                            var grid = me.down("panel[region=center] > grid[itemId=eventosGrid]");
                            grid.fireEvent("eventosselect", grid, idTab, record);
                        },
                        deselect: function(comp, record){
                            var grid = me.down("panel[region=center] > grid[itemId=eventosGrid]");
                            grid.fireEvent("eventosdeselect", grid, idTab, record);
                        }
                    },
                    columns: [
                        {
                            text: "Data",
                            dataIndex: "dataHora",
                            //width: 150,
                            flex: 2,
                            renderer: function(value){
                                return Ext.Date.format(value, "d/m/Y H:i");
                            }
                        },{
                            text: "Descrição",
                            dataIndex: "descricao",
                            flex: 2,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            },
                            renderer: function(value, metaData, record){
                                if(record.get("comParametro"))
                                    metaData.style = "text-decoration: underline !important";
                                
                                return value;
                            }
                        },{
                            text: "Requerente",
                            dataIndex: "requerente",
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Enviado",
                            dataIndex: "enviado",
                            flex: 1,
                            renderer: function(value){
                                return (value) ? "Sim" : "Não";
                            },
                            filter: "boolean"
                        },{
                            text: "Conexão",
                            dataIndex: "conexao",
                            flex: 1,
                            filter: {
                                type: "list",
                                options: ["GPRS", "SAT"]
                            }
                        }
                    ]
                }]
            }],
            listeners: {
                close: function(comp){
                    comp.fireEvent("tabeventoclose", comp, idTab);
                },
                afterrender: function(comp){
                    comp.fireEvent("tabeventoafterrender", comp, idTab);
                }
            }
        });
        
        me.posicoesStore.getProxy().extraParams.placa = placa;
        me.posicoesStore.load();
        
        me.eventosStore.getProxy().extraParams.placa = placa;
        me.eventosStore.load();
        
        me.callParent(arguments);
    },
    
    setRecord: function(record){
        var me = this,
            veiculoInfoPanel = me.down("panel[itemId=veiculo_info]");
        
        me.record = record;
        veiculoInfoPanel.setData(record);
    },
    
    getRecord: function(){
        return this.record;
    },
    
    recarregarStores: function(){
        var me = this;
        
        me.posicoesStore.load();
        me.eventosStore.load();
    },
    
    adicionarFiltro: function(filter){
        if(this.filtroAtivo){
            this.removerFiltro();
        }
            
        this.filtroAtivo = filter;
        this.posicoesStore.filter(this.filtroAtivo);
        //this.eventosStore.filter(this.filtroAtivo);
    },
    
    removerFiltro: function(){
        this.filtrAtivo = null;
        this.posicoesStore.clearFilter();
        //this.eventosStore.getFilters().removeAll();
    },
    
    onRolarScrollCheck: function(comp, checked){
        comp.up("principal_eventos_tab").rolarScroll(checked);
    },
    
    rolarScroll: function(rolar){
        var grid = this.down("grid"),
            store = grid.getStore(),
            view = grid.getView();
        
        if(rolar)
            view.getRow(store.getCount() - 1).scrollIntoView();
        else
            view.getRow(0).scrollIntoView();
    }
});