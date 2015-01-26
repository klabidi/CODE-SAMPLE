Ext.define("Eagle.controller.veiculos.Limites", {
    extend: "Ext.app.Controller",
    
    models: [
        "Veiculo",
        "VeiculoLimite",
        "VeiculoAcessorio"
    ],
    stores: [
        "VeiculosUsuario",
        "VeiculosLimites",
        "VeiculosAcessorios"
    ],
    views: [
        "veiculos.limites.Window"
    ],
    
    refs: [{
        ref: "form",
        select: "veiculolimitewindow > form"
    }],
    
    init: function(){
        this.control({
            "veiculos_limites_window": {
                beforerender: this.carregar
            },
            "veiculos_limites_window > form combobox[name=placa]": {
                change: this.onComboVeiculoChange
            },
            "veiculos_limites_window > form button[action=salvar]": {
                click: this.salvar
            },
            "veiculos_limites_window > form button[action=cancelar]": {
                click: this.cancelar
            }
        });
    },
    
    carregar: function(){
        var me = this,
            limitesStore = me.getVeiculosLimitesStore(),
            veiculosStore = me.getVeiculosUsuarioStore(),
            acessoriosStore = me.getVeiculosAcessoriosStore();
        
        if(!limitesStore.isLoaded())
            limitesStore.load();
        
        if(!veiculosStore.isLoaded())
            veiculosStore.load();
        
        if(!acessoriosStore.isLoaded())
            acessoriosStore.load();
    },
    
    onComboVeiculoChange: function(comp, newValue){
        var limitesStore = this.getVeiculosLimitesStore(),
            acessoriosStore = this.getVeiculosAcessoriosStore(),
            form = comp.up("form"),
            record,
            recordLimites;
        
        record = limitesStore.getAt(limitesStore.find("placa", newValue));
        recordLimites = acessoriosStore.getAt(acessoriosStore.find("placa", newValue));
        
        if(record){
            form.loadRecord(record);

            if(recordLimites){
                form.getViewModel().set({
                    comVelocidade: recordLimites.get("velocidade"),
                    comVelocidadeChuva: recordLimites.get("velocidadeChuva"),
                    comRpm: recordLimites.get("rpm"),
                    velocidade: record.get("velocidade"),
                    velocidadeChuva: record.get("velocidadeChuva"),
                    rpmMaximo: record.get("rpmMaximo"),
                    rpmMinimo: record.get("rpmMinimo")
                });
            }
        }else{
            if(recordLimites){
                form.getViewModel().set({
                    comVelocidade: recordLimites.get("velocidade"),
                    comVelocidadeChuva: recordLimites.get("velocidadeChuva"),
                    comRpm: recordLimites.get("rpm"),
                    velocidade: 0,
                    velocidadeChuva: 0,
                    rpmMaximo: 0,
                    rpmMinimo: 0
                });
            }
        }
    },
    
    salvar: function(comp){
        var me = this,
            form = comp.up("form"),
            window = form.up("window"),
            limitesStore = me.getVeiculosLimitesStore(),
            record = form.getRecord(), // Pega o model do form
            values = form.getValues(); // Pega os valores
    
        if(form.isValid()){
            
            window.setLoading(true);
            
            if(!record)
                record = Ext.create("Eagle.model.VeiculoLimite");

            record.set(values); // Carrega os valores no model
            
            limitesStore.add(record); // Adiciona no store

            limitesStore.sync({ //Faz alterações no servidor
                success: function(){
                    Ext.toast("Registro salvo com sucesso.", "Sucesso", "t");
                    limitesStore.load(); //Recarrega o store

                    window.setLoading(false);
                    window.close();
                },
                failure: function(batch, options){
                    window.setLoading(false);

                    Ext.Msg.show({
                        title: "Erro",
                        message: "Ocorreu algum erro ao salvar o registro.\n"
                                + "Por favor, contate o suporte.",
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            });
            
        }
    },
    
    cancelar: function(comp){
        var form = comp.up("form"),
            window = form.up("window");
        
        window.close();
    }
});