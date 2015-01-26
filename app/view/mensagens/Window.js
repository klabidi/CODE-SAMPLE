Ext.define("Eagle.view.mensagens.Window", {
    extend: 'Ext.window.Window',
    xtype: 'layout-border',
    alias: "widget.mensagemwindow",
    
    width: 700,
    title: "Enviar mensagem",
    border: false,
    bodyBorder: false,
    //maxWidth: 700,
    
    initComponent: function(){
        Ext.apply(this, {
            defaults: {
                collapsible: true, 
                split: true,
                bodyPadding: 10
            },
            items: [{
                xtype: "tabpanel",
                collapsible: false,
                flex: 1,
                region: "center",
                items: [{
                    title: "Veículo (Texto)",
                    xtype: "veiculotextoform"
                },{
                    title: "Veículo (Pergunta / Resposta)",
                    xtype: "veiculoperguntarespostaform"
                },{
                    title: "Usuário (Texto)",
                    xtype: "usuariotextoform"
                }]
            },{
                title: 'Ultimas 20 mensagens',
                layout: 'fit',
                flex: 1,
                margin: '5 0 0 0',
                xtype: "grid_mensagem_form",
                region: 'south'
            }]
        });
        
        this.callParent(arguments);
    }
});