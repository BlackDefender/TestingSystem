jQuery(function($){

    var baseUrl = 'http://synergy.od.ua/site/';
    var $workplace = $('#workplace');
    var categoriesList, testsList;


//////// НАЧАЛЬНАЯ СТРАНИЦА
    function getTestsList(){
        $.get(baseUrl+'get-categories', function(data){
            categoriesList = JSON.parse(data);
            $.get(baseUrl+'get-tests-list', function(data){
                testsList = JSON.parse(data);
                _renderTestsList();
            });
        });
    }
    function _renderTestsList(){
        var table = '<table class="table table-bordered table-hover img-rounded"><thead><tr class="bg-info text-muted"><th class="col-xs-8">Название</th><th class="col-xs-2">Дата начала</th><th class="col-xs-2">Дата окончания</th></tr></thead><tbody></tbody></table>';
        // отрисовываем сиписок категорий
        categoriesList.forEach(function(item){
            $workplace.append('<section class="category-container" data-category-id="'+item['id']+'"><h2>'+item['name']+'</h2>'+table+'</section>');
        });
        //распихиваем тесты по категориям
        testsList.forEach(function(item){
            $('.category-container[data-category-id='+item['category_id']+'] table tbody').append('<tr data-test-id="'+item['id']+'"><td><a href="/?test-id='+item['id']+'" class="link-to-the-test">'+item['name']+'</a></td><td>'+item['start_date_formatted']+'</td><td>'+item['end_date_formatted']+'</td></tr>')
        });

        // цепляем событие нажатия ссылки
        $('.link-to-the-test').bind('click', function(){
            var testId = $(this).parent().parent().attr('data-test-id');
            getTest(testId);
            window.history.pushState(null, null, this.href);
            return false;
        });
    }



//////////// СТРАНИЦА ТЕСТА
    function getTest(testId){
        $.get(baseUrl+'get-test', {'id':testId}, function(data){
            var test = JSON.parse(data);
            clearWorkplace();
            $workplace.append('<form id="test" data-test-id="'+testId+'">\n\
                <h1>'+ test['name'] +'</h1> \n\
                <fieldset> \n\
                    <legend>Регистрационные данные</legend>\n\
                    <div class="form-group question user-data" data-input-name="firstName"> <label for="firstName">Имя</label> <input id="firstName" name="firstName" type="text" class="form-control"> </div>\n\
                    <div class="form-group question user-data" data-input-name="lastName"> <label for="lastName">Фамилия</label> <input id="lastName" name="lastName" type="text" class="form-control"> </div>\n\
                    <div class="form-group question user-data" data-input-name="tel"> <label for="tel">Телефон</label> <input id="tel" name="tel" type="text" class="form-control"> </div>\n\
                    <div class="form-group question user-data" data-input-name="email"> <label for="email">E-mail</label> <input id="email" name="email" type="text" class="form-control"> </div>\n\
                </fieldset></form>');

            test['blocks'].forEach(function(block){
                var blockHTML = '<fieldset style="display:none;">';
                if(block['name'] !== "") blockHTML += '<legend>'+block['name']+'</legend>';

                block['questions'].forEach(function(question){
                    var questionHTML = '<div class="question" data-input-name="question_'+question['id']+'" data-question-type="'+question['type']+'" data-question-id="'+question['id']+'">';
                    if(question['name'] !== '') questionHTML += '<h4>'+question['name']+'</h4>';
                    if(question['img'] !== '') questionHTML += '<img class="test-question-image" src="'+question['img']+'">';
                    if(question['type'] === 'text'){
                        questionHTML += '<label><input type="text" name="question_'+question['id']+'"></label>';
                    }
                    else{
                        question['answers'].forEach(function(answer){
                            var answerHTML = '<label>';
                            answerHTML += '<input type="'+question['type']+'" name="question_'+question['id']+'" data-answer-id="'+answer['id']+'">';
                            if(answer['name'] !== '' && question['type'] !== 'text') answerHTML += answer['name'];
                            if(answer['img'] !== '') answerHTML += '<img class="test-answer-image" src="'+answer['img']+'">';
                            answerHTML += '</label>';
                            questionHTML += answerHTML;
                        });
                    }
                    questionHTML += '</div>';
                    blockHTML += questionHTML;
                });

                blockHTML += '</fieldset>';
                $('#test').append(blockHTML);
            });


            $('#test').append('<button type="button" class="btn btn-primary" id="test-next-block-btn">Далее &gt;&gt;</button>');

            var $blocksCollection = $('#test fieldset');
            $blocksCollection.iterator = 0;
            // нажатие на кнопку ДАЛЕЕ при прохождении теста
            $('#test-next-block-btn').bind('click',function(){
                var goBack = false;
                var $questions = $blocksCollection.eq($blocksCollection.iterator).find('.question');
                $questions.each(function(){
                    var $ans = $(this).find('input[name="'+$(this).attr('data-input-name')+'"]');
                    switch ($ans.attr("type")) {
                        case 'text':
                            if($ans.val() === ''){
                                goBack = true;
                                $(this).addClass('invalid');
                                $ans.focus();
                                return false;
                            }
                            break;
                        case 'radio':
                            if($ans.filter(':checked').length === 0){
                                goBack = true;
                                $(this).addClass('invalid');
                                return false;
                            }
                            break;
                        case 'checkbox':
                            if($ans.filter(':checked').length === 0){
                                goBack = true;
                                $(this).addClass('invalid');
                                return false;
                            }
                            break;
                        default:
                            break;
                    }
                });
                if(goBack) return ;

                if($blocksCollection.iterator === $blocksCollection.length - 1){
                    sendResult();
                }
                $blocksCollection.eq($blocksCollection.iterator).toggle();
                ++$blocksCollection.iterator;
                $blocksCollection.eq($blocksCollection.iterator).toggle();
                if($blocksCollection.iterator === $blocksCollection.length - 1){
                    $('#test-next-block-btn').html('Готово!');
                }
            });
        });
    }

    // отправка результатов прохождения теста
    function sendResult(){
        var test_result = {};
        test_result['test_id'] = $('#test').attr('data-test-id');
        test_result['first_name'] = $('#firstName').val();
        test_result['last_name'] = $('#lastName').val();
        test_result['tel'] = $('#tel').val();
        test_result['email'] = $('#email').val();

        var responses = [];
        $('#test .question:not(.user-data)').each(function(){
            switch ($(this).attr('data-question-type')){
                case 'radio':
                    var answer_id = $(this).find('input:checked').attr('data-answer-id');
                    responses.push({'question_id':$(this).attr('data-question-id'),'question_type':$(this).attr('data-question-type'),'result':answer_id});
                    break;
                case 'checkbox':
                    var answer_ids = [];
                    $(this).find('input:checked').each(function(){
                        answer_ids.push($(this).attr('data-answer-id'));
                    });
                    responses.push({'question_id':$(this).attr('data-question-id'),'question_type':$(this).attr('data-question-type'),'result':answer_ids});
                    break;
                case 'text':
                    var value = $(this).find('input[type="text"]').val();
                    responses.push({'question_id':$(this).attr('data-question-id'),'question_type':$(this).attr('data-question-type'),'result':value});
                    break;
            }
        });
        test_result['responses'] = responses;
        var test_result_json = JSON.stringify(test_result);

        console.log(test_result);
        $.post(baseUrl+'add-test-result', {'test_result_JSON':test_result_json}, function(data){
            console.log(data);
        });
    }


    function clearWorkplace(){
        $workplace.contents().remove();
    }

    function init(){
        var place = window.location.search;
        if(place === "") getTestsList();
        var keyStr = 'test-id=';
        if(place.indexOf(keyStr)>0){
            var testId = place.substr(place.indexOf(keyStr)+keyStr.length);
            getTest(testId);
        }
    }

    init();

});
