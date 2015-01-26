Ext.define("Eagle.controller.Acompanhamento", {
    extend: "Ext.app.Controller",
    models: [
        "Acompanhamento",
        "AcompanhamentoDetalhado",
        "Operacao"
    ],
    stores: [
        "Acompanhamentos",
        "AcompanhamentosDetalhados",
        "OperacoesUsuario"
    ],
    views: [
        "acompanhamento.Panel"
    ],
    
    refs: [{
        ref: "toolbar",
        selector: "acompanhamento_panel > toolbar"
    },{
        ref: "panel",
        selector: "acompanhamento_panel > panel"
    },{
        ref: "detalhadosPanel",
        selector: "acompanhamento_panel > panel > panel[region=east]"
    },{
        ref: "gridPanel",
        selector: "acompanhamento_panel > panel > grid[region=center]"
    }],
    
    // Responsável por salvar o estado dos componentes no localStorage
    estadoComp: Ext.util.LocalStorage.get("eaglestorage"),
    // Serve como o setInterval
    taskRunner: new Ext.util.TaskRunner(),
    reloadRunner: null,
    
    init: function(){
        var me = this;
        
        this.control({
            "acompanhamento_panel": {
                afterrender: this.recuperarFiltros
            },
            "acompanhamento_panel > panel > grid[region=center]": {
                select: this.onVeiculoSelect,
                veiculoclick: this.onVeiculoClick
            },
            "acompanhamento_panel > panel > panel[region=east]": {
                collapse: this.onCollapseDetalhadoPanel
            },
            "acompanhamento_panel > toolbar > combobox[action=filtrarOperacao]": {
                change: this.onFiltrarOperacaoChange
            },
            "acompanhamento_panel > toolbar > button[action=recarregar]": {
                click: this.reload
            }
        });
        
        // Cria o runner que será responsável pela atualização automática
        this.reloadRunner = this.taskRunner.newTask({
            scope: me,
            run: me.reload,
            interval: 1000 * 60 * 5 // 5 minutos de intervalo
        });
    },
    
    /**
     * Atualiza store e o que for preciso para o reload da tela
     * @returns {boolean} // Se retornar false encerra a task
     */
    reload: function(){
        var me = this,
            operacaoComboValue = me.getToolbar().down("combobox[action=filtrarOperacao]").getValue(),
            acompanhamentoStore = me.getAcompanhamentosStore();
        
        acompanhamentoStore.load({
            params: {
                operacao: operacaoComboValue
            }
        });
        
        return true;
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
            acompanhamentoStore = me.getAcompanhamentosStore();

        acompanhamentoStore.load({
            params: {
                operacao: newValue
            }
        });
    },
    
    /**
     * Mostra os o grid detalhado da placa selecionada
     * @param {object} comp
     * @param {object} record
     * @returns {void}
     */
    onVeiculoSelect: function(comp, record){
        var me = this,
            detalhadosPanel = me.getDetalhadosPanel(),
            detalhadoStore = me.getAcompanhamentosDetalhadosStore(),
            plc = record.get("placa"),
            panel = me.getDetalhadosPanel().down("[itemId=griddetalhado]");
        
        detalhadosPanel.setVisible(true);
        detalhadosPanel.expand();
        
        detalhadoStore.load({
            params: {
                placa : plc
            }
        });
        
        //panel.setTitle("Veículo: "+plc);
        
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
    onCollapseDetalhadoPanel: function(panel){
        panel.setVisible(false);
        // Deixa os paineis invisíveis, erro no firefox
        //panel.down("#griddetalhado").setVisible(false);
    }
    
});