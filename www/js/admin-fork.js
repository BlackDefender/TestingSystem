jQuery(function($){
    // инициализация
    function init(){
        // сразу получаем список категорий т.к. он нужен везде
        if(globalVars.categoriesList === ''){
            helpers.getCategoriesList(init);
            return ;
        }
        // задаем глобальный счетчик
        helpers.counter =  helpers.getCounter();


        // для затравки показываем список имеющихся тестов
        tests.get();


        // обработчики для кнопок тулбара
        //$('.add-test-btn').bind('click', testEditor.add);
        $('.get-tests-list-btn').bind('click', tests.get);
        $('.get-categories-list-btn').bind('click', categories.showMainList);


        // глобальные обработчики событий для Work Place
        globalVars.$workplace.bind('click', function(e){
            var $target = $(e.target);

            //выбор всех элементов списка
            if($target.hasClass('select-all-items')){
                var checked = $target.is(':checked');
                $target.parents('table').find('tbody tr td:first-child input[type="checkbox"]').prop( "checked", checked );
            }

            // добавить в корзину один элемент списка
            if($target.hasClass('single-add-to-trash')){
                var singleToTrashParams = {
                    'action': 'trash',
                    'multiple': false,
                    'target': $target,
                    'toTrash': true
                };
                helpers.confirm('Предупреждение', messages[globalVars.currentController].singleToTrashMsg, helpers.trash, singleToTrashParams);
            }

            // восстановить из корзины один элемент списка
            if($target.hasClass('single-recover')){
                helpers.trash({
                    'action': 'trash',
                    'multiple': false,
                    'target': $target,
                    'toTrash': false
                });
            }

            // удалить навсегда один элемент списка
            if($target.hasClass('single-delete')){
                var singleDeleteParams = {
                    'action': 'delete',
                    'multiple': false,
                    'target': $target
                };
                helpers.confirm('Предупреждение', messages[globalVars.currentController].singleDeleteMsg, helpers.trash, singleDeleteParams);
            }

        });

        // ОБРАБОТЧИКИ ДЛЯ ПЕРЕИМЕНОВАНИЯ КАТЕГОРИЙ И ТЕСТОВ
        globalVars.$workplace.bind('focusout', function(e){
            var $target = $(e.target);
            if($target.hasClass('list-edit-field')){
                helpers.renameEnd($target);
            }
        });
        globalVars.$workplace.bind('keyup', function(e){
            var $target = $(e.target);
            if($target.hasClass('list-edit-field')){
                if(e.keyCode === 13)
                    helpers.renameEnd($target);
                if(e.keyCode === 27)
                    helpers.renameRollBack($target);
            }
        });
        globalVars.$workplace.bind('dblclick', function(e){
            var $target = $(e.target);
            if($target.hasClass('list-item-label')){
                helpers.renameStart($target);
            }
        });

        // TOOLBAR
        globalVars.$currentTaskToolbar.bind('click', function(e){
            var $target = $(e.target);

            // пакетно добавить в корзину
            if($target.hasClass('toolbar-batch-add-to-trash')){
                if(helpers.getSelectedIds() === 'NO_SELECTED_ITEMS_ERROR'){
                    helpers.alert('Ошибка','Ничего не выбрано.');
                    return;
                }
                var batchToTrashParams = {
                    'action': 'trash',
                    'multiple': true,
                    'target': '',
                    'toTrash': true
                };
                helpers.confirm('Предупреждение', messages[globalVars.currentController].batchToTrashMsg, helpers.trash, batchToTrashParams);
            }

            // пакетно восстановить из корзины
            if($target.hasClass('toolbar-batch-recover')){
                if(helpers.getSelectedIds() === 'NO_SELECTED_ITEMS_ERROR'){
                    helpers.alert('Ошибка','Ничего не выбрано.');
                    return;
                }
                helpers.trash({
                    'action': 'trash',
                    'multiple': true,
                    'target': '',
                    'toTrash': false
                });
            }

            // пакетно удалить навсегда
            if($target.hasClass('toolbar-batch-delete')){
                if(helpers.getSelectedIds() === 'NO_SELECTED_ITEMS_ERROR'){
                    helpers.alert('Ошибка','Ничего не выбрано.');
                    return;
                }
                var batchDeleteParams = {
                    'action': 'delete',
                    'multiple': true,
                    'target': ''
                };
                helpers.confirm('Предупреждение', messages[globalVars.currentController].batchDeleteMsg, helpers.trash, batchDeleteParams);
            }
        });

    }
    init();
});

