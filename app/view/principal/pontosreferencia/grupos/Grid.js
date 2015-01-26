Ext.define("Eagle.view.principal.pontosreferencia.grupos.Grid", {
    extend: "Ext.grid.Panel",
    alias: "widget.principal_pontosreferencia_grupos_grid",
    
    requires: [
        "Ext.grid.filters.Filters"
    ],
    
    initComponent: function(){
        Ext.apply(this, {
            columns: [{
                dataIndex: "nome",
                flex: 1,
                text: "Nome",
                filter: "string"
            },{
                action: "editar",
                align: "center",
                handler: function(grid, rowIndex, colIndex, item, e, record){
                    this.down("actioncolumn[action=editar]").fireEvent("click", this, record);
                },
                scope: this,
                icon: "resources/images/16/ios7-paper-outline.png",
                tooltip: "Editar",
                xtype: "actioncolumn",
                width: 50
            },{
                action: "excluir",
                align: "center",
                handler: function(grid, rowIndex, colIndex, item, e, record){
                    this.down("actioncolumn[action=excluir]").fireEvent("click", this, record);
                },
                scope: this,
                icon: "resources/images/16/ios7-minus-outline.png",
                tooltip: "Remover",
                xtype: "actioncolumn",
                width: 50
            }],
            dockedItems: [{
                dock: "top",
                items: [{
                    action: "adicionar",
                    icon: "resources/images/16/ios7-plus-outline.png",
                    text: "Adicionar",
                    tooltip: "Adicionar Grupo"
                }],
                xtype: "toolbar"
            }],
            store: "PontosReferenciaGrupo"
        });
        
        this.callParent(arguments);
    }
});