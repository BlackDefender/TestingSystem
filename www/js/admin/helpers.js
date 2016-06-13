jQuery(function($){

    var prompt_cb, confirm_cb_ok, confirm_cb_cancel;
    var confirm_cb_ok_params, confirm_cb_cancel_params;

    var helpers = {
        clearWorklace: function(){
            globalVars.$currentTaskToolbar.empty();
            globalVars.$workplace.empty();
        },
        getCategoriesList:function(cb){// получает список категорий и вызывает переданную функцию
            $.get(globalVars.baseUrl+'categories',function(data){
                globalVars.categoriesList = JSON.parse(data);
                globalVars.categoriesListAssociated = [];
                globalVars.categoriesList.forEach(function(item){
                    globalVars.categoriesListAssociated[item['id']] = item['name'];
                });
                if(cb !== undefined) cb();
            });
        },
        getTestsList: function(cb){
            $.get(globalVars.baseUrl+'tests')
                .done(function(data){
                    globalVars.testsList = JSON.parse(data);
                    globalVars.testsListAssociated = [];
                    globalVars.testsList.forEach(function(item){
                        globalVars.testsListAssociated[item['id']] = item;
                    });
                    if(cb !== undefined) cb();
                });
        },
        getCounter: function (){// возвращает функцию-счетчик
            var count = 0;
            return function(){
                return count++;
            };
        },
        counter: null,
        getSelectedIds: function(tableSelector){ // возвращет массив айдишников выбранных тестов в списке
            if(tableSelector === undefined) tableSelector = 'table'; //для ленивых
            var $selectedItems = globalVars.$workplace.find(tableSelector + ' tbody tr td:first-child input[type="checkbox"]:checked');
            if($selectedItems.length === 0) return 'NO_SELECTED_ITEMS_ERROR';
            var selectedItemsIdsList = [];
            $selectedItems.each(function(){
                selectedItemsIdsList.push($(this).parents('tr').attr('data-id'));
            });
            return selectedItemsIdsList;
        },
        changesResultAnimation: function($target, success){
            var startColor = success ? 'rgba(92, 184, 92, 0.4)' : 'rgba(217, 83, 79, 0.4)';
            var $td = $target.parents('td');
            $td.stop().animate({'background-color': startColor}, 500, function(){
                $td.animate({'background-color':'transparent'}, 500);
            });
        },
        /*helpers.trash({
            'controller': 'tests' || 'categories',
            'action': 'trash' || 'delete',
            'multiple': true || false,
            'target': table selector || jQuery object,
            'toTrash': true || false
        });*/
        trash: function(params){//params = {controller, action, multiple, target, toTrash}
            var ids;
            if(params.multiple){
                ids = helpers.getSelectedIds(params.target);
                if(ids === 'NO_SELECTED_ITEMS_ERROR') return;
            }else{
                ids = [params.target.parents('tr').attr('data-id')];
            }
            var dataToSend = {'ids_JSON': JSON.stringify(ids)};
            if(params.action === 'trash') dataToSend['to_trash'] = params.toTrash;
            $.get(globalVars.baseUrl+globalVars.currentController+'/'+params.action, dataToSend)
                .done(function(data){
                    if(parseInt(data) >= 1){
                        window[globalVars.currentController].get();
                    }
                })
                .fail(function(data){
                    helpers.alert('OOPS!','Something get wrong...');
                });
        },
        alert: function(header, message){
            $('#helpers-alert').find('.modal-title').html(header);
            $('#helpers-alert').find('.modal-body').html(message);
            $('#helpers-alert').modal();
        },
        prompt: function(header, message, cb){
            if(typeof cb !== 'function') return;
            prompt_cb = cb;
            $('#helpers-prompt').find('.modal-title').html(header);
            $('#helpers-prompt-input').attr('placeholder', message);
            $('#helpers-prompt').modal();
            $('#helpers-prompt-input').focus();
        },
        confirm: function(header, message, cb_ok, cb_ok_params, cb_cancel, cb_cancel_params){
            if(typeof cb_ok !== 'function') return;
            confirm_cb_ok = cb_ok;
            confirm_cb_cancel = cb_cancel;
            confirm_cb_ok_params = cb_ok_params;
            confirm_cb_cancel_params = cb_cancel_params;
            $('#helpers-confirm').find('.modal-title').html(header);
            $('#helpers-confirm').find('.modal-body').html(message);
            $('#helpers-confirm').modal();
        },
        renameStart: function($target){
            $target.css({'display':'none'});// убираем label
            $target.parents('td').find('input[type="text"]').css({'display':'block'}).focus();// показываем input
        },
        renameEnd: function($target){
            var newName = $target.val();
            var $label = $target.parents('td').find('label');
            if($label.html() === newName){
                $target.css({'display':'none'});// убираем input
                $label.css({'display':'block'});// показываем label
                return ;
            }
            var itemId = $target.parents('tr').attr('data-id');// находим id

            $.get(globalVars.baseUrl+globalVars.currentController+'/rename',{'id':itemId, 'new_name':newName})
                .done(function(data){
                    if(data == 1){
                        $target.css({'display':'none'});// убираем input
                        $label.html(newName).css({'display':'block'});// меняем значение label и показываем его
                        helpers.changesResultAnimation($target, true);
                        if(globalVars.currentController === 'categories') helpers.getCategoriesList();
                        if(globalVars.currentController === 'tests') helpers.getTestsList();
                    }
                    else{
                        helpers.changesResultAnimation($target, false);
                    }
                })
                .fail(function(arg){
                    helpers.changesResultAnimation($target, false);
                    //console.log('fail', arg);
                });
        },
        renameRollBack: function($target){
            $target.css({'display':'none'});// убираем input
            $target.parents('td').find('label').css({'display':'block'});// показываем label
            $target.val($target.parents('td').find('label').html());
        },
        filterInput: function(e,regexp){
            e=e || window.event;
            var target=e.target || e.srcElement;
            var isIE=document.all;
            if (target.tagName.toUpperCase()=='INPUT'){
                var code=isIE ? e.keyCode : e.which;
                if (code<32 || e.ctrlKey || e.altKey) return true;

                var char=String.fromCharCode(code);
                if (!regexp.test(char)) return false;
            }
            return true;
        },
        stripTags: function(str){ // Strip HTML and PHP tags from a string
            return str.replace(/<\/?[^>]+>/gi, '');
        }
    };
    helpers.counter =  helpers.getCounter();

    function promptOk(){
        var data = $('#helpers-prompt-input').val();
        if(data === '') return;
        $('#helpers-prompt-input').val('');
        prompt_cb(data);
    }

    $('#helpers-prompt-ok-btn').bind('click', function(){
        promptOk();
    });

    $('#helpers-confirm-ok-btn').bind('click', function(){
        if(confirm_cb_ok_params === undefined || confirm_cb_ok_params === null || confirm_cb_ok_params === '')
            confirm_cb_ok();
        else
            confirm_cb_ok(confirm_cb_ok_params);
    });

    $('#helpers-confirm-cancel-btn').bind('click', function(){
        if(typeof confirm_cb_cancel === 'function'){
            if(confirm_cb_cancel_params === undefined || confirm_cb_cancel_params === null || confirm_cb_cancel_params === '')
                confirm_cb_cancel();
            else
                confirm_cb_cancel(confirm_cb_cancel_params);
        }
    });

    window.helpers = helpers;

});