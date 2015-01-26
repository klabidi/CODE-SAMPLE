Ext.define("Eagle.view.mensagens.VeiculoMacro", {
    extend: "Ext.form.Panel",
    alias: "widget.veiculomacroform",
    
    border: false,
    itemId: "veiculomacro",
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
                value: 2 // Mensagem deve ser numero com 2 digitos (Ex:01)
            },{
                allowBlank: false,
                displayField: "placa",
                editable: false,
                fieldLabel: "Placa",
                name: "placas",
                store: "VeiculosTeclado",
                valueField: "placa",
                xtype: "combobox"
            },{
                allowBlank: false,
                displayField: "mensagem",
                editable: false,
                fieldLabel: "Mensagem",
                name: "mensagem",
                queryMode: "local",
                store: "MensagensMacros",
                valueField: "macro",
                xtype: "combobox"
            }]
        });
        
        this.callParent(arguments);
    }
});