Ext.define("Eagle.controller.Notificacoes", {
    extend: "Ext.app.Controller",
    models: [
        "NotificacaoTipo",
        "Notificacao",
        "NotificacaoMensagem",
        "NotificacaoEvento",
        "NotificacaoNoticia",
        "NotificacaoInformacao",
        "MensagemHistorico"
    ],
    stores: [
        "NotificacaoMensagens",
        "NotificacaoEventos",
        "NotificacaoNoticias",
        "NotificacaoInformacoes",
        "MensagensHistoricos"
    ],
    views: [
        "notificacoes.Panel",
        "notificacoes.mensagens.Panel",
        "notificacoes.eventos.Panel",
        "notificacoes.noticias.Panel",
        "notificacoes.informacoes.Panel",
        "mensagens.Window"
    ],
    
    refs: [{
        ref: "panel",
        selector: "notificacoes_panel"
    }, {
        ref: "mensagensPanel",
        selector: "notificacoes_panel notificacoes_mensagens_panel"
    }, {
        ref: "eventosPanel",
        selector: "notificacoes_panel notificacoes_eventos_panel"
    }, {
        ref: "informacoesPanel",
        selector: "notificacoes_panel notificacoes_informacoes_panel"
    }, {
        ref: "noticiasPanel",
        selector: "notificacoes_panel notificacoes_noticias_panel"
    }, {
        ref: "btnAlertaAvisos",
        selector: "viewport > [region=north] > toolbar > #defaultButtonGroup > button[action=mostrarAvisos]"
    }],
    
    taskRunner: new Ext.util.TaskRunner(),
    reloadNotificacoes: null,
    
    avisosVisualizados: false,
    totalMensagens: 0,
    totalEventos: 0,
    totalInformacoes: 0,

    init: function(){
        this.control({
            "notificacoes_panel": {
                render: this.onRenderPanel,
                expand: this.onNotificacoesPanelExpand,
                collapse: this.onNotificacoesPanelCollapse
            },
            "notificacoes_mensagens_panel": {
                mensagemtooltipvisualizadores: this.onTooltipVisualizadores,
                mensagemreadclick: this.onNotificacaoReadClick,
                mensagemresponderclick: this.onMensagemResponderClick
            },
            "notificacoes_eventos_panel": {
                eventoreadclick: this.onNotificacaoReadClick,
                eventotooltipvisualizadores: this.onTooltipVisualizadores
            },
            "notificacoes_informacoes_panel": {
                informacaoreadclick: this.onNotificacaoReadClick,
                informacaotooltipvisualizadores: this.onTooltipVisualizadores
            },
            "viewport > [region=north] > toolbar > #defaultButtonGroup > button[action=mostrarAvisos]": {
                click: this.onBtnAlertaAvisosClick
            },
            "notificacoes_panel tool[action=adicionarEvento]": {
                click: this.onAdicionarEventoClick
            },
            "notificacoes_panel tool[action=enviarMensagem]": {
                click: this.onEnviarMensagemClick
            }
        });
        
        this.reloadNotificacoes = this.taskRunner.newTask({
            scope: this,
            run: this.load,
            interval: 1000 * 60 //1 minuto
        });
    },
    
    routes: {
        "notificacoes/:id": "onAfterInformacoes"
    },
    
    load: function(){
        this.getNotificacaoMensagensStore().load({
            scope: this,
            callback: this.mostrarMensagens
        });
        
        this.getNotificacaoEventosStore().load({
            scope: this,
            callback: this.mostrarEventos
        });
        
        this.getNotificacaoInformacoesStore().load({
            scope: this,
            callback: this.mostrarInformacoes
        });
        
        //this.mostrarNoticias();
    },
    
    /**
     * Quando o panel for renderizado a função carrega os stores e da ínicio
     * no reload automático de notificações
     * @returns {void}
     */
    onRenderPanel: function(){
        this.load();
        this.reloadNotificacoes.start();
    },
    
    onNotificacaoReadClick: function(comp, idNotificacao, tipo){
        this.marcarNotificacaoVisualizada(idNotificacao, tipo);
    },
    
    onMensagemResponderClick: function(comp, idNotificacao, placa, usuario){
        this.abrirMensagemWindow(comp, idNotificacao, placa, usuario);
    },
    
    onTooltipVisualizadores: function(comp, idNotificacao, visualizadores, random){
        if(visualizadores>0){
            var tooltip = Ext.getCmp('tooltip_'+idNotificacao);
            if(tooltip) tooltip.destroy();

            Ext.create('Ext.tip.ToolTip', {
                id: 'tooltip_'+idNotificacao,
                target: 'vis_'+idNotificacao+'_'+random,
                width: 200,
                loader: {
                    url: 'php/notificacoes.php?action=listarVisualizadores&idNotificacao='+idNotificacao,
                    autoLoad: true
                }
            });
            Ext.QuickTips.init();
        }
    },
    
    onNotificacoesPanelExpand: function(comp){
        this.avisosVisualizados = true;
        
        this.getBtnAlertaAvisos().setHidden(true);
        
        //this.mostrarNoticias();
    },
    
    onNotificacoesPanelCollapse: function(comp){
        this.avisosVisualizados = false;
    },
    
    onBtnAlertaAvisosClick: function(){
        this.getPanel().expand();
    },
    
    /**
     * Verifica se existem notificações novas
     * @returns {void}
     */
    verificarNotificacoesNovas: function(){
        var qtdMensagens = this.getNotificacaoMensagensStore().getTotalCount(),
            qtdEventos = this.getNotificacaoEventosStore().getTotalCount(),
            qtdInformacoes = this.getNotificacaoInformacoesStore().getTotalCount(),
            mensagens = false,
            eventos = false,
            informacoes = false,
            avisos = false;
        
        // Se a quantidade de mensagens na store for maior que o total de mensagens
        if(qtdMensagens > this.totalMensagens){
            // Atualiza o total de mensagens
            this.totalMensagens = qtdMensagens;
            // Seta flag de mensagens como true
            mensagens = true;
        }
        
        // Se a quantidade de enventos na store for maior que o total de eventos
        if(qtdEventos > this.totalEventos){
            // Atualiza total de eventos
            this.totalEventos = qtdEventos;
            // Seta flag de eventos como true
            eventos = true;
        }
        
        if(qtdInformacoes > this.totalInformacoes){
            this.totalInformacoes = qtdInformacoes;
            
            informacoes = true;
        }
        
        // Se existirem mensagens ou eventos e o panel de avisos ainda não foi visualizado
        avisos = (mensagens || eventos || informacoes) && !this.avisosVisualizados;
        
        // Se nenhuma notificação nova veio mas as antigas ainda não foram visualizadas
        if(((qtdMensagens + qtdEventos + qtdInformacoes) > 0) && !this.avisosVisualizados){
            // Seta flag de avisos como true
            avisos = true;
        }
        
        // Mostra ou esconde o ícone de notificações de acordo com a flag avisos
        this.getBtnAlertaAvisos().setHidden(!avisos);
        /*
        if(mensagens || eventos || informacoes){
            var title, txt;
            if(mensagens){
                title = 'Nova Notificação de Mensagem!';
                txt = '<b>'+this.getNotificacaoMensagensStore().getAt(0).getData().remetente+'</b>: ';
                txt += this.getNotificacaoMensagensStore().getAt(0).getData().mensagem;
            }
            
            if(eventos){
                title = 'Nova Notificação de Evento!';
                txt = '<b>'+this.getNotificacaoEventosStore().getAt(0).getData().veiculo+'</b>: ';
                txt += this.getNotificacaoEventosStore().getAt(0).getData().descricao;
            }
            
            if(informacoes){
                title = 'Nova Notificação de Informação!'; // ORDENACAO INVERTIDA, MAIS NOVA EM BAIXO< ACERTAR...
                txt = '<b>'+this.getNotificacaoInformacoesStore().getAt(0).getData().remetente+'</b>: ';
                txt += this.getNotificacaoInformacoesStore().getAt(0).getData().descricao;
            }
            
            Ext.toast(txt, title);
            Ext.toast({message: 'Hello Sencha!', timeout: 2000});
        }
        */
    },
    
    mostrarMensagens: function(){
        var mensagensStore = this.getNotificacaoMensagensStore(),
            mensagensPanel = this.getMensagensPanel(),
            panel = this.getPanel(),
            qtdRecords = mensagensStore.getTotalCount();
        
        // Verifica se o panel já não está adicionado ainda
        if(!mensagensPanel){
            if(qtdRecords > 0){
                panel.add({
                    xtype: "notificacoes_mensagens_panel",
                    store: mensagensStore
                });
            }
        }else{
            if(qtdRecords === 0){
                panel.remove(mensagensPanel);
            }
        }
        
        this.verificarNotificacoesNovas();       
    },
    
    mostrarEventos: function(){
        var eventosStore = this.getNotificacaoEventosStore(),
            eventosPanel = this.getEventosPanel(),
            panel = this.getPanel(),
            qtdRecords = eventosStore.getTotalCount();
        
        if(!eventosPanel){
            if(qtdRecords > 0){
                panel.add({
                    xtype: "notificacoes_eventos_panel",
                    store: eventosStore
                });
            }
        }else{
            if(qtdRecords === 0){
                panel.remove(eventosPanel);
            }
        }
        
        this.verificarNotificacoesNovas();
    },
    
    mostrarInformacoes: function(){
        var informacoesStore = this.getNotificacaoInformacoesStore(),
            informacoesPanel = this.getInformacoesPanel(),
            panel = this.getPanel(),
            qtdRecords = informacoesStore.getTotalCount();
        
        if(!informacoesPanel){
            if(qtdRecords > 0){
                panel.add({
                    xtype: "notificacoes_informacoes_panel",
                    store: informacoesStore
                });
            }
        }else{
            if(qtdRecords === 0){
                panel.remove(informacoesPanel);
            }
        }
        
        this.verificarNotificacoesNovas();
    },
    
    mostrarNoticias: function(){
        var me = this,
            feed,
            store = this.getNotificacaoNoticiasStore();
        
        if(Eagle.app.feedsLoaded){
            feed = Ext.create("Ext.util.FeedReader", {
                url: "http://www.cetran.rs.gov.br/rss.php"
            });

            feed.load(function(success, feed){
                if(success){
                    store.setData(feed.entries);

                    if(!me.getNoticiasPanel()){
                        me.getPanel().add({
                            xtype: "notificacoes_noticias_panel",
                            store: store
                        });
                    }
                }
            }, this, 5);
        }
    },
    
    /**
     * Marca a notificação como visualizada e recarrega o store
     * @param {number} idNotificacao
     * @param {string} tipo
     * @returns {void}
     */
    marcarNotificacaoVisualizada: function(idNotificacao, tipo){
        Ext.Ajax.request({
            url: "php/notificacoes.php?action=marcarVisualizada",
            method: "POST",
            async: true,
            params: {
                idNotificacao: idNotificacao
            },
            scope: this,
            callback: function(opt, success, response){
                var res = Ext.decode(response.responseText);
                
                if(res.success){
                    // Se for mensagem recarrega somente o store de mensagens
                    if(tipo === "mensagem"){
                        this.getNotificacaoMensagensStore().load({
                            scope: this,
                            callback: function(){
                                this.mostrarMensagens();
                            }
                        });
                    // Se for evento recarrega somente o store de eventos
                    }else if(tipo === "evento"){
                        this.getNotificacaoEventosStore().load({
                            scope: this,
                            callback: function(opt, success, response){
                                this.mostrarEventos();
                            }
                        });   
                    }else if(tipo === "informacao"){
                        this.getNotificacaoInformacoesStore().load({
                            scope: this,
                            callback: function(opt, success, response){
                                this.mostrarInformacoes();
                            }
                        });   
                    }
                }else{
                    msgAlert("Erro", "Não foi possível marcar a notificação como visualizada", Ext.Msg.ERROR);
                }
            }
        });
    },
    
    /**
     * Abre a window para enviar mensagem aos veículos
     * @param {object} comp
     * @param {int} idNotificacao
     * @param {string} placa
     * @returns {void}
     */
    abrirMensagemWindow: function(comp, idNotificacao, placa, usuario){
        var compId = comp.getId(),
            mensagemWindow;
        
        // Cria instância da window
        mensagemWindow = Ext.create("Eagle.view.mensagens.Window");
        
        // Se tem idNotificaçao e uma resposta
        if(idNotificacao){
            // Verifica se o remetente é um veículo
            if(placa !== ""){
                
                //load na store da lista de ultimas 20 mensagens
                this.getMensagensHistoricosStore().load({
                    params: {
                        usuarioPlaca: placa 
                    }
                });
                
                mensagemWindow.down("tabpanel").setActiveTab("veiculotexto");

                mensagemWindow.down("tabpanel > form[itemId=veiculotexto] > [name=idNotificacao]").setValue(idNotificacao);
                //mensagemWindow.down("tabpanel > form[itemId=veiculomacro] > [name=idNotificacao]").setValue(idNotificacao);
                mensagemWindow.down("tabpanel > form[itemId=veiculoperguntaresposta] > [name=idNotificacao]").setValue(idNotificacao);
                
                mensagemWindow.down("tabpanel > form[itemId=veiculotexto] > [name=placas]").select(placa);
                //mensagemWindow.down("tabpanel > form[itemId=veiculomacro] > [name=placas]").select(placa);
                mensagemWindow.down("tabpanel > form[itemId=veiculoperguntaresposta] > [name=placas]").select(placa);
            }else{ // Senão for um veículo é um usuário
                
                //load na store da lista de ultimas 20 mensagens
                this.getMensagensHistoricosStore().load({
                    params: {
                        usuarioPlaca: usuario 
                    }
                });
                
                mensagemWindow.down("tabpanel").setActiveTab("usuariotexto");

                mensagemWindow.down("tabpanel > form[itemId=usuariotexto] > [name=idNotificacao]").setValue(idNotificacao);
                mensagemWindow.down("tabpanel > form[itemId=usuariotexto] > [name=usuarios]").select(usuario);
            }
        }
        
        // Mostra a window com efeito
        mensagemWindow.show(compId);
    },
    
    onAfterInformacoes: function(tipo){
        var me = this;
        
        Ext.Ajax.request({
            url: "php/notificacoes.php?action=getInformacaoAtualizacao",
            method: "POST",
            params: {
                tipo: tipo
            },
            callback: function(options, success, response){
                var res = Ext.decode(response.responseText);
                
                Ext.create("Ext.window.Window", {
                    autoShow: true,
                    title: "Informações do Sistema",
                    height: 500,
                    width: 600,
                    html: res.data[0]
                });
            }
        });
        
        setTimeout(function(){
            me.redirectTo("home");
        }, 1000 * 5);
    },
    
    onAdicionarEventoClick: function(){
        if(!Ext.getCmp("windowcfg")){
            
            var windowCfg = Ext.create("Eagle.view.eventoscfg.WindowCfg");
            windowCfg.show();
            /*
            Ext.create("Ext.window.Window", {
                closeAction: "hide",
                height: 400,
                id: "eventoscfgwindow",
                items: [{
                    xtype: "eventoscfg_grid"
                }],
                layout: "fit",
                title: "Configuração de Eventos",
                width: 500
            }).show();
            */
        }else{
            
            Ext.getCmp("windowcfg").show();
            
        }
    },
    
    onEnviarMensagemClick: function(){
        var mensagemWindow = Ext.create("Eagle.view.mensagens.Window");
        
        this.getMensagensHistoricosStore().load();
    
        mensagemWindow.down("tabpanel").setActiveTab(2);
        mensagemWindow.show();
    }
});
