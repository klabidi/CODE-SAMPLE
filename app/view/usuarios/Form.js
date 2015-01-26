Ext.define("Eagle.view.usuarios.Form", {
    extend: "Ext.form.Panel",
    alias: "widget.usuarios_form",
    
    requires: [
        "Ext.layout.container.Column",
        "Ext.form.FieldSet",
        "Ext.form.field.Hidden"
    ],
    
    autoScroll: true,
    border: false,
    layout: {
        type: "hbox",
        align: "stretch"
    },
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
            items: [{ //grid
                xtype: 'grid',
                flex: 2,
                padding: "10 0 10 10",
                autoScroll: true,
                scroll: true,
                border: true,
                plugins: ["gridfilters"],
                columnWidth: 0.65,
                publishes: "selection",
                reference: "usuariosGrid",
                store: "Usuarios",
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
                            },
                            filter: "boolean"
                        }
                    ]
                }
            },{
                xtype: "panel",
                border: false,
                autoScroll: true,
                flex: 1,
                items: [{
                    xtype: "fieldset",
                    margin: "0 10 0 10",
                    title: "Detalhes do Usuário",
                    border: true,
                    collapsible: false,
                    defaultType: "textfield",
                    defaults: {anchor: "100%"},
                    layout: "anchor",
                    items: [{
                        xtype: "hidden",
                        name: "idUsuario"
                    },{
                        fieldLabel: "Nome",
                        name: "nome",
                        allowBlank: false
                    },{
                        fieldLabel: "Login",
                        name: "login",
                        allowBlank: false,
                        enableKeyEvents: true
                    },{
                        fieldLabel: "Email",
                        name: "email",
                        vtype: "email",
                        allowBlank: false
                    },{
                        xtype: "combobox",
                        fieldLabel: "Empresa",
                        name: "empresa",
                        store: "Empresas",
                        queryMode: "local",
                        valueField: "idEmpresa",
                        displayField: "nome",
                        allowBlank: false
                    },{
                        xtype: "hidden",
                        fieldLabel: "Central",
                        name: "central",
                        allowBlank: false
                    },{
                        xtype: "combobox",
                        fieldLabel: "Grupo",
                        name: "grupo",
                        store: "Grupos",
                        queryMode: "local",
                        valueField: "idGrupo",
                        displayField: "descricao",
                        allowBlank: false
                    },{
                        xtype: "checkbox",
                        fieldLabel: "Ativo",
                        name: "ativo",
                        inputValue: true
                    },{
                        xtype: "fieldset",
                        title: "Senha",
                        collapsible: true,
                        defaultType: "textfield",
                        items: [{
                            fieldLabel: "Antiga",
                            name: "senhaAntiga",
                            inputType: "password",
                            bind: {
                                visible: "{usuariosGrid.selection}"
                            }
                        },{
                            fieldLabel: "Nova",
                            name: "senhaNova",
                            inputType: "password"
                        },{
                            fieldLabel: "Redigite",
                            name: "senhaConferencia",
                            inputType: "password"
                        }]
                    },{
                        xtype: "fieldset",
                        title: "Ações",
                        defaultType: "button",
                        layout: "column",
                        padding: "10 10 10 10",
                        items: [{
                            columnWidth: 0.5,
                            action: "salvar",
                            text: "Salvar",
                            margin: "0 5 0 0"
                        },{
                            columnWidth: 0.5,
                            action: "cancelar",
                            text: "Cancelar",
                            margin: "0 0 0 5"
                        }]
                    }]
                }]
            }]
        });
        
        this.callParent(arguments);
    }
});