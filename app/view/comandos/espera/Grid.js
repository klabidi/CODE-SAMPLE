Ext.define("Eagle.view.comandos.espera.Grid", {
    extend: "Ext.grid.Panel",
    alias: "widget.comandos_espera_grid",
    
    plugins: [
       "gridfilters" //plugin para o gridfilters
    ],
    
    initComponent: function(){
        Ext.apply(this, {
            columns: [
                {text: "Data", dataIndex: "data", formatter: "date('d/m/Y H:i')", width: 125, filter: "date"},
                {text: "Veículo", dataIndex: "placa", width: 85, filter: "string"},
                {text: "Comando", dataIndex: "comando", flex: 1, filter: "string"},
                {text: "Parâmetro", dataIndex: "parametro", flex: 2},
                {text: "Requerente", dataIndex: "requerente", flex: 1, filter: "string"},
                {text: "Satélite", dataIndex: "satelite", width: 75, filter: "boolean",
                    renderer: function(value){
                        return (value) ? "Sim" : "Não";
                    }
                },
                {
                    xtype: "actioncolumn",
                    width: 30,
                    action: "excluir",
                    icon: "resources/images/16/trash-a.png",
                    scope: this,
                    handler: function(grid, rowIndex, colIndex, item, e, record){
                        this.down("actioncolumn[action=excluir]").fireEvent("click", this, record);
                    }
                }
            ],
            store: "ComandosEspera"
        });
        
        this.callParent(arguments);
    }
});