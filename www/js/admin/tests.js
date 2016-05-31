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

        function singleTrash($target, toTrash){
            var ids = [$target.parents('tr').attr('data-id')];
            $.get(globalVars.baseUrl+'tests/trash',{'ids_JSON': JSON.stringify(ids), 'to_trash': toTrash}, function(data){
                if(data == 1){
                    get();
                }
            });
        }

        function batchTrash(toTrash){
            var ids = helpers.getSelectedIds('#tests-list');
            if(ids === 'NO_SELECTED_ITEMS_ERROR') return;
            $.get(globalVars.baseUrl+'tests/trash',{'ids_JSON': JSON.stringify(ids), 'to_trash': toTrash}, function(data){
                if(data >= 1){
                    get();
                }
            });
        }

        function singleDelete($target){
            var ids = [$target.parents('tr').attr('data-id')];
            $.get(globalVars.baseUrl+'tests/delete',{'ids_JSON': JSON.stringify(ids)}, function(data){
                if(data == 1){
                    get();
                }
            });
        }

        function batchDelete(){
            var ids = helpers.getSelectedIds('#tests-list');
            if(ids === 'NO_SELECTED_ITEMS_ERROR') return;
            $.get(globalVars.baseUrl+'tests/delete',{'ids_JSON': JSON.stringify(ids)}, function(data){
                if(data >= 1){
                    get();
                }
            });
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

            if($target.hasClass('tests-list--single-add-to-trash') || $target.parent().hasClass('tests-list--single-add-to-trash')){
                singleTrash($target, true);
            }
            if($target.hasClass('tests-list--get-test-results') || $target.parent().hasClass('tests-list--get-test-results')){
                getTestResults($target);
            }
            if($target.hasClass('tests-list--single-recover') || $target.parent().hasClass('tests-list--single-recover')){
                singleTrash($target, false);
            }
            if($target.hasClass('tests-list--single-delete') || $target.parent().hasClass('tests-list--single-delete')){
                singleDelete($target);
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
            if($target.hasClass('tests-list--toolbar-batch-add-to-trash')){
                batchTrash(true);
            }

            if($target.hasClass('tests-list--toolbar-batch-recover')){
                batchTrash(false);
            }
            if($target.hasClass('tests-list--toolbar-show-main-list')){
                mainListIsShowingNow = true;
                render();
            }
            if($target.hasClass('tests-list--toolbar-batch-delete')){
                batchDelete();
            }
        });

        return {
            'get':get
        };
    })();

    window.tests = tests;
});