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