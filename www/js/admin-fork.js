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
            if($target.hasClass('select-all-items')){
                var checked = $target.is(':checked');
                $target.parents('table').find('tbody tr td:first-child input[type="checkbox"]').prop( "checked", checked );
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

    }
    init();
});

