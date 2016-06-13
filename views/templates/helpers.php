<!------------------------------------------- ВСПЛЫВАЮЩИЕ ОКНА ОБЪЕКТА HELPERS ------------------------------------------>

<div id="helpers-alert" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">ОК</button>
            </div>
        </div>
    </div>
</div>


<div id="helpers-prompt" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body">
                <div class="modal-body-message"></div>
                <input type="text" class="form-control" id="helpers-prompt-input" placeholder="">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" data-dismiss="modal">Отмена</button>
                <button type="button" class="btn btn-success" id="helpers-prompt-ok-btn" data-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

<div id="helpers-confirm" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title"></h4>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" id="helpers-confirm-cancel-btn" data-dismiss="modal">Отмена</button>
                <button type="button" class="btn btn-default" id="helpers-confirm-ok-btn" data-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>
<!-------------------------------------------------------------------------------------------------------------->