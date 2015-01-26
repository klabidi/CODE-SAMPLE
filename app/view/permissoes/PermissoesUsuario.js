Ext.define("Eagle.view.permissoes.PermissoesUsuario", {
    extend: "Ext.form.Panel",
    alias: "widget.usuarios_grid",
    
    requires: [
        "Ext.layout.container.Column",
        "Ext.form.FieldSet",
        "Ext.form.field.Hidden"
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
                title: "Usuários",
                autoScroll: true,
                border: false,
                plugins: ["gridfilters"], 
                publishes: "selection",
                store: "UsuariosGrupo",
                columns: {
                    items: [
                        {
                            text: "Nome", 
                            dataIndex: "nome", 
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Login", 
                            dataIndex: "login", 
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Email", 
                            dataIndex: "email", 
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Ativo", 
                            dataIndex: "ativo", 
                            width: 75,
                            renderer: function(value){
                                return (value) ? "Sim" : "Não";
                            }
                        },{
                            xtype: "actioncolumn",
                            width: 30,
                            action: "edit",
                            icon: "resources/images/16/ios7-paper-outline.png",
                            scope: this,
                            handler: function(grid, rowIndex, colIndex, item, e, record){
                                this.down("actioncolumn[action=edit]").fireEvent("click", grid, record);
                            }
                        }
                    ]
                }
            }]
        });
        
        this.callParent(arguments);
    }
});