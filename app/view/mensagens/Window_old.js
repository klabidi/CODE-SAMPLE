Ext.define("Eagle.view.mensagens.Window", {
    extend: "Ext.panel.Panel",
    alias: "widget.mensagemwindow",
    
    width: 700,
    layout: "fit",
    border: false,
    modal: true,
    
    initComponent: function(){
        Ext.apply(this, {
            fieldDefaults: [{
                labelAlign: "top"
            }],
            items: [{
                xtype: "tabpanel",
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
            }]
        });
        
        this.callParent(arguments);
    }
});