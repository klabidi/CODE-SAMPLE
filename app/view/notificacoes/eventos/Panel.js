Ext.define("Eagle.view.notificacoes.eventos.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.notificacoes_eventos_panel",
    
    itemId: "notificacao_eventos_panel",
    autoScroll: true,
    border: false,
    bodyBorder: false,
    collapsible: true,
    margin: "5 5 0 5",
    title: "Eventos",
    titleCollapse: true,
    header: {
        style: {
            backgroundColor: "#FFFFFF"
        }
    },
    
    //Variável que recebe o store
    store: {},
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(this, {
            items: [{
                xtype: "dataview",
                store: me.store,
                itemSelector: "div.notificacao",
                tpl: ['<tpl for=".">',
                        '<div class="notificacao" id="evento_{idNotificacao}">',
                            '<div class="descricao">',
                                '<span style="float:left; font-weight:bold;">{[this.montarDescricao(values)]}</span>',
                                '<span style="float:right; font-size:10px;">{data}</span><br>',
                                '<span style="float:left; font-size:10px;" onmouseover="fireEvent(\'notificacao_eventos_panel\', \'eventotooltipvisualizadores\', \'{idNotificacao}\',\'{visualizacoes}\',\'{random}\')" id="vis_{idNotificacao}_{random}">{visualizacoes:this.visualizacoes}</span>',
                                '<span style="float:right; font-size:10px;">{[dataDif(values.data)]}</span>',
                            '</div>',
                            '<div class="informacao">',
                                '<span><b>Descrição:</b> {descricao}</span><br/>',
                                '<span style="float: left;">{parametro}</span><br/>',
                                '<a class="enableclick" style="color:#4d7fcd;" '
                                    +'onclick="fireEvent(\'notificacao_eventos_panel\', \'eventoreadclick\', \'{idNotificacao}\', \'evento\')"'
                                    +'>Marcar Como Lida</a>',
                            '</div>',
                        '</div>',
                      '</tpl>',
                      {
                          montarDescricao: function(values){
                              var retorno = values.placa;
                              if(values.frota)
                                   retorno += " - " + values.frota;
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