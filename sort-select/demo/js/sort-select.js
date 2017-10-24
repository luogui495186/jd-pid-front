/**前端插件 基于jquery，jquery ui */
//html，选择插件,在选择框中排序，支持多选,支持自定义dom,
(function($){
    $.fn.extend({
        "sortSelect":function(option){
			//绑定是清除旧的绑定
			var thisId = $(this).attr("id");
			$("#sort-select-main"+thisId).remove();
			var selectedDom = new Array();//选择的dom
			var randomNumber = Math.ceil(Math.random()*100);
			//生成下拉按钮和下拉内容的唯一id
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
			var ulHtml = "<div class='sort-select-div'>";
			ulHtml += "<ul class='sort-select-ul' id='"+ulId+"' style='width:"+opts.width+"'>";
			var selectedTextArray = new Array();
			$(this).find("option").each(function(i,v){
				var _value = $(v).val().trim();
				var _text = $(v).text().trim();
				var _html  = $(v).attr("html");
				var checkedAttr = $(v).prop("selected") ? "checked='checked'" : "";
				var disabledAttr = $(v).attr("disabled") ? "disabled='disabled'" : "";
				var disabledClass = $(v).attr("disabled") ? "disabled" : "";
				//统计选中的文本
				if(checkedAttr != ""){
					selectedTextArray.push(_text);
				}
				ulHtml += "<li id='"+_value+"' class='"+disabledClass+" text='"+_text+"'>";
				//多选用checkbox，单选用radio
				if(typeof($(obj).attr("multiple"))=="undefined"){
					ulHtml += "<input name='sort-select-name' "+disabledAttr+" "+checkedAttr+" value='"+_value+"' type='radio' data-text='"+_text+"'/>&nbsp; ";
				}else{
					ulHtml += "<input name='sort-select-name' "+disabledAttr+" "+checkedAttr+" value='"+_value+"' type='checkbox' data-text='"+_text+"'/>&nbsp; ";
				}
				ulHtml += _text ;
				if (typeof(_html) != "undefined"){ 
					ulHtml += "<span class='sort-select-ul-user-dom'>"+_html+"</span>";
				}
				ulHtml += "</li>";
			});
			ulHtml += "</ul>";
			ulHtml += "<span class='sort-select-select-all'>";
			ulHtml += "<button class='btn btn-default'>全选</button>";
			ulHtml += "<button class='btn btn-default'>全不选</button></span>";
			ulHtml += "</div>";

			//添加显示的下拉按钮
			var btnHtml = "<button id='"+droupDownButId+"' class='sort-select-btn multiselect dropdown-toggle btn btn-default' data-toggle='dropdown' style='width:"+opts.buttonWidth+"'>";
			if(selectedTextArray.length == 0 ) {
				btnHtml += opts.buttonTitle;
			}else{
				if(selectedTextArray.length <= opts.numberDisplayed){
					btnHtml += selectedTextArray.join(",");
				}else if(selectedTextArray.length > opts.numberDisplayed){
					btnHtml += "选择了"+selectedTextArray.length +"个";
				}
			}
			btnHtml += " <b class='caret'></b></button>";
			html += btnHtml;
			html += ulHtml;
			
			//全选，全部选按钮
			
			html += "</div>";

            //隐藏文本框
            $(this).hide();
            //添加下拉按钮，下拉内容
			$(this).after(html);
			
			//绑定用户自定义菜单是否可用
			$("#"+ulId + " li").each(function(){
				if($(this).hasClass("disabled")){
					$(this).find(".sort-select-ul-user-dom").children().attr("disabled","disabled");
				}
			});
				 
			//列表点击事件
			$("#"+ulId+" li").click(function(){
				if($(this).hasClass("disabled")){
					return;
				}
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
					//拖拽后重新排序select中option
					var _optionTemp = new Array();//保存排序后的option
					$("#"+ulId+" li").each(function(){
						var _value = $(this).attr("id");
						$(obj).find("option").each(function(){
							if($(this).val() == _value){
								_optionTemp.push($(this));
								return false;
							}
						});
					});
					$(obj).find("option").remove();
					for(var key in _optionTemp){
						$(obj).append(_optionTemp[key]);
					}
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
					if(!$(this).parents("li").hasClass("disabled")){
						var domClickEvent = $(this).attr("onclick");
						if(domClickEvent != null && domClickEvent != undefined){
							domClickEvent();
						}
					}
					e.stopPropagation();
				});
			 }
			 //绑定用户自定义dom点击事件
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
				//设置选中行数据格式[1,2,3,4]
				setSelected:function(data){
					$("#"+ulId + " li").each(function(){
						var _id = $(this).attr("id") ;
						for(var key in data){
							if(_id == data[key]){
								$(this).find("input[name='sort-select-name']").prop("checked",true);
								break;
							}
						}
					});
					//重新赋值选中内容
					bindSelectValue();
				},
				//设置取消选中的行
				setUnSelected:function(data){
					$("#"+ulId + " li").each(function(){
						var _id = $(this).attr("id") ;
						for(var key in data){
							if(_id == data[key]){
								$(this).find("input[name='sort-select-name']").prop("checked",false);
								break;
							}
						}
					});
					//重新赋值选中内容
					bindSelectValue();
				},
				//设置不可用的行
				setDisabled:function(data){
					$("#"+ulId + " li").each(function(){
						var _id = $(this).attr("id") ;
						for(var key in data){
							if(_id == data[key]){
								$(this).removeClass("disabled");
								$(this).addClass("disabled");
								$(this).find("input[name='sort-select-name']").attr("disabled","disabled");
								$(this).find(".sort-select-ul-user-dom").children().attr("disabled","disabled");
								break;
							}
						}
					});
				},
				//设置可用的行
				setEnabled:function(data){
					$("#"+ulId + " li").each(function(){
						var _id = $(this).attr("id") ;						
						for(var key in data){
							if(_id == data[key]){
								$(this).removeClass("disabled");
								$(this).find("input[name='sort-select-name']").removeAttr("disabled");
								$(this).find(".sort-select-ul-user-dom").children().removeAttr("disabled");
								break;
							}
						}
					});
				}
			}
        }
    });
})(window.jQuery)