jQuery(function($){

    var prompt_cb, confirm_cb_ok, confirm_cb_cancel;
    var confirm_cb_ok_params, confirm_cb_cancel_params;

    var helpers = {
        clearWorklace: function(){
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
                    if(globalVars.categoriesListAssociated.length > 0){
                        globalVars.testsList.forEach(function(item){
                            item['category_name'] = globalVars.categoriesListAssociated[item['category_id']];
                        });
                    }
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