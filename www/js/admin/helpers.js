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
                globalVars.categoriesList.forEach(function(item){
                    globalVars.categoriesListAssociated[item['id']] = item['name'];
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
        counter: null, //уже готовый счетчик. устанавливается в функции init().
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
            $.get(globalVars.baseUrl+params.controller+'/'+params.action, dataToSend)
                .done(function(data){
                    if(parseInt(data) >= 1){
                        window[params.controller].get();
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
            var newCategoryName = $target.val();
            var $label = $target.parents('td').find('label');
            if($label.html() === newCategoryName){
                $target.css({'display':'none'});// убираем input
                $label.css({'display':'block'});// меняем значение label и показываем его
            }
            var categoryId = $target.parents('tr').attr('data-id');// находим id категории

            $.get(globalVars.baseUrl+globalVars.currentController+'/rename',{'id':categoryId, 'new_name':newCategoryName})
                .done(function(data){
                    if(data == 1){
                        $target.css({'display':'none'});// убираем input
                        $label.html(newCategoryName).css({'display':'block'});// меняем значение label и показываем его
                        helpers.getCategoriesList();
                    }
                })
                .fail(function(arg){
                    console.log('fail',arg);
                });

        },
        renameRollBack: function($target){
            $target.css({'display':'none'});// убираем input
            $target.parents('td').find('label').css({'display':'block'});// показываем label
            $target.val($target.parents('td').find('label').html());
        }
    };

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