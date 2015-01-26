Ext.define("Eagle.view.principal.pontosreferencia.Grid", {
    extend: "Ext.grid.Panel",
    alias: "widget.principal_pontosreferencia_grid",
    
    requires: [
        "Ext.grid.feature.Grouping",
        "Ext.grid.filters.Filters"
    ],
    
    selType: "checkboxmodel",
    
    initComponent: function(){
        Ext.apply(this, {
            columns: [{
                dataIndex: "descricao",
                flex: 1,
                text: "Descrição",
                filter: "string"
            },{
                dataIndex: "observacao",
                flex: 1,
                text: "Observação",
                filter: "string"
            },{
                dataIndex: "endereco",
                flex: 1,
                text: "Endereço",
                filter: "string"
            },{
                dataIndex: "cidade",
                flex: 1,
                text: "Cidade",
                filter: "string"
            },{
                dataIndex: "grupoDescricao",
                flex: 1,
                text: "Grupo"
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
                    tooltip: "Adicionar ponto de referência"
                },{
                    action: "limparSelecoes",
                    icon: "resources/images/16/ios7-close-empty.png",
                    tooltip: "Limpar Todas as Seleções do Grid"
                }],
                xtype: "toolbar"
            }],
            features: [{
                ftype: "grouping",
                groupHeaderTpl: "Grupo: {name} ({rows.length} Ponto{[values.rows.length > 1 ? 's' : '']})",
                hideGroupedHeader: false,
                startCollapsed: false
            }],
            plugins: [
                "gridfilters" //plugin para o gridfilters
             ],
            selModel: {
                showHeaderCheckbox: true,
                pruneRemoved: false,
                ignoreRightMouseSelection: true
            },
            store: "PontosReferencia"
        });
        
        this.callParent(arguments);
    }
});