Ext.define("Eagle.controller.Dashboard", {
    extend: "Ext.app.Controller",
    models: [
        "Dashboard",
        "Operacao",
        "VeiculoLimite"
    ],
    stores: [
        "Dashboards",
        "OperacoesUsuario",
        "VeiculosLimites"
    ],
    views: [
        "dashboard.Panel"
    ],
    
    refs: [{
        ref: "toolbar",
        selector: "dashboard_panel > toolbar"
    },{
        ref: "panel",
        selector: "dashboard_panel > panel"
    },{
        ref: "chartsPanel",
        selector: "dashboard_panel > panel > panel[region=east]"
    },{
        ref: "gridPanel",
        selector: "dashboard_panel > panel > grid[region=center]"
    }],
    
    estadoschart: null,
    consumochart: null,
    velocidadeschart: null,
    rpmchart: null,
    // Responsável por salvar o estado dos componentes no localStorage
    estadoComp: Ext.util.LocalStorage.get("eaglestorage"),
    // Serve como o setInterval
    taskRunner: new Ext.util.TaskRunner(),
    reloadRunner: null,
    
    init: function(){
        var me = this;
        
        this.control({
            "dashboard_panel": {
                afterrender: this.recuperarFiltros
            },
            "dashboard_panel > panel > grid[region=center]": {
                select: this.onVeiculoSelect,
                veiculoclick: this.onVeiculoClick
            },
            "dashboard_panel > panel > grid[region=center] > tableview": {
                collapsebody: this.onCollapseBody,
                expandbody: this.onExpandBody
            },
            "dashboard_panel > panel > panel[region=east]": {
                resize: this.ajustarCharts,
                collapse: this.onCollapseChartsPanel
            },
            "dashboard_panel > toolbar > combobox[action=filtrarOperacao]": {
                change: this.onFiltrarOperacaoChange
            },
            "dashboard_panel > toolbar > button[action=recarregar]": {
                click: this.reload
            }
        });
        
        // Cria o runner que será responsável pela atualização automática
        this.reloadRunner = this.taskRunner.newTask({
            scope: me,
            run: me.reload,
            interval: 1000 * 60 * 30 // 30 minutos de intervalo
        });
    },
    
    /**
     * Atualiza store e o que for preciso para o reload da tela
     * @returns {boolean} // Se retornar false encerra a task
     */
    reload: function(){
        var me = this,
            dashboardStore = me.getDashboardsStore();
        
        dashboardStore.load({
            scope: me,
            callback: function(){
                me.reloadCharts();
            }
        });
        
        return true;
    },
    
    /**
     * Atualiza os gráficos
     * @returns {void}
     */
    reloadCharts: function(){
        var me = this,
            grid = me.getGridPanel(),
            record;
        // Pega o record da linha selecionada
        record = grid.getSelection()[0];
        // Se não houver linha selecionada aborta a missão
        if(!record)
            return null;
        // Recarrega os charts
        me.carregarEstadosChart(record);
        me.carregarAjaxCharts(record);
    },
    
    /**
     * Recupera filtros que estão no localStorage
     * @returns {void}
     */
    recuperarFiltros: function(){
        var me = this,
            toolbar = me.getToolbar(),
            operacoesStore = me.getOperacoesUsuarioStore(),
            operacaoCombo = toolbar.down("combobox[action=filtrarOperacao]"),
            estadoComp = me.estadoComp,
            filtroOperacao;
        
        // Verifica se a store de operações não está carregada
        if(!operacoesStore.isLoaded()){
            // Carrega a store
            operacoesStore.load({
                scope: me,
                callback: function(){
                    me.recuperarFiltros();
                }
            });
            
        }else{
            
            // Recupera o filtro de operação
            filtroOperacao = parseInt(estadoComp.getItem("filtroOperacaoDashboard"));
            filtroOperacao = (filtroOperacao.toString() === "NaN") ? null : filtroOperacao;
            
            if(filtroOperacao) // Verifica se o filtro que está em cache está disponível para o usuário logado
                filtroOperacao = operacoesStore.getAt(operacoesStore.find("idOperacao"), filtroOperacao);

            if(!filtroOperacao) // Verifica se têm filtro, se não tiver procura pela operação padrão
                filtroOperacao = operacoesStore.getAt(operacoesStore.find("padrao", true));

            operacaoCombo.select(filtroOperacao);
            
            // Começa o processo de reload automático
            me.reloadRunner.start();
        }
    },
    
    /**
     * Quando um novo valor do combobox de operação for selecionado
     * @param {object} comp
     * @param {int} newValue
     * @returns {void}
     */
    onFiltrarOperacaoChange: function(comp, newValue){
        var me = this,
            dashboardStore = me.getDashboardsStore(),
            estadoComp = me.estadoComp;
        
        // Salva o filtro no localStorage
        estadoComp.setItem("filtroOperacaoDashboard", ((newValue !== null) ? newValue : ""));
        // Adiciona o parametro operação no store
        dashboardStore.getProxy().extraParams.operacao = newValue;
        // Carrega a store
        dashboardStore.load();
    },
    
    /**
     * Mostra os gráficos relativos a placa selecionada
     * @param {object} comp
     * @param {object} record
     * @returns {void}
     */
    onVeiculoSelect: function(comp, record){
        var me = this,
            limitesStore = me.getVeiculosLimitesStore(),
            chartsPanel = me.getChartsPanel();
        
        // Verifica se a store não está carregada
        if(!limitesStore.isLoaded()){
            // Carrega a store
            limitesStore.load({
                scope: me,
                callback: function(){
                    me.onVeiculoSelect(comp, record);
                }
            });

        }else{

            chartsPanel.setVisible(true);
            chartsPanel.expand();

            me.carregarEstadosChart(record);
            me.carregarAjaxCharts(record);

        }
    },
    
    /**
     * Carrega o gráfico de estados
     * @param {object} record
     * @returns {void}
     */
    carregarEstadosChart: function(record){
        var me = this,
            dataChart = new Array(),
            panel,
            panelChart,
            id;
        
        panel = me.getChartsPanel().down("[itemId=estadoschart]");
        // Deixa o painel visivel
        panel.setVisible(true);
        // Remove todos os componentes dentro do panel
        panel.removeAll();
        // Adiciona panel no qual o gráfico vai ser renderizado
        panelChart = panel.add({
            xtype: "panel",
            border: false
        });
        // Pega o id do panel
        id = panelChart.getId();
        
        // Carrega os dados em um array
        dataChart.push({
            name: "Andando",
            y: record.get("andando")
        },{
            name: "Parado",
            y: record.get("parado")
        },{
            name: "Desligado",
            y: record.get("desligado")
        });
        
        me.estadoschart = new Highcharts.Chart({
            chart: {
                renderTo: id,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: "Movimento"
            },
            tooltip: {
                pointFormat: "{point.name}: <b>{point.percentage:.1f}%</b>"
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || "black"
                        }
                    }
                }
            },
            series: [{
                type: "pie",
                name: "Estado",
                data: dataChart
            }]
        });
    },
    
    /**
     * Carrega o gráfico de CONSUMO
     * @param {object} placa
     * @param {object} consumo
     * @param {object} record
     * @returns {void}
     */
    carregarConsumoChart: function(placa, consumo){
        var me = this,
            record,
            panel,
            panelChart,
            id;
        
        panel = me.getChartsPanel().down("[itemId=consumochart]");
        // Deixa o painel visivel
        panel.setVisible(true);
        // Remove todos os componentes do panel
        panel.removeAll();
        // Cria novo panel no qual o gráfico será renderizado
        panelChart = panel.add({
            xtype: "panel",
            border: false
        });
        // Verifica se veiram dados para serem mostrados
        if(consumo.length === 0){
            
            panelChart.update("<center><h4>Sem dados</h4></center>");
            
            return null;
            
        }
        // Se vier com o valor -1 é porque o veículo não possui o acessório
        if(consumo[0][1] < 0){
            
            panelChart.update("<center><h4>Sem acessório</h4></center>");
            
            return null;
            
        }
        // Pega o id do panel
        id = panelChart.getId();
        
        me.consumochart = new Highcharts.Chart({
            chart: {
                type: "spline",
                renderTo: id,
                zoomType: 'x'
            },
            title: {
                text: "Consumo"
            },
            xAxis: {
                type: "datetime",
                title: {
                    text: "Hora"
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Consumo"
                }
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%H:%M} : {point.y} Litros'
            },
            series: [{
                name: "Litros",
                data: consumo
            }]
        });
    },
    
    /**
     * Carrega o gráfico de velocidades
     * @param {object} placa
     * @param {object} vel
     * @param {object} record
     * @returns {void}
     */
    carregarVelocidadesChart: function(placa, vel){
        var me = this,
            limitesStore = me.getVeiculosLimitesStore(),
            record,
            limiteVelocidade,
            limiteVelocidadeChuva,
            panel,
            panelChart,
            id;
        
        panel = me.getChartsPanel().down("[itemId=velocidadeschart]");
        // Deixa o painel visivel
        panel.setVisible(true);
        // Remove todos os componentes do panel
        panel.removeAll();
        // Adiciona panel no qual o gráfico será renderizado
        panelChart = panel.add({
            xtype: "panel",
            border: false
        });
        // Verifica se vieram dados de velocidade
        if(vel.length === 0){
            
            panelChart.update("<center><h4>Sem dados</h4></center>");
            
            return null;
            
        }
        // Se a velocidade vier como -1 é porque o veículo não tem acessório
        if(vel[0][1] < 0){
            
            panelChart.update("<center><h4>Sem acessório</h4></center>");
            
            return null;
            
        }
        // Pega o id do panel
        id = panelChart.getId();
        
        record = limitesStore.getAt(limitesStore.find("placa", placa));
        
        limiteVelocidade = (record) ? record.get("velocidade") : 0;
        limiteVelocidadeChuva = (record) ? record.get("velocidadeChuva") : 0;
        
        me.velocidadeschart = new Highcharts.Chart({
            chart: {
                type: "spline",
                renderTo: id,
                zoomType: 'x'
            },
            title: {
                text: "Velocidades"
            },
            xAxis: {
                type: "datetime",
                title: {
                    text: "Data"
                }
            },
            yAxis: {
                title: {
                    text: "Velocidade"
                },
                min: 0,
                plotLines: [{ // Adiciona linha de limite de velocidade
                    value: limiteVelocidade,
                    color: "#FF0000",
                    dashStyle: "dashing",
                    zIndex: 6,
                    width: 2,
                    label: {
                        text: "Limite Velocidade: " + limiteVelocidade,
                        style: {
                            font: "10pt Trebuchet MS, Verdana, sans-serif",
                            fontWeight: "bold",
                            color: "#FF0000"
                        }
                    }
                },{ // Adiciona linha de limite de velocidade com chuva
                    value: limiteVelocidadeChuva,
                    color: "#FF0000",
                    dashStyle: "dashing",
                    zIndex: 6,
                    width: 2,
                    label: {
                        text: "Com Chuva: " + limiteVelocidadeChuva,
                        style: {
                            font: "10pt Trebuchet MS, Verdana, sans-serif",
                            fontWeight: "bold",
                            color: "#FF0000",
                            float: "left"
                        }
                    }
                }]
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%H:%M} : {point.y} km/h'
            },
            series: [{
                name: "Velocidade",
                data: vel
            }]
        });
    },
    
    /**
     * Carrega o gráfico de RPM
     * @param {object} placa
     * @param {object} rpm
     * @param {object} record
     * @returns {void}
     */
    carregarRpmChart: function(placa, rpm){
        var me = this,
            limitesStore = me.getVeiculosLimitesStore(),
            record,
            limiteRpmMaximo,
            limiteRpmMinimo,
            panel,
            panelChart,
            id;
        
        panel = me.getChartsPanel().down("[itemId=rpmchart]");
        // Deixa o painel visivel
        panel.setVisible(true);
        // Remove todos os componentes do panel
        panel.removeAll();
        // Cria novo panel no qual o gráfico será renderizado
        panelChart = panel.add({
            xtype: "panel",
            border: false
        });
        // Verifica se veiram dados para serem mostrados
        if(rpm.length === 0){
            
            panelChart.update("<center><h4>Sem dados</h4></center>");
            
            return null;
            
        }
        // Se vier com o valor -1 é porque o veículo não possui o acessório
        if(rpm[0][1] < 0){
            
            panelChart.update("<center><h4>Sem acessório</h4></center>");
            
            return null;
            
        }
        // Pega o id do panel
        id = panelChart.getId();
        
        record = limitesStore.getAt(limitesStore.find("placa", placa));
        
        limiteRpmMaximo = (record) ? record.get("rpmMaximo") : 0;
        limiteRpmMinimo = (record) ? record.get("rpmMinimo") : 0;
        
        me.rpmchart = new Highcharts.Chart({
            chart: {
                type: "spline",
                renderTo: id,
                zoomType: 'x'
            },
            title: {
                text: "RPM"
            },
            xAxis: {
                type: "datetime",
                title: {
                    text: "Data"
                }
            },
            yAxis: {
                title: {
                    text: "RPM"
                },
                min: 0,
                plotLines: [{ // Adiciona linha de limite de velocidade
                    value: limiteRpmMaximo,
                    color: "#FF0000",
                    dashStyle: "dashing",
                    zIndex: 6,
                    width: 2,
                    label: {
                        text: "Limite RPM Máximo: " + limiteRpmMaximo,
                        style: {
                            font: "10pt Trebuchet MS, Verdana, sans-serif",
                            fontWeight: "bold",
                            color: "#FF0000"
                        }
                    }
                },{ // Adiciona linha de limite de velocidade com chuva
                    value: limiteRpmMinimo,
                    color: "#FF0000",
                    dashStyle: "dashing",
                    zIndex: 6,
                    width: 2,
                    label: {
                        text: "Limite RPM Mínimo: " + limiteRpmMinimo,
                        style: {
                            font: "10pt Trebuchet MS, Verdana, sans-serif",
                            fontWeight: "bold",
                            color: "#FF0000"
                        }
                    }
                }]
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%H:%M} : {point.y} rpm'
            },
            series: [{
                name: "RPM",
                data: rpm
            }]
        });
    },
    
    /**
     * Ajusta os gráficos de acordo com o resize do panel
     * @param {object} comp
     * @param {int} width
     * @param {int} height
     * @returns {void}
     */
    ajustarCharts: function(comp, width, height){
        var altura = 300;
        
        if(this.estadoschart)
            this.estadoschart.setSize(width, altura, true);
        
        if(this.consumochart)
            this.consumochart.setSize(width, altura, true);
        
        if(this.velocidadeschart)
            this.velocidadeschart.setSize(width, altura, true);
        
        if(this.rpmchart)
            this.rpmchart.setSize(width, altura, true);
    },
    
    /**
     * Carrega os dados dos gráficos cujas informações são retornadas por ajax
     * @param {object} record
     * @returns {void}
     */
    carregarAjaxCharts: function(record){
        var me = this,
            placa = record.get("placa");
        
        Ext.Ajax.request({
            url: "php/dashboard.php?action=listarDetalheMovimento",
            method: "POST",
            params: {
                placa: placa
            },
            callback: function(options, success, response){
                var res = Ext.decode(response.responseText),
                    arrVelocidades = new Array(),
                    arrRPM = new Array(),
                    arrConsumo = new Array(),
                    len,
                    data,
                    dataString,
                    dataArray,
                    dataUTC,
                    row,
                    back;
                
                if(!res.success)
                    return null;
                // Quantidade de dados
                len = res.data.length;
                
                for(var i = 0; i < len; i++){
                    row = res.data[i];
                    // Transforma a string em date
                    data = Ext.Date.parse(row.dataHora, "d/m/Y H:i");
                    dataString = Ext.Date.format(data, "Y|m|d|H|i");
                    // Separa ano, mês, dia, hora e minuto em um array
                    dataArray = dataString.split("|");
                    // Transforma a data em um formato UTC para o highcharts
                    dataUTC = Date.UTC(dataArray[0], dataArray[1], dataArray[2], dataArray[3], dataArray[4]);
                    
                    arrVelocidades.push([dataUTC, row.velocidade]);
                    arrRPM.push([dataUTC, row.rpm]);
                    if(i!=0){
                        arrConsumo.push([dataUTC, row.consumo-back]);
                    }
                    
                    back = row.consumo;
                }
                
                // Ordena array de velocidades por order crescente de data
                arrVelocidades.sort(function(a, b){
                    return a[0]-b[0];
                });
                // Ordena array de rpm por order crescente de data
                arrRPM.sort(function(a, b){
                    return a[0]-b[0];
                });
                // Ordena array de consumo por order crescente de data
                arrConsumo.sort(function(a, b){
                    return a[0]-b[0];
                });
                
                me.carregarVelocidadesChart(placa, arrVelocidades);
                me.carregarRpmChart(placa, arrRPM);
                me.carregarConsumoChart(placa, arrConsumo);
            }
        });
    },
    
    /**
     * Função disparada quando o usuário clica na placa do veículo
     * @param {object} grid
     * @param {string} placa
     * @returns {void}
     */
    onVeiculoClick: function(grid, placa){
        var me = this,
            principalTabPanel = Ext.ComponentQuery.query("viewport > panel[region=center] > tabpanel")[0];
        
        // Abre a tab principal
        principalTabPanel.setActiveTab("principal");
        // Abre a tab evento
        this.getController("principal.Grid").abrirTabEvento(null, placa);
        setTimeout(function(){
            me.getController("principal.TabsEventos").veiculoTabCheck(null, placa, true);
        }, 1000);
    },
    
    /**
     * Deixa o panel dos charts não visível quando for fechado
     * @param {object} panel
     * @returns {void}
     */
    onCollapseChartsPanel: function(panel){
        panel.setVisible(false);
        
        // Deixa os paineis invisíveis, erro no firefox
        panel.down("#estadoschart").setVisible(false);
        panel.down("#velocidadeschart").setVisible(false);
        panel.down("#rpmchart").setVisible(false);
    },
    
    /**
     * Quando a linha é fechada
     * @param {object} rowNode
     * @param {object} record
     * @returns {void}
     */
    onCollapseBody: function(rowNode, record){
        // Remove todas as divs e componentes criadas dentro da div principal pelo highcharts.
        // Dessa maneira deixa o conteúdo html mais enxuto, portanto, mais leve.
        (function(){
            var div = $("#expandchart" + record.get("placa"))[0],
                childs,
                i = 0;
            
            if(div.length > 0){
                childs = div.childNodes;
                
                for(; i < childs.length; i++){
                    div.removeChild(childs[i]);
                }
            }
        })();
    },
    
    /**
     * Quando a linha do grid é expandida
     * @param {object} rowNode
     * @param {object} record
     * @returns {void}
     */
    onExpandBody: function(rowNode, record){
        (function () {
            Ext.Ajax.request({
                url: "php/dashboard.php?action=listarTrajetoDiario",
                async: true,
                method: "POST",
                params: {
                    placa: record.get("placa")
                },
                callback: function(options, success, response){
                    var res = Ext.decode(response.responseText),
                        data = res.data,
                        seriesArray = new Array(),
                        i = 0;
                    
                    // Percorre o array para calcular a diferença entre as datas de cada veículo
                    for(; i < data.length; i++){
                        seriesArray.push({
                            name: data[i].cidade,
                            data: [((data[i].dataAtual * 1000) - (data[i].dataAnterior * 1000))]
                        });
                    }
                    
                    $("#expandchart" + record.get("placa")).highcharts({
                        chart: {
                            type: "bar"
                        },
                        title: {
                            text: "Diário de Trajeto"
                        },
                        tooltip: {
                            formatter: function(){
                                return this.series.name;
                            }
                        },
                        xAxis: {
                            categories: ["."]
                        },
                        yAxis: {
                            type: "datetime",
                            //min: 3600 * 1000,
                            max: 24 * 3600 * 1000,
                            title: {
                                text: null
                            },
                            dateTimeLabelFormats: {
                                day: "%H:%M"
                            }
                        },
                        legend: {
                            maxHeight: 40,
                            reversed: true
                        },
                        plotOptions: {
                            series: {
                                stacking: "normal"
                            }
                        },
                        series: seriesArray
                    });
                }
            });
        }());
    }
    
});