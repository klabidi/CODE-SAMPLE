Ext.define("Eagle.controller.TrocasVisualizacao", {
    extend: "Ext.app.Controller",
    models: [
        "Empresa",
        "Usuario"
    ],
    stores: [
        "Empresas",
        "Usuarios"
    ],
    views: [
        "trocasvisualizacao.Form"
    ],
    
    init: function(){
        this.control({
            "trocasvisualizacao_form": {
                render: this.onRender
            },
            "trocasvisualizacao_form button[action=trocar]": {
                click: this.onTrocarClick
            },
            "trocasvisualizacao_form button[action=cancelar]": {
                click: this.onCancelarClick
            }
        });
    },
    
    onRender: function(){
        this.getEmpresasStore().load();
        this.getUsuariosStore().load();
    },
    
    onTrocarClick: function(button){
        var form = button.up("form");
        
        form.submit({
            url: "php/trocasvisualizacao.php?action=trocar",
            method: "POST",
            success: function(){
                window.location.reload(true);
            },
            failure: function(form, action){
                msgAlert("Erro"
                        , "Ocorreu um erro ('" + action.result.error + "')."
                        , Ext.Msg.ERROR);
            }
        });
    },
    
    onCancelarClick: function(button){
        var form = button.up("form");
        
        form.reset();
    }
});