Ext.define("Eagle.controller.principal.PontosAlvo", {
    extend: "Ext.app.Controller",
    models: [
        "PontoAlvo",
        "Veiculo",
        "PontoReferencia"
    ],
    stores: [
        "PontosAlvo",
        "VeiculosEmpresa",
        "PontosReferencia"
    ],
    views: [
        "principal.pontosalvo.Panel"
    ],
    
    refs: [{
        ref: "form",
        selector: "principal_panel_pontosalvo_panel"
    },{
        ref: "pontosReferenciaCombo",
        selector: "principal_panel_pontosalvo_panel > #pontosReferenciaCombo"
    },{
        ref: "pontosAlvoGrid",
        selector: "principal_panel_pontosalvo_panel > grid"
    },{
        ref: "grid",
        selector: "principal_panel_pontosalvo_panel > #grid"
    }],
    
    init: function(){
        this.control({
            "principal_panel_pontosalvo_panel #pontosReferenciaCombo": {
                change: this.onPontosReferenciaComboChange
            },
            "principal_panel_pontosalvo_panel #veiculosCombo": {
                change: this.onVeiculosComboChange
            },
            "principal_panel_pontosalvo_panel > grid": {
                edit: this.onGridEdit
            },
            "principal_panel_pontosalvo_panel > grid actioncolumn[action=excluir]": {
                click: this.onExcluirActionClick
            },
            "principal_panel_pontosalvo_panel > fieldset > checkbox[reference=pontosReferenciaCheckbox]": {
                change: this.onPontosReferenciaCheckboxChange
            },
            "principal_panel_pontosalvo_panel > fieldset > checkbox[reference=veiculosCheckbox]": {
                change: this.onVeiculosCheckboxChange
            },
            "principal_panel_pontosalvo_panel > grid tool[action=adicionar]": {
                click: this.onAdicionarToolClick
            }
        });
        
        this.getVeiculosEmpresaStore().load();
        this.getPontosReferenciaStore().load();
    },
    
    /**
     * Quando seleciona um valor no combo de pontos de referência
     * @param {object} combo
     * @param {int} newValue
     * @returns {void}
     */
    onPontosReferenciaComboChange: function(combo, newValue){
        var pontosAlvoStore,
            grid;
        
        if(!newValue)
            return;
        
        pontosAlvoStore = this.getPontosAlvoStore();
        
        grid = this.getGrid();
        
        Ext.suspendLayouts();
        grid.setTitle("Veículos");
        grid.reconfigure(pontosAlvoStore, [{
            flex: 1,
            text: "Veículo",
            dataIndex: "placa",
            editor: {
                xtype: "combobox",
                store: "VeiculosEmpresa",
                displayField: "placa",
                valueField: "placa",
                forceSelection: true
            }
        },{
            flex: 1,
            text: "Distância",
            dataIndex: "distancia",
            editor: "numberfield"
        },{
            xtype: "actioncolumn",
            action: "excluir",
            width: 30,
            sortable: false,
            menuDisabled: true,
            icon: "resources/images/16/ios7-minus-outline.png",
            tooltip: "Remover",
            scope: this,
            handler: function(view, rowIndex, colIndex, item, e, record){
                var actioncolumn = grid.down("actioncolumn[action=excluir]");
                actioncolumn.fireEvent("click", actioncolumn, record);
            }
        }]);
        Ext.resumeLayouts(true);
        
        if(!pontosAlvoStore.isLoaded()){
            pontosAlvoStore.load({
                scope: this,
                callback: function(){
                    this.filtrarPontosAlvo("idReferencia", newValue);
                }
            });
        }else{
            this.filtrarPontosAlvo("idReferencia", newValue);
        }
    },
    
    /**
     * Quando o checkbox dos pontos de referência é marcado
     * @param {object} checkbox
     * @returns {void}
     */
    onPontosReferenciaCheckboxChange: function(checkbox){
        var veiculosCheckbox = checkbox.up("panel").down("checkbox[reference=veiculosCheckbox]"),
            combobox = checkbox.up("fieldset").down("combobox");

        if(checkbox.getValue()){
            veiculosCheckbox.setValue(false);

            if(combobox.getValue())
                this.onPontosReferenciaComboChange(null, combobox.getValue());
        }
    },
    
    /**
     * Quando um veículo é selecionado no combo de veículos
     * @param {object} combo
     * @param {int} newValue
     * @returns {void}
     */
    onVeiculosComboChange: function(combo, newValue){
        var pontosAlvoStore,
            grid;
        
        if(!newValue)
            return;
        
        pontosAlvoStore = this.getPontosAlvoStore();
        
        grid = this.getGrid();
        
        Ext.suspendLayouts();
        grid.setTitle("Referências");
        grid.reconfigure(pontosAlvoStore, [{
            flex: 1,
            text: "Referência",
            dataIndex: "descReferencia",
            editor: {
                xtype: "combobox",
                store: "PontosReferencia",
                displayField: "descricao",
                valueField: "idPontoReferencia",
                forceSelection: true
            }
        },{
            flex: 1,
            text: "Distância",
            dataIndex: "distancia",
            editor: "numberfield"
        },{
            xtype: "actioncolumn",
            action: "excluir",
            width: 30,
            sortable: false,
            menuDisabled: true,
            icon: "resources/images/16/ios7-minus-outline.png",
            tooltip: "Remover",
            scope: this,
            handler: function(view, rowIndex, colIndex, item, e, record){
                var actioncolumn = grid.down("actioncolumn[action=excluir]");
                actioncolumn.fireEvent("click", actioncolumn, record);
            }
        }]);
        Ext.resumeLayouts(true);
        
        if(!pontosAlvoStore.isLoaded()){
            pontosAlvoStore.load({
                scope: this,
                callback: function(){
                    this.filtrarPontosAlvo("placa", newValue);
                }
            });
        }else{
            this.filtrarPontosAlvo("placa", newValue);
        }
    },
    
    /**
     * Quando o checkbox de veículos é marcado
     * @param {object} checkbox
     * @returns {void}
     */
    onVeiculosCheckboxChange: function(checkbox){
        var pontosReferenciaCheckbox = checkbox.up("panel").down("checkbox[reference=pontosReferenciaCheckbox]"),
            combobox = checkbox.up("fieldset").down("combobox");;

        if(checkbox.getValue()){
            pontosReferenciaCheckbox.setValue(false);

            if(combobox.getValue())
                this.onVeiculosComboChange(null, combobox.getValue());
        }
    },
    
    /**
     * Método para abrir uma window com o panel
     * @returns {void}
     */
    abrirWindow: function(){
        Ext.create("Ext.window.Window", {
            items: [{
                xtype: "principal_panel_pontosalvo_panel"
            }],
            layout: "fit",
            modal: true,
            title: "Vincular Ponto Alvo",
            width: 800
        }).show();
    },
    
    /**
     * Método para filtrar a store dos pontos alvo
     * @param {string} property
     * @param {string/int} value
     * @returns {void}
     */
    filtrarPontosAlvo: function(property, value){
        var store = this.getPontosAlvoStore();
        
        store.clearFilter();
        store.filter(property, value);
    },
    
    /**
     * Quando o botão de adicionar é clicado
     * @param {object} tool
     * @returns {Boolean}
     */
    onAdicionarToolClick: function(tool){
        var grid = tool.up("grid"),
            plugin = grid.getPlugin("cellediting"),
            panel = grid.up("panel"),
            referenciasCombo = panel.down("#pontosReferenciaCombo"),
            veiculosCombo = panel.down("#veiculosCombo"),
            veiculosCheck = veiculosCombo.up("fieldset").down("checkbox"),
            store,
            model,
            rec;
        
        if(referenciasCombo.getValue() === null && veiculosCombo.getValue() === null){
            msgAlert("Atenção"
                    , "É necessário selecionar um Ponto de Referência ou uma Placa."
                    , Ext.Msg.WARNING);
            return false;
        }
        
        if(veiculosCheck.getValue()){
            msgAlert("Desculpe"
                    , "Essa função não está disponível no mommento.\n Estamos em processo de desenvolvimento."
                    , Ext.Msg.WARNING);
            return false;
        }
        
        store = grid.getStore();
        model = store.getModel();
        
        rec = model.create({
            idReferencia: referenciasCombo.getValue(),
            placa: veiculosCombo.getValue(),
            distancia: 100
        });
        store.insert(0, rec);
        plugin.startEdit(rec, 0);
    },
    
    /**
     * Quando o novo registro é editado
     * @param {object} editor
     * @param {object} context
     * @returns {Boolean}
     */
    onGridEdit: function(editor, context){
        var me = this;
        
        context.grid.getView().focusRow(context.record);
        if(context.value === null){ //Verifica se o valor do campo não está vazio
            this.getPontosAlvoStore().remove(context.record);
            return false;
        }
        
        this.getPontosAlvoStore().sync({
            success: function(){
                if(context.record.get("empresa") === 0)
                    me.getPontosAlvoStore().load();
            },
            failure: function(){
                me.getPontosAlvoStore().remove(context.record);
                msgAlert("Erro"
                        , "<center>Não foi possível vincular o registro.</center>"
                           + "<center>Verifique se o registro já está cadastrado.</center>"
                           + "<center>Caso contrário contate a central.</center>"
                        , Ext.Msg.ERROR);
            }
        });
    },
    
    /**
     * Quando for excluir
     * @param {object} actioncolumn
     * @param {object} record
     * @returns {Boolean}
     */
    onExcluirActionClick: function(actioncolumn, record){
        if(typeof record.data === "undefined")
            return false;
        
        var me = this;
        
        confirmAlert("Atenção"
                , "Deseja remover o veículo do ponto alvo?"
                , Ext.Msg.WARNING
                , function(res){
                    if(res === "yes"){
                        me.getPontosAlvoStore().remove(record);
                        me.getPontosAlvoStore().sync({
                            success: function(){
                                Ext.toast("Registro desvinculado com sucesso."
                                        , "Registro desvinvulado"
                                        , "c");
                            },
                            failure: function(){
                                msgAlert("Erro"
                                       , "O registro não pode ser desvinculado.\n Ligue para a central."
                                       , Ext.Msg.ERROR);
                            }
                        });
                    }
                });
    }
});