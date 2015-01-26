Ext.define("Eagle.view.veiculos.Grid", {
    extend: "Ext.form.Panel",
    alias: "widget.veiculos_grid",
    
    requires: [
        "Ext.layout.container.Fit",
        "Ext.form.FieldSet",
        "Ext.form.field.Hidden"
    ],
    
    autoScroll: true,
    border: false,
    layout: "fit",
    viewModel: true,
    loadMask: true,
    
    initComponent: function(){
        Ext.apply(this, {
            items: [{ 
                xtype: "grid",
                autoScroll: true,
                scroll: true,
                border: false,
                publishes: "selection",
                plugins: ["gridfilters"],
                store: "Veiculos",
                columns: {
                    items: [
                        {
                            text: "Placa", 
                            dataIndex: "placa", 
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Frota", 
                            dataIndex: "frota", 
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Empresa", 
                            dataIndex: "empresa", 
                            flex: 2
                        },{
                            text: "Condutor", 
                            dataIndex: "condutor", 
                            flex: 2,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Serial", 
                            dataIndex: "serial", 
                            flex: 1,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        },{
                            text: "Marca/Modelo", 
                            dataIndex: "marca", 
                            flex: 2,
                            filter: {
                                type: "string",
                                itemDefaults: {
                                    emptyText: 'Filtro...'
                                }
                            }
                        }
                    ]
                }
            }]
        });
        
        this.callParent(arguments);
    }
});