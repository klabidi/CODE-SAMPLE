Ext.define("Eagle.store.UsuariosGrupo",{
    extend: "Ext.data.Store",
    model: "Eagle.model.Usuario",
    remoteSort: true,
    autoLoad: false,
    
    proxy: {
        type: "ajax",
        url: "php/usuarios.php?action=listarG",
            
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
        }
    }
});