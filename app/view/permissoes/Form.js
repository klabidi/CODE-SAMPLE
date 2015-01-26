Ext.define("Eagle.view.permissoes.Form", {
    extend: "Ext.form.Panel",
    alias: "widget.permissoes_form",
    
    requires: [
        "Ext.layout.container.Column",
        "Ext.form.FieldSet",
        "Ext.form.field.Hidden"
    ],
    
    autoScroll: false,
    border: false,
    layout: {
        type: "hbox",
        align: "stretch"
    },
    viewModel: true,
    loadMask: true,
    
    initComponent: function(){
        Ext.apply(this, {
            fieldDefaults: {
                labelAlign: 'left',
                labelWidth: 90,
                anchor: '100%',
                msgTarget: 'side'
            },
            
            items: [
                {
                    xtype: 'panel',
                    border: false,
                    flex: 2,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            flex: 1,
                            xtype: 'permissoes_grupo'
                        },{
                            flex: 2,
                            xtype: 'usuarios_grid'
                        }
                    ]
                },{
                    xtype: "permissoes_modulo",
                    flex: 1
                    //columnWidth: 0.35
                }
            ]
        });
        
        this.callParent(arguments);
    }
});