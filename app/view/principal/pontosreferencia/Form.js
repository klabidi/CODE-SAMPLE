Ext.define("Eagle.view.principal.pontosreferencia.Form", {
    extend: "Ext.form.Panel",
    alias: "widget.principal_pontosreferencia_form",
    
    border: false,
    margin: 5,
    
    initComponent: function(){
        Ext.apply(this, {
            defaults: {
                anchor: "100%",
                xtype: "textfield"
            },
            items: [{
                xtype: "hidden",
                name: "idPontoReferencia"
            },{
                allowBlank: false,
                fieldLabel: "Descrição",
                name: "descricao"
            },{
                xtype: "fieldset",
                border: false,
                layout: "hbox",
                padding: "0 0 0 0",
                items: [{
                    xtype: "combobox",
                    fieldLabel: "Grupo",
                    name: "grupo",
                    store: "GruposPontosReferencia",
                    valueField: "idReferenciaGrupo",
                    displayField: "nome",
                    flex: 1,
                    margin: "0 5 0 0"
                },{
                    xtype: "button",
                    action: "editarGrupos",
                    icon: "resources/images/16/ios7-paper-outline.png",
                    tooltip: "Editar Grupos"
                }]
            },{
                xtype: "textarea",
                fieldLabel: "Observação",
                name: "observacao",
//                minLength: 10,
//                maxLength: 400,
                resizable: true
            },{
                fieldLabel: "Endereço",
                name: "endereco"
            },{
                fieldLabel: "Cidade",
                name: "cidade"
            },{
                xtype: "hidden",
                fieldLabel: "Latitude",
                name: "latitude"
            },{
                xtype: "hidden",
                fieldLabel: "Longitude",
                name: "longitude"
            }],
            layout: "form"
        });
        
        this.callParent(arguments);
    }
});