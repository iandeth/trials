App = function (arg){
	if(arg == undefined){ arg = {} }
	this.tabs          = arg.tab_ui;
	this.current_shop  = undefined;
	this.search_type   = undefined;
	this.search_cache  = {}; // for ajax caching
	this.search_recent = {}; // for selecting shop from search result
	this.affi_id       = undefined;
	this.isp_id        = arg.isp_id || undefined;
	this.dc            = arg.dc || undefined;
	this.actioncode    = arg.actioncode || undefined;
	this.provider_affi_id = arg.provider_affi_id || undefined;
	this.vos           = arg.vos || undefined;

	// reset affi_id
	var cm = new CookieManager();
	this.affi_id = cm.getCookie('affi_id');
	if(this.affi_id && this.affi_id != 'no-use'){
		$('affi_id').value = this.affi_id;
	}
};

App.prototype.search =
function (type, start){
	$('search-result').innerHTML =
		'<img src="image/ajax_load_gray.gif" \/> 検索中...';
	this.search_type = type;
	this.search_recent = {};

	var res;
	if(!start){ // if new search query
		this.search_cache = {};
		this._ajaxSearch( type );
		return;
	}else{
		res = this.search_cache[ start ]; // check cache
		if(!res){
			this._ajaxSearch( type, start );
			return;
		}else{
			this.search_recent = res;
			this._updateSearchResult( res );
		}
	}
}

App.prototype._ajaxSearch =
function (type, start){
	var myPostBody = Form.serialize($('search_' + type));
	if(this.vos != undefined){
		myPostBody += '&vos=' + this.vos;
	}
	if(start){
		myPostBody += '&Start=' + start;
	}
	var _instance = this;
	new Ajax.Request(
		'cgi/search.cgi',
		{
			method: 'post',
			postBody: myPostBody,
			onComplete: function (req){
				var r = eval('(' + req.responseText + ')');
				if(r.error){
					$('search-result').innerHTML =
						'<p style="color:#880000">' + r.error
						+ '</p>';
				}else{
					_instance.search_cache[ r.pager.disp_from ] = r;
					_instance.search_recent = r;
					_instance._updateSearchResult( r );
				}
			}
		}
	);
}

App.prototype._updateSearchResult =
function ( r ){
	var html = '';
	html += '<h4 style="margin-bottom:0"><strong style="font-size:1.2em">' + r.pager.total_items
		+ '</strong> 件見つかりました</h4>';
	html += this._makePager( r.pager );
	html += this._makeSearchResultHtml( r.data.Shop );
	html += this._makePager( r.pager, 1 );
	html += '<p style="margin-left:0;font-size:0.6em">※写真提供：ホットペッパー.jp</p>';
	$('search-result').innerHTML = html;
}

App.prototype._makePager =
function ( pgr, move_to_top ){
	var html = '';
	html += '<p style="text-align:right;font-size:0.8em;'
		+ 'margin-right:0px;margin-top:10px">';
	html += '<strong style="font-size:1.2em">' + pgr.disp_page_num
		+ '</strong> / ' + pgr.total_pages + ' ページ　';
	if(pgr.back){
		html += '<a href="javascript:void(0)" onclick="myApp.search(\'' + this.search_type + '\',' + pgr.back + ')';
		if(move_to_top){
			html += ';window.location=\'#tab-ui\'';
		}
		html += '">≪前へ</a> ｜ ';
	}else{
		html += '<span style="color:#666">≪前へ ｜ </span>';
	}
	if(pgr.next){
		html += '<a href="javascript:void(0)" onclick="myApp.search(\'' + this.search_type + '\',' + pgr.next + ')';

		if(move_to_top){
			html += ';window.location=\'#tab-ui\'';
		}
		html += '">次へ≫</a>';
	}else{
		html += '<span style="color:#666">次へ≫</span>';
	}
	html += '</p>';
	return html;
}

App.prototype._makeSearchResultHtml =
function ( list ){
	var html = '';
	html += '<table id="result-table"'
		+ ' cellspacing="0" cellpadding="0"'
		+ ' style="margin-top:20px;margin-bottom:20px;'
		+ 'width:100%">';
	for (var i=0; i<list.length; i++){
		var obj = list[ i ];
		html += '<tr>';
		html += '<td class="left"><img src="' + obj.PictureUrl.PcSmallImg + '"></td>';
		html += '<td class="right"><span class="title">' + obj.ShopName + '</span>';
		html += '<span>' + obj.GenreCatch + ' / ' + obj.LargeAreaName + ' / ' + obj.MiddleAreaName + ' / ' + obj.KtaiAccess + '　' + '<a href="' + obj.ShopUrl + '" target="_blank">詳細はこちら</a>' + '</span>';
		html += '<span style="text-align:right"><input type="button" onclick="myApp.tabActionOnAffiliSelect(\'' + obj.ShopIdFront + '\')" style="font-size:0.8em" value="このお店を選択して次へ"/></span></td>';
		html += '</tr>';
		html += '<tr><td style="height:10px"></td><td></td></tr>';
	}
	html += '</table>';
	return html;
}

App.prototype.tabActionOnAffiliSelect =
function (shop_id){
	for (var i=0; i<this.search_recent.data.Shop.length; i++){
		var shop = this.search_recent.data.Shop[i];
		if( shop.ShopIdFront == shop_id ){
			this.current_shop = shop;
			break;
		}
	}

	window.location = '#tab-ui';
	if(this.affi_id){
//	if(this.affi_id && this.affi_id != 'no-use'){
		this.setCreativePattern();
		this.tabs.set('activeIndex',2);
	}else{
		this.tabs.set('activeIndex',1);
	}
}

App.prototype.tabActionOnAffiliIdSet =
function (id){
	this.affi_id = id || 'no-use';
	var cm = new CookieManager();
	cm.setCookie( 'affi_id', this.affi_id );

	if(this.affi_id == 'no-use'){
		$('affi_id').value = '';
	}

	this.setCreativePattern();

	window.location = '#tab-ui';
	this.tabs.set('activeIndex',2);
}

App.prototype.setCreativePattern =
function (){
	if( this.current_shop == undefined ){ return }
	if( this.affi_id == undefined ){ return }
	var type = this._getRadioSelectedValue('pattern-form','pattern-id');
	var obj = this._makeCreativeHtml( type );
	$('html-preview').innerHTML = obj.preview;
	$('html-textarea').value    = obj.textarea;
}

App.prototype._getRadioSelectedValue =
function (form_id, name){
	var elems = Form.getInputs(form_id, undefined, name);
	for(var i=0; i<elems.length; i++){
		var e = elems[i];
		if( e.checked ){ return e.value }
	}
}

/*
AND HERE COMES THE MESSY PART
*/
App.prototype._makeCreativeHtml =
function (type){
	var shop = this.current_shop;

	var real_id = (this.affi_id == 'no-use')? this.provider_affi_id
		: this.affi_id;

	var q = 'key=' + real_id + '&isp_id=' + this.isp_id 
		+ '&dc=' + this.dc;
	if( this.actioncode != undefined ){
		q += '&actioncode=' + this.actioncode;
	}
	q += '&TargetURL=' + Base64.encode( shop.ShopUrl );

	var url = 'http://affiliate.recruit.jp/system/servlet/ispkiwi.Op?'
		+ q;

	var log_img_html = '<span style="display:none"><img src="http://affiliate.recruit.jp/system/servlet/ispkiwi.Img?' + q + '" width="1" height="1"/></span>'

	var my_vos = shop.ShopUrl.match(/vos=[^&]+/);

	var html = '';
	var html_preview = '';
	var dummy_text = 'これはダミー文章です。あなたのブログ記事のテキストです。これはダミー文章です。あなたのブログ記事のテキストです。これはダミー文章です。あなたのブログ記事のテキストです。これはダミー文章です。あなたのブログ記事のテキストです。';

	if(type == 'text-name')
	{
		html += '<span class="recruit-affi-hotpepper"><a href="' + url + '" target="_blank">' + shop.ShopName + '</a></span>';
		html_preview = html;
	}
	else if(type == 'text-genre-name')
	{
		html += '<span class="recruit-affi-hotpepper"><a href="' + url + '" target="_blank">[' + shop.GenreCatch + '] ' + shop.ShopName + '</a></span>';
		html_preview = html;
	}

	else if(type == 'image-left')
	{
		html += '<span class="recruit-affi-hotpepper" style="display:block;float:left;margin:0 10px 5px 0">';

		html += '<span class="recruit-affi-hotpepper-photo" style="display:block"><a href="' + url + '" target="_blank">' + '<img src="' + shop.PictureUrl.PcMiddleImg + '" border="0"/>' + '</a></span>';
		html += '<span class="recruit-affi-hotpepper-by" style="display:block;font-size:10px">写真提供:<a href="http://www.hotpepper.jp/?' + my_vos + '" target="_blank">ホットペッパー.jp</a></span>';

		html += '</span>';
		var dummy = '<p style="color:#999;padding:0;margin:0">' + dummy_text + dummy_text + '</p>';
		html_preview = html + dummy;
	}
	else if(type == 'image-right')
	{
		html += '<span class="recruit-affi-hotpepper" style="display:block;float:right;margin:0 0px 5px 10px">';

		html += '<span class="recruit-affi-hotpepper-photo" style="display:block"><a href="' + url + '" target="_blank">' + '<img src="' + shop.PictureUrl.PcMiddleImg + '" border="0"/>' + '</a></span>';
		html += '<span class="recruit-affi-hotpepper-by" style="display:block;font-size:10px;text-align:right">写真提供:<a href="http://www.hotpepper.jp/?' + my_vos + '" target="_blank">ホットペッパー.jp</a></span>';

		html += '</span>';
		var dummy = '<p style="color:#999;padding:0;margin:0">' + dummy_text + dummy_text + '</p>';
		html_preview = html + dummy;
	}
	else if(type == 'image-center')
	{
		html += '<span class="recruit-affi-hotpepper" style="display:block;margin:10px 0;text-align:center">';

		html += '<span class="recruit-affi-hotpepper-photo" style="display:block"><a href="' + url + '" target="_blank">' + '<img src="' + shop.PictureUrl.PcMiddleImg + '" border="0"/>' + '</a></span>';
		html += '<span class="recruit-affi-hotpepper-by" style="display:block;font-size:10px">写真提供:<a href="http://www.hotpepper.jp/?' + my_vos + '" target="_blank">ホットペッパー.jp</a></span>';

		html += '</span>';
		var dummy = '<p style="color:#999;padding:0;margin:0">' + dummy_text + '</p>';
		html_preview = dummy + html + dummy;
	}
	else if(type == 'combo-a')
	{
		html += '<span class="recruit-affi-hotpepper" style="display:block;margin:10px 0">';

		html += '<span style="display:block;float:left;margin-right:10px">';
		html += '<span class="recruit-affi-hotpepper-photo" style="display:block"><a href="' + url + '" target="_blank">' + '<img src="' + shop.PictureUrl.PcMiddleImg + '" border="0"/>' + '</a></span>';
		html += '<span class="recruit-affi-hotpepper-by" style="display:block;font-size:10px">写真提供:<a href="http://www.hotpepper.jp/?' + my_vos + '" target="_blank">ホットペッパー.jp</a></span>';
		html += '</span>';

		html += '<span style="display:block">';
		html += '<span style="display:block;font-size:0.9em">' + shop.GenreCatch + '</span>';
		html += '<span style="display:block"><a href="' + url + '" target="_blank">' + shop.ShopName + '</a></span>';
		html += '</span>';

		html += '<span style="display:block;clear:both"></span>';
		html += '</span>';
		var dummy = '<p style="color:#999;padding:0;margin:0">' + dummy_text + '</p>';
		html_preview = dummy + html + dummy;
	}
	else if(type == 'combo-b')
	{
		html += '<span class="recruit-affi-hotpepper" style="display:block;margin:10px 0">';

		html += '<span style="display:block;float:left;margin-right:10px">';
		html += '<span class="recruit-affi-hotpepper-photo" style="display:block"><a href="' + url + '" target="_blank">' + '<img src="' + shop.PictureUrl.PcMiddleImg + '" border="0"/>' + '</a></span>';
		html += '<span class="recruit-affi-hotpepper-by" style="display:block;font-size:10px">写真提供:<a href="http://www.hotpepper.jp/?' + my_vos + '" target="_blank">ホットペッパー.jp</a></span>';
		html += '</span>';

		html += '<span style="display:block">';
		html += '<span style="display:block;font-size:0.9em">' + shop.GenreCatch + '</span>';
		html += '<span style="display:block"><a href="' + url + '" target="_blank">' + shop.ShopName + '</a></span>';
		html += '<span style="display:block;margin-top:10px;font-size:0.9em">予算' + shop.BudgetAverage + ' - ' + shop.Capacity + '席 - ' + shop.Access + '</span>';
		html += '</span>';

		html += '<span style="display:block;clear:both"></span>';
		html += '</span>';
		var dummy = '<p style="color:#999;padding:0;margin:0">' + dummy_text + '</p>';
		html_preview = dummy + html + dummy;
	}
	else if(type == 'combo-c')
	{
		html += '<span class="recruit-affi-hotpepper" style="display:block;margin:10px 0;padding:10px;border:1px solid #000;margin-bottom:10px">';

		html += '<span style="display:block;float:left;margin-right:10px">';
		html += '<span class="recruit-affi-hotpepper-photo" style="display:block"><a href="' + url + '" target="_blank">' + '<img src="' + shop.PictureUrl.PcMiddleImg + '" border="0"/>' + '</a></span>';
		html += '<span class="recruit-affi-hotpepper-by" style="display:block;font-size:10px">写真提供:<a href="http://www.hotpepper.jp/?' + my_vos + '" target="_blank">ホットペッパー.jp</a></span>';
		html += '</span>';

		html += '<span style="display:block">';
		html += '<span style="display:block;font-size:0.9em">' + shop.GenreCatch + '</span>';
		html += '<span style="display:block"><a href="' + url + '" target="_blank">' + shop.ShopName + '</a></span>';
		html += '</span>';


		html += '<span style="display:block;clear:both"></span>';
		html += '</span>';
		var dummy = '<p style="color:#999;padding:0;margin:0">' + dummy_text + '</p>';
		html_preview = dummy + html + dummy;
	}
	else if(type == 'combo-d')
	{
		html += '<span class="recruit-affi-hotpepper" style="display:block;margin:10px 0;padding:10px;border:1px solid #000">';

		html += '<span style="display:block;float:left;margin-right:10px">';
		html += '<span class="recruit-affi-hotpepper-photo" style="display:block"><a href="' + url + '" target="_blank">' + '<img src="' + shop.PictureUrl.PcMiddleImg + '" border="0"/>' + '</a></span>';
		html += '<span class="recruit-affi-hotpepper-by" style="display:block;font-size:10px">写真提供:<a href="http://www.hotpepper.jp/?' + my_vos + '" target="_blank">ホットペッパー.jp</a></span>';
		html += '</span>';

		html += '<span style="display:block">';
		html += '<span style="display:block;font-size:0.9em">' + shop.GenreCatch + '</span>';
		html += '<span style="display:block"><a href="' + url + '" target="_blank">' + shop.ShopName + '</a></span>';
		html += '<span style="display:block;margin-top:10px;font-size:0.9em">予算' + shop.BudgetAverage + ' - ' + shop.Capacity + '席 - ' + shop.Access + '</span>';
		html += '</span>';

		html += '<span style="display:block;clear:both"></span>';
		html += '</span>';
		var dummy = '<p style="color:#999;padding:0;margin:0">' + dummy_text + '</p>';
		html_preview = dummy + html + dummy;
	}

	var r = new RegExp('</span>$');
	var html_with_logger = html.replace( r, log_img_html + '</span>' );

	return {
		preview : html_preview,
		textarea : html_with_logger
	};
}
