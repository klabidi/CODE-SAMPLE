Ext.define("Eagle.view.mensagens.VeiculoTexto", {
    extend: "Ext.form.Panel",
    alias: "widget.veiculotextoform",
    
    border: false,
    itemId: "veiculotexto",
    layout: "form",
    method: "POST",
    url: "php/teclados.php?action=enviarMensagensVeiculos",
    
    initComponent: function(){
        Ext.apply(this, {
            buttons: [{
                action: "enviar", 
                text: "Enviar"
            }],
            items: [{
                xtype: "hidden",
                name: "idNotificacao"
            },{
                xtype: "hidden",
                name: "tipo",
                value: 1 // Mensagem de texto livre
            },{
                allowBlank: true,
                displayField: "nome",
                editable: true,
                fieldLabel: "Operação",
                name: "operacao",
                store: "Operacoes",
                submitValue: false,
                valueField: "idOperacao",
                xtype: "combobox"
            },{
                allowBlank: false,
                displayField: "placa",
                editable: false,
                fieldLabel: "Placa(s)",
                multiSelect: true,
                name: "placas",
                store: "VeiculosTeclado",
                valueField: "placa",
                xtype: "combobox"
            },{
                allowBlank: false,
                fieldLabel: "Mensagem",
                maxLength: 48,
                maxWidth: 16,
                name: "mensagem",
                xtype: "textarea"
            }]
        });
        
        this.callParent(arguments);
    }
});