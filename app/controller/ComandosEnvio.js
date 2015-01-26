Ext.define("Eagle.controller.ComandosEnvio", {
    extend: "Ext.app.Controller",
    
    models: ["Comando"],
    stores: ["Comandos"],
    views: ["comandos.envio.Window"],
    
    init: function(){
        this.control({
            "comandos_envio_window": {
                beforerender: this.onBeforeRender
            },
            "comandos_envio_window button[action=enviar]": {
                click: this.onEnviarClick
            },
            "comandos_envio_window > form > combobox[name=codigo]": {
                change: this.onComandosComboChange
            }
        });
    },
    
    /**
     * Antes de renderizar a window
     * @param {object} comp
     * @returns {void}
     */
    onBeforeRender: function(comp){
        // Adicionar parâmetro da placa na store
        this.getComandosStore().getProxy().extraParams.placa = comp.placa;
    },
    
    /**
     * Clique no botão enviar
     * Envia o comando para os veículos
     * @param {object} button
     * @returns {void}
     */
    onEnviarClick: function(button){
        var window = button.up("window"),
            form = window.down("form");
        
        if(form.isValid()){
            form.getForm().submit({
                url: "php/veiculos.php?action=enviarComando",
                success: function(form, action) {
                   Ext.toast("Comando enviado", "Sucesso", "c");
                },
                failure: function(form, action) {
                    switch (action.failureType) {
                        case Ext.form.action.Action.CONNECT_FAILURE:
                            msgAlert("Erro", "Erro de conexão", Ext.Msg.ERROR);
                            break;
                        case Ext.form.action.Action.SERVER_INVALID:
                            msgAlert("Erro", "Erro não identificado", Ext.Msg.ERROR);
                            break;
                   }
                }
            });
        }
    },
    
    /**
     * Quando o comando é selecionado
     * @param {object} comp
     * @param {object} newValue
     * @returns {void}
     */
    onComandosComboChange: function(comp, newValue){
        var form = comp.up("form"),
            comandosStore = this.getComandosStore(),
            record,
            parametros,
            oldComponents,
            sateliteCheck;
        
        // Componentes que foram adicionados no form anteriormente
        oldComponents = Ext.ComponentQuery.query("comandos_envio_window > form > [itemId^=padrao]");
        // Se existirem componentes de outro comandos, remove estes componentes
        if(oldComponents.length > 0){
            for(var i = 0; i < oldComponents.length; i++){
                form.remove(oldComponents[i]);
            }
        }
        // Procura pelo comando na store
        record = comandosStore.getAt(comandosStore.find("codigo", newValue));
        
        if(record){
            // Adiciona os parametros de acessório
            form.add([{
                itemId: "padraoAcessorio",
                name: "acessorio",
                value: record.get("acessorio"),
                xtype: "hidden"
            }, {
                itemId: "padraoAcessorioInterno",
                name: "acessorioInterno",
                value: record.get("acessorioInterno"),
                xtype: "hidden"
            }]);
            // Pega o checkbox do satélite
            sateliteCheck = Ext.ComponentQuery.query("comandos_envio_window > form > [name=satelite]")[0];
            // Se o veículo recebe comandos por satélite
            if(record.get("satelite")) // Deixa o checkbox habilitado
                sateliteCheck.setDisabled(false);
            else // Senão desabilita o checkbox
                sateliteCheck.setDisabled(true);
            
            // Pega os parametros do comando selecionado
            parametros = record.get("parametros");
            // Se existirem parametros para o comando selecionado
            if(parametros.length > 0){
                // Adiciona os componentes relativos aos parametros
                for(var i = 0; i < parametros.length; i++){
                    form.add({
                        allowBlank: false,
                        fieldLabel: parametros[i].descricao,
                        itemId: "padrao" + i,
                        maxLength: parametros[i].tamanho,
                        minLength: parametros[i].tamanho || 1,
                        name: "parametro" + i
                    });
                }
            }
        }
    }
});