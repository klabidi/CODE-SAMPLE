Ext.define("Eagle.view.operacoes.Grid", {
    extend: "Ext.grid.Panel",
    alias: "widget.operacoes_grid",
    border: false,
    initComponent: function(){
        Ext.apply(this, {
            columns: [
                {text: "Nome", dataIndex: "nome", flex: 1},
                {text: "Descrição", dataIndex: "descricao", flex: 2},
                {
                    xtype: "actioncolumn",
                    width: 30,
                    action: "vincularUsuarios",
                    icon: "resources/images/16/person-stalker.png",
                    tooltip: "Vincular Usuários",
                    scope: this,
                    handler: function(grid, rowIndex, colIndex, item, e, record){
                        this.down("actioncolumn[action=vincularUsuarios]").fireEvent("click", this, record);
                    }
                },
                {
                    xtype: "actioncolumn",
                    width: 30,
                    action: "vincularVeiculos",
                    icon: "resources/images/16/truck-outline.png",
                    tooltip: "Vincular Veículos",
                    scope: this,
                    handler: function(grid, rowIndex, colIndex, item, e, record){
                        this.down("actioncolumn[action=vincularVeiculos]").fireEvent("click", this, record);
                    }
                },
                {
                    xtype: "actioncolumn",
                    width: 30,
                    action: "edit",
                    icon: "resources/images/16/ios7-paper-outline.png",
                    tooltip: "Editar Definições da Operação",
                    scope: this,
                    handler: function(grid, rowIndex, colIndex, item, e, record){
                        this.down("actioncolumn[action=edit]").fireEvent("click", this, record);
                    }
                },
                {
                    xtype: "actioncolumn",
                    width: 30,
                    action: "excluir",
                    icon: "resources/images/16/ios7-minus-outline.png",
                    tooltip: "Excluir Operação",
                    scope: this,
                    handler: function(grid, rowIndex, colIndex, item, e, record){
                        this.down("actioncolumn[action=excluir]").fireEvent("click", this, record);
                    }
                }
            ],
            dockedItems: [{
                dock: "top",
                items: [{
                    action: "adicionar",
                    icon: "resources/images/16/ios7-plus-outline.png",
                    text: "Adicionar"
                }],
                xtype: "toolbar"
            }],
            store: "Operacoes"
        });
        
        this.callParent(arguments);
    }
});