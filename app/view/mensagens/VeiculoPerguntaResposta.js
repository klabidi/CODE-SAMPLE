Ext.define("Eagle.view.mensagens.VeiculoPerguntaResposta", {
    extend: "Ext.form.Panel",
    alias: "widget.veiculoperguntarespostaform",
    
    border: false,
    itemId: "veiculoperguntaresposta",
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
                value: 3 // Mensagem deve ser Texto Livre + As Perguntas Concatenadas por &;
            },{
                allowBlank: true,
                displayField: "nome",
                editable: true,
                fieldLabel: "Operação",
                name: "operacao",
                store: "Operacoes",
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
                fieldLabel: "Pergunta",
                name: "pergunta",
                xtype: "textfield"
            },{
                allowBlank: false,
                fieldLabel: "Resposta 1",
                name: "resposta1",
                xtype: "textfield"
            },{
                allowBlank: false,
                fieldLabel: "Resposta 2",
                name: "resposta2",
                xtype: "textfield"
            },{
                allowBlank: false,
                fieldLabel: "Resposta 3",
                name: "resposta3",
                xtype: "textfield"
            }]
        });
        
        this.callParent(arguments);
    }
});