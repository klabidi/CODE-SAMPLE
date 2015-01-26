Ext.define("Eagle.controller.Permissoes", {
    extend: "Ext.app.Controller",
    models: [
        "PermissaoGrupo", 
        "Usuario" 
    ],
    stores: [
        "Permissoes",
        "PermissoesGrupos",
        "UsuariosGrupo"
    ],
    views: [ 
        "permissoes.Form", 
        "permissoes.PermissoesGrupo", 
        "permissoes.PermissoesModulo",
        "permissoes.PermissoesUsuario"
    ], 
    
    refs: [{
        ref: "panel", 
        selector: "permissoes_form" 
    }],
    
    init: function(){
       
        this.control({
            "permissoes_form": {
                beforerender: this.onBeforeRender
            },
            "permissoes_grupo > grid": {
                select: this.onGridSelect
            },
            "usuarios_grid > grid actioncolumn[action=edit]": {
                click: this.onUsuarioSelect
            },
            "permissoes_modulo > treepanel": {
                checkchange: function(node, checked){
                    this.onCheckAction(node,checked)
                }
            },
            "permissoes_modulo toolbar > button[action=expandir]": {
                click: this.expandirTree
            },
            "permissoes_modulo toolbar > button[action=reduzir]": {
                click: this.reduzirTree
            }
        });
    },
    
    onBeforeRender: function(){
        this.getPermissoesGruposStore().load();
    },
    
    onGridSelect: function(grid, record){
        //this.getPermissoesStore().getProxy().extraParams.grupo = record.id;
        this.getPermissoesStore().load({
            params: {
                grupo : record.id,
                expander: true
            }
        });
        
        this.getUsuariosGrupoStore().load({
            params: {
                grupo : record.id
            }
        });
    },
    
    onUsuarioSelect: function(grid, record){
        var usuariosGrid = grid.up("tabpanel").down("#usuarios").down("grid"),
            usuariosStore = usuariosGrid.getStore();
        
        //sleciona o pai do tabpanel usuario(da tela de permissoes)
        grid.up('tabpanel').setActiveTab("usuarios");
        usuariosGrid.setSelection(usuariosStore.find("idUsuario", record.get("idUsuario")));
    },
    
    onCheckAction: function(node, checked){
        var me = this;
            
        //retira a permissão
        if(!checked){
            
                node.set('checked', true);
                Ext.Msg.confirm('Atenção', '<center>Esta ação removerá a permissão de todos os módulos filhos.<br/> Deseja continuar?</center>', function(res){
                    if(res === 'yes'){
                        Ext.Ajax.request({
                            url: 'php/permissoes.php?action=remPermissao',
                            method: "POST",
                            params: {
                                grupo: node.get('grupo'),
                                modulo: node.get('id')
                            },
                            callback: function(options, success, response){
                                var res = Ext.decode(response.responseText);
                                if(res.success){ 
                                    me.getPermissoesStore().load({
                                        params: {
                                            grupo : node.get('grupo'),
                                            expander: true
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
                
        }else{
            
                node.set('checked', false);

                if(!node.get('checked')){
                    Ext.Ajax.request({
                        url: 'php/permissoes.php?action=addPermissao',
                        method: "POST",
                        params: {
                            grupo: node.get('grupo'),
                            modulo: node.get('id')
                        },
                        callback: function(options, success, response){
                            var res = Ext.decode(response.responseText);
                            if(res.success){
                                me.getPermissoesStore().load({
                                    params: {
                                        grupo : node.get('grupo'),
                                        expander: true
                                    }
                                });
                            }
                        }
                    });
                }
                
        }
            
    },
    
    expandirTree: function(button){
        var toolbar = button.up('toolbar'),
            treepanel = toolbar.up("treepanel");
       
        treepanel.mask('Expanding tree...');
        toolbar.disable();
        
        treepanel.expandAll(function() {
            treepanel.unmask();
            toolbar.enable();
        });
    },
    
    reduzirTree: function(button){
        
        /*
        var self = treepanel, 
            groups = treepanel.view.el.query('.x-grid-group-body');
        Ext.Array.forEach(groups, function (group) {        
            self.collapse(Ext.get(group.id));    
        });
        */
        
        /*
        toolbar.disable();
        treepanel.collapseAll(function() {9
            toolbar.enable();
        });*/
        
    }
    
});