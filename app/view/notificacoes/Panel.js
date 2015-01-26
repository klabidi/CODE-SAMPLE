Ext.define("Eagle.view.notificacoes.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.notificacoes_panel",
    title: "Central de Avisos",
    titleCollapse: true,
    width: 300,
    collapsible: true,
    collapsed: true,
    overflowY: "scroll",
    tools: [{
        action: "enviarMensagem",
        tooltip: "Enviar Mensagem",
        type: "plus"
    },{
        action: "adicionarEvento",
        tooltip: "Configurações",
        type: "gear"
    }]
});