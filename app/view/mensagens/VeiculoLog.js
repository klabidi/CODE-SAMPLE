Ext.define("Eagle.view.mensagens.VeiculoLog", {
    extend: "Ext.form.Panel",
    alias: "widget.veiculoLogGrid",
    
    border: false,
    itemId: "veiculolog",
    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    
    initComponent: function(){
        Ext.applyIf(this, {
            items: [{
                xtype: "grid",
                //store: "",
                defaults: {
                    border: false
                },
                items: [{
                    columns: [{
                        text: "Data / Hora",
                        dataIndex: "data",
                        filter: "string",
                        flex: 1
                    },{
                        text: "Requerente",
                        dataIndex: "requerente",
                        filter: "string",
                        flex: 1
                    },{
                        text: "Texto",
                        dataIndex: "texto",
                        filter: "string",
                        flex: 1
                    }]
                }] 
            }]
        });
        
        this.callParent(arguments);
    }
});