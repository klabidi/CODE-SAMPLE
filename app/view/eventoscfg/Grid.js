Ext.define("Eagle.view.eventoscfg.Grid", {
    extend: "Ext.grid.Panel",
    alias: "widget.eventoscfg_grid",
    
    requires: [
        "Ext.grid.plugin.CellEditing"
    ],
    
    //referenceHolder: true,
    viewModel: true,
    
    initComponent: function(){
        Ext.apply(this, {
            columns: [{
                dataIndex: "descricao",
                flex: 1,
                text: "Descrição"
            },{
                dataIndex: "desc_situacao",
                flex: 1,
                text: "Situação"
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
                    action: "recarregar",
                    icon: "resources/images/16/ios7-refresh-empty.png",
                    tooltip: "Recarregar"
                },{
                    xtype: "combobox",
                    store: "Operacoes",
                    name: "operacao",
                    displayField: "nome",
                    valueField: "idOperacao",
                    emptyText: "Operação",
                    forceSelection: true,
                    editable: false,
                    reference: "operacao",
                    publishes: "value"
                },{
                    action: "adicionar",
                    icon: "resources/images/16/ios7-plus-outline.png",
                    text: "Adicionar",
                    tooltip: "Adicionar Evento",
                    bind: {
                        disabled: "{!operacao.value}"
                    }
                }],
                xtype: "toolbar"
            }],
            selType: "cellmodel",
            store: "EventosCfg",
            plugins: [{
                clicksToEdit: 2,
                ptype: "cellediting",
                pluginId: "cellediting"
            }]
        });
        
        this.callParent(arguments);
    }
});