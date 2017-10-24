/**前端插件 基于jquery，jquery ui */
//html，选择插件,在选择框中排序，支持多选,支持自定义按钮,
//支持input，控件的click事件被委托插件处理
(function($){
    $.fn.extend({
        "sortSelect":function(option){
			//绑定是清除旧的绑定
			var thisId = $(this).attr("id");
			$("#sort-select-main"+thisId).remove();
			var selectedDom = new Array();//选择的dom
			var randomNumber = Math.ceil(Math.random()*100);
			//生成下拉按钮和下来ul的唯一id
			//下拉按钮id
			var droupDownButId = "sort-select-btn";
			//下来内容UL的id
			var ulId = "sort-select-ul";
			while(true){
				var droupDownButIdTemp = droupDownButId+randomNumber;
				if($("#"+droupDownButIdTemp).length<=0){
					droupDownButId = droupDownButIdTemp;
					ulId = ulId+randomNumber;
					break;
				}else{
					randomNumber = Math.ceil(Math.random()*100);
				}
			}
            //默认参数
            var defaluts = {
                "multiple":false,//是否多选，默认单选
                "data":[], //数据源格式为[{'id':'abc','name':'bcd'}]
				"html":"",//每个列里末尾展示的html，如button，radio，checkbox
                "width":"240px",
                "sort":false,
                "buttonTitle":"请选择",
                "buttonWidth":"auto",
                "numberDisplayed":4,//默认显示数量
				"onChange":function(){}
            };
			//合并参数
			var opts = $.extend({},defaluts,option);
			//绑定的对象
			var obj = $(this);
			var html = "<div class='sort-select-main' id='sort-select-main"+thisId+"'>";
			
			//创建下拉内容
			var ulHtml = "<ul class='sort-select-ul' id='"+ulId+"' style='width:"+opts.width+"'>";
			var selectedTextArray = new Array();
			$(this).find("option").each(function(i,v){
				var _value = $(v).val().trim();
				var _text = $(v).text().trim();
				var _html  = $(v).attr("html");
				var checkedHtml = $(v).prop("checked") ? "checked='checked'" : "";
				//统计选中的文本
				if(checkedHtml != ""){
					selectedTextArray.push(_text);
				}
				ulHtml += "<li id='"+_value+"' text='"+_text+"'>";
				//多选用checkbox，单选用radio
				if(typeof($(obj).attr("multiple"))=="undefined"){
					ulHtml += "<input name='sort-select-name' "+checkedHtml+" value='"+_value+"' type='radio' data-text='"+_text+"'/>&nbsp; ";
				}else{
					ulHtml += "<input name='sort-select-name' "+checkedHtml+" value='"+_value+"' type='checkbox' data-text='"+_text+"'/>&nbsp; ";
				}
				ulHtml += _text ;
				ulHtml += "<span class='sort-select-ul-user-dom'>"+_html+"</span>";
				ulHtml += "</li>";
			});
			ulHtml += "</ul>";

			//添加显示的下拉按钮
			var btnHtml = "<button id='"+droupDownButId+"' class='sort-select-btn multiselect dropdown-toggle btn btn-default' data-toggle='dropdown' style='width:"+opts.buttonWidth+"'>";
			if(selectedTextArray.length == 0 ) {
				btnHtml += opts.buttonTitle;
			}else{
				if(selectedTextArray.length <= opts.numberDisplayed){
					btnHtml += "选择了"+selectedTextArray.length +"个";
				}else if(selectedTextArray.length > opts.numberDisplayed){
					btnHtml += selectedTextArray.join(",");
				}
			}
			btnHtml += " <b class='caret'></b></button>";
			html += btnHtml;
			html += ulHtml;
			html += "</div>";

            //隐藏文本框
            $(this).hide();
            //添加下拉按钮，下拉内容
            $(this).after(html);
				 
			//列表点击事件
			$("#"+ulId+" li").click(function(){
				var inputObj = $(this).find("input[name='sort-select-name']");
				var inputType = inputObj.attr("type");
				if(inputObj.prop("checked") && inputType!="radio"){
					inputObj.prop("checked",false);
				}else{
					inputObj.prop("checked",true);
				}
				bindSelectValue();
				opts.onChange();
			});
			
			$("#"+ulId+" input[name='sort-select-name']").click(function(){
				bindSelectValue();
				opts.onChange();
			});
			
			//解决，火狐浏览器拖拽后执行li点击事件
			var userAgent = navigator.userAgent;//浏览器信息
			if(opts.sort){
				$("#"+ulId).sortable({update:function(event, ui){
					if(userAgent.indexOf("Firefox") > -1){
						var inputObj = $(ui.item).find("input[name='sort-select-name']");
						var inputType = inputObj.attr("type");
						if(inputObj.prop("checked") && inputType!="radio"){
							inputObj.prop("checked",false);
						}else{
							inputObj.prop("checked",true);
						}
					}else{
						bindSelectValue();
					}
				}});
			}
			
			//下拉菜单显示/隐藏策略
			var inSelect = false;
			$("#"+ulId).mouseover(function(){
				inSelect = true;
			});
			
			//列表鼠标离开事件
			$("#"+ulId).mouseleave(function(){
				$("#"+ulId).hide();
				inSelect = false;
			});
			
			 //下拉菜单,失去光标事件
			 $("#"+droupDownButId).blur(function(){
				if(!inSelect){
				   $("#"+ulId).hide();
				}
			 });
			 
			 //用户自定义dom点击事件处理
			 function userDomClick(){
				$("#"+ulId+" .sort-select-ul-user-dom").children().click(function(e){
					var domClickEvent = $(this).attr("onclick");
					if(domClickEvent != null && domClickEvent != undefined){
						domClickEvent();
					}
					e.stopPropagation();
				});
			 }
			 
			 userDomClick();

			 //复选框选择事件
			$("#"+ulId+" input[name='sort-select-name']").click(function(e){
				bindSelectValue();
				e.stopPropagation();
			});
			
			//下拉按钮点击事件
            $("#"+droupDownButId).click(function(){
				//显示下拉内容
                $("#"+ulId).show();               
            });
            
            //绑定内容事件
            function bindSelectValue(){
                var selectedTextArray = new Array();
				var selectValueArray = new Array();
				selectedDom = new Object();
                $("#"+ulId+" input[name='sort-select-name']:checked").each(function(i,v){
					var _text = $(v).attr("data-text");
					var _value = $(v).val();
                    selectedTextArray.push(_text);
					selectValueArray.push(_value);
					selectedDom[_value] = $(v).parents('li').find(".sort-select-ul-user-dom").children();
                });
                obj.val(selectValueArray);
                var strSelect = "";
                if(selectedTextArray.length<=opts.numberDisplayed){
                    if(selectedTextArray.length>0){
                        strSelect = selectedTextArray.join(",");
                    }else{
                        strSelect = opts.buttonTitle;
                    }
                }else{
                    strSelect += "选择了"+(selectedTextArray.length)+"个";
                }
                $("#"+droupDownButId).html(strSelect+" <b class='caret'></b>");
            }
			
			return {
				getDom:function(){
					bindSelectValue();
					return selectedDom;
				},
				//数据格式 {"1":"<input type='radio' name='radio1' id='radio11' value='radioValue11'/> <label for='radio11'>同意</label>"}
				setDomData:function(data){
					for(var key in data){
						$("#"+ulId + " li").each(function(){
							if( key == $(this).attr("id") ) {
								$(this).find(".sort-select-ul-user-dom").html(data[key]);
								//重新绑定children 事件
								userDomClick();
								return false;
							}
						});
					}
				},
				//数据格式[1,2,3,4]
				setSelectKey:function(data){
					$("#"+ulId + " li").each(function(){
						var _id = $(this).attr("id") ;
						//标记是否已经选中
						$(this).find("input[name='sort-select-name']").prop("checked",false);
						for(var key in data){
							if(_id == data[key]){
								$(this).find("input[name='sort-select-name']").prop("checked",true);
								break;
								flag = true;
							}
						}
					});
					//重新赋值选中内容
					bindSelectValue();
				}
			}
        }
    });
})(window.jQuery)