Ext.define("Eagle.store.Empresas", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Empresa",
    autoLoad: false,
    remoteSort: false,
    remoteFilter: false,
    proxy: {
        type: "ajax",
        url: "php/empresas.php?action=listar",
        reader: {
            type: "json",
            rootProperty: "data"
        }
    }
});