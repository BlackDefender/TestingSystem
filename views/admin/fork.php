<?php

/* @var $this yii\web\View */

$this->title = 'Admin Page';

require_once 'fork-templates.php';// подключаем файл с шаблонами

?>

<ul class='toolbar btn-group'>
    <li class='btn btn-success add-test-btn' title="Добавить тест"><i class="glyphicon glyphicon-plus"></i></li>
    <li class='btn btn-info get-tests-list-btn' title="Список тестов"><i class="glyphicon glyphicon-list"></i></li>
    <li class='btn btn-warning get-categories-list-btn' title="Список категорий"><i class="fa fa-database"></i></li>
</ul>

<ul class='toolbar btn-group' id="current-task-toolbar"></ul>
<div class='clearfix' id="work-space"></div>




<!-- Trigger the modal with a button -->
<!--<button type="button" class="btn btn-info" data-toggle="modal" data-target="#add-category-modal-window" title="Добавить категорию"><i class="glyphicon glyphicon-plus"></i></button>-->
<!-- Modal -->
<div id="add-category-modal-window" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title">Добавление категории тестов</h4>
      </div>
      <div class="modal-body">
          <input type="text" class="form-control" id="add-category-modal-window-input" placeholder="Название категории">
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-default" id="add-category-btn" data-dismiss="modal">Добавить</button>
        <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
      </div>
    </div>

  </div>
</div>



<style type="text/css">
    /* ОБЩИЕ СТИЛИ */
    body{
        padding: 0;
    }
    .toolbar{
        padding: 0;
        margin: 0 0 20px;
    }
    #work-space{
        width: 100%;
        height: auto;
        background-color: transparent;
        position: relative;
    }
    /* СТИЛИ ФОРМЫ ДОБАВЛЕИЯ НОВОГО ТЕСТА */
    .add-new-test--form-header .form-control.add-new-test--date{
        width: 50px;
        text-align: center;
    }
    .add-new-test--form-header .form-control.add-new-test--date-year{
        width: 60px;
        text-align: center;
    }
    .add-new-test--category-label{
        padding: 0 10px 0 30px;
    }
    .add-new-test--form-header{
        padding: 3px;
        border-radius: 5px;
    }
    .add-new-test--form-header .form-control{
        display: inline;
        width: auto;
    }
    #add-new-test--test-name{
        width: 50%;
    }
    .add-new-test--aside-toolbar{
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        right: 0;
    }
    .add-new-test--questions-block-wrap{
        background-color: #F7F4DC;
        margin: 20px 0 20px;
        padding: 3px;
        border-radius: 5px;
        border: 1px solid #FFF9CB;
    }
    .add-new-test--questions-block-name{
        /*margin: 0 0 15px;*/
        width: 70%;
        display: inline-block;
    }
    .add-new-test--questions-block--question-wrap{
        margin: 15px 0;
    }
    .add-new-test--questions-block-toolbar{
        text-align: right;
    }
    .add-new-test--questions-block-menu{
        float: right;
    }
    .add-new-test--questions-block--question-answer{
        margin: 5px 0;
    }
    .add-new-test--questions-block--question-answer input[type="text"]{
        width: 60%;
        display: inline-block;
    }
    .add-new-test--questions-block--question-add-answer{
        margin: 15px 0 0;
    }
    .add-new-test--questions-block--question-answer-delete{
        margin: 0 0 0 15px;
    }
    .edit-field{
        display: none;
    }
    .categories-list-item-label{
        width:100%;
        height: 100%;
    }

</style>





<script type="text/javascript">

jQuery(function($){

    var globalVars = {
        'baseUrl': 'http://synergy.od.ua/',
        'categoriesList': '',                     // [{id:'1',name:'name'}]
        'categoriesListAssociated': [], // categoriesListAssociated[id] = 'name'
        'testsList': '',
        '$workplace': $('#work-space'),
        '$currentTaskToolbar': $('#current-task-toolbar')
    };

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
            var $selectedItems = globalVars.$workplace.find(tableSelector + ' tbody tr td:first-child input[type="checkbox"]:checked');
            if($selectedItems.length === 0) return 'NO_SELECTED_ITEMS_ERROR';
            var selectedItemsIdsList = [];
            $selectedItems.each(function(){
                selectedItemsIdsList.push($(this).parents('tr').attr('data-id'));
            });
            return selectedItemsIdsList;
        },
        alert: function(header, message){

        },
        prompt: function(header, message, cb){

        },
        confirm: function(header, message, cb_yes, cb_no){

        }
    };

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
        testsList.get();


        // обработчики для кнопок тулбара
        $('.add-test-btn').bind('click', tests.add);
        $('.get-tests-list-btn').bind('click', testsList.get);
        $('.get-categories-list-btn').bind('click', categories.render);


        // глобальные обработчики событий для Work Place
        globalVars.$workplace.bind('click', function(e){
            var $target = $(e.target);
            if($target.hasClass('select-all-items')){
                var checked = $target.is(':checked');
                $target.parents('table').find('tbody tr td:first-child input[type="checkbox"]').prop( "checked", checked );
            }
        });


        $('#add-category-btn').bind('click',function(){
            var categoryName = $('#add-category-modal-window-input').val();
            $.get(baseUrl+'categories/add',{'name':categoryName}, function(data){

            });
        });
    }

    var testsList = (function(){
        var mainListIsShowingNow = true;

        function get(){
            if(globalVars.categoriesList === '') {
                helpers.getCategoriesList(this.get);
                return ;
            }
            $.get(globalVars.baseUrl+'tests', function(data){
                testsList = JSON.parse(data);
                render();
            });
        }

        function render(){
            helpers.clearWorklace();
            globalVars.$workplace.append($('#tests-list-header-template').html());
            var testsListItemTemplateFunction = _.template( mainListIsShowingNow ? $('#tests-list-item-template').html() : $('#tests-list-trash-item-template').html()),
                testsListItemTemplateHTML = '';

            testsList.forEach(function(item){

                if(mainListIsShowingNow != item['is_in_trash'])
                    testsListItemTemplateHTML += testsListItemTemplateFunction({'item':item, 'categoriesListAssociated':globalVars.categoriesListAssociated});
            });
            $('#tests-list tbody').append(testsListItemTemplateHTML);

            if(mainListIsShowingNow)
                globalVars.$currentTaskToolbar.append($('#tests-list-toolbar-template').html());
            else
                globalVars.$currentTaskToolbar.append($('#tests-list-trash-toolbar-template').html());
        }

        function singleTrash($target, toTrash){
            var ids = [$target.parents('tr').attr('data-id')];
            console.log(ids);
            $.get(globalVars.baseUrl+'tests/trash',{'ids_JSON': JSON.stringify(ids), 'to_trash': toTrash}, function(data){
                if(data == 1){
                    get();
                }
            });
        }

        function batchTrash(toTrash){
            var ids = helpers.getSelectedIds('#tests-list');
            if(ids === 'NO_SELECTED_ITEMS_ERROR') return;
            console.log(ids);
            console.log(toTrash);
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


            if($target.hasClass('tests-list--single-recover') || $target.parent().hasClass('tests-list--single-recover')){
                singleTrash($target, false);
            }
            if($target.hasClass('tests-list--single-delete') || $target.parent().hasClass('tests-list--single-delete')){
                singleDelete($target);
            }

        });

        globalVars.$currentTaskToolbar.bind('click', function(e){
            var $target = $(e.target);

            if($target.hasClass('tests-list--toolbar-batch-add-to-trash') || $target.parent().hasClass('tests-list--toolbar-batch-add-to-trash')){
                batchTrash(true);
            }
            if($target.hasClass('tests-list--toolbar-show-trash') || $target.parent().hasClass('tests-list--toolbar-show-trash')){
                mainListIsShowingNow = false;
                render();
            }

            if($target.hasClass('tests-list--toolbar-batch-recover') || $target.parent().hasClass('tests-list--toolbar-batch-recover')){
                batchTrash(false);
            }
            if($target.hasClass('tests-list--toolbar-show-main-list') || $target.parent().hasClass('tests-list--toolbar-show-main-list')){
                mainListIsShowingNow = true;
                render();
            }
            if($target.hasClass('tests-list--toolbar-batch-delete') || $target.parent().hasClass('tests-list--toolbar-batch-delete')){
                batchDelete();
            }
        });

        return {
            'get':get
        };
    })();

    var tests = (function(){
        //Создаем новый тест
        function addTest(){
            helpers.clearWorklace();
            globalVars.$workplace.append($('#add-test-template').html());
            var categoriesListItemTemplateFunction = _.template($('#add-test-categories-list-item-template').html()),
                categoriesListItemsHTML = '';

            globalVars.categoriesList.forEach(function(item){
                categoriesListItemsHTML += categoriesListItemTemplateFunction({'item':item});
            });
            $('#test-category-selector').append(categoriesListItemsHTML);

            addBlockInNewTest();
            $('#add-new-test--test-name').focus();
        }

        function addBlockInNewTest(){
            globalVars.$workplace.append($('#add-test-block-template').html());
            addQuestionInBlock();
            $('.add-new-test--questions-block-wrap:last .add-new-test--questions-block-name').focus();
        }
        function deleteBlockFromNewTest(){
            $(this).parents('.add-new-test--questions-block-wrap').remove();
        }
        function addQuestionInBlock(){
            // определяем откуда был вызов функции
            // если нажатием кнопки в форме - добавляем вопрос в соответствующий блок вопросов
            // если чистый вызов функции, то в последний блок. (используется при инициализации блока)
            var $target;
            if($(this).hasClass('add-new-test--add-question') || $(this).parent().hasClass('add-new-test--add-question'))
                $target = $(this).parents('.add-new-test--questions-block-wrap').children('.add-new-test--questions-block');
            else $target = $('.add-new-test--questions-block:last');
            if($target.length === 0) return ; // а вдруг вызвали откуда не надо.
            $target.append($('#add-test-question-template').html());

            $target.find('.add-new-test--questions-block--question-wrap:last .add-new-test--questions-block--question-add-answer').click();
            $target.find('.add-new-test--questions-block--question-wrap:last .add-new-test--questions-block--question-name').focus();
        }

        function deleteQuestionFromBlock($obj){
            $obj.parents('.add-new-test--questions-block--question-wrap').remove();
        }

        function addAnswerForQuestion(){
            var $parent = $(this).parents('.add-new-test--questions-block--question-wrap'); //контейнер вопроса
            var $target = $parent.find('.add-new-test--questions-block--question-answers-wrap');// контейнер с ответами
            var type = $parent.find('.add-new-test--questions-block--test-type-select').val();

            var counterIndex;
            if($target.attr('data-counter-index')){
                counterIndex = $target.attr('data-counter-index');
            }else{
                counterIndex = helpers.counter();
                $target.attr('data-counter-index', counterIndex);
            }

            var output = '<div class="add-new-test--questions-block--question-answer">';
            switch(type){
                case 'radio':
                    output += '<input type="radio" name="answer_'+counterIndex+'"> <input class="form-control" placeholder="Ответ" type="text">';
                    break;
                case 'checkbox':
                    output += '<input type="checkbox" name="answer_'+counterIndex+'"> <input class="form-control" placeholder="Ответ" type="text">';
                    break;
                case 'text':
                    output += '<input class="form-control" type="text" name="answer_'+counterIndex+'" placeholder="Ответ">';
                    break;
            }
            output += '<span class="btn btn-warning add-new-test--questions-block--question-answer-delete" title="Удалить вариант ответа"><i class="fa fa-minus"></i></span>';
            output += '</div>';
            $target.append(output);
            $target.find('input[type="text"]:last').focus();
        }

        function deleteAnswerForQuestion($obj){
            $obj.parents('.add-new-test--questions-block--question-answer').remove();
        }

        function changeQuestionType(){
            var windowScroll = $(window).scrollTop();
            var $questionContainer = $(this).parents('.add-new-test--questions-block--question-wrap');
            var $answersContainer = $questionContainer.find('.add-new-test--questions-block--question-answers-wrap');
            if($answersContainer.length === 0) return ;

            var data = [];
            $answersContainer.find('input[type="text"]').each(function(){
                data.push($(this).val());
            });
            $answersContainer.empty();
            var $addBtn = $questionContainer.find('.add-new-test--questions-block--question-add-answer');
            data.forEach(function(item){
                $addBtn.click();
                $answersContainer.find('input[type="text"]:last').val(item);
            });
            $(window).scrollTop(windowScroll);
        }

        function saveTest(){
            var testObject = {};
            var testName = $('#add-new-test--test-name').val();
            var testCategoryId = $('#test-category-selector').val();

            var startDate_d = $('#add-new-test--start-date-dd').val(),
                startDate_m = $('#add-new-test--start-date-mm').val(),
                startDate_y = $('#add-new-test--start-date-yyyy').val(),
                endDate_d = $('#add-new-test--end-date-dd').val(),
                endDate_m = $('#add-new-test--end-date-mm').val(),
                endDate_y = $('#add-new-test--end-date-yyyy').val(),
                startDate,
                endDate;

            startDate = new Date(startDate_y+'-'+startDate_m+'-'+startDate_d);
            endDate = new Date(endDate_y+'-'+endDate_m+'-'+endDate_d);
            var isPrivate = $('#add-new-test--is-private').is(':checked');

            testObject['category_id'] = testCategoryId;
            testObject['test_name'] = testName;
            testObject['start_date'] = startDate.getTime();
            testObject['end_date'] = endDate.getTime();
            testObject['is_private'] = isPrivate;
            testObject['blocks'] = [];

            var $testBlocksCollection = globalVars.$workplace.find('.add-new-test--questions-block-wrap');
            $testBlocksCollection.each(function(){
                var $block = $(this);
                var currentBlock = {};
                var blockName = $block.find('.add-new-test--questions-block-name').val();
                currentBlock['name'] = blockName;
                currentBlock['questions'] = [];

                var $questions = $block.find('.add-new-test--questions-block--question-wrap');
                $questions.each(function(){
                    var $question = $(this);
                    var questionName = $question.find('.add-new-test--questions-block--question-name').val(),
                        questionImg = '',
                        questionType = $question.find('.add-new-test--questions-block--test-type-select').val();

                    var currentQuestion = {};
                    currentQuestion['name'] = questionName;
                    currentQuestion['img'] = questionImg;
                    currentQuestion['type'] = questionType;
                    currentQuestion['answers'] = [];

                    var $answers = $question.find('.add-new-test--questions-block--question-answer');
                    $answers.each(function(){
                        var answerName = $(this).find('input[type="text"]').val();
                        var answerIsTrue = false;
                        var answerImg = '';
                        switch(questionType){
                            case 'text':
                                answerIsTrue = true;
                                break;
                            case 'radio':
                                answerIsTrue = $(this).find('input[type="radio"]').is(':checked');
                                break;
                            case 'checkbox':
                                answerIsTrue = $(this).find('input[type="checkbox"]').is(':checked');
                                break;
                        }
                        currentQuestion['answers'].push({
                            'name': answerName,
                            'img': answerImg,
                            'is_true': answerIsTrue
                        });

                    });
                    currentBlock['questions'].push(currentQuestion);
                });

                testObject['blocks'].push(currentBlock);
            });


            //console.log(testObject);
            //console.log(JSON.stringify(testObject));

            $.post(globalVars.baseUrl+'tests/add',{'test_JSON': JSON.stringify(testObject)}, function(data){
                console.log(data);
            });
        }

        // обработчик нажатия в рабочей области
        // идентифицируем событие и делаем что надо
        // сюда можно добавлять обработку любых событий, происходящих на бескрайних просторах .work-space
        globalVars.$workplace.bind('click', function(e){
            var $target = $(e.target);

            // добавить блок вопросов
            if($target.hasClass('add-new-test--add-block') || $target.parent().hasClass('add-new-test--add-block')){
                addBlockInNewTest();
            }

            // добавить вопрос
            if($target.hasClass('add-new-test--add-question') || $target.parent().hasClass('add-new-test--add-question')){
                addQuestionInBlock.apply(e.target);
            }

            // добавить ответ на вопрос
            if($target.hasClass('add-new-test--questions-block--question-add-answer') || $target.parent().hasClass('add-new-test--questions-block--question-add-answer')){
                addAnswerForQuestion.apply(e.target);
            }

            // удалить блок вопросов
            if($target.hasClass('add-new-test--questions-block-menu-delete')){
                deleteBlockFromNewTest.apply(e.target);
            }

            // удалить вопрос
            if($target.hasClass('add-new-test--questions-block--question-delete') || $target.parent().hasClass('add-new-test--questions-block--question-delete')){
                var $obj;
                if($target.hasClass('add-new-test--questions-block--question-delete'))
                    $obj = $target;
                else $obj = $target.parent();
                deleteQuestionFromBlock($obj);
            }

            // удалить ответ на вопрос
            if($target.hasClass('add-new-test--questions-block--question-answer-delete') || $target.parent().hasClass('add-new-test--questions-block--question-answer-delete')){
                var $obj;
                if($target.hasClass('add-new-test--questions-block--question-answer-delete'))
                    $obj = $target;
                else $obj = $target.parent();
                deleteAnswerForQuestion($obj);
            }

            // кнопка сохранеия теста
            if($target.hasClass('add-new-test--save-btn') || $target.parent().hasClass('add-new-test--save-btn')){
                saveTest();
            }

        });

        globalVars.$workplace.bind('change', function(e){
            var $target = $(e.target);
            if($target.hasClass('add-new-test--questions-block--test-type-select')){
                changeQuestionType.apply(e.target);
            }

        });

        return {
            add:addTest
        };

    })();

    var testsResults = (function(){


        return{

        };
    })();

    var categories = (function(){
        function render(){
            if(globalVars.categoriesList === ''){
                helpers.getCategoriesList(this.render);
                return ;
            }
            helpers.clearWorklace();

            globalVars.$workplace.append($('#categories-list-base-template').html());


            var categoriesListItemTemplateFunction = _.template($('#categories-list-item-template').html()),
                categoriesListItemsHTML = '';

            globalVars.categoriesList.forEach(function(item){
                categoriesListItemsHTML += categoriesListItemTemplateFunction({'item':item});
            });
            $('#categories-list tbody').append(categoriesListItemsHTML);
            globalVars.$workplace.append($('#categories-list-modal-window-template').html());

            globalVars.$currentTaskToolbar.append("<li class='btn btn-warning categories-list-add' title='Добавить категорию'><i class='glyphicon glyphicon-plus'></i></li>");
        }

        globalVars.$workplace.bind('click', function(e){
            var $target = $(e.target);
            if($target.hasClass('categories-list-item-label')){

            }
        });

        return {
            'render':render
        };

    })();

    init();
});
</script>
