Ext.define("Eagle.controller.Usuarios", {
    extend: "Ext.app.Controller",
    models: [
        "Usuario",
        "Grupo",
        "Empresa"
    ],
    stores: [
        "Usuarios",
        "Grupos",
        "Empresas"
    ],
    views: [
        "usuarios.Form"
    ],
    
    refs: [{
        ref: "panel",
        selector: "usuarios_form"
    }],
    
    init: function(){
        this.control({
            "usuarios_form": {
                beforerender: this.onBeforeRender
            },
            "usuarios_form > grid": {
                select: this.onGridSelect
            },
            "usuarios_form button[action=salvar]": {
                click: this.onSalvarClick
            },
            "usuarios_form button[action=cancelar]": {
                click: this.onCancelarClick
            },
            "usuarios_form textfield[name=login]": {
                blur: this.onLoginBlur
            }
        });
    },
    
    onBeforeRender: function(){
        this.getUsuariosStore().load();
        this.getGruposStore().load();
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

        // Verifica se a senha será alterada
        if(values.senhaAntiga){
            // Verifica se o usuário sabe o que digitou
            if(values.senhaNova === values.senhaConferencia){
                values.senha = values.senhaConferencia;
                // Verifica se o componente já está mostrando algum erro
                if(panel.down("textfield[name=senhaConferencia]").hasActiveError()){
                    // Remove o erro
                    panel.down("textfield[name=senhaConferencia]").unsetActiveError();
                }

            }else{
                // Adiciona um erro no componente
                panel.down("textfield[name=senhaConferencia]").setActiveError("As senhas não são iguais.");

            }

        }
        delete values.senhaConferencia;
        delete values.senhaNova;
        
        record.set(values);
    },
    
    adicionar: function(){
        var panel = this.getPanel(),
            values = panel.getForm().getValues(),
            record;
        
        // Verifica se o usuário quer mudar a senha
        if(values.senhaNova){
            // Verifica se o usuário sabe o que está digitando
            if(values.senhaNova === values.senhaConferencia){
                // Cria o atributo senha
                values.senha = values.senhaConferencia;
                // Se tiver um erro sendo mostrado no campo retira o erro
                if(panel.down("textfield[name=senhaConferencia]").hasActiveError()){
                    panel.down("textfield[name=senhaConferencia]").unsetActiveError();
                }
            }else{
                // Mostra erro no campo quando as senhas forem diferentes
                panel.down("textfield[name=senhaConferencia]").setActiveError("As senhas não são iguais.");
            }
        }
        // Remove os atributos desnecessários
        delete values.senhaAntiga;
        delete values.senhaConferencia;
        delete values.senhaNova;
        
        // Cria um novo model
        record = Ext.create("Eagle.model.Usuario");
        // Seta os valores do form no model
        record.set(values);
        // Adiciona model na store
        this.getUsuariosStore().add(record);
    },
    
    onSalvarClick: function(){
        var grid = this.getPanel().down("grid"),
            form = this.getPanel().getForm();
        
        // Verifica se os campos do formulário estão válidos
        if(form.isValid()){
            // Edição
            if(form.getValues().idUsuario > 0){
                this.editar();
            }else{
                this.adicionar();
            }
            
            this.getUsuariosStore().sync({
                success: function(){
                    Ext.toast("Registro salvo com sucesso.", "Sucesso", "t");
                    /*Ext.Msg.show({
                        title: "Sucesso",
                        message: "Registro salvo com sucesso.",
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.OK
                    });*/
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
    },
    
    onLoginBlur: function(input){
        var me = this,
            value = input.getValue();
        
        Ext.Ajax.request({
            url: "php/usuarios.php?action=verificarLogin",
            method: "POST",
            params: {
                login: value
            },
            callback: function(options, success, response){
                var res = Ext.decode(response.responseText);
                
                if(res.existe){
                    input.setActiveError("Esse login já existe no sistema.");
                }else{
                    if(input.hasActiveError()){
                        input.unsetActiveError();
                    }
                }
            }
        });
    }
});