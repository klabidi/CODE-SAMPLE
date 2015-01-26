Ext.define("Eagle.view.veiculos.limites.Window", {
    extend: "Ext.window.Window",
    alias: "widget.veiculos_limites_window",
    
    requires: [
        "Ext.form.FieldContainer",
        "Ext.slider.Widget"
    ],
    
    closeAction: "destroy",
    layout: "fit",
    modal: true,
    title: "Configurações de Limites do Veículo",
    width: 500,
    
    initComponent: function(){
        Ext.apply(this, {
            items: [{
                xtype: "form",
                autoScroll: true,
                bodyPadding: 5,
                layout: "anchor",
                defaultType: "fieldcontainer",
                defaults: {
                    anchor: 0,
                    labelWidth: 140,
                    layout: {
                        type: "hbox",
                        align: "center"
                    }
                },
                buttons: [{
                    action: "salvar",
                    text: "Salvar"
                },{
                    action: "cancelar",
                    text: "Cancelar"
                }],
            
                referenceHolder: true,
                viewModel: {
                    data: {
                        velocidade: 0,
                        velocidadeChuva: 0,
                        rpmMaximo: 0,
                        rpmMinimo: 0,
                        comVelocidade: false,
                        comVelocidadeChuva: false,
                        comRpm: false
                    }
                },
                
                items: [{
                    fieldLabel: "Veículo",
                    defaults: {
                        flex: 1
                    },
                    items: [{
                        xtype: "combobox",
                        name: "placa",
                        displayField: "placa",
                        valueField: "placa",
                        store: "VeiculosUsuario",
                        margin: "0 5 0 5",
                        allowBlank: false,
                        tabIndex: 1
                    }]
                },{
                    fieldLabel: "Velocidade",
                    bind: {
                        hidden: "{!comVelocidade}"
                    },
                    defaults: {
                        minValue: 0,
                        maxValue: 200
                    },
                    items: [{
                        xtype: "numberfield",
                        name: "velocidade",
                        width: 100,
                        margin: "0 5 0 5",
                        bind: "{velocidade}",
                        tabIndex: 2
                    },{
                        xtype: "sliderwidget",
                        flex: 1,
                        bind: "{velocidade}"
                    }]
                },{
                    fieldLabel: "Velocidade com chuva",
                    bind: {
                        hidden: "{!comVelocidadeChuva}"
                    },
                    defaults: {
                        minValue: 0,
                        maxValue: 200
                    },
                    items: [{
                        xtype: "numberfield",
                        name: "velocidadeChuva",
                        width: 100,
                        margin: "0 5 0 5",
                        bind: "{velocidadeChuva}",
                        tabIndex: 3
                    },{
                        xtype: "sliderwidget",
                        flex: 1,
                        bind: "{velocidadeChuva}"
                    }]
                },{
                    fieldLabel: "RPM máximo",
                    bind: {
                        hidden: "{!comRpm}"
                    },
                    defaults: {
                        minValue: 0,
                        maxValue: 9000
                    },
                    items: [{
                        xtype: "numberfield",
                        name: "rpmMaximo",
                        width: 100,
                        margin: "0 5 0 5",
                        bind: "{rpmMaximo}",
                        tabIndex: 4
                    },{
                        xtype: "sliderwidget",
                        flex: 1,
                        bind: "{rpmMaximo}"
                    }]
                },{
                    fieldLabel: "RPM mínimo",
                    bind: {
                        hidden: "{!comRpm}"
                    },
                    defaults: {
                        minValue: 0,
                        maxValue: 9000
                    },
                    items: [{
                        xtype: "numberfield",
                        name: "rpmMinimo",
                        width: 100,
                        margin: "0 5 0 5",
                        bind: "{rpmMinimo}",
                        tabIndex: 5
                    },{
                        xtype: "sliderwidget",
                        flex: 1,
                        bind: "{rpmMinimo}"
                    }]
                }]
            }]
        });
        
        this.callParent(arguments);
    }
});