Ext.define("Eagle.view.notificacoes.noticias.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.notificacoes_noticias_panel",
    
    autoScroll: true,
    border: false,
    bodyBorder: false,
    collapsible: true,
    margin: "5 5 0 5",
    title: "Notícias do Trânsito",
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
                        '<div class="notificacao" title="Visualizar" id="noticia_{idNotificacao}">',
                            '<div class="descricao">',
                                '<span style="font-weight:bold;">{title}</span>',
                            '</div>',
                            '<div class="informacao">',
                                '<span>{contentSnippet}</span><br/>',
                                '<span style="float: left"><a class="enableclick" style="color:#4d7fcd;" href="{link}" target="_blank">Ler notícia completa</a></span><br/>',
                            '</div>',
                        '</div>',
                      '</tpl>']
            }]
        });
        
        this.callParent(arguments);
    }
});