var wrapperTpl = '<div id="ProjectPageModule" class="project_page_module">' +
        '<ul class="ul_tab tap" data-action="updateType">' +
            '<li class="active" data-status="1"><a href="javascript:void(0);">融资中</a></li>' +
            '<li data-status="2"><a href="javascript:void(0);">还款中</a></li>' +
            '<li data-status="3"><a href="javascript:void(0);">还款完成</a></li>' +
        '</ul>' +
        '<ul id="dataWrapper"></ul>' +
        // '<div class="ui_loading"><span class="img"></span>加载中</div>' +
    '</div>';
module.exports = wrapperTpl;