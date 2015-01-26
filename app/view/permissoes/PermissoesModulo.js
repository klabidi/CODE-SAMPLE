Ext.define("Eagle.view.permissoes.PermissoesModulo", {
    extend: "Ext.form.Panel",
    alias: "widget.permissoes_modulo",
    
    requires: [
        "Ext.layout.container.Column",
        "Ext.form.FieldSet",
        "Ext.form.field.Hidden",
        'Ext.tree.*',
        'Ext.data.*'
    ],
    
    border: false,
    layout: "fit",
    autoLoad: false, 
     
    initComponent: function(){
        Ext.apply(this, {
            items: [{
                xtype: 'treepanel',
                autoScroll: true, 
                title: 'Modulos',
                rootVisible: false,
                store: 'Permissoes',
                animate: true,
                tbar: [
                '->',
                {
                    action: "expandir",
                    text: 'Expandir'
                }, {
                    action: "reduzir",
                    text: 'Reduzir'
                }]
                
            }]
        });
        
        this.callParent(arguments);
    }
});