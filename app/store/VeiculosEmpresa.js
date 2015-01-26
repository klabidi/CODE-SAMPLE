Ext.define("Eagle.store.VeiculosEmpresa", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Veiculo",
    autoLoad: false,
    proxy: {
        type: "ajax",
        url: "php/veiculos.php?action=listarEmpresaCompleto",
        reader: {
            type: "json",
            rootProperty: "data"
        }
    },
    sorters: [{
        direction: "ASC",
        property: "placa"
    }]
});