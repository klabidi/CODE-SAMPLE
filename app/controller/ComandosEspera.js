Ext.define("Eagle.controller.ComandosEspera", {
    extend: "Ext.app.Controller",
    
    models: ["ComandoEspera"],
    stores: ["ComandosEspera"],
    views: ["comandos.espera.Grid"],
    
    init: function(){
        this.control({
            "comandos_espera_grid": {
                beforerender: this.onBeforeRender
            },
            "comandos_espera_grid actioncolumn[action=excluir]": {
                click: this.onExcluirClick
            }
        });
    },
    
    /**
     * Carrega os stores necessários
     * @returns {void}
     */
    onBeforeRender: function(){
        this.getComandosEsperaStore().load();
    },
    
    /**
     * Excluir comandos em espera
     * @param {object} grid
     * @param {object} record
     * @returns {void}
     */
    onExcluirClick: function(grid, record){
        var comandosEsperaStore = this.getComandosEsperaStore();
        
        confirmAlert("Atenção"
            , "Deseja realmente excluir esse comando?"
            , Ext.Msg.WARNING
            , function(res){
                if(res === "yes"){
                    comandosEsperaStore.remove(record);
                    comandosEsperaStore.sync({ //Faz alterações no servidor
                        success: function(){
                            Ext.toast("Registro excluído com sucesso.", "Sucesso", "t");
                        },
                        failure: function(batch, options){
                            Ext.Msg.show({
                                title: "Erro",
                                message: "Ocorreu algum erro ao excluir o registro.\n"
                                        + "Por favor, contate o suporte.",
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.ERROR
                            });
                        }
                    });
                }
            });
    }
});