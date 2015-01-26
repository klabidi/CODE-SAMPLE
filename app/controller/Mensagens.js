Ext.define("Eagle.controller.Mensagens", {
    extend: "Ext.app.Controller",
    
    models: [
        "Veiculo", 
        "Usuario",
        "Operacao",
        "MensagemMacro",
        "MensagemHistorico",
        "NotificacaoMensagem"
    ],
    stores: [
        "VeiculosTeclado",
        "Usuarios",
        "Operacoes",
        "MensagensMacros",
        "MensagensHistoricos",
        "NotificacaoMensagens"
    ],
    views: [
        "mensagens.Window",
        "mensagens.GridMensagem",
        "mensagens.VeiculoTexto",
        "mensagens.VeiculoMacro",
        "mensagens.VeiculoPerguntaResposta",
        "mensagens.UsuarioTexto"
    ],
    
    init: function(){
        this.control({
            "mensagemwindow": {
                show: this.onAfterRender
            },
            "mensagemwindow > tabpanel form button[action=enviar]": {
                click: this.enviarMensagem
            },
            "mensagemwindow > tabpanel form combobox[name=operacao]": {
                change: this.onOperacaoChange
            },
            "notificacoes_mensagens_panel tool[action=setLidaTodasMsgs]": {
                click: this.setLidaTodasMsgs
            },
            "mensagemwindow > tabpanel form combobox[name=placas]": {
                select: this.onLoadMsgsPlc
            },
            "mensagemwindow > tabpanel form combobox[name=usuarios]": {
                select: this.onLoadMsgsUser
            },
            "mensagemwindow > grid_mensagem_form": {
                expand: this.onCollapseMsgExpandPanel,
                collapse: this.onCollapseMsgPanel
            }
        });
    },
    
    onAfterRender: function(window){
        if(!this.getVeiculosTecladoStore().isLoaded()){
            this.getVeiculosTecladoStore().load({
                scope: this,
                callback: function(){
                    this.onAfterRender(window);
                }
            });
        }else{
            if(this.getVeiculosTecladoStore().getTotalCount() === 0){
                window.down("tabpanel").remove(window.down("veiculotextoform"));
                window.down("tabpanel").remove(window.down("veiculoperguntarespostaform"));
            }
        }
    },
    
    enviarMensagem: function(comp){
        var me = this,
            form = comp.up("form"),
            values = form.getValues(),
            placas,
            usuarios;
        
        if(form.isValid()){
            if(values.tipo === "4"){
                usuarios = values.usuarios.join();
            }else{
                placas = (values.tipo === "2") ? values.placas : values.placas.join();
            }
            
            form.submit({
                params: {
                    placasSel: placas,
                    usuariosSel: usuarios
                },
                success: function(form, action){
                    Ext.toast("Mensagem enviada.", "Sucesso", "c");
                    
                    form.reset();
                },
                failure: function(form, action){
                    switch(action.failureType){
                        case Ext.form.action.Action.SERVER_INVALID:
                            var res = Ext.decode(action.response.responseText);

                            msgAlert("Erro",
                                     "A mensagem não pode ser enviada (" + res.error + ").",
                                     Ext.Msg.ERROR);
                            break;
                        
                        case Ext.form.action.Action.CONNECT_FAILURE:
                            msgAlert("Erro",
                                     "Falha na conexão. A mensagem não pode ser enviada.",
                                     Ext.Msg.ERROR);
                            break;
                    }
                }
            });
        }
    },
    
    onOperacaoChange: function(comp, newValue){
        var form = comp.up("form"),
            placasCombo = form.down("combobox[name=placas]");
        
        if(newValue){
            Ext.Ajax.request({
                async: false,
                method: "POST",
                url: "php/veiculos.php?action=listarOperacao",
                params: {
                    operacao: newValue
                },
                callback: function(opt, success, response){
                    var res = Ext.decode(response.responseText);
                    if(res.success){
                        var arrPlacas = new Array();
                        
                        for(var i = 0; i < res.data.length; i++){
                            arrPlacas.push(res.data[i].placa);
                        }
                        
                        placasCombo.setValue(arrPlacas);
                    }
                }
            });
        }
    },
    
    onVeiculoMacroComboChange: function(comp, newValue){
        var macrosStore = this.getMensagensMacrosStore();
        
        if(newValue){
            macrosStore.getProxy().extraParams.placa = newValue;
            macrosStore.load();
        }else{
            macrosStore.getProxy().extraParams = {};
        }
    },
    
    setLidaTodasMsgs: function(){
        var me = this;
        confirmAlert("Atenção", "Deseja realmente marcar como lida todas as mensagens?", Ext.Msg.WARNING, 
            function(res){
                if(res === "yes"){
                    Ext.Ajax.request({
                        url: "php/notificacoes.php?action=setLidaTodasMsgs",
                        method: "POST",
                        callback: function(options, success, response){
                            var res = Ext.decode(response.responseText);
                            if(res.success){
                                me.getNotificacaoMensagensStore().load();
                            }
                        }
                    }); 
                }
        });
        
    },
    
    onLoadMsgsPlc: function(){
        var placasCombo = Ext.ComponentQuery.query('mensagemwindow > tabpanel form combobox[name=placas]')[0],
            mensagemwindow = Ext.ComponentQuery.query('mensagemwindow')[0],
            plcs = placasCombo.getValue(),
            placasConcat = '';
            
        for (i=0; i < plcs.length; i++) { 
            placasConcat += plcs[i] + ",";
        }
        
        //retira ultimo caracter
        placasConcat = placasConcat.substring(0,(placasConcat.length - 1));
        
        this.getMensagensHistoricosStore().load({
            params: {
                usuarioPlaca: placasConcat 
            }
        });
        
        mensagemwindow.center();
    },
    
    onLoadMsgsUser: function(){
        var userCombo = Ext.ComponentQuery.query('mensagemwindow > tabpanel form combobox[name=usuarios]')[0],
            mensagemwindow = Ext.ComponentQuery.query('mensagemwindow')[0],
            users = userCombo.getValue(),
            userConcat = '';
            
        for (i=0; i < users.length; i++) { 
            userConcat += users[i] + ",";
        }
        
        //retira ultimo caracter
        userConcat = userConcat.substring(0,(userConcat.length - 1));
        
        this.getMensagensHistoricosStore().load({
            params: {
                usuarioPlaca: userConcat 
            }
        });
        
        mensagemwindow.center();
    },
    
    onCollapseMsgExpandPanel: function(panel){
        var coll = panel.getCollapsed(),
            mensagemwindow = Ext.ComponentQuery.query('mensagemwindow')[0];
        
        mensagemwindow.setHeight(true);
        mensagemwindow.center();
        
    },
    
    onCollapseMsgPanel: function(panel){
        var coll = panel.getCollapsed(),
            mensagemwindow = Ext.ComponentQuery.query('mensagemwindow')[0];
        
        mensagemwindow.setHeight(true);
        mensagemwindow.center();
        
    }
    
});