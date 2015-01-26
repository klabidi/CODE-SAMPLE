Ext.define("Eagle.view.operacoes.vincular.veiculos.Panel", {
    extend: "Ext.container.Container",
    alias: "widget.operacoes_vincular_veiculos_panel",
    
    requires: [
        "Ext.grid.*",
        "Ext.layout.container.HBox"
    ],
    
    border: false,
    layout: {
        type: "hbox",
        align: "stretch"
    },
    
    initComponent: function(){
        var me = this,
            group1 = this.id + "group1",
            group2 = this.id + "group2";
        
        Ext.apply(this, {
            items: [{
                columns: [{
                    text: "Placa",
                    flex: 1,
                    sortable: true,
                    dataIndex: "placa",
                    menuDisabled: true
                },{
                    text: "Frota",
                    flex: 1,
                    sortable: true,
                    dataIndex: "frota",
                    menuDisabled: true
                }],
                flex: 1,
                itemId: "grid1",
                margin: "0 5 0 0",
                multiSelect: true,
                store: "VeiculosEmpresa",
                title: "Veículos não vinculados",
                viewConfig: {
                    plugins: {
                        ptype: "gridviewdragdrop",
                        dragGroup: group1,
                        dropGroup: group2
                    },
                    listeners: {
                        drop: function(node, data){
                            var grid = me.down("grid[itemId=grid1]");
                            
                            grid.fireEvent("drop", grid, data.records);
                        }
                    }
                },
                xtype: "grid"
            },{
                columns: [{
                    text: "Placa",
                    flex: 1,
                    sortable: true,
                    dataIndex: "placa",
                    menuDisabled: true
                }],
                flex: 1,
                itemId: "grid2",
                store: "VeiculosOperacoes",
                stripeRows: true,
                title: "Veículos vinculados",
                viewConfig: {
                    plugins: {
                        ptype: "gridviewdragdrop",
                        dragGroup: group2,
                        dropGroup: group1
                    },
                    listeners: {
                        drop: function(node, data){
                            var grid = me.down("grid[itemId=grid2]");
                            
                            grid.fireEvent("drop", grid, data.records);
                        }
                    }
                },
                xtype: "grid"
            }]
        });
        
        
        this.callParent(arguments);
    }
});