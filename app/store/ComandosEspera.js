Ext.define("Eagle.store.ComandosEspera", {
    extend: "Ext.data.Store",
    model: "Eagle.model.ComandoEspera",
    
    autoLoad: false,
    pageSize: 0,
    proxy: {
        api: {
            //create: "php/operacoes.php?action=criar",
            read: "php/veiculos.php?action=listarComandosEspera",
            //update: "php/operacoes.php?action=alterar",
            destroy: "php/veiculos.php?action=excluirComandosEspera"
        },
        actionMethods: {
            read: 'POST'
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
        },
        type: "ajax"
    },
    sorters: [{
        direction: "DESC",
        property: "data"
    }]
});