jQuery(function($){
    var tests = (function(){
        var mainListIsShowingNow = true;

        var baseTemplate = $('#tests-list-base-template').html(),
            mainListItemTemplateFunction = _.template($('#tests-list-item-template').html()),
            trashItemTemplateFunction = _.template($('#tests-list-trash-item-template').html()),
            mainListToolbarTemplate = $('#tests-list-toolbar-template').html(),
            trashToolbarTemplate = $('#tests-list-trash-toolbar-template').html();

        function get(){
            if(globalVars.categoriesList === '') {
                helpers.getCategoriesList(this.get);
                return ;
            }
            $.get(globalVars.baseUrl+'tests', function(data){
                globalVars.testsList = JSON.parse(data);
                render();
            });
        }

        function showMainList(){
            mainListIsShowingNow = true;
            render();
        }

        function render(){
            globalVars.currentController = 'tests';
            helpers.clearWorklace();
            globalVars.$workplace.append(baseTemplate);

            var itemsHTML = '',
                itemTemplateFunction = mainListIsShowingNow ? mainListItemTemplateFunction : trashItemTemplateFunction;

            globalVars.testsList.forEach(function(item){
                if(mainListIsShowingNow != item['is_in_trash'])
                    itemsHTML += itemTemplateFunction({'item':item, 'categoriesListAssociated':globalVars.categoriesListAssociated});
            });
            $('#tests-list tbody').append(itemsHTML);

            if(mainListIsShowingNow)
                globalVars.$currentTaskToolbar.append(mainListToolbarTemplate);
            else
                globalVars.$currentTaskToolbar.append(trashToolbarTemplate);
        }
        
        function getTestResults($target){
            var id = $target.parents('tr').attr('data-id');
            testsResults.get(id);
        }


        globalVars.$workplace.bind('click', function(e){
            var $target = $(e.target);
            // изменение приватности теста
            if($target.hasClass('test-list--test-privacy-property')){
                var id = $target.parents('tr').attr('data-id');
                $.get(globalVars.baseUrl+'tests/change-privacy',{'id':id, 'is_private':$target.is( ":checked" )}, function(data){
                    var text;
                    if(data == 1) text = 'Изменено';
                    else text = 'Ошибка';
                    var $node = $('<span class="text-success"> '+text+'</span>');
                    $target.parent().append($node);
                    $node.animate({'opacity':0}, 2000, function(){
                        $node.remove();
                    });
                });
            }

            if($target.hasClass('tests-list--get-test-results') || $target.parent().hasClass('tests-list--get-test-results')){
                getTestResults($target);
            }



        });

        globalVars.$currentTaskToolbar.bind('click', function(e){
            var $target = $(e.target);

            if($target.hasClass('tests-list--toolbar-add-test')){
                testEditor.add();
            }
            if($target.hasClass('tests-list--toolbar-show-trash')){
                mainListIsShowingNow = false;
                render();
            }
            if($target.hasClass('tests-list--toolbar-show-main-list')){
                mainListIsShowingNow = true;
                render();
            }
        });

        return {
            'showMainList':showMainList,
            'get':get
        };
    })();

    window.tests = tests;
});