Ext.define("Eagle.view.trocasvisualizacao.Form", {
    extend: "Ext.form.Panel",
    alias: "widget.trocasvisualizacao_form",
    
    layout: "form",
    referenceHolder: true,
    viewModel: true,
    
    initComponent: function(){
        Ext.apply(this, {
            buttons: [{
                action: "trocar",
                text: "Trocar"
            },{
                action: "cancelar",
                text: "Cancelar"
            }],
            items: [{
                allowBlank: false,
                displayField: "nome",
                emptyText: "Empresa",
                fieldLabel: "Empresa",
                forceSelection: true,
                name: "empresa",
                publishes: "value",
                queryMode: "local",
                reference: "empresa",
                store: "Empresas",
                valueField: "idEmpresa",
                xtype: "combobox"
            },{
                allowBlank: false,
                bind: {
                    //visible: "{empresa.value}",
                    filters: {
                        property: "empresa",
                        value: "{empresa.value}"
                    }
                },
                displayField: "nome",
                emptyText: "Usuário",
                fieldLabel: "Usuário",
                forceSelection: true,
                name: "usuario",
                queryMode: "local",
                store: "Usuarios",
                valueField: "idUsuario",
                xtype: "combobox"
            },{
                allowBlank: false,
                emptyText: "Senha do usuário logado",
                fieldLabel: "Senha",
                name: "senha",
                inputType: "password",
                xtype: "textfield"
            }]
        });
        
        this.callParent(arguments);
    }
});