jQuery(function($){
    var gallery = (function(){
        var $thisWorkplace = $('#gallery-workplace');
        var $details = $('#gallery-details');
        var $detailsThumbnail = $('#gallery-details .thumb');
        var $toolbar = $('#gallery-toolbar');
        var currentPath = '';
        var selectedImageUrl = '';
        var $targetElement;

        function init($target){
            $detailsThumbnail.css('background-image','');
            selectedImageUrl = '';
            dir();
            $('#gallery').modal();
            $targetElement = $target;
        }

        function dir(){
            $.get(globalVars.baseUrl+'gallery/dir',{'dir':currentPath}, function (data){
                var list = JSON.parse(data);
                $thisWorkplace.empty();
                list.forEach(function(item){
                    $thisWorkplace.append(' <li class="gallery-workplace-item" data-type="'+item['type']+'" data-url="'+item['thumbnail']+'" data-path="'+item['name']+'">\n\
                                            <input type="checkbox">\n\
                                            <div class="thumb" style="background-image:url('+item['thumbnail']+');"></div>\n\
                                            <div class="file-name">'+item['name']+'</div>\n\
                                        </li>');
                });
            });
            $('.gallery-adress-string').val( (currentPath === '') ? '/' : currentPath );
        }

        function goBack(){
            console.log('currentPath before', currentPath);
            currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            console.log('currentPath after', currentPath);
            dir();
        }

        function createFolder(){
            var folderName = prompt('Введите имя папки:');
            if(folderName === null || folderName === '') return;
            folderName = currentPath+'/'+folderName;
            console.log(folderName);

            $.get(globalVars.baseUrl+'gallery/create-folder',{'folder_name':folderName},function(data){
                if(data === 'FOLDER_WAS_CREATED') dir();
            });
        }

        function deleteFiles(){
            var filesList = [];
            $thisWorkplace.find('li input[type="checkbox"]:checked').each(function(){
                filesList.push($(this).parents('li').attr('data-path'));
            });
            console.log(filesList);
            if(filesList.length === 0) return ;
            helpers.confirm(' ', 'Уверены что хотите удалить файл(ы)?', _delete, filesList);
        }
        function _delete(filesList){
            $.get(globalVars.baseUrl+'gallery/delete',{'files_list':JSON.stringify(filesList)},function(data){
                console.log(data);
                dir();
            });
        }

        function upload(){
            var files = document.getElementById('gallery-upload-input').files;
            var data = new FormData();
            for(var i=0; i< files.length; ++i){
                data.append(i, files[i]);
            }
            $.ajax({
                url: globalVars.baseUrl+'gallery/upload',
                type: 'POST',
                data: data,
                processData: false,
                contentType: false,
                success: function( respond ){
                    dir();
                    $('#gallery-upload-input').val('');
                },
                error: function( jqXHR, textStatus, errorThrown ){
                    console.log('ОШИБКИ AJAX запроса: ' + textStatus );
                }
            });
        }

        $thisWorkplace.selectable({
            selected: function( event, ui ) {
                if($(ui.selected).attr('data-type') === 'dir'){
                    currentPath += '/'+$(ui.selected).attr('data-path');
                    console.log(currentPath);
                    dir(currentPath);
                    $detailsThumbnail.css('background-image','');
                }
                else{
                    $detailsThumbnail.css('background-image',$(ui.selected).find('.thumb').css('background-image'));
                    selectedImageUrl = $(ui.selected).attr('data-url');
                }
            }
        });

        // привязка обработчиков на кнопки тулбара
        $toolbar.bind('click', function(e){
            var $target = $(e.target);
            if($target.hasClass('gallery-upload')){
                $('#gallery-upload-dialog').modal();
            }
            if($target.hasClass('gallery-go-back')){
                goBack();
            }
            if($target.hasClass('gallery-create-folder')){
                createFolder();
            }
            if($target.hasClass('gallery-delete')){
                deleteFiles();
            }
        });

        // кнопка "загрузить" во всплывающем окне
        $('#gallery-upload-submit-btn').bind('click', upload);

        $('#gallery-add-image').bind('click',function(){
            if(selectedImageUrl === '') return ;
            $targetElement.attr('data-url', selectedImageUrl);
            $targetElement.css('background-image', 'url('+selectedImageUrl+')');
        });


        return {
            'init':init
        };


    })();

    window.gallery = gallery;
});