Ext.define("Eagle.controller.Situacoes", {
    extend: "Ext.app.Controller",
    models: [
        "Situacao"
    ],
    stores: [
        "Situacoes"
    ],
    views: [
        "situacoes.Form",
        "situacoes.Grid",
        "situacoes.Window"
    ],
    
    init: function(){
        this.control({
            "situacoes_grid": {
                beforerender: this.onBeforeRenderGrid
            },
            "situacoes_grid actioncolumn[action=edit]": {
                click: this.onEditarClick
            },
            "situacoes_grid actioncolumn[action=excluir]": {
                click: this.onExcluirClick
            },
            "situacoes_grid > toolbar > button[action=adicionar]": {
                click: this.onAdicionarClick
            },
            "situacoes_grid > toolbar > button[action=configurar]": {
                click: this.onConfigurarClick
            },
            "situacoes_window button[action=salvar]": {
                click: this.onWindowSalvarClick
            },
            "situacoes_window button[action=cancelar]": {
                click: this.onWindowCancelarClick
            }
        });
    },
    
    onBeforeRenderGrid: function(){
        this.getSituacoesStore().load();
    },
    
    onHelpClick: function(){
        Ext.create("Ext.window.Window", {
            height: 350,
            items: [{
                xtype: "panel",
                html: "<video controls autoplay><source src='resources/video/vincular_usuarios.mp4' type='video/mp4'></video>"
            }],
            layout: "fit",
            modal: true,
            title: "Como vincular usuários nas operações?",
            width: 620
        }).show();
    },
    
    onEditarClick: function(view, record){
        var windowSituacao = Ext.create("Eagle.view.situacoes.Window");
        windowSituacao.down("form").loadRecord(record);
        windowSituacao.show();
    },
    
    onExcluirClick: function(view, record){
        var me = this; 
        
        Ext.Msg.show({ 
            title: "Atenção",
            message: "Deseja excluir este registro? (Irá excluir todos os registros, referente a situação, em cascata)",
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function(btn){
                if(btn === "yes"){
                    me.getSituacoesStore().remove(record); 
                    me.getSituacoesStore().sync({ 
                        callback: function(){
                            me.getSituacoesStore().load(); 
                        },
                        failure: function(){
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
            }
        });
    },
    
    onWindowSalvarClick: function(button){
        var me = this,
            win = button.up("window"),
            form = win.down("form");
        
        if(form.isValid()){ //Verifica se o formulário está preenchido corretamente
            win.mask("Salvando...");
            
            var values = form.getValues(), //Pega valores do formulário
                record = form.getRecord(); //Pega o record que foi carregado no form

            if(values.idSituacao > 0){ //Verifica se tem id no registro
                record.set(values); //Faz alteração dos valores do record carregado
            }else{ //Se o registro for novo
                record = Ext.create("Eagle.model.Situacao"); //Cria um novo record vazio
                record.set(values); //Adiciona valores no record
                this.getSituacoesStore().add(record); //Add record na store
            }

            this.getSituacoesStore().sync({ //Faz alterações no servidor
                success: function(){
                    Ext.toast("Registro salvo com sucesso.", "Sucesso", "c");
                    button.up("window").down("form").reset();
                    button.up("window").close();
                    me.getSituacoesStore().load(); //Recarrega o grid
                    win.down("form").reset();
                    win.unmask();
                },
                failure: function(batch, options){
                    win.unmask();
                    msgAlert("Erro","Ocorreu algum erro ao salvar o registro.\nPor favor, contate o suporte.",Ext.Msg.ERROR);
                }
            });
        }else{
            Ext.toast({
                html: "Existem campos que não foram preenchidos",
                title: "Atenção",
                align: "t"
            });
        }
    },
    
    onWindowCancelarClick: function(button){
        button.up("window").down("form").reset();
        button.up("window").close();
    },
    
    onAdicionarClick: function(){
        var windowSituacao = Ext.create("Eagle.view.situacoes.Window");
        windowSituacao.show();
    },
    
    onConfigurarClick: function(){
        var windowCfg = Ext.create("Eagle.view.eventoscfg.WindowCfg");
        windowCfg.show();
    }
    
});