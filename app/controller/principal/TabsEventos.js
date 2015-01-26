Ext.define("Eagle.controller.principal.TabsEventos", {
    extend: "Ext.app.Controller",
    
    models: [
        "Posicao",
        "Veiculo",
        "VeiculoLimite",
        "ComandoEspera"
    ],
    stores: [
        "VeiculosTeclado",
        "VeiculosLimites",
        "ComandosEspera"
    ],
    views: [
        "principal.eventos.Tab",
        "principal.veiculos.informacoes.Panel"
    ],
    
    refs: [{
        ref: "tabPanel",
        selector: "principal_panel > tabpanel"
    },{
        ref: "mapa",
        selector: "principal_panel > panel[region=center] > principal_mapa_panel"
    },{
        ref: "veiculosGrid",
        selector: "principal_grid"
    },{
        ref: "viewportTabPanel",
        selector: "viewport > panel[region=center] > tabpanel"
    }],
    
    init: function(){
        this.control({
            "principal_eventos_tab": {
                tabeventoclose: this.onTabClose,
                checkboxclick: this.veiculoTabCheck,
                tabeventoafterrender: this.onAfterRender,
                beforeselectall: this.showMask,
                selectall: this.hideMask,
                beforedeselectall: this.showMask,
                deselectall: this.hideMask
            },
            "principal_eventos_tab > toolbar > button[action=recarregar]": {
                buttonclick: this.onRecarregarButtonClick
            },
            "principal_eventos_tab > toolbar > button[action=filtrar]": {
                buttonclick: this.onFiltrarButtonClick
            },
            "principal_eventos_tab > toolbar > datefield[name=data]": {
                dataselect: this.onDataSelect
            },
            "principal_eventos_tab > toolbar > button[action=limparFiltro]": {
                buttonclick: this.onLimparFiltroButtonClick
            },
            "principal_eventos_tab > toolbar > button[action=informacaoveiculo]": {
                buttonclick: this.onInformacaoVeiculoButtonClick
            },
            "principal_eventos_tab > toolbar > button[action=enviarmensagem]": {
                buttonclick: this.onEnviarMensagemButtonClick
            },
            "principal_eventos_tab > toolbar > button[action=enviarcomando]": {
                buttonclick: this.onEnviarComandoButtonClick
            },
            "principal_eventos_tab > toolbar > button[action=comandosespera]": {
                buttonclick: this.onComandosEsperaButtonClick
            },
            "principal_eventos_tab > toolbar > button[action=cadastrarLimites]": {
                buttonclick: this.onCadastrarLimitesClick
            },
            "principal_eventos_tab > panel[region=center] > grid[itemId=posicoesGrid]": {
                posicoesmouseenter: this.onPosicoesMouseEnter,
                posicoesmouseleave: this.onPosicoesMouseLeave,
                posicoesselect: this.onPosicoesSelect,
                posicoesdeselect: this.onPosicoesDeselect
            },
            "principal_eventos_tab > panel[region=center] > grid[itemId=eventosGrid]": {
                eventosexpandbody: this.onEventosExpandBody,
                eventosselect: this.onEventosSelect,
                eventosdeselect: this.onEventosDeselect
            }
        });
    },
    
    onAfterRender: function(comp, idTab){
        var placa = idTab.replace("tab_", ""),
            teclado = false,
            tabCheckbox;
        
        if(!this.getVeiculosTecladoStore().isLoaded()){
            this.getVeiculosTecladoStore().load();
        }
        
        teclado = !(this.getVeiculosTecladoStore().find("placa", placa) < 0);
        
        comp.down("toolbar > button[action=enviarmensagem]").setVisible(teclado);
        
        // Marca o checkbox do veículo
        tabCheckbox = Ext.getDom(placa + "tabcheckbox");
        if(tabCheckbox){
            tabCheckbox.checked = true;
            tabCheckbox.setAttribute("checked", true);
        }
    },
    
    onRecarregarButtonClick: function(comp, idTab){
        this.carregar(comp, idTab);
    },
    
    onDataSelect: function(comp, idTab, value){
        this.carregar(comp, idTab, value);
    },
    
    carregar: function(comp, idTab, value){
    	var me = this,
            tabpanel = me.getTabPanel(),
            tab = tabpanel.getComponent(idTab),
            gridSelectionModel = tab.down("#posicoesGrid").getSelectionModel(),
            todasPosicoesSelecionadas = false,
            posicoesStore,
            eventosStore,
            diaAnterior,
            data;
    	
    	if(!tab)
            return null;
        
        if(value)
            data = Ext.Date.format(value, "d-m-Y");
        else
            data = Ext.Date.format(tab.down("toolbar > datefield[name=data]").getValue(), "d-m-Y");
        
        diaAnterior = tab.down("toolbar > checkbox[name=diaanterior]").getValue();
    	
    	posicoesStore = tab.down("grid[itemId=posicoesGrid]").getStore();
    	eventosStore = tab.down("grid[itemId=eventosGrid]").getStore();
    	
    	posicoesStore.getProxy().extraParams.data = data;
    	posicoesStore.getProxy().extraParams.diaAnterior = diaAnterior;
    	
    	eventosStore.getProxy().extraParams.data = data;
    	eventosStore.getProxy().extraParams.diaAnterior = diaAnterior;
        
        // Verifica se todas as posições estão marcadas
        todasPosicoesSelecionadas = gridSelectionModel.isRangeSelected(0, posicoesStore.getTotalCount());
        if(todasPosicoesSelecionadas)
            gridSelectionModel.deselectAll(); // Remove a seleção de todas as posições
    	
    	posicoesStore.load({
            callback: function(){
                // Verifica se todas as posições estavam marcadas
                if(todasPosicoesSelecionadas)
                    gridSelectionModel.selectAll(); // Marca todas as posições
            }
        });
        eventosStore.load();
    },
    
    onFiltrarButtonClick: function(comp, idTab){
        var me = this,
            tabpanel = me.getTabPanel(),
            tab = tabpanel.getComponent(idTab),
            data,
            horaIni,
            horaFim,
            filtroIni,
            filtroFim,
            filtro;
        
        if(!tab)
            return null;
        
        data = tab.down("toolbar > datefield[name=data]").getValue();
        horaIni = tab.down("toolbar > timefield[name=horaIni]").getValue();
        horaFim = tab.down("toolbar > timefield[name=horaFim]").getValue();
	
        data = Ext.Date.format(data, "d/m/Y");
        horaIni = Ext.Date.format(horaIni, "H:i");
        horaFim = Ext.Date.format(horaFim, "H:i");

        filtroIni = Ext.Date.parse(Ext.String.format("{0} {1}", data, horaIni), "d/m/Y H:i");
        filtroFim = Ext.Date.parse(Ext.String.format("{0} {1}", data, horaFim), "d/m/Y H:i");
        
        if(filtroIni && filtroFim){
            filtro = new Ext.util.Filter({
                filterFn: function(item){
                    var dataHora = item.get("dataHora");

                    if(dataHora >= filtroIni && dataHora <= filtroFim)
                        return true;
                    else
                        return false;
                }
            });
            tab.adicionarFiltro(filtro);
        }
    },
    
    onLimparFiltroButtonClick: function(comp, idTab){
        var me = this,
            tabpanel = me.getTabPanel(),
            tab = tabpanel.getComponent(idTab),
            horaIni,
            horaFim;
        
        if(!tab)
            return null;
        
        horaIni = tab.down("toolbar > timefield[name=horaIni]");
        horaFim = tab.down("toolbar > timefield[name=horaFim]");
        
        horaIni.setValue(null);
        horaFim.setValue(null);
        
        tab.removerFiltro();
    },
    
    onPosicoesMouseEnter: function(comp, idTab, record){
        var me = this,
            mapa = me.getMapa(),
            tabpanel = me.getTabPanel(),
            tab = tabpanel.getComponent(idTab),
            idPolyline = idTab.replace("tab_", ""),
            idMarker = "posicao_" + idPolyline + "_" + record.get("dataHora").toString(),
            viewGrid,
            eventoRow,
            eventosStore,
            eventoRecord;
        
        if(!tab)
            return null;
        
        eventosStore = tab.down("grid[itemId=eventosGrid]").getStore();
        viewGrid = tab.down("grid[itemId=eventosGrid]").getView();
        
        eventoRecord = eventosStore.getAt(eventosStore.find("dataHora", record.get("dataHora")));
        
        eventoRow = viewGrid.getRow(eventoRecord);
        
        if(eventoRow)
            eventoRow.scrollIntoView();
        
        mapa.bounceMarker(idMarker, true);
        
        return null;
    },
    
    onPosicoesMouseLeave: function(comp, idTab, record){
        var me = this,
            mapa = me.getMapa(),
            tabpanel = me.getTabPanel(),
            tab = tabpanel.getComponent(idTab),
            idPolyline = idTab.replace("tab_", ""),
            idMarker = "posicao_" + idPolyline + "_" + record.get("dataHora").toString();
    
        if(!tab)
            return null;
        
        mapa.bounceMarker(idMarker, false);
    },
    
    onPosicoesSelect: function(comp, idTab, record){
        var me = this,
            mapa = me.getMapa(),
            placa = idTab.replace("tab_", ""),
            idPolyline = "posicao_" + placa,
            idMarker = "posicao_" + placa + "_" + record.get("dataHora").toString(),
            polyline,
            marker,
            icone,
            info;
        
        polyline = mapa.getPolyline(idPolyline);
        
        if(!polyline)
            polyline = mapa.addPolyline({
                id: idPolyline,
                strokeColor: "#00b3fd",
                strokeOpacity: 1.0,
                strokeWeight: 5
            });
        
        polyline.addPosition({
            lat: record.get("latitude"),
            lng: record.get("longitude")
        });
        
        marker = mapa.getMarker(idMarker);
        
        if(!marker){
            
            icone = {
                url: 'resources/images/mapa_icons/Create.php'
                        +'?vel='+record.get("velocidade")
                        +'&ang='+record.get("angulo")
                        +'&ign='+record.get("ignicao")
                        +'&pt=true',
                anchor: mapa.createPoint(9, 9)
            };

            info = '<b>Data:</b> '+Ext.Date.format(record.get("dataHora"), "d/m/y H:i")+'<br>'
                    +'<b>Velocidade:</b> '+record.get("velocidade")+' km/h<br>';

            marker = mapa.addMarkerRoute({
                lat: record.get("latitude"),
                lng: record.get("longitude"),
                id: idMarker,
                icon: icone
            }, info);
            
        }
    },
    
    onPosicoesDeselect: function(comp, idTab, record){
        var me = this,
            mapa = me.getMapa(),
            placa = idTab.replace("tab_", ""),
            idPolyline = "posicao_" + placa,
            idMarker = "posicao_" + placa + "_" + record.get("dataHora").toString(),
            polyline;
        
        polyline = mapa.getPolyline(idPolyline);
        
        if(!polyline)
            return null;
        
        polyline.clearPositions();
        
        mapa.removerMarker(idMarker);
    },
    
    onEventosExpandBody: function(comp, idTab, record){
        if(record.get("localizacao") || record.get("referencia")){
            return null;
        }
        
        Ext.Ajax.request({
            url: "php/eventos.php?action=getLocalRef",
            method: "POST",
            async: true,
            params: {
                latitude: record.get("latitude"),
                longitude: record.get("longitude")
            },
            callback: function(comp, success, response){
                var res = Ext.decode(response.responseText);
                if(res.success){
                    record.set({
                        localizacao: res.data.localizacao,
                        referencia: res.data.referencia
                    });
                }
            }
        });
    },
    
    onEventosSelect: function(comp, idTab, record){
        var me = this,
            mapa = me.getMapa(),
            placa = idTab.replace("tab_", ""),
            idMarker = "evento_" + placa + "_" + record.get("dataHora").toString(),
            marker,
            icone,
            info;
        
        marker = mapa.getMarker(idMarker);
        if(!marker){
            icone = {
                url: 'resources/images/mapa_icons/event.png',
                anchor: mapa.createPoint(9, 9)
            };

            info = '<b>Data:</b> '+Ext.Date.format(record.get("dataHora"), "d/m/y H:i")+'<br/>'
                  +'<b>Descrição:</b> '+record.get("descricao")+'<br/>';

            marker = mapa.addMarker({
                lat: record.get("latitude"),
                lng: record.get("longitude"),
                id: idMarker,
                icon: icone,
                centralize: true
            }, info);
        }
    },
    
    onEventosDeselect: function(comp, idTab, record){
        var me = this,
            mapa = me.getMapa(),
            placa = idTab.replace("tab_", ""),
            idMarker = "evento_" + placa + "_" + record.get("dataHora").toString();
        
        mapa.removerMarker(idMarker);
    },
    
    onTabClose: function(comp, idTab){
        var me = this,
            mapa = me.getMapa(),
            placa = idTab.replace("tab_", ""),
            padraoMarkerPosicao = "posicao_" + placa,
            padraoMarkerEvento = "evento_" + placa,
            idPolyline = "posicao_" + placa,
            polyline;
        
        polyline = mapa.getPolyline(idPolyline);
        
        if(polyline)
            polyline.clearPositions();
        
        mapa.removerAllMarkers(padraoMarkerPosicao);
        mapa.removerAllMarkers(padraoMarkerEvento);
    },
    
    /**
     * Quando o checkbox de algum tab veículo é marcado ou desmarcado
     * a ação deve ser refletida no grid de veículos.
     * @param {object} comp
     * @param {string} placa
     * @param {boolean} checked
     * @returns {void}
     */
    veiculoTabCheck: function(comp, placa, checked){
        var me = this,
            veiculosGrid = this.getVeiculosGrid(),
            veiculosStore = veiculosGrid.getStore(),
            selection = veiculosGrid.getSelection(),
            len = selection.length,
            i,
            hasPlaca,
            record;
    
        // Verifica se o checkbox está marcado
        if(checked){
            hasPlaca = false;
            
            // Verifica se a placa está selecionada no grid
            for(i = 0; i < len; i++){
                if(selection[i].get("placa") === placa){
                    hasPlaca = true;
                }
            }
            
            // Se a placa não estiver marcada no grid
            // adiciona no array de selections
            if(!hasPlaca){
                record = veiculosStore.getAt(veiculosStore.find("placa", placa));
                selection.push(record);
            }
        }else{
            hasPlaca = false;
            
            // Verifica se a placa está selecionada no grid
            for(i = 0; i < len; i++){
                if(selection[i].get("placa") === placa)
                    hasPlaca = i;
            }
            
            // Se a placa já estiver selecionada no grid
            // remove a placa do array de selections
            if(hasPlaca !== false)
                selection.splice(hasPlaca, 1);
        }
        
        if(selection.length > 0)
            // Se o array de selections não estiver vázio
            veiculosGrid.getSelectionModel().select(selection);
        else
            // Se o array de selections estiver vázio
            // executa o deselectAll pois o setSelection
            // não funciona com o array vazio
            veiculosGrid.getSelectionModel().deselectAll();
    },
    
    onInformacaoVeiculoButtonClick: function(comp, idTab){
        var placa = idTab.replace("tab_", ""),
            idWindow = "veiculos_informacoes_window_informacoes_" + placa,
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
    
    onEnviarMensagemButtonClick: function(comp, idTab){
        var placa = idTab.replace("tab_", ""),
            mensagemWindow = Ext.create("Eagle.view.mensagens.Window");
        
        mensagemWindow.down("tabpanel").setActiveTab("veiculotexto");
        mensagemWindow.down("tabpanel > form[itemId=veiculotexto] > [name=placas]").select(placa);
        mensagemWindow.down("tabpanel > form[itemId=veiculoperguntaresposta] > [name=placas]").select(placa);
        
        mensagemWindow.show();
    },
    
    onEnviarComandoButtonClick: function(comp, idTab){
        var placa = idTab.replace("tab_", "");
        
        Ext.create("Eagle.view.comandos.envio.Window", {
            autoShow: true,
            placa: placa
        });
    },
    
    onComandosEsperaButtonClick: function(comp, idTab){
        var comandosEsperaStore = this.getComandosEsperaStore(),
            placa = idTab.replace("tab_", ""),
            win = Ext.ComponentQuery.query("#comandos_espera_window")[0];
        
        comandosEsperaStore.getProxy().extraParams.placa = placa;
        
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
    
    onCadastrarLimitesClick: function(comp, idTab){
        var me = this,
            limitesStore = this.getVeiculosLimitesStore(),
            placa = idTab.replace("tab_", ""),
            window,
            record;
        
        // Verifica se o store não está carregado
        if(!limitesStore.isLoaded()){
            // Carrega o store
            limitesStore.load({
                scope: me,
                callback: function(){
                    me.onCadastrarLimitesClick(comp, idTab);
                }
            });
            
        }else{
            // Instância a window
            window = Ext.create("Eagle.view.veiculos.limites.Window");
            
            // Procura pelo registro
            record = limitesStore.getAt(limitesStore.find("placa", placa));
            // Se não encontrar cria um novo model
            if(!record)
                record = Ext.create("Eagle.model.VeiculoLimite", {placa: placa});

            // Carrega o form
            window.down("form").loadRecord(record);
            
            // Mostra a window
            window.show();
            
        }
    },
    
    showMask: function(){
        this.getViewportTabPanel().mask("Carregando. Por favor, aguarde...");
    },
    
    hideMask: function(){
        this.getViewportTabPanel().unmask();
    }
});
