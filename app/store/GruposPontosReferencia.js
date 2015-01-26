Ext.define("Eagle.store.GruposPontosReferencia", {
    extend: "Ext.data.Store",
    model: "Eagle.model.GrupoPontoReferencia",
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "",
            read: "php/pontosreferencia.php?action=listarGrupos",
            update: "",
            destroy: ""
        },
        reader: {
            type: "json",
            rootProperty: "data"
        },
        writer: {
            type: "json",
            writeAllFields: true,
            encode: true,
            rootProperty: "data"
        }
    },
    sorters: [{
        direction: "ASC",
        property: "nome"
    }]
});