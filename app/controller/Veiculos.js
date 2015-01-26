Ext.define("Eagle.controller.Veiculos", {
    extend: "Ext.app.Controller",
    models: [
        "Veiculo"
    ],
    stores: [
        "Veiculos"
    ],
    views: [
        "veiculos.Grid"
    ],
    
    refs: [{
        ref: "panel",
        selector: "veiculos_grid"
    }], 
    
    init: function(){
        this.control({
            "veiculos_grid": {
                beforerender: this.onBeforeRenderGrid
            },
            "veiculos_grid > grid": {
                select: this.onGridSelect
            }
        });
    },
    
    onBeforeRenderGrid: function(){
        this.getVeiculosStore().load();
    },
    
    onGridSelect: function(grid, record){
        this.getPanel().getForm().loadRecord(record);
    }
    
});