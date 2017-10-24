/**前端插件 基于jquery，bootstrap */
//html，table子表,可以支持2层
(function($){
    $.fn.extend({
        "masterDetailTable":function(option){
            //默认参数
            var defaluts = {
                "title":[],//主表标题
                "detailTitle":[],//从表标题
                "data":[], //数据源格式为[{"data":[],"detail":[[]]]
                "tableClass":"table table-bordered table-hover",//表格class
                "showRowNumber":true //是否显示行号默认显示
            };
            var opts = $.extend({},defaluts,option);
            var html = "<table class=\""+opts.tableClass+"\">";
            //创建主表表头
            html += "<thead>";
            html += "<tr>";
            html += "<th style='width:20px;'></th>";
            if(opts.showRowNumber){
                html += "<th style='width:20px;'>#</th>";
            }
            for(var key in opts.title){
                html += "<th>"+opts.title[key]+"</th>";
            }
            html += "</tr>";
            html += "</thead>";
            //创建表格内容
            html += "<tbody>";
            for(var key in opts.data){
                html += "<tr key='"+key+"' id='tr-"+key+"'>";
                html += "<td style='cursor: pointer;color:#337ab7;padding:6px;font-size:14px;' key='"+key+"' class='td-detail-btn'><b>+</b></td>";
                if(opts.showRowNumber){
                    html += "<td>"+(parseInt(key)+1)+"</td>";
                }
                for(var k in opts.data[key]['data']){
                    html += "<td>"+opts.data[key]['data'][k]+"</td>";
                }
                html += "</tr>";
                
                //子表
                html += "<tr style='display:none;' id='tr-detail-"+key+"'>";
                html += "<td></td>";
                html += "<td colspan='"+(opts.title.length+1)+"'>";
                
                html += "<table class='"+opts.tableClass+"'>";
                html += "<thead>";
                //子表表头
                html += "<tr>";
                if(opts.showRowNumber){
                    html += "<th style='width:20px;'>#</th>";
                }
                for(var k in opts.detailTitle){
                    html += "<th>"+opts.detailTitle[k]+"</th>";
                }
                html += "</tr>";
                html += "</thead>";
                //子表内容
                html += "<tbody>";
                for(var k in opts.data[key]['detail']){
                    html += "<tr class='tr-detail' id='tr-detail-"+key+"'>";
                    if(opts.showRowNumber){
                        html += "<td>"+(parseInt(k)+1)+"</td>";
                    }
                    for(var detailKey in opts.data[key]['detail'][k]){
                        html += "<td>"+opts.data[key]['detail'][k][detailKey]+"</td>";
                    }
                    html += "</tr>";
                }
                html += "</tbody>";
                html += "</table>";
                
                html += "</td>";
                html += "</tr>"; 
            }
            html += "</tbody>";
            html += "</table>";
            var obj = $(this).html(html);
            //绑定展开、隐藏明细事件
            $(this).find(".td-detail-btn").click(function(){
                var key = $(this).attr("key");
                var detailRowId = "tr-detail-"+key;
                if($(this).find("b").text()=="+"){
                    $(this).find("b").text("-");
                    $("#"+detailRowId).css("display","table-row");
                }else{
                    $(this).find("b").text("+");
                    $("#"+detailRowId).css("display","none");
                }
            });
            return obj;
        }
    });
})(window.jQuery)