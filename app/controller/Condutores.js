Ext.define("Eagle.controller.Condutores", {
    extend: "Ext.app.Controller",
    models: [
        "Condutor",
        "Empresa"
    ],
    stores: [
        "Condutores",
        "Empresas"
    ],
    views: [
        "condutores.Form"
    ],
    
    refs: [{
        ref: "panel",
        selector: "condutores_form"
    }],
    
    init: function(){
        this.control({
            "condutores_form": {
                beforerender: this.onBeforeRender
            },
            "condutores_form > grid": {
                select: this.onGridSelect
            },
            "condutores_form button[action=salvar]": {
                click: this.onSalvarClick
            },
            "condutores_form button[action=cancelar]": {
                click: this.onCancelarClick
            }
        });
    },
    
    onBeforeRender: function(){
        this.getCondutoresStore().load();
        this.getEmpresasStore().load();
    },
    
    onGridSelect: function(grid, record){
        this.getPanel().getForm().loadRecord(record);
    },
    
    editar: function(){
        var panel = this.getPanel(),
            form = panel.getForm(),
            values = form.getValues(),
            record = form.getRecord();
    
        // Força o valor ativo = fase caso o checkbox esteja desmarcado
        // Porque senão não altera os dados do record carregado
        if(!values.ativo)
            values.ativo = false;
        
        record.set(values);
    },
    
    adicionar: function(){
        var panel = this.getPanel(),
            values = panel.getForm().getValues(),
            record;
        
        // Cria um novo model
        record = Ext.create("Eagle.model.Condutor");
        // Seta os valores do form no model
        record.set(values);
        // Adiciona model na store
        this.getCondutoresStore().add(record);
    },
    
    onSalvarClick: function(){
        var grid = this.getPanel().down("grid"),
            form = this.getPanel().getForm();
        
        // Verifica se os campos do formulário estão válidos
        if(form.isValid()){
            // Edição
            if(form.getValues().idCondutor > 0){
                this.editar();
            }else{
                this.adicionar();
            }
            
            this.getCondutoresStore().sync({
                success: function(){
                    Ext.toast("Registro salvo com sucesso.", "Sucesso", "t");
                    form.reset();
                    grid.getSelectionModel().deselectAll();
                },
                failure: function(batch, options){
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
    
    onCancelarClick: function(){
        var panel = this.getPanel(),
            grid = panel.down("grid");
        
        panel.getForm().reset();
        grid.getSelectionModel().deselectAll();
    }
});