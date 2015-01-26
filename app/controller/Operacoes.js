Ext.define("Eagle.controller.Operacoes", {
    extend: "Ext.app.Controller",
    models: [
        "Operacao",
        "Usuario",
        "Veiculo"
    ],
    stores: [
        "Usuarios",
        "UsuariosOperacoes",
        "VeiculosEmpresa",
        "VeiculosOperacoes",
        "Operacoes"
    ],
    views: [
        "operacoes.Grid",
        "operacoes.Window",
        "operacoes.vincular.usuarios.Panel",
        "operacoes.vincular.veiculos.Panel"
    ],
    
    init: function(){
        this.control({
            "operacoes_grid": {
                beforerender: this.onBeforeRenderGrid
            },
            "operacoes_grid actioncolumn[action=edit]": {
                click: this.onEditarClick
            },
            "operacoes_grid actioncolumn[action=excluir]": {
                click: this.onExcluirClick
            },
            "operacoes_grid actioncolumn[action=vincularUsuarios]": {
                click: this.onVincularUsuariosClick
            },
            "operacoes_grid actioncolumn[action=vincularVeiculos]": {
                click: this.onVincularVeiculosClick
            },
            "operacoes_grid > toolbar > button[action=adicionar]": {
                click: this.onAdicionarClick
            },
            "operacoes_vincular_usuarios_panel > grid[itemId=grid1]": {
                drop: this.onDropUsuariosNaoVinculados
            },
            "operacoes_vincular_usuarios_panel > grid[itemId=grid2]": {
                drop: this.onDropUsuariosVinculados
            },
            "operacoes_vincular_veiculos_panel > grid[itemId=grid1]": {
                drop: this.onDropVeiculosNaoVinculados
            },
            "operacoes_vincular_veiculos_panel > grid[itemId=grid2]": {
                drop: this.onDropVeiculosVinculados
            },
            "operacoes_window button[action=salvar]": {
                click: this.onWindowSalvarClick
            },
            "operacoes_window button[action=cancelar]": {
                click: this.onWindowCancelarClick
            }
        });
    },
    
    onBeforeRenderGrid: function(){
        this.getOperacoesStore().load();
    },
    
    onVincularUsuariosClick: function(comp, record){
        var me = this,
            remover = new Array();
        
        this.getUsuariosOperacoesStore()
                .getProxy()
                .extraParams.operacao = record.get("idOperacao");
        // Carrega o store de operações usuários
        this.getUsuariosOperacoesStore().load({
            callback: function(){
                // Carrega o store de usuários
                me.getUsuariosStore().load({
                    callback: function(){
                        // Verifica quais dos usuários já estão vinculados
                        me.getUsuariosOperacoesStore().each(function(opRec){
                            me.getUsuariosStore().each(function(usRec){
                                
                                if(opRec.get("idUsuario") === usRec.get("idUsuario"))
                                    remover.push(usRec); // Adiciona record no array para remoção
                                
                            });
                        });
                        // Remove os records que já estão vinculados
                        me.getUsuariosStore().remove(remover);
                        
                        Ext.create("Ext.window.Window",{
                            bodyPadding: 5,
                            height: 400,
                            items: [{
                                xtype: "operacoes_vincular_usuarios_panel"
                            }],
                            layout: "fit",
                            maxHeight: 300,
                            modal: true,
                            title: "Vincular Usuários",
                            tools: [{
                                type: "help",
                                handler: this.onHelpClick
                            }],
                            width: 600
                        }).show();
                        
                    }
                });
                
            }
        });
    },
    
    onVincularVeiculosClick: function(comp, record){
        var me = this,
            remover = new Array();
        
        this.getVeiculosOperacoesStore()
                .getProxy()
                .extraParams.operacao = record.get("idOperacao");
        // Carrega o store de operações veículos
        this.getVeiculosOperacoesStore().load({
            callback: function(){
                //Carrega o store de veículos
                me.getVeiculosEmpresaStore().load({
                    callback: function(){
                        // Verifica quais dos veículos já estão vinculados
                        me.getVeiculosOperacoesStore().each(function(opRec){
                            me.getVeiculosEmpresaStore().each(function(veRec){
                                
                                if(opRec.get("placa") === veRec.get("placa"))
                                    remover.push(veRec); // Adiciona record no array para removeção
                                
                            });
                        });
                        
                        me.getVeiculosEmpresaStore().remove(remover);
                        
                        Ext.create("Ext.window.Window",{
                            bodyPadding: 5,
                            height: 400,
                            items: [{
                                xtype: "operacoes_vincular_veiculos_panel"
                            }],
                            layout: "fit",
                            maxHeight: 300,
                            modal: true,
                            title: "Vincular Veículos",
                            tools: [{
                                type: "help",
                                handler: this.onHelpClick
                            }],
                            width: 600
                        }).show();
                        
                    }
                });
                
            }
        });
    },
    
    onDropUsuariosNaoVinculados: function(grid, records){
        var operacao = this.getUsuariosOperacoesStore()
                .getProxy().extraParams.operacao,
            len = records.length,
            i = 0;
        
        for(; i < len; i++){
            Ext.Ajax.request({
                async: true,
                url: "php/operacoes.php?action=removerUsuario",
                method: "POST",
                params: {
                    operacao: operacao,
                    usuario: records[i].get("idUsuario")
                },
                failure: function(response){
                    msgAlert("Erro ao desvincular usuário"
                        , "Ocoreu um erro ao desvincular o usuário. (Contate a central)"
                        , Ext.Msg.ERROR
                        , grid);
                }
            });
        }
    },
    
    onDropUsuariosVinculados: function(grid, records){
        var operacao = this.getUsuariosOperacoesStore()
                .getProxy().extraParams.operacao,
            len = records.length,
            i = 0;
        
        for(; i < len; i++){
            Ext.Ajax.request({
                async: true,
                url: "php/operacoes.php?action=addUsuario",
                method: "POST",
                params: {
                    operacao: operacao,
                    usuario: records[i].get("idUsuario")
                },
                failure: function(response){
                    msgAlert("Erro ao vincular usuário"
                        , "Ocoreu um erro ao vincular o usuário. (Contate a central)"
                        , Ext.Msg.ERROR
                        , grid);
                }
            });
        }
    },
    
    onDropVeiculosNaoVinculados: function(grid, records){
        var operacao = this.getVeiculosOperacoesStore()
                .getProxy().extraParams.operacao,
            len = records.length,
            i = 0;
        
        for(; i < len; i++){
            Ext.Ajax.request({
                async: true,
                url: "php/operacoes.php?action=removerVeiculo",
                method: "POST",
                params: {
                    operacao: operacao,
                    placa: records[i].get("placa")
                },
                failure: function(response){
                    msgAlert("Erro ao desvincular veículo"
                        , "Ocoreu um erro ao desvincular o veículo. (Contate a central)"
                        , Ext.Msg.ERROR
                        , grid);
                }
            });
        }
    },
    
    onDropVeiculosVinculados: function(grid, records){
        var operacao = this.getVeiculosOperacoesStore()
                .getProxy().extraParams.operacao,
            len = records.length,
            i = 0;
        
        for(; i < len; i++){
            Ext.Ajax.request({
                async: true,
                url: "php/operacoes.php?action=addVeiculo",
                method: "POST",
                params: {
                    operacao: operacao,
                    placa: records[i].get("placa")
                },
                failure: function(response){
                    msgAlert("Erro ao vincular veículo"
                        , "Ocoreu um erro ao vincular o veículo. (Contate a central)"
                        , Ext.Msg.ERROR
                        , grid);
                }
            });
        }
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
        var windowOperacao = Ext.create("Eagle.view.operacoes.Window");
        windowOperacao.down("form").loadRecord(record);
        windowOperacao.show();
    },
    
    onExcluirClick: function(view, record){
        var me = this; //Guarda contexto da função na variável me
        
        Ext.Msg.show({ //Mensagem de confirmação de exclusão
            title: "Atenção",
            message: "Deseja excluir este registro?",
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function(btn){
                if(btn === "yes"){
                    me.getOperacoesStore().remove(record); //Remove o registro da store
                    me.getOperacoesStore().sync({ //Faz alterações no servidor
                        callback: function(){
                            me.getOperacoesStore().load(); //Recarrega grid
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

            if(values.idOperacao > 0){ //Verifica se tem id no registro
                record.set(values); //Faz alteração dos valores do record carregado
            }else{ //Se o registro for novo
                record = Ext.create("Eagle.model.Operacao"); //Cria um novo record vazio
                record.set(values); //Adiciona valores no record
                this.getOperacoesStore().add(record); //Add record na store
            }

            this.getOperacoesStore().sync({ //Faz alterações no servidor
                success: function(){
                    Ext.toast("Registro salvo com sucesso.", "Sucesso", "c");
                    me.getOperacoesStore().load(); //Recarrega o grid
                    win.down("form").reset();
                    win.unmask();
                },
                failure: function(batch, options){
                    win.unmask();
                    msgAlert("Erro"
                            ,"Ocorreu algum erro ao salvar o registro.\nPor favor, contate o suporte."
                            ,Ext.Msg.ERROR);
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
        var windowOperacao = Ext.create("Eagle.view.operacoes.Window");
        windowOperacao.show();
    }
});