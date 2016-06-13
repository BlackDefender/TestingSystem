jQuery(function($){
    var tests = (function(){
        var mainListIsShowingNow = true;

        var baseTemplate = $('#tests-list-base-template').html(),
            itemTemplateFunction = _.template($('#tests-list-item-template').html()),
            mainListToolbarTemplate = $('#tests-list-toolbar-template').html(),
            trashToolbarTemplate = $('#tests-list-trash-toolbar-template').html();

        function get(){
            helpers.getTestsList(render);
//            $.get(globalVars.baseUrl+'tests', function(data){
//                globalVars.testsList = JSON.parse(data);
//                render();
//            });
        }

        function showMainList(){
            mainListIsShowingNow = true;
            render();
        }

        function render(){
            globalVars.currentController = 'tests';
            helpers.clearWorklace();
            globalVars.$workplace.append(baseTemplate);

            var itemsHTML = '';
            globalVars.testsList.forEach(function(item){
                if(mainListIsShowingNow != item['is_in_trash'])
                    itemsHTML += itemTemplateFunction({'item':item, 'categories':globalVars.categoriesList, 'mainListIsShowingNow':mainListIsShowingNow});
            });
            $('#tests-list tbody').append(itemsHTML);

            globalVars.$currentTaskToolbar.append( mainListIsShowingNow ? mainListToolbarTemplate : trashToolbarTemplate);

        }

        function getTestResults($target){
            var id = $target.parents('tr').attr('data-id');
            testsResults.get(id);
        }



        function changeDateEnd($target){
            // проверяем изменилась ли дата
            var newDate = $target.val();
            var $label = $target.parents('td').find('label');
            if($label.html() === newDate){
                $target.css({'display':'none'});// убираем input
                $label.css({'display':'block'});// показываем label
                return ;
            }

            var testId = $target.parents('tr').attr('data-id');
            var targetTest;

            globalVars.testsList.forEach(function(item){
                if(item['id'] == testId){
                    targetTest = item;
                    return false;
                }
            });
            if(targetTest === undefined){
                helpers.renameRollBack($target);
                return ;
            }

            var startDate, endDate, now = moment();

            if($target.hasClass('tests-list-item-start-date-input')){
                var newStartDateStr = $target.val(),
                    oldStartDateStr = targetTest['start_date_formatted'];

                if(newStartDateStr === oldStartDateStr){
                    helpers.renameRollBack($target);
                    return ;
                }

                var newStartDate = moment(newStartDateStr, "DD-MM-YYYY");
                endDate = moment(targetTest['end_date_formatted'], "DD-MM-YYYY");
                if(!newStartDate.isValid() || newStartDate.isBefore(now, 'day') || newStartDate.isAfter(endDate)){
                    helpers.renameRollBack($target);
                    return ;
                }
                startDate = newStartDate;
            }

            if($target.hasClass('tests-list-item-end-date-input')){
                var newEndDateStr = $target.val(),
                    oldEndDateStr = targetTest['end_date_formatted'];

                if(newEndDateStr === oldEndDateStr){
                    helpers.renameRollBack($target);
                    return ;
                }

                var newEndDate = moment(newEndDateStr, "DD-MM-YYYY");
                startDate = moment(targetTest['start_date_formatted'], "DD-MM-YYYY");
                if(!newEndDate.isValid() || newEndDate.isBefore(now, 'day') || newEndDate.isBefore(startDate)){
                    helpers.renameRollBack($target);
                    return ;
                }
                endDate = newEndDate;
            }

            $.get(globalVars.baseUrl+'tests/change-date', {'test_id': testId, 'start_date':startDate.unix(), 'end_date':endDate.unix()})
                .done(function(data){
                    if(data == 1){
                        $target.css({'display':'none'});// убираем input
                        $target.parents('td').find('label').html($target.val()).css({'display':'block'});// меняем значение label и показываем его
                        helpers.changesResultAnimation($target, true);
                        helpers.getTestsList();
                    }else{
                        helpers.renameRollBack($target);
                        helpers.alert('Ошибка', 'Не удалось изменить дату.');
                    }
                })
                .fail(function(){
                    helpers.renameRollBack($target);
                    helpers.alert('Ошибка', 'Не удалось изменить дату.');
                })

        }

        function copyTest($target){
            var testId = $target.parents('tr').attr('data-id');
            $.get(globalVars.baseUrl+'tests/copy', {'id': testId})
                    .done(function(data){
                        if(data == 1){
                            get();
                        }
                    })
                    .fail(function(){
                        helpers.alert('Ой!', 'Что-то пошло не так.');
                    });
        }

        function showTestLink($target){
            var testId = $target.parents('tr').attr('data-id');
            helpers.alert('Ссылка на тест', globalVars.testsListAssociated[testId]['name'] +'<br>'+ globalVars.baseUrl+'?test-id='+testId);
        }

        // обработчики изменения даты начала или окончания теста
        globalVars.$workplace.bind('focusout', function(e){
            var $target = $(e.target);
            if($target.hasClass('tests-list-item-start-date-input') || $target.hasClass('tests-list-item-end-date-input')){
                changeDateEnd($target);
            }
        });
        globalVars.$workplace.bind('keyup', function(e){
            var $target = $(e.target);
            if($target.hasClass('tests-list-item-start-date-input') || $target.hasClass('tests-list-item-end-date-input')){
                if(e.keyCode === 13)
                    changeDateEnd($target);
                if(e.keyCode === 27)
                    helpers.renameRollBack($target);
            }
        });
        globalVars.$workplace.bind('dblclick', function(e){
            var $target = $(e.target);
            if($target.hasClass('tests-list-item-start-date-label') || $target.hasClass('tests-list-item-end-date-label')){
                helpers.renameStart($target);
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

        globalVars.$workplace.bind('click', function(e){
            var $target = $(e.target);
            // изменение приватности теста
            if($target.hasClass('test-list--test-privacy-property')){
                var id = $target.parents('tr').attr('data-id');
                $.get(globalVars.baseUrl+'tests/change-privacy',{'id':id, 'is_private':$target.is( ":checked" )})
                    .done(function(data){
                        if(data == 1){
                            helpers.changesResultAnimation($target, true);
                            setTimeout(get, 1000);
                        }
                    })
                    .fail(function(){
                        helpers.changesResultAnimation($target, false);
                    });
            }

            if($target.hasClass('tests-list--get-test-results')){
                getTestResults($target);
            }
            if($target.hasClass('tests-list--single-copy')){
                copyTest($target);
            }
            if($target.hasClass('tests-list--single-get-link')){
                showTestLink($target);
            }
        });

        globalVars.$workplace.bind('change', function(e){
            var $target = $(e.target);
            // изменение категории теста
            if($target.hasClass('test-list--test-category')){
                var categoryId = $target.val();
                var testId = $target.parents('tr').attr('data-id');
                $.get(globalVars.baseUrl+'tests/change-category', {'test_id':testId,'new_category_id':categoryId})
                        .done(function(data){
                            if(data == 1){
                                helpers.changesResultAnimation($target, true);
                                helpers.getTestsList();
                            }
                        })
                        .fail(function(){
                            helpers.changesResultAnimation($target, false);
                        });
            }
        });

        return {
            'showMainList':showMainList,
            'get':get
        };
    })();

    window.tests = tests;
});