Ext.define("Eagle.view.dashboard.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.dashboard_panel",
    
    requires: [
        "Ext.sparkline.Pie",
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
                    border: false
                },
                items: [{ // Grid
                    columns: [{
                        text: "Veículo",
                        dataIndex: "placa",
                        filter: "string",
                        renderer: function(value){
                            return "<a class='enableclick' onclick='fireEvent(\"dashboard_panel_grid\", \"veiculoclick\", \""+value+"\")'>" + value + "</a>";
                        },
                        width: 100
                    },{
                        text: "Movimento",
                        columns: [{
                            text: "Andando (%)",
                            dataIndex: "andando",
                            flex: 1
                        },{
                            text: "Parado (%)",
                            dataIndex: "parado",
                            flex: 1
                        },{
                            text: "Desligado (%)",
                            dataIndex: "desligado",
                            flex: 1
                        },{
                            xtype: "widgetcolumn",
                            widget: {
                                xtype: 'sparklinepie',
                                tipTpl: new Ext.XTemplate('&#9679; {percent:number("0.0")}%')
                            },
                            width: 40,
                            dataIndex: "movimento"
                        }]
                    },{
                        text: "Distância",
                        dataIndex: "distancia",
                        align: "center",
                        flex: 1,
                        renderer: function(value){
                            if(value < 0) // Sem acessório
                                return "-";
                            
                            if(value >= 1000){
                                // Tranforma para kilometros
                                value = (value / 1000);
                                // Esse round é para deixar o valor com 1 casa decimal
                                return (Math.round(value * 10) / 10) + " km";
                            }
                            
                            return value + " m";
                        }
                    },{
                        text: "Horimetro",
                        dataIndex: "horimetro",
                        align: "center",
                        flex: 1,
                        renderer: function(value){
                            return (value >= 0) ? value : "-";
                        }
                    },{
                        text: "Velocidade Máx.",
                        dataIndex: "velocidade",
                        align: "center",
                        flex: 1,
                        renderer: function(value){
                            // Charque por causa de aparelho ruim da Cielo.
                            //if(value < 0 || value > 200)
                            //    return "-";

                            return value + " km/h";
                        }
                    },{
                        text: "Consumo",
                        dataIndex: "consumo",
                        align: "center",
                        flex: 1,
                        renderer: function(value){
                            if(value < 0)
                                return "-";
                            
                            return value + " km/l";
                        }
                    }],
                    itemId: "dashboard_panel_grid",
                    region: "center",
                    stateId: "estadoDashboardGrid", //adiciona id único para o componente
                    stateful: true, //seta o stateful para salvar o estado do componente em cookie
                    plugins: ["gridfilters", {
                        ptype: "rowexpander",
                        rowBodyTpl: new Ext.XTemplate("<div id='expandchart{placa}' style='height: 150px'></div>")
                    }],
                    store: "Dashboards",
                    xtype: "grid"
                }, { // Gráficos
                    autoScroll: true,
                    border: true,
                    collapsed: true,
                    collapsible: true,
                    defaults: {
                        border: false
                    },
                    hidden: true,
                    items: [{
                        xtype: "panel",
                        //collapsible: true,
                        itemId: "estadoschart",
                        title: "Movimento",
                        height: 340,
                        layout: "fit",
                        width: "100%"
                    },{
                        xtype: "panel",
                        //collapsible: true,
                        itemId: "consumochart",
                        title: "Consumo",
                        height: 340,
                        layout: "fit",
                        width: "100%"
                    },{
                        xtype: "panel",
                        //collapsible: true,
                        itemId: "velocidadeschart",
                        title: "Velocidades",
                        height: 340,
                        layout: "fit",
                        width: "100%"
                    },{
                        xtype: "panel",
                        //collapsible: true,
                        itemId: "rpmchart",
                        title: "RPM",
                        height: 340,
                        layout: "fit",
                        width: "100%"
                    }],
                    layout: "vbox",
                    minWidth: 400,
                    region: "east",
                    resizable: true,
                    title: "Gráficos",
                    titleAlign: "center",
                    xtype: "panel",
                    width: "30%"
                }],
                layout: "border",
                stateId: "estadoDashboardGrid",
                stateful: true,
                xtype: "panel"
            }]
        });
        
        me.callParent(arguments);
    }
});