Ext.define("Eagle.controller.Inicio", {
    extend: "Ext.app.Controller",
    models: [],
    stores: [],
    views: [],
    
    // Serve como o setInterval
    taskRunner: new Ext.util.TaskRunner(),
    reloadRunner: null,
    
    refs: [{
        ref: "viewport",
        selector: "viewport"
    },{
        ref: "north",
        selector: "viewport panel[region=north]"
    },{
        ref: "principal",
        selector: "viewport > panel[region=center] > tabpanel > principal_panel"
    },{
        ref: "veiculosGrid",
        selector: "principal_grid"
    },{
        ref: "gridButtonGroup",
        selector: "viewport > panel[region=north] > toolbar > buttongroup[itemId=gridButtonGroup]"
    }],
    
    init: function(){
        this.control({
            "viewport": {
                beforerender: this.configurar
            },
            "viewport > panel[region=center]": {
                afterrender: this.configurarCenterView
            },
            "viewport > panel[region=north]": {
                afterrender: this.configurarView
            },
            "viewport > panel[region=center] > tabpanel > panel": {
                show: this.mostrarOcultarBotoesGrid
            },
            "viewport > panel[region=north] > toolbar > buttongroup[itemId=gridButtonGroup] > button[action=mostrarStreetView]": {
                toggle: this.toggleStreetView
            },
            "viewport > panel[region=north] > toolbar > buttongroup[itemId=gridButtonGroup] > button[action=mostrarGrid]": {
                toggle: this.toggleGrid
            },
            "viewport > panel[region=north] > toolbar > buttongroup[itemId=sairButtonGroup] > button[action=sair]": {
                click: this.sair
            },
            "viewport > panel[region=north] > toolbar > buttongroup[itemId=sairButtonGroup] > button[action=ajudar] [action=sobre]": {
                click: this.onSobreClick
            },
            "viewport > panel[region=north] > toolbar > buttongroup[itemId=sairButtonGroup] > button[action=ajudar] [action=contato]": {
                click: this.onContatoClick
            },
            "viewport > panel[region=north] > toolbar > buttongroup[itemId=sairButtonGroup] > button[action=ajudar] [action=download]": {
                click: this.onDownloadClick
            },
            "viewport > panel[region=north] > toolbar > buttongroup[itemId=defaultButtonGroup] > button[action=trocarVisualizacao]": {
                click: this.onTrocarVisualizacaoClick
            }
        });
    },
    
    /**
     * Deixa a primeira tab com permissão com ativa.
     * @param {object} panel
     * @returns {Boolean}
     */
    configurarCenterView: function(panel){
        var tabpanel = panel.down("tabpanel"),
            tabbar = tabpanel.getTabBar(),
            items = tabbar.items.items,
            i = 0;
        
        for(; i < items.length; i++){
            if(items[i].isVisible()){
                tabpanel.setActiveTab(i);
                return true;
            }
        }
        return true;
    },
    
    /**
     * Busca informações do usuário na sessão e adiciona o nome do usuário no north panel
     * @returns {undefined}
     */
    configurarView: function(){
        this.checkVisualizacao();
        
        Ext.Ajax.request({
            url: "php/session.php?action=getItem",
            method: "POST",
            async: false,
            scope: this,
            params: {
                index: "eagleNome"
            },
            callback: function(comp, e, response){
                var res = Ext.decode(response.responseText);
                this.getNorth().down("toolbar > tbtext").setText("Usuário: " + res);
            }
        });
    },
    
    mostrarOcultarBotoesGrid: function(comp){
        var me = this,
            itemId = comp.getItemId();
        
        if(itemId === "principal"){
            me.getGridButtonGroup().show();
        }else{
            me.getGridButtonGroup().hide();
        }
    },
    
    /**
     * Pega as variáveis de sessão do php e passa para o js
     * @returns {undefined}
     */
    configurar: function(){
        var me = this;
        // Cria o runner que será responsável pela atualização automática
        this.reloadRunner = this.taskRunner.newTask({
            scope: me,
            run: me.verificarSessao,
            interval: 1000 * 60 * 5 // 5 minutos de intervalo
        });
        
        this.reloadRunner.start();
    },
    
    /**
     * Função para verificar variáveis da sessão
     * Se o atributo index não existir na sessão
     * retorna para a página de login
     * @returns {void}
     */
    verificarSessao: function(){
        var retorno = false;

        Ext.Ajax.request({
            url: "php/session.php?action=verificar",
            method: "POST",
            params: {
                index: "eagleIdUsuario"
            },
            async: false,
            callback: function(options, success, response){
                retorno = Ext.decode(response.responseText);
            }
        });

        if(!retorno)
            window.location = "../";
    },
    
    /**
     * Mostra/Oculta grid de veículos
     * @returns {undefined}
     */
    toggleStreetView: function(button, pressed){
        var principal = this.getPrincipal();
        
        if(pressed)
            principal.expandStreetViewPanel();
        else
            principal.collapseStreetViewPanel();
    },
    
    /**
     * Mostra/Oculta grid de veículos
     * @returns {undefined}
     */
    toggleGrid: function(){
        this.getVeiculosGrid().up("tabpanel").toggleCollapse();
        // Para que a barra de rolagem não apareça
        this.getVeiculosGrid().up("panel").toggleCollapse();
    },
    
    /**
     * Método para sair da aplicação e apagar sessão
     * @returns {undefined}
     */
    sair: function(){
        Ext.Msg.show({
            title: "Atenção",
            message: "Deseja sair do Eagle 4?",
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.WARNING,
            fn: function(btn){
                if(btn === "yes"){
                    window.location = "../logout.php";
                }
            }
        });
    },
    
    onSobreClick: function(){
        var win = Ext.ComponentQuery.query("#sobre_ajuda_panel")[0];
        
        if(win){
            win.show();
        }else{
            Ext.create("Ext.window.Window", {
                closeAction: "hide",
                height: 250,
                itemId: "sobre_ajuda_panel",
                items: [{
                    border: false,
                    html: "<div><br/>"
                        + " <center><img src='resources/images/index/logo_eagle4_medio.png' /></center><br/>"
                        + " <center><b> Sistema de Monitoramento Eagle </b></center><br/>"
                        + " <center><b> Versão 4.0 </b></center>"
                        + "</div>",
                    xtype: "panel"
                }],
                layout: "fit",
                title: "Ajuda - Sobre",
                width: 400
            }).show();
        }
    },
    
    onContatoClick: function(){
        var win = Ext.ComponentQuery.query("#contato_ajuda_panel")[0];
        
        if(win){
            win.show();
        }else{
            Ext.create("Ext.window.Window", {
                closeAction: "hide",
                height: 100,
                itemId: "contato_ajuda_panel",
                items: [{
                    border: false,
                    html: "<div>"
                        + " <center>"
                        + "     <table>"
                        + "         <tr>"
                        + "             <td><b>Central de Monitoramento 24hrs:</b></td>"
                        + "             <td>0800 707-3309</td>"
                        + "         </tr>"
                        + "         <tr>"
                        + "             <td><b>Registro de Reclamações:</b></td>"
                        + "             <td>0800 707-3309</td>"
                        + "         </tr>"
                        + "         <tr>"
                        + "             <td><b>Grupo Cielo:</b></td>"
                        + "             <td>(54) 2104-3399</td>"
                        + "         </tr>"
                        + "     </table>"
                        + " </center>"
                        + "</div>",
                    xtype: "panel"
                }],
                layout: "fit",
                title: "Ajuda - Contatos",
                width: 400
            }).show();
        }
    },
    
    onDownloadClick: function(){
        if(window.location.host === "localhost")
            window.open("http://localhost/eagle-4/help/");
        else
            window.open("http://" + window.location.host + "/~eagle4dev/help/");
    },
    
    onTrocarVisualizacaoClick: function(button){
        if(button.getItemId() === "voltar"){
            Ext.Ajax.request({
                url: "php/trocasvisualizacao.php?action=voltar",
                method: "POST",
                async: false,
                callback: function(options, success, response){
                    var res = Ext.decode(response.responseText);
                    if(res.success){
                        window.location.reload(true);
                    }else{
                        msgAlert("Erro"
                        , "Ocorreu um erro ('" + action.result.error + "')."
                        , Ext.Msg.ERROR);
                    }
                }
            });
        }else{
            Ext.create("Ext.window.Window", {
                autoShow: true,
                items: [{
                    xtype: "trocasvisualizacao_form"
                }],
                layout: "fit",
                title: "Troca de Visualização",
                width: 500
            });
        }
    },
    
    checkVisualizacao: function(){
        var button = Ext.ComponentQuery.query("viewport > panel[region=north] > toolbar > buttongroup[itemId=defaultButtonGroup] > button[action=trocarVisualizacao]")[0];
        
        if(!button)
            return false;
        
        if(!button.isVisible())
            return false;
        
        Ext.Ajax.request({
            url: "php/trocasvisualizacao.php?action=checkVisualizacao",
            method: "POST",
            async: true,
            callback: function(options, success, response){
                var res = Ext.decode(response.responseText);
                if(res.success){
                    if(res.visualizacao){
                        button.setIcon("resources/images/16/ios7-rewind-outline.png");
                        button.setTooltip("Voltar Visualização");
                        button.itemId = "voltar";
                    }else{
                        button.setIcon("resources/images/16/ios7-eye-outline.png");
                        button.setTooltip("Trocar Visualização");
                    }
                }
            }
        });
    }
});