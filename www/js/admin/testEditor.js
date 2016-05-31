jQuery(function($){
    var testEditor = (function(){
        //Создаем новый тест
        function addTest(){
            globalVars.currentController = 'testEditor';
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
    window.testEditor = testEditor;
});