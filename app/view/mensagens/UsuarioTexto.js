Ext.define("Eagle.view.mensagens.UsuarioTexto", {
    extend: "Ext.form.Panel",
    alias: "widget.usuariotextoform",
    
    border: false,
    itemId: "usuariotexto",
    layout: "form",
    method: "POST",
    url: "php/notificacoes.php?action=enviarMensagensUsuarios",
    
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
                value: 4 // Usuário
            },{
                allowBlank: false,
                displayField: "nome",
                editable: false,
                fieldLabel: "Usuário(s)",
                multiSelect: true,
                name: "usuarios",
                store: "Usuarios",
                valueField: "idUsuario",
                xtype: "combobox"
            },{
                allowBlank: false,
                fieldLabel: "Mensagem",
                name: "mensagem",
                xtype: "textarea"
            }]
        });
        
        this.callParent(arguments);
    }
});