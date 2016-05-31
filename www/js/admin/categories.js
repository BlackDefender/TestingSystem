jQuery(function($){
    var categories = (function(){
        var mainListIsShowingNow = true;

        var baseTemplate = $('#categories-list-base-template').html(),
            mainListItemTemplateFunction = _.template($('#categories-list-item-template').html()),
            trashItemTemplateFunction = _.template($('#categories-list-trash-item-template').html()),
            mainListToolbarTemplate = $('#categories-toolbar-template').html(),
            trashToolbarTemplate = $('#categories-trash-toolbar-template').html();

        function get(){
            globalVars.categoriesList = '';
            render();
        }
        function showMainList(){
            mainListIsShowingNow = true;
            render();
        }
        function render(){
            if(globalVars.categoriesList == ''){
                helpers.getCategoriesList(render);
                return ;
            }
            globalVars.currentController = 'categories';
            helpers.clearWorklace();
            globalVars.$workplace.append(baseTemplate);

            var itemsHTML = '',
                itemTemplateFunction = mainListIsShowingNow ? mainListItemTemplateFunction : trashItemTemplateFunction;
            globalVars.categoriesList.forEach(function(item){
                if(mainListIsShowingNow != item['is_in_trash']){
                    itemsHTML += itemTemplateFunction({'item':item});
                }
            });
            $('#categories-list tbody').append(itemsHTML);

            if(mainListIsShowingNow)
                globalVars.$currentTaskToolbar.append(mainListToolbarTemplate);
            else
                globalVars.$currentTaskToolbar.append(trashToolbarTemplate);

            $("#categories-list").tablesorter({
                headers:{ 0:{sorter: false}, 2:{sorter: false} }
            });

        }

        function add(name){
            $.get(globalVars.baseUrl+'categories/add',{'name':name})
                .done(function(data){
                    if(data === 'CATEGORY_EXISTS_ERROR'){
                        helpers.alert('Ошибка', 'Такая категория уже сушествует.');
                        return ;
                    }
                    get();
                })
                .fail(function(){
                    helpers.alert('Ошибка', 'Что-то пошло не так.');
                });
        }

        globalVars.$workplace.bind('click', function(e){
            var $target = $(e.target);

            // добавить в корзину
            if($target.hasClass('categories--single-add-to-trash')){
                var singleToTrashMsg = 'При помещении категории в корзину нельзя будет проходить тесты, относящиеся к данной категории.<br>Уверены что хотите поместить категорию в корзину?';
                var singleToTrashParams = {
                    'controller': 'categories',
                    'action': 'trash',
                    'multiple': false,
                    'target': $target,
                    'toTrash': true
                };
                helpers.confirm('Предупреждение', singleToTrashMsg, helpers.trash, singleToTrashParams);
            }

            // восстановить из корзины
            if($target.hasClass('categories--single-recover')){
                helpers.trash({
                    'controller': 'categories',
                    'action': 'trash',
                    'multiple': false,
                    'target': $target,
                    'toTrash': false
                });
            }
            // удалить навсегда
            if($target.hasClass('categories--single-delete')){
                var singleDeleteMsg = 'При удалении категории будут также удалены все тесты, относящиеся к данной категории и результаты их прохождения.<br>Уверены что хотите удалить категорию?';
                var singleDeleteParams = {
                    'controller': 'categories',
                    'action': 'delete',
                    'multiple': false,
                    'target': $target
                };
                helpers.confirm('Предупреждение', singleDeleteMsg, helpers.trash, singleDeleteParams);
            }

        });

        // TOOLBAR
        globalVars.$currentTaskToolbar.bind('click', function(e){
            var $target = $(e.target);

            // добавить категорию
            if($target.hasClass('categories--add')){
                helpers.prompt('Добавить категорию', 'Название категории', add);
            }

            // показать корзину
            if($target.hasClass('categories--toolbar-show-trash')){
                mainListIsShowingNow = false;
                render();
            }

            // пакетно добавить в корзину
            if($target.hasClass('categories--toolbar-batch-add-to-trash')){
                if(helpers.getSelectedIds() === 'NO_SELECTED_ITEMS_ERROR'){
                    helpers.alert('Ошибка','Ничего не выбрано.');
                    return;
                }
                var batchToTrashMsg = 'При помещении категорий в корзину нельзя будет проходить тесты, относящиеся к данным категориям.<br>Уверены что хотите поместить выбранные категории в корзину?';
                var batchToTrashParams = {
                    'controller': 'categories',
                    'action': 'trash',
                    'multiple': true,
                    'target': '#categories-list',
                    'toTrash': true
                };
                helpers.confirm('Предупреждение', batchToTrashMsg, helpers.trash, batchToTrashParams);
            }

            // пакетно восстановить из корзины
            if($target.hasClass('categories--toolbar-batch-recover')){
                if(helpers.getSelectedIds() === 'NO_SELECTED_ITEMS_ERROR'){
                    helpers.alert('Ошибка','Ничего не выбрано.');
                    return;
                }
                helpers.trash({
                    'controller': 'categories',
                    'action': 'trash',
                    'multiple': true,
                    'target': '#categories-list',
                    'toTrash': false
                });
            }

            // удалить навсегда
            if($target.hasClass('categories--toolbar-batch-delete')){
                if(helpers.getSelectedIds() === 'NO_SELECTED_ITEMS_ERROR'){
                    helpers.alert('Ошибка','Ничего не выбрано.');
                    return;
                }
                var batchDeleteMsg = 'При удалении категорий будут также удалены все тесты, относящиеся к данным категориям и результаты их прохождения.<br>Уверены что хотите удалить выбранные категории?';
                var batchDeleteParams = {
                    'controller': 'categories',
                    'action': 'delete',
                    'multiple': true,
                    'target': '#categories-list'
                };
                helpers.confirm('Предупреждение', batchDeleteMsg, helpers.trash, batchDeleteParams);
            }

            //показать основной список
            if($target.hasClass('categories--toolbar-show-main-list')){
                mainListIsShowingNow = true;
                render();
            }

        });

        return {
            'showMainList':showMainList,
            'get':get
        };

    })();

    window.categories = categories;
});