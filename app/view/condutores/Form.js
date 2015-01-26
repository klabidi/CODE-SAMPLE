Ext.define("Eagle.view.condutores.Form", {
    extend: "Ext.form.Panel",
    alias: "widget.condutores_form",
    
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
            items: [{ // grid
                xtype: 'grid',
                flex: 2,
                padding: "10 0 10 10",
                autoScroll: true,
                border: true,
                plugins: ["gridfilters"],
                columnWidth: 0.65,
                publishes: "selection",
                reference: "condutoresGrid",
                store: "Condutores",
                columns: {
                    items: [
                        {
                            text: "Nome", 
                            dataIndex: "nome", 
                            flex: 2,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Empresa", 
                            dataIndex: "empresa", 
                            flex: 2,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Placa", 
                            dataIndex: "placa", 
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Telefone", 
                            dataIndex: "telefone", 
                            flex: 1
                        },{
                            text: "Celular", 
                            dataIndex: "celular", 
                            flex: 1
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
            },{ // form
                xtype: "panel",
                border: false,
                autoScroll: true,
                flex: 1,
                items: [{
                    xtype: "fieldset",
                    flex: 1,
                    margin: "0 10 0 10",
                    title: "Detalhes do Condutor",
                    border: true,
                    collapsible: false,
                    defaultType: "textfield",
                    defaults: {anchor: "100%"},
                    layout: "anchor",
                    items: [{
                        xtype: "hidden",
                        name: "idCondutor"
                    },{
                        xtype: "hidden",
                        name: "empresaId"
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
                        fieldLabel: "Nome",
                        name: "nome",
                        allowBlank: false,
                        maxLength: 50
                    },{
                        fieldLabel: "Cpf",
                        name: "cpf",
                        enableKeyEvents: true,
                        maxLength: 30
                    },{
                        fieldLabel: "Rg",
                        name: "rg",
                        enableKeyEvents: true,
                        maxLength: 30
                    },{
                        fieldLabel: "Telefone",
                        name: "telefone",
                        emptyText: '(xx)xxxx-xxxx',
                        enableKeyEvents: true
                    },{
                        fieldLabel: "Celular",
                        name: "celular",
                        emptyText: '(xx)xxxx-xxxx', 
                        enableKeyEvents: true
                    },{
                        fieldLabel: 'Data Nascimento', 
                        xtype: 'datefield', 
                        name: 'data_nascimento'
                    },{
                        fieldLabel: "Matricula na Empresa",
                        name: "matricula",
                        enableKeyEvents: true,
                        maxLength: 20
                    },{
                        xtype: "checkbox",
                        fieldLabel: "Ativo",
                        name: "ativo",
                        inputValue: true
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