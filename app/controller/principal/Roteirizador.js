Ext.define("Eagle.controller.principal.Roteirizador", {
    extend: "Ext.app.Controller",
    models: [
        "DirecaoRoteirizacao"
    ],
    stores: [
        "DirecoesRoteirizacao"
    ],
    views: [
        "principal.mapa.roteirizador.Grid"
    ],
    
    refs: [{
        ref: "mapa",
        selector: "principal_panel > panel > principal_mapa_panel"
    }],
    
    init: function(){
        this.control({
            "principal_mapa_roteirizador_grid > toolbar > button[action=roteirizar]": {
                click: this.onRoteirizarButtonClick
            },
            "principal_mapa_roteirizador_grid > toolbar > button[action=limparRoteirizador]": {
                click: this.limparPontosRoteirizador
            }
        });
    },
    
    onRoteirizarButtonClick: function(button){
        var checkbox = button.up("toolbar").down("checkbox[action=otimizar]");
        
        this.getMapa().calcDirection(checkbox.checked);
    },
    
    limparPontosRoteirizador: function(){
        this.getMapa().cleanDirections();
    }
});