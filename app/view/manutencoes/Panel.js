Ext.define("Eagle.view.manutencoes.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.manutencoespanel",
    layout: "fit",
    border: false,
    
    initComponent: function(){
        Ext.apply(this, {
            items: [{
                xtype: "tabpanel",
                border: false,
                bodyStyle: {
                    backgroundImage: "url('resources/images/index/cielo_logo.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                    backgroundPosition: "center"
                },
                items: [{
                    icon: "resources/images/16/person-stalker.png",
                    itemId: 'usuarios',
                    title: "Usuários",
                    xtype: "usuarios_form",
                    hidden: !Eagle.permissao.verificarPermissao(8)
                },{
                    icon: "resources/images/16/truck-outline.png",
                    title: "Veículos",
                    xtype: "veiculos_grid",
                    hidden: !Eagle.permissao.verificarPermissao(9)
                },{
                    icon: "resources/images/16/ios7-paper-outline.png",
                    title: "Operações",
                    xtype: "operacoes_grid",
                    hidden: !Eagle.permissao.verificarPermissao(9)
                },{
                    icon: "resources/images/16/man.png",
                    title: "Condutores",
                    xtype: "condutores_form",
                    hidden: !Eagle.permissao.verificarPermissao(10)
                },{
                    icon: "resources/images/16/ios7-pricetags-outline.png",
                    title: "Situações",
                    xtype: "situacoes_grid",
                    hidden: !Eagle.permissao.verificarPermissao(13)
                },{
                    icon: "resources/images/16/ios7-locked-outline.png",
                    title: "Permissões",
                    xtype: "permissoes_form",
                    hidden: !Eagle.permissao.verificarPermissao(11)
                }]
            }]
        });
        
        this.callParent(arguments);
    }
});