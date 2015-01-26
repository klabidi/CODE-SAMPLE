Ext.define("Eagle.controller.EventosCfg", {
    extend: "Ext.app.Controller",
    models: [
        "EventoCfg",
        "Operacao",
        "Situacao",
        "MensagemMacro",
        "MsgCfg"
    ],
    stores: [
        "EventosCfg",
        "EventosCfgCombo",
        "Operacoes",
        "Situacoes",
        "MensagensMacros",
        "MsgsCfg"
    ],
    views: [
        "eventoscfg.WindowCfg",
        "eventoscfg.Grid",
        "eventoscfg.Form",
        "eventoscfg.Window",
        "eventoscfg.MsgGrid",
        "eventoscfg.MsgForm",
        "eventoscfg.MsgWindow"
    ],
    
    init: function(){
        this.control({
            "eventoscfg_grid": {
                //beforerender: this.onBeforeRender,
                beforeEdit: this.onBeforeEdit,
                canceledit: this.onCancelEdit,
                edit: this.onEdit
            },
            "eventoscfg_grid actioncolumn[action=excluir]": {
                click: this.onExcluirClick
            },
            "eventoscfg_grid > toolbar > button[action=adicionar]": {
                click: this.onAdicionarClick
            },
            "eventoscfg_grid > toolbar > button[action=recarregar]": {
                click: this.onRecarregarClick
            },
            "eventoscfg_grid > toolbar > combobox[name=operacao]": {
                change: this.onOperacaoChange
            },
            "eventoscfg_window button[action=salvar]": {
                click: this.onWindowSalvarClick
            },
            "eventoscfg_window button[action=cancelar]": {
                click: this.onWindowCancelarClick
            },
            "msgcfg_grid": {
                beforeEdit: this.onMsgBeforeEdit,
                canceledit: this.onMsgCancelEdit,
                edit: this.onMsgEdit
            },
            "msgcfg_grid actioncolumn[action=excluir]": {
                click: this.onMsgExcluirClick
            },
            "msgcfg_grid > toolbar > button[action=adicionar]": {
                click: this.onMsgAdicionarClick
            },
            "msgcfg_grid > toolbar > button[action=recarregar]": {
                click: this.onMsgRecarregarClick
            },
            "msgcfg_grid > toolbar > combobox[name=operacao]": {
                change: this.onMsgOperacaoChange
            },
            "msgcfg_window button[action=salvar]": {
                click: this.onMsgWindowSalvarClick
            },
            "msgcfg_window button[action=cancelar]": {
                click: this.onMsgWindowCancelarClick
            }
        });
    },
    
    /**
     * Antes da renderização do grid
     * @returns {void}
     */
    //onBeforeRender: function(){
        // Carrega store das situacoes
    //    this.getSituacoesStore().load();
    //},
    
    /**
     * Clique no botão adicionar novo eventocfg
     * @param {Ext.button.Button} button
     * @returns {void}
     */
    onAdicionarClick: function(button){
        var windowCad = Ext.create("Eagle.view.eventoscfg.Window"),
            operacaoId = Ext.ComponentQuery.query('eventoscfg_grid > toolbar > combobox[name=operacao]')[0].getValue();
        
        this.getEventosCfgComboStore().load({
            params: {
                operacao: operacaoId
            }
        });
        
        windowCad.show();
    },
    
    /**
     * Clique no botão da ação excluir eventocfg
     * @param {Ext.grid.column.Action} actioncolumn
     * @param {Eagle.model.EventoCfg} record
     * @returns {void}
     */
    onExcluirClick: function(actioncolumn, record){
        var me = this;
        
        confirmAlert("Atenção"
            , "Deseja realmente excluir esse registro?"
            , Ext.Msg.WARNING
            , function(res){
                if(res === "yes"){
                    me.getEventosCfgStore().remove(record); // Remove o record da store
                    me.getEventosCfgStore().sync({ // Manda a requisição de remover para o php
                        failure: function(){
                            msgAlert("Erro"
                                    , "Não foi possível excluir o evento. Contate a central."
                                    , Ext.Msg.ERROR);
                        }
                    });
                }
            });
    },
    
    /**
     * Antes de editar
     * @param {object} editor
     * @param {object} context
     * @returns {Boolean}
     */
    onBeforeEdit: function(editor, context){
        // Verifica se o usuário está tentando editar um registro já vinculado
        if(context.record.get("codigo") !== 0)
            return false; // Não pode editar
        else
            return true; // Pode somente adicionar
    },
    
    /**
     * Depois de clicar fora ou enter
     * @param {object} editor
     * @param {object} context
     * @returns {Boolean}
     */
    onEdit: function(editor, context){
        var comboStore = this.getEventosCfgComboStore(), // Referência do store do combo
            gridStore = this.getEventosCfgStore(), // Referência do store do grid
            operacaoCombo = context.grid.up("window").down("combobox[name=operacao]"),
            comboRec;
            
        var comboSituStore = this.getSituacoesStore(), // Referência do store do grid
            comboSituRec;
            
        // Verifica se o registro já está cadastrado
        if(gridStore.find("codigo", context.value) > -1){
            Ext.toast("Este evento já está cadastrado.", "Evento já cadastrado", "c");
            gridStore.removeAt(0); // Remove do grid o record em branco
            
            return false; // Para a operação
        }
        
        // Pega o record selecionado no combo
        comboRec = comboStore.getAt(comboStore.find("codigo", context.value));
        
        // Pega o record selecionado no combo de situacao
        comboSituRec = comboSituStore.getAt(comboSituStore.find("idSituacao", context.value));
        
        // Copia os valores para o record vázio adicionado no store do grid
        context.record.set({
            descricao: comboRec.get("descricao"),
            codigo: comboRec.get("codigo"),
            parametro: comboRec.get("parametro"),
            acessorio: comboRec.get("acessorio"),
            acessorioInterno: comboRec.get("acessorioInterno"),
            situacao: comboSituRec.get("idSituacao"),
            operacao: operacaoCombo.getValue()
        });
        
        // Manda request para fazer alterações no php
        gridStore.sync({
            failure: function(){
                msgAlert("Erro"
                        , "Não foi possível cadastrar o evento. Contate a central."
                        , Ext.Msg.ERROR);
            }
        });
        
        return true;
    },
    
    /**
     * Clique no recarregar grid
     * @returns {void}
     */
    onRecarregarClick: function(){
        this.getEventosCfgStore().reload();
    },
    
    /**
     * Quando a edição é cancelada
     * @param {object} editor
     * @param {object} context
     * @returns {void}
     */
    onCancelEdit: function(editor, context){
        if(context.record.get("codigo") === 0){ // Se for um record novo adicionado
            // Remove da store do grid
            this.getEventosCfgStore().remove(context.record);
            
        }
    },
    
    onWindowSalvarClick: function(button){
        var me = this,
            win = button.up("window"),
            form = win.down("form"),
            operacaoId = Ext.ComponentQuery.query('eventoscfg_grid > toolbar > combobox[name=operacao]')[0].getValue();
        
        Ext.ComponentQuery.query('eventoscfg_form > hidden[name=operacao]')[0].setValue(operacaoId);
        
        if(form.isValid()){ 
            win.mask("Salvando...");
            
            var values = form.getValues(), 
                record = form.getRecord();
            
            record = Ext.create("Eagle.model.EventoCfg"); //Cria um novo record vazio
            record.set(values); //Adiciona valores no record
            this.getEventosCfgStore().add(record); //Add record na store
            
            this.getEventosCfgStore().sync({ //Faz alterações no servidor
                success: function(){
                    Ext.toast("Registro salvo com sucesso.", "Sucesso", "c");
                    button.up("window").down("form").reset();
                    button.up("window").close();
                    me.getEventosCfgStore().load(); //Recarrega o grid
                    win.down("form").reset();
                    win.unmask();
                },
                failure: function(batch, options){
                    msgAlert("Erro","Ocorreu algum erro ao salvar o registro. Motivo: Registro já cadastrado.",Ext.Msg.ERROR);
                    button.up("window").down("form").reset();
                    button.up("window").close();
                    me.getEventosCfgStore().load(); //Recarrega o grid
                    win.down("form").reset();
                    win.unmask();
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
    
    onOperacaoChange: function(combobox, newValue){
        this.getEventosCfgStore().getProxy().extraParams.operacao = newValue;
        this.getEventosCfgStore().load();
    },
    
    /******************************************************/
    
    onMsgAdicionarClick: function(button){
        var windowCad = Ext.create("Eagle.view.eventoscfg.MsgWindow"),
            operacaoId = Ext.ComponentQuery.query('msgcfg_grid > toolbar > combobox[name=operacao]')[0].getValue();
        
        this.getMensagensMacrosStore().load({
            params: {
                placa: 'null',
                envio: 'false'
            }
        });
        
        windowCad.show();
    },
    
    onMsgExcluirClick: function(actioncolumn, record){
        var me = this;
        
        confirmAlert("Atenção"
            , "Deseja realmente excluir esse registro?"
            , Ext.Msg.WARNING
            , function(res){
                if(res === "yes"){
                    me.getMsgsCfgStore().remove(record); 
                    me.getMsgsCfgStore().sync({ 
                        failure: function(){
                            msgAlert("Erro", "Não foi possível excluir o registro. Contate a central.", Ext.Msg.ERROR);
                        }
                    });
                }
            });
    },
    
    onMsgBeforeEdit: function(editor, context){
        // Verifica se o usuário está tentando editar um registro já vinculado
        if(context.record.get("mensagem") !== 0)
            return false; // Não pode editar
        else
            return true; // Pode somente adicionar
    },
    
    onMsgEdit: function(editor, context){
        var comboStore = this.getMensagensMacrosStore(), 
            gridStore = this.getMsgsCfgStore(), 
            operacaoCombo = context.grid.up("window").down("combobox[name=operacao]"),
            comboRec;
            
        var comboSituStore = this.getSituacoesStore(), // Referência do store do grid
            comboSituRec;
            
        // Verifica se o registro já está cadastrado
        if(gridStore.find("mensagem", context.value) > -1){
            Ext.toast("Este evento já está cadastrado.", "Evento já cadastrado", "c");
            gridStore.removeAt(0); 
            return false; 
        }
        
        comboRec = comboStore.getAt(comboStore.find("codigo", context.value));
        comboSituRec = comboSituStore.getAt(comboSituStore.find("idSituacao", context.value));
        
        // Copia os valores para o record vázio adicionado no store do grid
        context.record.set({
            descricao: comboRec.get("descricao"),
            codigo: comboRec.get("codigo"),
            parametro: comboRec.get("parametro"),
            acessorio: comboRec.get("acessorio"),
            acessorioInterno: comboRec.get("acessorioInterno"),
            situacao: comboSituRec.get("idSituacao"),
            operacao: operacaoCombo.getValue()
        });
        
        // Manda request para fazer alterações no php
        gridStore.sync({
            failure: function(){
                msgAlert("Erro"
                        , "Não foi possível cadastrar o evento. Contate a central."
                        , Ext.Msg.ERROR);
            }
        });
        
        return true;
    },
    
    onMsgRecarregarClick: function(){
        this.getMsgsCfgStore().reload();
    },
    
    onMsgCancelEdit: function(editor, context){
        if(context.record.get("mensagem") === 0){ 
            this.getMensagensMacrosStore().remove(context.record);
        }
    },
    
    onMsgWindowSalvarClick: function(button){
        var me = this,
            win = button.up("window"),
            form = win.down("form"),
            operacaoId = Ext.ComponentQuery.query('msgcfg_grid > toolbar > combobox[name=operacao]')[0].getValue();
        
        Ext.ComponentQuery.query('msgcfg_form > hidden[name=operacao]')[0].setValue(operacaoId);
        
        if(form.isValid()){ 
            win.mask("Salvando...");
            
            var values = form.getValues(), 
                record = form.getRecord();
            
            record = Ext.create("Eagle.model.MsgCfg"); 
            record.set(values); 
            this.getMsgsCfgStore().add(record); 
            
            this.getMsgsCfgStore().sync({ 
                success: function(){
                    Ext.toast("Registro salvo com sucesso.", "Sucesso", "c");
                    button.up("window").down("form").reset();
                    button.up("window").close();
                    me.getMsgsCfgStore().load(); 
                    win.down("form").reset();
                    win.unmask();
                },
                failure: function(batch, options){
                    msgAlert("Erro","Ocorreu algum erro ao salvar o registro. Motivo: Registro já cadastrado.",Ext.Msg.ERROR);
                    button.up("window").down("form").reset();
                    button.up("window").close();
                    me.getMsgsCfgStore().load(); 
                    win.down("form").reset();
                    win.unmask();
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
    
    onMsgWindowCancelarClick: function(button){
        button.up("window").down("form").reset();
        button.up("window").close();
    },
    
    onMsgOperacaoChange: function(combobox, newValue){
        this.getMsgsCfgStore().getProxy().extraParams.operacao = newValue;
        this.getMsgsCfgStore().load();
    }
});