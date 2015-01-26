Ext.define("Eagle.view.notificacoes.informacoes.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.notificacoes_informacoes_panel",
    
    itemId: "notificacao_informacoes_panel",
    autoScroll: true,
    border: false,
    bodyBorder: false,
    collapsible: true,
    margin: "5 5 0 5",
    title: "Informações do Sistema",
    titleCollapse: true,
    header: {
        style: {
            backgroundColor: "#FFFFFF"
        }
    },
    
    store: {},
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(this, {
            items: [{
                xtype: "dataview",
                store: me.store,
                itemSelector: "div.notificacao",
                tpl: ['<tpl for=".">',
                        '<div class="notificacao" id="informacao_{idNotificacao}">',
                            '<div class="descricao">',
                                '<span style="float:left; font-weight:bold;">{remetente}</span>',
                                '<span style="float:right; font-size:10px;">{data}</span><br>',
                                '<span style="float:left; font-size:10px;" id="vis_{idNotificacao}_{random}" onmouseover="fireEvent(\'notificacao_informacoes_panel\', \'informacaotooltipvisualizadores\', \'{idNotificacao}\',\'{visualizacoes}\',\'{random}\')">{visualizacoes:this.visualizacoes}</span>',
                                '<span style="float:right; font-size:10px;">{[dataDif(values.data)]}</span>',
                            '</div>',
                            '<div class="informacao">',
                                '<span>{descricao}</span><br/><br/>',
                                '<a class="enableclick" style="color:#4d7fcd;" '
                                    +'onclick="fireEvent(\'notificacao_informacoes_panel\', \'informacaoreadclick\', \'{idNotificacao}\', \'informacao\')"'
                                    +'>Marcar Como Lida</a>',
                                '<span style="float: right"><a href="{url}" target="_blank" class="enableclick" style="color:#4d7fcd;">Acessar</a></span>',
                            '</div>',
                        '</div>',
                      '</tpl>',
                      {
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