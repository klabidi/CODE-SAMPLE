Ext.define("Eagle.view.comandos.envio.Window", {
    extend: "Ext.window.Window",
    alias: "widget.comandos_envio_window",
    
    requires: [
        "Ext.layout.container.Form"
    ],
    
    // Atributo que recebe qual placa foi selecionada
    placa: null,
    
    modal: true,
    layout: "fit",
    title: "Envio de Comandos",
    width: 500,
    
    initComponent: function(){
        var me = this;
        
        Ext.apply(this, {
            buttons: [{
                action: "enviar",
                text: "Enviar"
            }],
            items: [{
                autoScroll: true,
                defaultType: "textfield",
                items: [{
                    name: "placa",
                    value: me.placa,
                    xtype: "hidden"
                }, {
                    allowBlank: false,
                    displayField: "descricao",
                    editable: false,
                    fieldLabel: "Comando",
                    name: "codigo",
                    store: "Comandos",
                    valueField: "codigo",
                    xtype: "combobox"
                },{
                    disabled: true,
                    fieldLabel: "Satélite",
                    name: "satelite",
                    inputValue: false,
                    xtype: "checkbox"
                }],
                layout: "form",
                xtype: "form"
            }]
        });
        
        this.callParent(arguments);
    }
});