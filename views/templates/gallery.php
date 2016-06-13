<div id="gallery-upload-dialog" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Загрузка файлов на сервер</h4>
            </div>
            <div class="modal-body">
                <div class="modal-body-message">
                    Выберите файлы для загрузки:
                </div>
                <input type="file" class="form-control" multiple id="gallery-upload-input" accept="image/jpeg,image/png,image/gif" />
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">Отмена</button>
                <button type="button" class="btn btn-success" id="gallery-upload-submit-btn" data-dismiss="modal">Загрузить</button>
            </div>
        </div>
    </div>
</div>

<div id="gallery" class="modal fade" role="dialog">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-body clearfix">
                <div id="gallery-toolbar" class="well well-sm">
                    <div class="clearfix">
                        <button class="btn gallery-go-back"><i class="fa fa-arrow-left"></i></button>
                        <div class="gallery-adress-string-wrap">
                            <input type="text" class="form-control gallery-adress-string" readonly>
                        </div>
                    </div>
                    <div id="gallery-toolbar-nav">
                        <button class="btn btn-info gallery-create-folder"><i class="fa fa-folder-open gallery-create-folder"></i></button>
                        <!--<button class="btn btn-info "><i class="fa fa-download"></i></button>-->
                        <button class="btn btn-info gallery-upload"><i class="fa fa-upload gallery-upload"></i></button>
                        <button class="btn btn-info gallery-delete"><i class="fa fa-trash gallery-delete"></i></button>
                    </div>
                </div>
                <section id="gallery-workplace-wrap">
                    <ul id="gallery-workplace"></ul>
                    <div id="gallery-details">
                        <div class="thumb"></div>
                        <div class="buttons-holder">
                            <button class="btn btn-warning" data-dismiss="modal">Закрыть</button>
                            <button class="btn btn-success" data-dismiss="modal" id="gallery-add-image">Добавить</button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>