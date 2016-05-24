    $(function(){
	$('.work-space').html('')
	var counter1 = 0;
	    $('.add').on("click", function(){	//Создаем блок с новым тестом
		$('.work-space').html('<div class = "newTest">\n\
		    <p><input id = "testName" placeholder = "Название теста"></p>\n\
		    <p>Выбор категории теста<select name = "category" id = "qCat">\n\
		    <option value = "HTML">HTML</option>\n\
		    <option value = "CSS">CSS</option>\n\
		    <option value = "JS">JS</option>\n\
		    <option value = "JAVA">JAVA</option>\n\
		    <option value = "GENERAL">GENERAL</option>\n\
		    </select>\n\
		    <p><button class = "newQ">Новый вопрос</button></p>\n\
		    <p><select name = "qType" id = "qType">\n\
		    <option value = "radio">radio</option>\n\
		    <option value = "check">check</option>\n\
		    <option value = "input">input</option>\n\
		    <option value = "tArea">tArea</option>\n\
		    <option value = "image">image</option>\n\
		    </select>\n\
		    </p>\n\
		    <button id = "save">Сохранить</button>\n\
		    </div>\n\
	        ');
	    });
		var qCount = counter();
		
		$(document).on("click", ".newQ", function(){			//Создаем блок с новым вопросом
		    $('#qType').css('display','block');
		    counter1++;							//Счетчик для создания вопросов с уникальным ИД
		    var testName = $('#testName').val();			// При перерисовке work-space не сохраняется значение поля с названием теста
		    var questionName = testName + '-' + qCount();		//ИД вопроса, завязанный на названии теста и счетчике
		    var x = $('.work-space').html() +  "<div class=" + questionName +
		        "><div><input class = 'question' placeholder = 'Введите вопрос'></div><button class = 'newAns " + questionName +
		        "'>Новый вариант ответа</button>";
		    $('.work-space').html(x);
		    $('#testName').val(testName);				// Возвращаем название теста на законное место
		});	
			
		$(document).on("click", ".newAns", function(){
		    var Name = ($(this).parent().prop('className'));		// Для каждого набора радиокнопок будет одно имя, связанное с классом вопроса
		    var select = $("#qType :selected").val();
		    var x = $(this).parent().html();
		    switch(select){
			case 'radio':
			    x += "<p><input type = 'radio' name = " + Name + counter1 + "><input><button class = 'remove'>Удалить вариант ответа</button></p>";
			    break;
			case 'check':
			    x += "<p><input type = 'checkbox' name = " + Name + qCount() + "><input><button class = 'remove'>Удалить вариант ответа</button></p>";
			    break;
			case 'input':
                            if ($(this).next().html() === undefined) {
				x += "<p><input name = " + Name + qCount() + "><button class = 'remove'>Удалить вариант ответа</button></p>";
			    }
			    break;
			case 'tArea':
			    if ($(this).next().html() === undefined) {
				x += "<p><textarea name = " + Name + qCount() + "></textarea><button class = 'remove'>Удалить вариант ответа</button></p>";
			    }
			    break;
			case 'image':
			    x += "<p><input type='file' id='files' name='files[]' multiple />\n\
				<output id='list'></output><button class = 'remove'>Удалить вариант ответа</button></p>";
                            break;
			}
			$(this).parent().html(x);
		});
				
		$(document).on("click", ".remove", function(){
		    $(this).parent().remove();
		});   
        
		$(document).on('change', '#files', function(evt) {
		    var files = evt.target.files; // FileList object
			    // Loop through the FileList and render image files as thumbnails.
		    for (var i = 0, f; f = files[i]; i++) {
				// Only process image files.
			if (!f.type.match('image.*')) {
			    continue;
			}
			var reader = new FileReader();
				// Closure to capture the file information.
			reader.onload = (function(theFile) {
			    return function(e) {
				// Render thumbnail.
				var span = document.createElement('span');
				span.innerHTML = ['<img class="thumb" src="', e.target.result,
						    '" title="', theFile.name, '"/>'].join('');
				alert(this.className);
				document.getElementById('list').insertBefore(span, null);
			    };
			})(f);
				// Read in the image file as a data URL.
			reader.readAsDataURL(f);
		    }
		});
		
		
		
});
			var counter = function() {
			    var c = 1;
			    return function() {
				return c++;
			};
			};
