Ext.define("Eagle.controller.principal.PontosReferencia", {
    extend: "Ext.app.Controller",
    models: [
        "PontoReferencia",
        "GrupoPontoReferencia",
        "PontoReferenciaGrupo"
    ],
    stores: [
        "PontosReferencia",
        "GruposPontosReferencia",
        "PontosReferenciaGrupo"
    ],
    views: [
        "principal.pontosreferencia.Grid",
        "principal.pontosreferencia.Form",
        "principal.pontosreferencia.grupos.Grid",
        "principal.pontosreferencia.grupos.Form"
    ],
    refs: [{
        ref: "mapa",
        selector: "principal_panel > panel > principal_mapa_panel"
    }],
    
    init: function(){
        this.control({
            "principal_pontosreferencia_grid": {
                beforerender: this.onBeforeRender,
                select: this.onSelect,
                deselect: this.onDeselect
            },
            "principal_pontosreferencia_grid actioncolumn[action=excluir]": {
                click: this.onExcluirClick
            },
            "principal_pontosreferencia_grid actioncolumn[action=editar]": {
                click: this.onEditarClick
            },
            "principal_pontosreferencia_grid > toolbar > button[action=adicionar]":{
                click: this.onAdicionarClick
            },
            "principal_pontosreferencia_grid > toolbar > button[action=limparSelecoes]":{
                click: this.onLimparSelecoesClick
            },
            "principal_pontosreferencia_form button[action=salvar]": {
                click: this.onSalvarClick
            },
            "principal_pontosreferencia_form button[action=cancelar]": {
                click: this.onCancelarClick
            },
            "principal_pontosreferencia_grupos_grid": {
                beforerender: this.onPontosReferenciaGropoBeforeRender
            },
            "principal_pontosreferencia_grupos_grid actioncolumn[action=excluir]": {
                click: this.onExcluirGrupoClick
            },
            "principal_pontosreferencia_grupos_grid actioncolumn[action=editar]": {
                click: this.onEditarGrupoClick
            },
            "principal_pontosreferencia_grupos_grid > toolbar > button[action=adicionar]": {
                click: this.onAdicionarGrupoClick
            },
            "principal_pontosreferencia_form > fieldset > button[action=editarGrupos]": {
                click: this.onComboButtonClick
            }
        });
    },
    
    onSelect: function(grid, record){
        var mapa = this.getMapa(),
            marker,
            info;
        
        info = "<b>Descrição:</b> " + record.get("descricao") + "<br>"
            + "<b>Endereço:</b> " + record.get("endereco") + "<br>"
            + "<b>Cidade:</b> " + record.get("cidade") + "<br>";
        
        marker = mapa.addMarker({
            title: record.get("descricao"),
            lat: record.get("latitude"),
            lng: record.get("longitude"),
            id: "pontoref_" + record.getId(),
            icon: "resources/images/mapa_icons/referencia.png",
            centralize: true
        }, info);
    },
    
    onDeselect: function(grid, record){
        var mapa = this.getMapa();
        mapa.removerMarker("pontoref_" + record.getId());
    },
    
    onBeforeRender: function(){
        this.getPontosReferenciaStore().load();
    },
    
    onExcluirClick: function(actioncolumn, record){
        var me = this;
        var mapa = this.getMapa();
        
        confirmAlert("Atenção"
                , "Deseja realmente excluir esse registro?"
                , Ext.Msg.WARNING
                , function(res){
                    if(res === "yes"){
                        mapa.removerMarker("pontoref_" + record.getId());
                        me.getPontosReferenciaStore().remove(record); // Remove o record da store
                        me.getPontosReferenciaStore().sync({ // Manda a requisição de remover para o php
                            failure: function(){
                                msgAlert("Erro"
                                        , "Não foi possível excluir o ponto de referência. Contate a central."
                                        , Ext.Msg.ERROR);
                            }
                        });
                    }
                });
    },
    
    onEditarClick: function(actioncolumn, record){
        var me = this;
        
        if(!this.getGruposPontosReferenciaStore().isLoaded())
            this.getGruposPontosReferenciaStore().load({
                callback: function(){
                    me.abrirWindow(record);
                }
            });
        else
            this.abrirWindow(record);
    },
    
    onAdicionarClick: function(){
        this.abrirWindow();
    },
    
    onLimparSelecoesClick: function(button){
        button.up("grid")
            .getSelectionModel()
            .deselectAll();
    },
    
    abrirWindow: function(record){
        var me = this,
            win = Ext.ComponentQuery.query("pontos_referencia_window")[0];
        
        if(win)
            win.close();
        
        win = Ext.create("Ext.window.Window", {
            buttons: [{
                handler: function(button){ me.onSalvarClick(button); },
                text: "Salvar"
            },{
                handler: function(button){ me.onCancelarClick(button); },
                text: "Cancelar"
            }],
            closeAction: "destroy",
            itemId: "pontos_referencia_window",
            items: [{
                xtype: "principal_pontosreferencia_form"
            }],
            layout: "fit",
            listeners: {
                show: function(win){
                    me.onWindowShow(win, record);
                },
                close: function(win){
                    me.onCloseWindow(win);
                }
            },
            title: "Adicionar Ponto de Referência",
            width: 400
        });
        win.showAt(0, 0);
        
        if(record)
            win.down("form").loadRecord(record);
    },
    
    onSalvarClick: function(button){
        var me = this,
            win = button.up("window"),
            form = win.down("form"),
            record = form.getRecord(),
            values;
        
        if(form.isValid()){
            values = form.getValues();
            
            if(values.latitude && values.longitude){
                if(values.idPontoReferencia > 0){
                    record.set(values);
                }else{
                    record = Ext.create("Eagle.model.PontoReferencia");
                    record.set(values);

                    this.getPontosReferenciaStore().add(record);
                }
                
                this.getPontosReferenciaStore().sync({
                    success: function(){
                        me.getPontosReferenciaStore().load();
                        win.close();
                    },
                    failure: function(){
                        me.getPontosReferenciaStore().remove(record);

                        msgAlert("Erro"
                            , "Ocorreu um erro, não foi possível salvar o ponto de referência. Contate a central."
                            , Ext.Msg.ERROR);
                    }
                });
            }else{
                msgAlert("Atenção"
                    , "Mova o cursor no mapa para selecionar uma posição válida."
                    , Ext.Msg.ERROR);
            }
        }
    },
    
    onCancelarClick: function(button){
        var win = button.up("window"),
            form = win.down("form");
        
        form.reset();
    },
    
    onWindowShow: function(win, record){
        var form = win.down("form"),
            mapa = this.getMapa(),
            marker,
            lat = -28.2620,
            lon = -52.4102;
    
        if(record){
            lat = record.get("latitude");
            lon = record.get("longitude");
        }
    
        marker = mapa.addMarker({
            lat: lat,
            lng: lon,
            id: "pontoref",
            //icon: "resources/images/16/ios7-location.png",
            centralize: true,
            draggable: true
        });
        
        mapa.adicionarListener(marker, "dragend", function(){
            form.down("hidden[name=latitude]")
                    .setValue(marker.getPosition().lat());
            form.down("hidden[name=longitude]")
                    .setValue(marker.getPosition().lng());
            
            mapa.reverseGeocoding(marker.getPosition().lat(), marker.getPosition().lng(), function(results){
                var address = results[0],
                    addressComp,
                    len,
                    i,
                    cidade,
                    endereco,
                    numero;
                
                if(address){
                    addressComp = address.address_components;
                    len = addressComp.length;
                    i = 0;
                    
                    for(; i < len; i++){
                        if(addressComp[i].types[0] === "locality")
                            cidade = addressComp[i].long_name;
                        
                        if(addressComp[i].types[0] === "route")
                            endereco = addressComp[i].long_name;
                        
                        if(addressComp[i].types[0] === "street_number")
                            numero = addressComp[i].long_name;
                    }
                    
                    if(typeof(numero) !== "undefined")
                        endereco += ", " + numero;
                    
                    if(typeof(cidade) !== "undefined"){
                        form.down("textfield[name=cidade]")
                            .setValue(cidade);
                    }
                    
                    if(typeof(endereco) !== "undefined"){
                        form.down("textfield[name=endereco]")
                            .setValue(endereco);
                    }
                }
            });
        });
    },
    
    onCloseWindow: function(win){
        var form = win.down("form");
        
        form.reset();
        this.getMapa().removerMarker("pontoref");
    },
    
    onPontosReferenciaGropoBeforeRender: function(){
        this.getPontosReferenciaGrupoStore().load();
    },
    
    onExcluirGrupoClick: function(actioncolumn, record){
        var me = this;
        
        confirmAlert("Atenção"
                , "Deseja realmente excluir esse registro?"
                , Ext.Msg.WARNING
                , function(res){
                    if(res === "yes"){
                        me.getPontosReferenciaGrupoStore().remove(record); // Remove o record da store
                        me.getPontosReferenciaGrupoStore().sync({ // Manda a requisição de remover para o php
                            failure: function(){
                                msgAlert("Erro"
                                        , "Não foi possível excluir o registro. Contate a central."
                                        , Ext.Msg.ERROR);
                            }
                        });
                    }
                });
    },
    
    onEditarGrupoClick: function(actioncolumn, record){
        var me = this;
        
        if(!this.getPontosReferenciaGrupoStore().isLoaded()){ 
            this.getPontosReferenciaGrupoStore().load({
                callback: function(){
                    me.abrirGrupoWindow(record);
                }
            });
        }else{
            //console.log(this.getPontosReferenciaGrupoStore());
            this.abrirGrupoWindow(record);
        }
    },
    
    onAdicionarGrupoClick: function(){ 
        this.abrirGrupoWindow(); 
    }, 
    
    abrirGrupoWindow: function(record){
        var me = this,
            win =  Ext.ComponentQuery.query("grupo_referencia_window")[0];
        
        if(win)
            win.close();
        
        Ext.create("Ext.window.Window", {
            buttons: [{
                handler: function(button){ me.onSalvarGrupoClick(button); },
                text: "Salvar"
            },{
                handler: function(button){ me.onCancelarGrupoClick(button); },
                text: "Cancelar"
            }],
            closeAction: "destroy",
            itemId: "grupo_referencia_window",
            items: [{
                xtype: "principal_pontosreferencia_grupos_form"
            }],
            layout: "fit",
            listeners: {
                show: function(win){
                    me.onWindowGrupoShow(win, record);
                },
                close: function(win){
                    me.onCloseGrupoWindow(win);
                }
            },
            title: "Adicionar Grupo",
            width: 400
        }).show();
    },
    
    onSalvarGrupoClick: function(button){
        var me = this,
            win = button.up("window"),
            form = win.down("form"),
            record = form.getRecord(),
            values;
        
        if(form.isValid()){
            values = form.getValues();
            
                if(values.idReferenciaGrupo > 0){
                    record.set(values);
                }else{
                    record = Ext.create("Eagle.model.PontoReferencia");
                    record.set(values);

                    this.getPontosReferenciaGrupoStore().add(record);
                }
                
                this.getPontosReferenciaGrupoStore().sync({
                    success: function(){
                        //me.getPontosReferenciaGrupoStore().load();
                        win.close();
                    },
                    failure: function(){
                        me.getPontosReferenciaGrupoStore().remove(record);
                        msgAlert("Erro"
                            , "Ocorreu um erro, não foi possível salvar o ponto de referência. Contate a central."
                            , Ext.Msg.ERROR);
                    }
                });
        }
    },
    
    onCancelarGrupoClick: function(button){
        var win = button.up("window"),
            form = win.down("form");
        
        form.reset();
    },
    
    onWindowGrupoShow: function(win, record){
        var form = win.down("form");
        
        if(record){
            form.loadRecord(record);
        }
    }, 
    
    onCloseGrupoWindow: function(win){
        var form = win.down("form");
        
        form.reset();
    },
    
    onComboButtonClick: function(button){
        Ext.create("Ext.window.Window", {
            height: 400,
            items: [{
                xtype: "principal_pontosreferencia_grupos_grid"
            }],
            title: "Grupos de Pontos de Referência",
            layout: "fit",
            modal: true,
            width: 600
        }).show();
    }
    
});