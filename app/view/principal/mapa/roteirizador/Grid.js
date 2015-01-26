Ext.define("Eagle.view.principal.mapa.roteirizador.Grid", {
    extend: "Ext.grid.Panel",
    alias: "widget.principal_mapa_roteirizador_grid",
    
    border: false,
    
    initComponent: function(){
        Ext.apply(this, {
            columns: [
                {text: "Local", dataIndex: "descricao", flex: 3, sortable: false, menuDisabled: true},
                {text: "Ordem", dataIndex: "ordem", flex: 1, sortable: false, menuDisabled: true}
            ],
            dockedItems: [{
                dock: "bottom",
                xtype: "toolbar",
                border: false,
                items: [{
                    text: "Gerar",
                    xtype: "button",
                    icon: "resources/images/16/ios7-navigate-outline.png",
                    action: "roteirizar",
                    tooltip: "Gerar Rota Com os Pontos Selecionados"
                },{
                    text: "Limpar",
                    xtype: "button",
                    icon: "resources/images/16/ios7-close-empty.png",
                    action: "limparRoteirizador",
                    tooltip: "Limpar Rota Ativa e Fechar Roteirizador"
                },'->',{
                    xtype: "checkbox",
                    fieldLabel: "Otimizar",
                    labelWidth: 53,
                    checked: false,
                    action: "otimizar"
                }]
            }],
            store: "DirecoesRoteirizacao",
            viewConfig: {
                markDirty: false
            }
        });
        
        this.callParent(arguments);
    }
});