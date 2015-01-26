Ext.define("Eagle.store.Grupos", {
    extend: "Ext.data.Store",
    model: "Eagle.model.Grupo",
    autoLoad: false,
    proxy: {
        type: "ajax",
        url: "php/grupos.php?action=listar",
        reader: {
            type: "json",
            rootProperty: "data"
        }
    }
});