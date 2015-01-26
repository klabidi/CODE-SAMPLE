Ext.define("Eagle.store.PontosReferenciaGrupo", {
    extend: "Ext.data.Store",
    model: "Eagle.model.PontoReferenciaGrupo",
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        api: {
            create: "php/pontosreferencia.php?action=criarGrupos", 
            read:   "php/pontosreferencia.php?action=listarGrupos", 
            update: "php/pontosreferencia.php?action=editarGrupos", 
            destroy:"php/pontosreferencia.php?action=excluirGrupos" 
        },
        actionMethods: {
            read: "POST"
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