Ext.define("Eagle.controller.principal.Grid", {
    extend: "Ext.app.Controller",
    models: [
        "Rota",
        "Veiculo",
        "Empresa",
        "Operacao",
        "ComandoEspera",
        "VeiculoInformacao"
    ],
    stores: [
        "Rotas",
        "OperacoesUsuario",
        "ComandosEspera",
        "VeiculosTeclado"
    ],
    views: [
        "principal.eventos.Tab",
        "principal.Grid",
        "principal.veiculos.informacoes.Panel",
        "comandos.envio.Window"
    ],
    
    refs: [{
        ref: "mapa",
        selector: "principal_mapa_panel"
    },{
        ref: "grid",
        selector: "principal_grid"
    },{
        ref: "gridView",
        selector: "principal_grid gridview"
    },{
        ref: "gridButtonGroup",
        selector: "viewport > panel[region=north] > toolbar > buttongroup[itemId=gridButtonGroup]"
    },{
        ref: "tabPanel",
        selector: "principal_panel > tabpanel"
    },{
        ref: "principal",
        selector: "principal_panel"
    },{
        ref: "viewportTabPanel",
        selector: "viewport > panel[region=center] > tabpanel"
    }],

    // Tempo para o refresh automático
    tempoRefresh: 60 * 1000,
    idIntervaloRefresh: null,
    // Responsável por salvar o estado dos componentes no localStorage
    estadoComp: Ext.util.LocalStorage.get("eaglestorage"),
    // Guarda a última busca para o refresh
    ultimaBusca: null,
    
    init: function(){
        this.control({
            "principal_grid": {
                afterrender: this.inicializar,
                select: this.adicionarMarker,
                deselect: this.removerMarker,
                itemcontextmenu: this.onContextMenu,
                beforeselectall: this.onBeforeSelectAll,
                beforedeselectall: this.onBeforeDeselectAll,
                selectall: this.onSelectAll,
                deselectall: this.onDeselectAll,
                filterchange: this.carregarLocalRefRange,
                headerclick: this.carregarLocalRefRange
            },
            
            "principal_grid gridview": {
                itemadd: this.carregarLocalRefAjax
            },
            
            "principal_grid gridcolumn": {
                veiculoclick: this.abrirTabEvento
            },
            
            "principal_grid button[action=refresh]": {
                click: this.refresh
            },
            
            "principal_grid button[action=clearAll]": {
                click: this.deselecionarLinhas
            },
            
            "principal_grid button[action=comandosEspera]": {
                click: this.comandosEspera
            },
            
            "principal_grid combobox[action=filtrarOperacao]": {
                change: this.filtrarOperacao
            },
            
            "principal_grid checkbox[action=autoRefresh]": {
                change: this.autoRefreshGrid
            },
            
            "principal_grid button[action=pontosAlvo]": {
                click: this.onPontosAlvoClick
            }
        });
        
        // Adiciona listener no load do rotas store
        this.getRotasStore().on("load", this.onRotasStoreLoad, this);
    },
    
    /**
     * Inicializa o grid
     * @returns {void}
     */
    inicializar: function(){
        var autoRefresh = this.getGrid().down("checkbox[action=autoRefresh]").getValue();
        
        // Chama o método para recuperar os filtros
        this.recuperarFiltros();
        this.autoRefreshGrid(null, autoRefresh);
        
        if(!this.getVeiculosTecladoStore().isLoaded()){
            this.getVeiculosTecladoStore().load();
        }
    },
    
    /**
     * Recupera os filtros que estão no localStorage
     * @returns {void}
     */
    recuperarFiltros: function(){
        var me = this,
            operacoesStore = me.getOperacoesUsuarioStore(),
            estadoComp = me.estadoComp,
            operacaoCombo = me.getGrid().down("combobox[action=filtrarOperacao]"),
            filtroOperacao;
        
        if(!operacoesStore.isLoaded()){ // Verifica se a store ainda não está carregada
            
            operacoesStore.load({
                scope: me,
                callback: function(){
                    me.recuperarFiltros();
                }
            });
            
        }else{
            
            // Recupera o filtro de operação
            filtroOperacao = parseInt(estadoComp.getItem("filtroOperacaoVeiculosGrid"));
            filtroOperacao = (filtroOperacao.toString() === "NaN") ? null : filtroOperacao;
            
            if(filtroOperacao) // Verifica se o filtro que está em cache está disponível para o usuário logado
                filtroOperacao = operacoesStore.getAt(operacoesStore.find("idOperacao"), filtroOperacao);
            
            if(!filtroOperacao) // Verifica se têm filtro, se não tiver procura pela operação padrão
                filtroOperacao = operacoesStore.getAt(operacoesStore.find("padrao", true));
            // Seta o valor no combo
            operacaoCombo.select(filtroOperacao);
            
        }
    },

    /**
     * Método executado toda vez que o rotasStore é carregado
     * @param {type} comp
     * @param {type} records
     * @returns {undefined}
     */
    onRotasStoreLoad: function(comp, records){
        var me = this,
            rotasStore = me.getRotasStore(),
            ultima = "";
    
        if(records.length > 0)
            ultima = records[0].get("ultima");
        
        me.ultimaBusca = ultima;
        //Faz requisição ajax para 50 primeiros registros
        me.carregarLocalRefAjax(rotasStore.getRange(0, 50));
    },
    
    /**
     * Método para carregar localização e referências por ajax
     * @param {type} records
     * @returns {undefined}
     */
    carregarLocalRefAjax: function(records){
        var me = this;
        
        Ext.Array.forEach(records, function(rec){
            Ext.Ajax.request({
                url: "php/rotas.php?action=getLocalRef",
                method: "POST",
                async: true,
                params: {
                    idRota: rec.get("idRota"),
                    veiculo: rec.get("placa"),
                    latitude: rec.get("latitude"),
                    longitude: rec.get("longitude")
                },
                callback: function(comp, success, response){
                    var res = Ext.decode(response.responseText);
                    
                    if(res.success){
                        rec.set({
                            localizacao: res.data.localizacao,
                            referencia: res.data.referencia
                        });
                    }
                }
            });
        }, me);
    },
    
    /**
     * Carrega a localização e referência dos 
     * registros que estão aparecendo no grid.
     * @returns {void}
     */
    carregarLocalRefRange: function(){
        this.carregarLocalRefAjax( // Chama a função para carregar local e ref dos records
                this.getGridView().getRecords( // Recupera os records com base nos nodes
                    this.getGridView().getNodes() // Recupera os nodes que estão renderizados no HTML
                )
        );
    },
    
    /**
     * Busca e altera somente os registros atualizados
     * @returns {undefined}
     */
    refresh: function(){
        var me = this,
            rotasStore = me.getRotasStore(),
            mapa = me.getMapa(),
            grid = me.getGrid(),
            gridView = grid.getView(),
            row,
            marker;
        
        me.getGrid().mask("Carregando...");
        Ext.Ajax.request({
            url: "php/rotas.php?action=listarVeiculos",
            method: "POST",
            async: true,
            scope: me,
            params: {
                operacao: me.estadoComp.getItem("filtroOperacaoVeiculosGrid"),
                ultimaBusca: me.ultimaBusca
            },
            callback: function(comp, success, response){
                var res = Ext.decode(response.responseText);
                
                if(!res)
                    return null;
                
                Ext.Array.forEach(res.data, function(item){
                    //Busca o registro no store
                    var record = rotasStore.getAt(rotasStore.find("placa", item.veiculo.placa));
                    
                    if(record){
                        //Seta novos valores
                        record.set(item);
                        me.ultimaBusca = item.ultima;
                        
                        row = gridView.getRow(record);
                        if(row)
                            me.carregarLocalRefAjax([record]);

                        marker = mapa.getMarker("veiculo_" + record.get("placa"));
                        
                        if(marker){
                            
                            marker.setIcon({
                                url: 'resources/images/mapa_icons/Create.php'
                                        +'?txt='+record.get("placa")
                                        +'&ang='+record.get("angulo")
                                        +'&ign='+record.get("ignicao")
                                        +'&vel='+record.get("velocidade"),
                                anchor: mapa.createPoint(9, 9)
                            });

                            marker.setPosition({
                                lat: record.get("latitude"),
                                lng: record.get("longitude")
                            });
                            
                        }
                        
                        me.atualizarTabEvento(record);
                    }
                });
                
                grid.unmask();
            }
        });
    },
    
    /**
     * Adiciona marker na última posição do veículo
     * @param {type} rowModel
     * @param {type} record
     * @returns {undefined}
     */
    adicionarMarker: function(rowModel, record){
        var mapa = this.getMapa(),
            button = this.getGridButtonGroup().down("button[action=mostrarStreetView]"),
            icone,
            info,
            marker,
            tabCheckbox;
        
        marker = mapa.getMarker("veiculo_" + record.get("placa"));
        
        if(!marker){
            
            icone = {
                url: 'resources/images/mapa_icons/Create.php'
                        +'?txt='+record.get("placa")
                        +'&ang='+record.get("angulo")
                        +'&ign='+record.get("ignicao")
                        +'&vel='+record.get("velocidade"),
                anchor: mapa.createPoint(9, 9)
            };

            info = '<b>Condutor:</b> '+record.get("condutor")+'<br>'
                  +'<b>Última Posição:</b> '+Ext.Date.format(record.get("data"), "d/m/Y H:i")+'<br>'
                  +'<b>Velocidade:</b> '+record.get("velocidade")+' km/h<br>';

            marker = mapa.addMarker({
                lat: record.get("latitude"),
                lng: record.get("longitude"),
                centralize: true,
                id: "veiculo_" + record.get("placa"),
                title: record.get("placa"),
                icon: icone
            }, info, record.get("angulo"));
            
        }else{
            
            marker.setIcon({
                url: 'resources/images/mapa_icons/Create.php'
                        +'?txt='+record.get("placa")
                        +'&ang='+record.get("angulo")
                        +'&ign='+record.get("ignicao")
                        +'&vel='+record.get("velocidade"),
                anchor: mapa.createPoint(9, 9)
            });
            
            marker.setPosition({
                lat: record.get("latitude"),
                lng: record.get("longitude")
            });
            
        }
        
        // Marca o checkbox do veículo na tab do veículo
        tabCheckbox = Ext.getDom(record.get("placa") + "tabcheckbox");
        if(tabCheckbox){
            tabCheckbox.checked = true;
            tabCheckbox.setAttribute("checked", true);
        }
        
        if(button.pressed)
            mapa.setStreetView(marker, record.get("angulo"));
    },
    
    /**
     * Remove o marker referente ao veículo selecionado
     * @param {type} rowModel
     * @param {type} record
     * @returns {undefined}
     */
    removerMarker: function(rowModel, record){
        var tabCheckbox;
        
        this.getMapa().removerMarker("veiculo_" + record.get("placa"));
        
        // Desmarca o checkbox do veículo na tab do veículo
        tabCheckbox = Ext.getDom(record.get("placa") + "tabcheckbox");
        if(tabCheckbox){
            tabCheckbox.checked = false;
            tabCheckbox.removeAttribute("checked");
        }
    },
    
    /**
     * Filtro do grid por operação
     * @param {type} comp
     * @param {type} newValue
     * @returns {undefined}
     */
    filtrarOperacao: function(comp, newValue){
        var me = this,
            estadoComp = me.estadoComp,
            rotasStore = me.getRotasStore();
        
        // Salva o filtro no localStorage
        estadoComp.setItem("filtroOperacaoVeiculosGrid", ((newValue !== null) ? newValue : ""));
        
        // Deseleciona todos os registros e remove todos os markers
        // para evitar problemas com erro no src/selection/Model.js linha 1071
        me.getGrid().getSelectionModel().deselectAll();
        me.getMapa().removerAllMarkers();
        
        // Adiciona parâmetro fixo na store
        rotasStore.getProxy().extraParams.operacao = newValue;
        rotasStore.load();
    },
    
    /**
     * Adiciona tab do veículo
     * @param {type} comp
     * @param {string} value
     * @returns {null}
     */
    abrirTabEvento: function(comp, value){
        var me = this,
            rotasStore = me.getRotasStore(),
            tabPanel = me.getGrid().up("tabpanel"),
            record,
            tab;
        // Verifica se a store já está carregada
        if(rotasStore.isLoaded()){
            // Encontra o record na store com base na placa
            record = rotasStore.getAt(rotasStore.find("placa", value));
            // Se não encontrar o record, encerra a função
            if(!record)
                return false;
            
            tab = tabPanel.getComponent("tab_" + value);
            // Verifica se o componente tab ainda não foi criado
            if(!tab){
                // Cria o componente tab
                tab = tabPanel.add({
                    xtype: "principal_eventos_tab",
                    itemId: "tab_" + record.get("placa"),
                    title: record.get("placa"),
                    record: record
                });
            }else{
                // Recarrega as informações do tab com base no record
                tab.setRecord(record);
                // Recarrega stores de posições e eventos
                tab.recarregarStores();
            }
            // Deixa a tab atual como tab ativa
            tabPanel.setActiveTab(tab);
        }else{ // Se a store não estiver carregada
            rotasStore.load({ // Carrega store
                callback: function(){
                    // Chama a função recursivamente quando o load estiver completo
                    me.abrirTabEvento(comp, value);
                }
            });
        }
    },
    
    /**
     * Atualiza a tab
     * @param {Rota} record
     * @returns {void}
     */
    atualizarTabEvento: function(record){
        var me = this,
            gridPanel = this.getGrid(),
            tabPanel = gridPanel.up("tabpanel"),
            tab = null,
            selection = null,
            i = 0,
            placa = "",
            tabCheckbox = null;
        
        tab = tabPanel.getComponent("tab_" + record.get("placa"));
        
        if(tab){
            tab.setRecord(record);
            
            placa = record.get("placa");
            selection = gridPanel.getSelection();
            
            for(; i < selection.length; i++){
                if(placa === selection[i].get("placa")){
                    tabCheckbox = Ext.getDom(record.get("placa") + "tabcheckbox");
                    if(tabCheckbox){
                        tabCheckbox.checked = true;
                        tabCheckbox.setAttribute("checked", true);
                    }
                }
            }
        }
    },
    
    /**
     * Controle do auto refresh
     * @param {type} comp
     * @param {boolean} newValue
     * @returns {null}
     */
    autoRefreshGrid: function(comp, newValue){
        var me = this;
    
        if(newValue){
            if(!me.idIntervaloRefresh){
                me.idIntervaloRefresh = setInterval(function(){
                    me.refresh();
                }, me.tempoRefresh);
            }
        }else{
            clearInterval(me.idIntervaloRefresh);
            me.idIntervaloRefresh = null;
        }
    },
    
    /**
     * Deselect em todas as linhas do grid
     * @returns {null}
     */
    deselecionarLinhas: function(){
        var selModel = this.getGrid().getSelectionModel();
        
        selModel.deselectAll();
    },
    
    onContextMenu: function(comp, record, item, index, event){
        var me = this,
            menu;
        
        event.stopEvent();
        
        menu = Ext.create("Ext.menu.Menu", {
            margin: "0 0 10 0",
            width: 200,
            items: [{
                text: "Informações",
                icon: "resources/images/16/ios7-information-outline.png",
                handler: function(){
                    me.informacoesVeiculo(record.get("placa"));
                }
            },{
                text: "Enviar Comando",
                icon: "resources/images/16/ios7-paperplane-outline.png",
                handler: function(){
                    me.enviarComando(record.get("placa"));
                }
            },{
                text: "Enviar Mensagem",
                icon: "resources/images/16/ios7-email-outline.png",
                // Verifica se o veículo selecionado tem teclado
                hidden: (this.getVeiculosTecladoStore().find("placa", record.get("placa")) < 0),
                handler: function(){
                    me.enviarMensagem(record.get("placa"));
                }
            },{
                text: "Comandos Em Espera",
                icon: "resources/images/16/ios7-stopwatch-outline.png",
                handler: function(){
                    var comandosEsperaStore = me.getComandosEsperaStore();
                    
                    comandosEsperaStore.getProxy().extraParams.placa = record.get("placa");
                    me.abrirComandosEsperaWindow();
                }
            }]
        });
        
        menu.showAt(event.getXY());
    },
    
    informacoesVeiculo: function(placa){
        var idWindow = "veiculos_informacoes_window_informacoes_" + placa,
            win = Ext.ComponentQuery.query("#" + idWindow)[0];

        if(win)
            win.destroy();

        Ext.Ajax.request({
            url: "php/veiculos.php?action=listarInformacoes",
            params: {
                placa: placa
            },
            callback: function(options, success, response){
                var res = Ext.decode(response.responseText),
                    rec = Ext.create("Eagle.model.VeiculoInformacao");

                if(res.success){
                    if(res.data.length > 0){
                        rec.set(res.data[0]);

                        Ext.create("Ext.window.Window", {
                            itemId: idWindow,
                            items: [{
                                xtype: "principal_veiculos_informacoes_panel",
                                veiculo: rec
                            }],
                            layout: "fit",
                            maxHeight: 400,
                            title: "Informações do Veículo (" + placa + ")",
                            width: 400
                        }).show();
                    }else{
                        Ext.toast({
                            html: "Não foram encontradas informações para o veículo " + placa + ".",
                            title: "Sem Informações",
                            align: "t",
                            icon: "resources/images/16/alert-circled.png"
                        });
                    }
                }
            }
        });
    },
    
    enviarComando: function(placa){
        Ext.create("Eagle.view.comandos.envio.Window", {
            autoShow: true,
            placa: placa
        });
    },
    
    enviarMensagem: function(placa){
        var mensagemWindow = Ext.create("Eagle.view.mensagens.Window");
        
        mensagemWindow.down("tabpanel").setActiveTab("veiculotexto");
        mensagemWindow.down("tabpanel > form[itemId=veiculotexto] > [name=placas]").select(placa);
        //mensagemWindow.down("tabpanel > form[itemId=veiculomacro] > [name=placas]").select(placa);
        mensagemWindow.down("tabpanel > form[itemId=veiculoperguntaresposta] > [name=placas]").select(placa);
        
        mensagemWindow.show();
    },
    
    /**
     * Função disparada antes do click no marcar todos os veículos
     * @returns {Boolean}
     */
    onBeforeSelectAll: function(){
        var principal = this.getPrincipal(),
            panel = principal.down("panel > panel[itemId=street_view_panel]");
        
        // Se o panel do street view estiver aberto
        // não deixa a função de marcar todos acontecer
        if(!panel.isHidden()){
            Ext.Msg.show({
                title: "Atenção",
                message: "Essa ação não pode ser feita com o Street View aberto.",
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.WARNING
            });
            
            return false;
        }else{
            this.getViewportTabPanel().mask("Processando. Por favor, aguarde...");
            return true;
        }
    },
    
    onBeforeDeselectAll: function(){
        this.getViewportTabPanel().mask("Processando. Por favor, aguarde...");
    },
    
    onSelectAll: function(){
        this.getViewportTabPanel().unmask();
    },
    
    onDeselectAll: function(){
        this.getViewportTabPanel().unmask();
    },
    
    comandosEspera: function(){
        var comandosEsperaStore = this.getComandosEsperaStore();

        delete comandosEsperaStore.getProxy().extraParams.placa;

        this.abrirComandosEsperaWindow();
    },
    
    abrirComandosEsperaWindow: function(){
        var win = Ext.ComponentQuery.query("#comandos_espera_window")[0];
        if(win)
            win.close();
        
        Ext.create("Ext.window.Window", {
            height: 500,
            itemId: "comandos_espera_window",
            items: [{
                xtype: "comandos_espera_grid"
            }],
            layout: "fit",
            title: "Comandos Em Espera",
            width: 1000
        }).show();
    },
    
    onPontosAlvoClick: function(){
        Ext.create("Ext.window.Window", {
            width: 600,
            height: 500,
            layout: "fit",
            title: "Pontos Alvo",
            modal: true,
            items: [{
                xtype: "principal_panel_pontosalvo_panel"
            }]
        }).show();
    }
});