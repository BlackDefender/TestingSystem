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

            addBlock();

            // задаем стартовые время начала и окончания теста
            var startDate = moment().add(1, 'days'),
                endDate = moment().add(1, 'days').add(1, 'months');

            $('#add-new-test--start-date-dd').val(startDate.date());
            $('#add-new-test--start-date-mm').val(startDate.month()+1);
            $('#add-new-test--start-date-yyyy').val(startDate.year());

            $('#add-new-test--end-date-dd').val(endDate.date());
            $('#add-new-test--end-date-mm').val(endDate.month()+1);
            $('#add-new-test--end-date-yyyy').val(endDate.year());

            $('#add-new-test--test-name').focus();
        }

        function addBlock(){
            globalVars.$workplace.append($('#add-test-block-template').html());
            addQuestion();
            $('.add-new-test--questions-block-wrap:last .add-new-test--questions-block-name').focus();
        }
        function deleteBlock(){
            $(this).parents('.add-new-test--questions-block-wrap').remove();
        }
        function addQuestion(){
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

        function deleteQuestion($obj){
            $obj.parents('.add-new-test--questions-block--question-wrap').remove();
        }

        function addAnswer(){
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
                    output += '<div class="add-new-test--questions-block--question-answer-img" title="Добавить изображение"></div>';
                    break;
                case 'checkbox':
                    output += '<input type="checkbox" name="answer_'+counterIndex+'"> <input class="form-control" placeholder="Ответ" type="text">';
                    output += '<div class="add-new-test--questions-block--question-answer-img" title="Добавить изображение"></div>';
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

        function deleteAnswer($obj){
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
            // проверка имени теста
            var testName = $('#add-new-test--test-name').val();
            if(testName === ''){
                helpers.alert('Ошибка', 'Вы забыли указать название теста.');
                return ;
            }

            // получаем категорию теста
            var testCategoryId = $('#test-category-selector').val();

            // проверка дат
            var startDate_d = $('#add-new-test--start-date-dd').val(),
                startDate_m = $('#add-new-test--start-date-mm').val(),
                startDate_y = $('#add-new-test--start-date-yyyy').val(),
                endDate_d = $('#add-new-test--end-date-dd').val(),
                endDate_m = $('#add-new-test--end-date-mm').val(),
                endDate_y = $('#add-new-test--end-date-yyyy').val(),
                startDate,
                endDate,
                now = moment();
            startDate = moment(startDate_d+'-'+startDate_m+'-'+startDate_y, 'DD-MM-YYYY');
            endDate = moment(endDate_d+'-'+endDate_m+'-'+endDate_y, 'DD-MM-YYYY');
            if(!startDate.isValid()){
                helpers.alert('Ошибка', 'Не корректная дата начала теста.');
                return ;
            }
            if(!startDate.isSameOrAfter(now, 'day')){
                helpers.alert('Ошибка', 'Тест не может ничинаться в прошлом.');
                return ;
            }
            if(!endDate.isValid()){
                helpers.alert('Ошибка', 'Не корректная дата окончания теста.');
                return ;
            }
            if(!endDate.isSameOrAfter(now, 'day')){
                helpers.alert('Ошибка', 'Тест не может заканчиваться в прошлом.');
                return ;
            }
            if(endDate.isBefore(startDate, 'day')){
                helpers.alert('Ошибка', 'Дата окончания теста не может быть раньше даты его начала.<br>Разумеется если Вы не Янус Полуэктович Невструев.');
                return ;
            }

            //получаем приватность теста
            var isPrivate = $('#add-new-test--is-private').is(':checked');

            // сканируем блоки вопросов со всеми потрахами
            var blocks = [];
            var dataValidationError = false;
            var $testBlocksCollection = globalVars.$workplace.find('.add-new-test--questions-block-wrap');
            if($testBlocksCollection.length === 0){
                helpers.alert('Ошибка проверки теста', 'И шо прям совсем, совсем пустой тест?! Мы так не договаривались!');
                return;
            }
            $testBlocksCollection.each(function(){
                var $block = $(this);
                var currentBlock = {};
                var blockName = $block.find('.add-new-test--questions-block-name').val();
                currentBlock['name'] = blockName;
                currentBlock['questions'] = [];

                var $questions = $block.find('.add-new-test--questions-block--question-wrap');
                if($questions.length === 0){
                    dataValidationError = true;
                    helpers.alert('Ошибка проверки теста', 'Вы серьезно хотите оставить блок пустым?! Так не пойдет!');
                    return false;
                }
                $questions.each(function(){
                    var $question = $(this);
                    var questionName = $question.find('.add-new-test--questions-block--question-name').val(),
                        questionImg = $question.find('.add-new-test--questions-block--question-img').attr('data-url'),
                        questionType = $question.find('.add-new-test--questions-block--test-type-select').val();

                    if(questionName === '' && questionImg === ''){
                        dataValidationError = true;
                        helpers.alert('Ошибка проверки теста', 'Один из вопросов был оставлен пустым.');
                        return false;
                    }

                    var currentQuestion = {};
                    currentQuestion['name'] = questionName;
                    currentQuestion['img'] = questionImg;
                    currentQuestion['type'] = questionType;
                    currentQuestion['answers'] = [];

                    var $answers = $question.find('.add-new-test--questions-block--question-answer');
                    if($answers.length === 0){
                        dataValidationError = true;
                        helpers.alert('Ошибка проверки теста', 'А где, я Вас спрашиваю, варианты ответов?!');
                        return false;
                    }
                    $answers.each(function(){
                        var answerName = $(this).find('input[type="text"]').val(),
                            answerIsTrue = false,
                            answerImg = $(this).find('.add-new-test--questions-block--question-answer-img').attr('data-url');
                        if(answerName === '' && answerImg === ''){
                            dataValidationError = true;
                            helpers.alert('Ошибка проверки теста', 'Один из ответов был оставлен пустым.');
                            return false;
                        }
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
                    if(dataValidationError) return false;
                    var selectedAnswerExists = false;
                    currentQuestion['answers'].forEach(function(ans){
                        if(ans['is_true']) selectedAnswerExists = true;
                    });
                    if(!selectedAnswerExists){
                        dataValidationError = true;
                        helpers.alert('Ошибка проверки теста', 'В одном из вопросов не был выбран ни один из вариантов ответов.');
                        return false;
                    }
                    currentBlock['questions'].push(currentQuestion);
                });
                if(dataValidationError) return false;
                blocks.push(currentBlock);
            });
            if(dataValidationError) return;

            var testObject = {};
            testObject['category_id'] = testCategoryId;
            testObject['test_name'] = testName;
            testObject['start_date'] = startDate.format('X');
            testObject['end_date'] = endDate.format('X');
            testObject['is_private'] = isPrivate;
            testObject['blocks'] = blocks;

            $.post(globalVars.baseUrl+'tests/add',{'test_JSON': JSON.stringify(testObject)})
                    .done(function(data){
                        if(data == 1){
                            helpers.alert(' ', 'Тест был добавлен');
                            tests.get();
                        }
                        else{
                            if(data === 'JSON_PARSE_ERROR'){
                                helpers.alert('Ошибка', 'Проблема со входними данными для теста.<br>Проверьте ввели ли Вы все правильно.');
                                return;
                            }
                            if(data === 'DB_ERROR'){
                                helpers.alert('Ошибка', 'Не удалось занести тест в базу данных.');
                                return;
                            }
                        }

                    })
                    .fail(function(){
                        helpers.alert('Ошибка', 'Не удалось создать тест.');
                    });
        }

        // обработчик нажатия в рабочей области
        // идентифицируем событие и делаем что надо
        // сюда можно добавлять обработку любых событий, происходящих на бескрайних просторах .work-space
        globalVars.$workplace.bind('click', function(e){
            var $target = $(e.target);

            // добавить блок вопросов
            if($target.hasClass('add-new-test--add-block') || $target.parent().hasClass('add-new-test--add-block')){
                addBlock();
            }

            // добавить вопрос
            if($target.hasClass('add-new-test--add-question') || $target.parent().hasClass('add-new-test--add-question')){
                addQuestion.apply(e.target);
            }

            // добавить ответ на вопрос
            if($target.hasClass('add-new-test--questions-block--question-add-answer') || $target.parent().hasClass('add-new-test--questions-block--question-add-answer')){
                addAnswer.apply(e.target);
            }

            // удалить блок вопросов
            if($target.hasClass('add-new-test--questions-block-menu-delete')){
                deleteBlock.apply(e.target);
            }

            // удалить вопрос
            if($target.hasClass('add-new-test--questions-block--question-delete') || $target.parent().hasClass('add-new-test--questions-block--question-delete')){
                var $obj;
                if($target.hasClass('add-new-test--questions-block--question-delete'))
                    $obj = $target;
                else $obj = $target.parent();
                deleteQuestion($obj);
            }

            // удалить ответ на вопрос
            if($target.hasClass('add-new-test--questions-block--question-answer-delete') || $target.parent().hasClass('add-new-test--questions-block--question-answer-delete')){
                var $obj;
                if($target.hasClass('add-new-test--questions-block--question-answer-delete'))
                    $obj = $target;
                else $obj = $target.parent();
                deleteAnswer($obj);
            }


            if($target.hasClass('add-new-test--questions-block--question-img') || $target.hasClass('add-new-test--questions-block--question-answer-img')){
                gallery.init($target);
            }

            // кнопка сохранеия теста
            if($target.hasClass('add-new-test--save-btn') || $target.parent().hasClass('add-new-test--save-btn')){
                saveTest();
            }

        });

        /*globalVars.$workplace.bind('contextmenu', function(e){
            var $target = $(e.target);
            if($target.hasClass('add-new-test--questions-block--question-img') || $target.hasClass('add-new-test--questions-block--question-answer-img')){
                console.log(e);
                e.preventDefault();
                var menu = $('<div>Delete</div>');

                console.log(menu);
                $('body').append(menu);
                menu.css({'position':'fixed', 'top':e.clientY, 'left':e.clientX, 'z-index':10000});
            }
        });*/
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