Ext.define("Eagle.view.principal.veiculos.informacoes.Panel", {
    extend: "Ext.panel.Panel",
    alias: "widget.principal_veiculos_informacoes_panel",
    
    veiculo: null,
    
    initComponent: function(){
        var me = this,
            htmlData;
        
        htmlData = "<table class='info'>"
                    + "<tr>"
                        + "<th>Condutor:</th>"
                        + "<td>" + me.veiculo.get("condutor") + "</td>"
                    + "</tr>"
                    + "<tr>"
                        + "<th>Frota:</th>"
                        + "<td>" + me.veiculo.get("frota") + "</td>"
                    + "</tr>"
                    + "<tr>"
                        + "<th>Marca:</th>"
                        + "<td>" + me.veiculo.get("marca") + "</td>"
                    + "</tr>"
                    + "<tr>"
                        + "<th>Cor:</th>"
                        + "<td>" + me.veiculo.get("cor") + "</td>"
                    + "</tr>"
                    + "<tr>"
                        + "<th>Aparelho:</th>"
                        + "<td>" + me.veiculo.get("aparelho") + "</td>"
                    + "</tr>"
                    + "<tr>"
                        + "<th>Serial:</th>"
                        + "<td>" + me.veiculo.get("serial") + "</td>"
                    + "</tr>"
                    + "<tr>"
                        + "<th>Satelital:</th>"
                        + "<td>" + ((me.veiculo.get("satelital")) ? "Sim" : "Não") + "</td>"
                    + "</tr>"
                + "</table>";
        
        Ext.apply(this, {
           html: htmlData
        });
        
        this.callParent(arguments);
    }
});