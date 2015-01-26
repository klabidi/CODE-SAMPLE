Ext.BLANK_IMAGE_URL = "resources/images/extjs/s.gif";
Ext.Loader.setConfig({
    enabled: true,
    scriptChainDelay: true,
    scriptCharset: "ISO-8859-1"
});
Ext.require([
    "Ext.Base",
    "Ext.state.Manager",
    "Ext.state.CookieProvider",
    "Ext.util.LocalStorage",
    "Ext.app.ViewModel",
    "Ext.window.Toast"
]);

var teste = null;

Ext.onReady(function(){
    Ext.tip.QuickTipManager.init();
    
    //Seta o cookie provider para guardar estados dos componentes por 1 ano
    Ext.state.Manager.setProvider(
        new Ext.state.CookieProvider({ 
            expires: new Date(new Date().getTime()+(1000*60*60*24*365))
        })
    );

    Ext.application({
        autoCreateViewport: true,
        appFolder: "app",
        controllers: [
            "Inicio",
            "ComandosEnvio",
            "ComandosEspera",
            "Mensagens",
            "Notificacoes",
            "Dashboard",
            "Acompanhamento",
            "Usuarios",
            "EventosCfg",
            "Operacoes",
            "Manutencoes",
            "Condutores",
            "Veiculos",
            "Permissoes",
            "TrocasVisualizacao",
            "Situacoes",
            
            "principal.Principal",
            "principal.Grid",
            "principal.TabsEventos",
            "principal.PontosAlvo",
            "principal.PontosReferencia",
            "principal.Roteirizador",
            
            "relatorios.Relatorios",
            "relatorios.Posicoes",
            "relatorios.Eventos",
            "relatorios.VelocidadesExcedida",
            "relatorios.Notificacoes",
            
            "veiculos.Limites"
        ],
        stores: [
            "DirecoesRoteirizacao"
        ],
        defaultToken: "home",
        name: "Eagle",
        listen: {
            controller: {
                "notificacao.Notificacoes": {
                    unmatchedroute: "onUmmatchedRoute"
                }
            }
        },
        
        onUmmatchedRoute: function(hash){
            console.log("Unmatched", hash);
        },
        
        splashscreen: {},
        feedsLoaded: false,
        
        init: function() {
            // Controle de permissão dos módulos
            Eagle.permissao = {
                estaCarregado: false,
                modulos: new Array(),
                // Carrega os módulos aos quais o grupo do usuário pode acessar
                carregar: function(){
                    Ext.Ajax.request({
                        url: "php/permissoes.php?action=listarPermissoesGrupo",
                        async: false,
                        callback: function(options, success, response){
                            var res = Ext.decode(response.responseText),
                                i = 0;

                            for(; i < res.data.length; i++){
                                Eagle.permissao.modulos.push(res.data[i]);
                            }
                            Eagle.permissao.estaCarregado = true;
                        }
                    });
                },
                // Verifica se o grupo do usuário tem acesso ao módulo passado
                verificarPermissao: function(modulo){
                    var i = 0;

                    if(!Eagle.permissao.estaCarregado)
                        Eagle.permissao.carregar();

                    for(; i < Eagle.permissao.modulos.length; i++){
                        if(modulo === Eagle.permissao.modulos[i])
                            return true;
                    }

                    return false;
                }
            };
            
            //start the mask on the body and get a reference to the mask
            this.splashscreen = Ext.getBody().mask("Carregamento quase completo, por favor, aguarde ...");
        },
        
        launch: function() {
            var me = this;
            
            Ext.getDom("splashscreen").style.display = "none";
            
            var task = new Ext.util.DelayedTask(function() {
                // fade out the body mask
                me.splashscreen.fadeOut({
                    duration: 500,
                    remove: true
                });
                // fade out the message
                me.splashscreen.next().fadeOut({
                    duration: 500,
                    remove: true
                });
            });
            task.delay(1000);
            
            // Carrega a api de feeds do Google'
            google.load("feeds", "1", {
                "callback" : function(){
                    // Seta flag como true
                    me.feedsLoaded = true;
                }
            });
            
            // Verifica se a sessão salva é referente ao usuário
            // Se não for apaga a sessão existente
            Ext.Ajax.request({
                url: "php/session.php?action=getSessao",
                async: false,
                scope: this,
                callback: function(opt, success, response){
                    var res = Ext.decode(response.responseText),
                        estadoComp = Ext.util.LocalStorage.get("eaglestorage");

                    if(estadoComp.getItem("usuario")){

                        if(estadoComp.getItem("usuario") !== res.eagleIdUsuario){

                            estadoComp.clear();

                            estadoComp.setItem("usuario", res.eagleIdUsuario);

                        }

                    }else{

                        estadoComp.setItem("usuario", res.eagleIdUsuario);

                    }
                }
            });
        }
    });
});