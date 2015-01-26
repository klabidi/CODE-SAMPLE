Ext.define("Eagle.view.permissoes.PermissoesGrupo", {
    extend: "Ext.form.Panel",
    alias: "widget.permissoes_grupo",
    
    requires: [ 
        "Ext.layout.container.Column", 
        'Ext.tree.*' 
    ], 
    
    border: false,
    layout: "fit",
    viewModel: true,
    loadMask: true,
    
    initComponent: function(){
        Ext.apply(this, {
            fieldDefaults: {
                labelAlign: 'left',
                labelWidth: 90,
                anchor: '100%',
                msgTarget: 'side'
            },
            items: [{
                xtype: "grid",
                autoScroll: true,
                border: false,
                plugins: ["gridfilters"], 
                publishes: "selection", 
                store: "PermissoesGrupos",
                title: "Grupos",
                columns: {
                    items: [{ 
                        text: "Nome dos grupos",
                        flex: 1,
                        dataIndex: "descricao", 
                        filter: {
                            type: "string",
                            itemDefaults: {
                                emptyText: 'Filtro...'
                            }
                        }
                    }]
                }
            }]
        });
        
        this.callParent(arguments);
    }
});