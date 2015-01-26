Ext.define("Eagle.view.notificacoes.mensagens.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.notificacoes_mensagens_panel",
    
    itemId: "notificacao_mensagens_panel",
    autoScroll: true,
    border: false,
    bodyBorder: false,
    collapsible: true,
    margin: "5 5 0 5",
    title: "Mensagens",
    titleCollapse: true,
    header: {
        style: {
            backgroundColor: "#FFFFFF"
        }
    },
    tools: [{
        action: "setLidaTodasMsgs",
        tooltip: "Marcar como lida todas as Mensagens",
        type: "close"
    }],
    store: {},
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(this, {
            items: [{
                xtype: "dataview",
                store: me.store,
                itemSelector: "div.notificacao",
                tpl: ['<tpl for=".">',
                        '<div class="notificacao" id="mensagem_{idNotificacao}">',
                            '<div class="descricao">',
                                '<span style="float:left; font-weight:bold;">{[this.montarDescricao(values)]}</span>',
                                '<span style="float:right; font-size:10px;">{data}</span><br>',
                                '<span style="float:left; font-size:10px;" onmouseover="fireEvent(\'notificacao_mensagens_panel\', \'mensagemtooltipvisualizadores\', \'{idNotificacao}\',\'{visualizacoes}\',\'{random}\')" id="vis_{idNotificacao}_{random}">{visualizacoes:this.visualizacoes}</span>',
                                '<span style="float:right; font-size:10px;">{[dataDif(values.data)]}</span>',
                            '</div>',
                            '<div class="informacao">',
                                '<span>{mensagem}</span><br/><br/>',
                                '<a class="enableclick" style="color:#4d7fcd;" '
                                    +'onclick="fireEvent(\'notificacao_mensagens_panel\', \'mensagemreadclick\', \'{idNotificacao}\', \'mensagem\')"'
                                    +'>Marcar como lida</a>',
                                '<a class="enableclick" style="color:#4d7fcd; float:right;" '
                                    +'onclick="fireEvent(\'notificacao_mensagens_panel\', \'mensagemresponderclick\', \'{idNotificacao}\', \'{placa}\', {usuario})"'
                                    +'>Responder</a>',
                            '</div>',
                        '</div>',
                      '</tpl>',
                      {
                          montarDescricao: function(values){
                              var retorno;
                              if(values.placa === ""){
                                  retorno = values.remetente;
                              }else{
                                  retorno = values.placa;
                                  if(values.frota)
                                      retorno += " - " + values.frota;
                              }
                              return retorno;
                          },
                          visualizacoes: function(val){
                              if(val > 1)
                                  return val + " visualizações";
                              else if(val === 1)
                                  return val + " visualização";
                              else
                                  return "Nenhuma visualização";
                          }
                      }]
            }]
        });
        
        this.callParent(arguments);
    }
}); 