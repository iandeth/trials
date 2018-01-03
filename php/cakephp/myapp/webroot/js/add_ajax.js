Post = function (){ this.initialize.apply(this, arguments) };
Post.prototype = {
	initialize: function(h) {
		h = $.extend({
			form: undefined   // $('form:first')
		}, h);
		// validation
		if (!h.form || h.form.length == 0) {
			alert('error: form が見つかりません');
			return;
		}
		this.form = h.form;
		// disabled: true だと save() しない。多重 submit 防止用途
		this.disabled = false;
	},
	save: function() {
		if (this.disabled)
			return false;
		this.disabled = true; // 多重 submit を防止
		$('#flashMessage').remove(); // エラー表示を初期化

		var _this = this;
		$.post('/posts/add_ajax_save', this.form.serialize())
			.success(function(data){
				console.log(data);
				// 保存成功
				if (data.is_success) {
					window.location = '/posts';
					return;
				// エラー
				} else {
					// Flash message 表示
					// めちゃめちゃベタ実装でどうかと...
					var div = '<div id="flashMessage" class="message" style="display:none">入力エラーがあります</div>';
					$('#content').prepend(div);
					$('#flashMessage').show('slow');
					// 各種入力エラーは server rendered html をまるごと差し替え
					var wrap = _this.form.parent();
					_this.form.remove();
					_this.form = $(data.html);
					wrap.append(_this.form);	
					// また submit 出来るように
					_this.disabled = false;
				}
			})
			.error(function(jxhr, msg, http_status){
				console.log('post error');
				console.log({
					msg: msg, http_status: http_status
				});
				_this.disabled = false;
			});
		return true;
	}
};

