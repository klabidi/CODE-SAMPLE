Ext.define("Eagle.view.situacoes.Grid", {
    extend: "Ext.grid.Panel",
    alias: "widget.situacoes_grid",
    border: false,
    initComponent: function(){
        Ext.apply(this, {
            columns: [
                {text: "Descrição", dataIndex: "descricao", flex: 2},
                {
                    xtype: "actioncolumn",
                    width: 30,
                    action: "edit",
                    icon: "resources/images/16/ios7-paper-outline.png",
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
                },
                '-',
                {
                    action: "configurar",
                    icon: "resources/images/16/ios7-cog-outline.png",
                    text: "Configurar"
                }],
                xtype: "toolbar"
            }],
            store: "Situacoes"
        });
        
        this.callParent(arguments);
    }
});