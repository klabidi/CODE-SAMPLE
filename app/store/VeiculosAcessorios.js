Ext.define("Eagle.store.VeiculosAcessorios", {
    extend: "Ext.data.Store",
    model: "Eagle.model.VeiculoAcessorio",
    autoLoad: false,
    proxy: {
        type: "ajax",
        url: "php/veiculoslimites.php?action=listarAcessorios",
        reader: {
            type: "json",
            rootProperty: "data"
        }
    }
});