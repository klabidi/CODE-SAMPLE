Ext.define("Eagle.view.operacoes.vincular.usuarios.Panel", {
    extend: "Ext.container.Container",
    alias: "widget.operacoes_vincular_usuarios_panel",
    
    requires: [
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
                    text: "Nome",
                    flex: 1,
                    sortable: true,
                    dataIndex: "nome",
                    menuDisabled: true
                }],
                flex: 1,
                itemId: "grid1",
                margin: "0 5 0 0",
                multiSelect: true,
                store: "Usuarios",
                title: "Usuários não vinculados",
                viewConfig: {
                    plugins: [{
                        ptype: "gridviewdragdrop",
                        containerScroll: true,
                        dragGroup: group1,
                        dropGroup: group2
                    }],
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
                    text: "Nome",
                    flex: 1,
                    sortable: true,
                    dataIndex: "nome",
                    menuDisabled: true
                }],
                flex: 1,
                itemId: "grid2",
                store: "UsuariosOperacoes",
                stripeRows: true,
                title: "Usuários vinculados",
                viewConfig: {
                    plugins: [{
                        ptype: "gridviewdragdrop",
                        containerScroll: true,
                        dragGroup: group2,
                        dropGroup: group1
                    }],
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