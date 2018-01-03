Hotpepper = function (){};

Hotpepper.Area2 = function (){};
Hotpepper.Area2.prototype.resolve_parent_areas
= function ( arg ){
	arg = $H( arg || {} );
	var arg_defaults = $H({
		lsa : undefined,
		la  : undefined,
		ma  : undefined,
		sa  : undefined
	});
	var hash = arg_defaults.merge( arg );

	if(hash.sa){
		for (var lsa in HP_AREA_MASTER){
			var obj_lsa = HP_AREA_MASTER[ lsa ];
			for (var la in obj_lsa.la){
				var obj_la = obj_lsa.la[ la ];
				for (var ma in obj_la.ma){
					var obj_ma = obj_la.ma[ ma ];
					for (var sa in obj_ma.sa){
						var obj_sa = obj_ma.sa[ sa ];
						if(sa == hash.sa){
							hash.lsa = lsa;
							hash.la  = la;
							hash.ma  = ma;
							hash.sa  = sa;
							hash.lsa_name = obj_lsa.name;
							hash.la_name  = obj_la.name;
							hash.ma_name  = obj_ma.name;
							hash.sa_name  = obj_sa.name;
							return hash;
						}
					}
				}
			}
		}
	}
	if(hash.ma){
		for (var lsa in HP_AREA_MASTER){
			var obj_lsa = HP_AREA_MASTER[ lsa ];
			for (var la in obj_lsa.la){
				var obj_la = obj_lsa.la[ la ];
				for (var ma in obj_la.ma){
					var obj_ma = obj_la.ma[ ma ];
					if(ma == hash.ma){
						hash.lsa = lsa;
						hash.la  = la;
						hash.ma  = ma;
						hash.lsa_name = obj_lsa.name;
						hash.la_name  = obj_la.name;
						hash.ma_name  = obj_ma.name;
						return hash;
					}
				}
			}
		}
	}
	if(hash.la){
		for (var lsa in HP_AREA_MASTER){
			var obj_lsa = HP_AREA_MASTER[ lsa ];
			for (var la in obj_lsa.la){
				var obj_la = obj_lsa.la[ la ];
				if(la == hash.la){
					hash.lsa = lsa;
					hash.la  = la;
					hash.lsa_name = obj_lsa.name;
					hash.la_name  = obj_la.name;
					return hash;
				}
			}
		}
	}
	return hash;
}

Hotpepper.Area2.Pulldown
= function (arg){
	arg = $H( arg || {} );
	var arg_defaults = $H({
		id_lsa : 'hp-sel-lsa',
		id_la  : 'hp-sel-la',
		id_ma  : 'hp-sel-ma',
		id_sa  : 'hp-sel-sa',
		first_opt_text : '指定なし'
	});
	arg = arg_defaults.merge( arg );

	this.ele = {
		lsa : $( arg.id_lsa ),
		la  : $( arg.id_la ),
		ma  : $( arg.id_ma ),
		sa  : $( arg.id_sa )
	};
	if(!this.ele.lsa){
		alert( 'Hotpepper.Area2.Pulldown\n'
			+ '大サービスエリアのプルダウンが見つかりません\n'
			+ 'id: ' + arg.id_lsa );
		return;
	}

	this.first_opt_text = arg.first_opt_text;

	var _instance = this;
	if(!this.ele.la){ return }
	Event.observe( this.ele.lsa, 'change', function (){
		_instance.change_large_area();
	});
	if(!this.ele.ma){ return }
	Event.observe( this.ele.la,  'change', function (){
		_instance.change_middle_area();
	});
	if(!this.ele.sa){ return }
	Event.observe( this.ele.ma,  'change', function (){
		_instance.change_small_area();
	});
};

Hotpepper.Area2.Pulldown.prototype.init
= function (arg){
	arg = $H( arg || {} );
	var arg_defaults = $H({
		lsa : undefined,
		la  : undefined,
		ma  : undefined,
		sa  : undefined
	});
	arg = arg_defaults.merge( arg );

	var def_val = this.resolve_parent_areas( arg );

	this.load_large_service_area( def_val.lsa );
	if(!this.ele.la){ return }
	this.change_large_area( def_val.la );
	if(!this.ele.ma){ return }
	this.change_middle_area( def_val.ma );
	if(!this.ele.sa){ return }
	this.change_small_area( def_val.sa );
}

Hotpepper.Area2.Pulldown.prototype.load_large_service_area
= function ( default_val ){
	var e = this.ele;
	// first selection (blank value)
	var first_opt = document.createElement("OPTION");
	first_opt.value = '';
	var first_opt_name = document.createTextNode(
		this.first_opt_text
	);
	first_opt.appendChild( first_opt_name );
	e.lsa.appendChild( first_opt );
	// the rest is from master
	for (var i in HP_AREA_MASTER){
		var opt = document.createElement("OPTION");
		opt.value = i;
		if(opt.value == default_val){
			opt.selected = true;
		}
		var name = HP_AREA_MASTER[i].name;
		var txt = document.createTextNode( name );
		opt.appendChild(txt);
		e.lsa.appendChild(opt);
	}
}

Hotpepper.Area2.Pulldown.prototype.change_large_area
= function ( default_val ){
	var e = this.ele;
	this._reset_pulldown( e.la );
	this._reset_pulldown( e.ma );
	this._reset_pulldown( e.sa );
	if(!e.lsa.value){
		return;
	}
	var hash = HP_AREA_MASTER[ e.lsa.value ].la;
	for (i in hash){
		var opt = document.createElement("OPTION");
		opt.value = i;
		if(opt.value == default_val){
			opt.selected = true;
		}
		var txt = document.createTextNode( hash[i].name );
		opt.appendChild(txt);
		e.la.appendChild(opt);
	}
}

Hotpepper.Area2.Pulldown.prototype.change_middle_area
= function ( default_val ){
	var e = this.ele;
	this._reset_pulldown( e.ma );
	this._reset_pulldown( e.sa );
	if(!e.la.value){
		return;
	}
	var hash = HP_AREA_MASTER[ e.lsa.value ].la[ e.la.value ].ma;
	for (i in hash){
		var opt = document.createElement("OPTION");
		opt.value = i;
		if(opt.value == default_val){
			opt.selected = true;
		}
		var txt = document.createTextNode( hash[i].name );
		opt.appendChild(txt);
		e.ma.appendChild(opt);
	}
}

Hotpepper.Area2.Pulldown.prototype.change_small_area
= function ( default_val ){
	var e = this.ele;
	this._reset_pulldown( e.sa );
	if(!e.ma.value){
		return;
	}
	var hash = HP_AREA_MASTER[ e.lsa.value ].la[ e.la.value ].
		ma[ e.ma.value ].sa;
	for (i in hash){
		var opt = document.createElement("OPTION");
		opt.value = i;
		if(opt.value == default_val){
			opt.selected = true;
		}
		var txt = document.createTextNode( hash[i].name );
		opt.appendChild(txt);
		e.sa.appendChild(opt);
	}
}

Hotpepper.Area2.Pulldown.prototype._reset_pulldown
= function (ele){
	if(!ele){ return }
	if(ele.length > 0){
		ele.length = 1;
	}else{
		var opt = document.createElement("OPTION");
		opt.value = '';
		var opt_name = document.createTextNode(
			this.first_opt_text
		);
		opt.appendChild( opt_name );
		ele.appendChild( opt );
	}
}

Hotpepper.Area2.Pulldown.prototype.resolve_parent_areas
= function (arg){
	var area2 = new Hotpepper.Area2();
	return area2.resolve_parent_areas( arg );
}

Hotpepper.Genre = function (){};
Hotpepper.Genre.Pulldown = function (arg){
	arg = $H( arg || {} );
	var arg_defaults = $H({
		id : 'hp-sel-genre',
		first_opt_text : '指定なし'
	});
	arg = arg_defaults.merge( arg );

	this.ele = {
		genre : $( arg.id )
	};
	if(!this.ele.genre){
		alert( 'Hotpepper.Genre.Pulldown\n'
			+ 'ジャンルのプルダウンが見つかりません\n'
			+ 'id: ' + arg.id );
		return;
	}

	this.first_opt_text = arg.first_opt_text;
};

Hotpepper.Genre.Pulldown.prototype.init = function (arg){
	arg = $H( arg || {} );
	var arg_defaults = $H({
		default_value : undefined
	});
	arg = arg_defaults.merge( arg );

	// first selection (blank value)
	var first_opt = document.createElement("OPTION");
	first_opt.value = '';
	var first_opt_name = document.createTextNode(
		this.first_opt_text
	);
	first_opt.appendChild( first_opt_name );
	this.ele.genre.appendChild( first_opt );
	// the rest is from master
	for (var i in HP_GENRE_MASTER){
		var opt = document.createElement("OPTION");
		opt.value = i;
		if(opt.value == arg.default_value){
			opt.selected = true;
		}
		var name = HP_GENRE_MASTER[i].name;
		var txt = document.createTextNode( name );
		opt.appendChild(txt);
		this.ele.genre.appendChild(opt);
	}
}

Hotpepper.Genre.Pulldown.prototype.resolve_text
= function (arg){
	arg = $H( arg || {} );
	var arg_defaults = $H({
		value : undefined
	});
	arg = arg_defaults.merge( arg );
	if( !arg.value ){ return }
	return HP_GENRE_MASTER[ arg.value ].name;
}

Hotpepper.Budget = function (){};
Hotpepper.Budget.Pulldown
= function (arg){
	arg = $H( arg || {} );
	var arg_defaults = $H({
		id : 'hp-sel-budget',
		first_opt_text : '指定なし'
	});
	arg = arg_defaults.merge( arg );

	this.ele = {
		budget : $( arg.id )
	};
	if(!this.ele.budget){
		alert( 'Hotpepper.Budget.Pulldown\n'
			+ '予算のプルダウンが見つかりません\n'
			+ 'id: ' + arg.id );
		return;
	}

	this.first_opt_text = arg.first_opt_text;
};

Hotpepper.Budget.Pulldown.prototype.init
= function (arg){
	arg = $H( arg || {} );
	var arg_defaults = $H({
		default_value : undefined
	});
	arg = arg_defaults.merge( arg );

	// first selection (blank value)
	var first_opt = document.createElement("OPTION");
	first_opt.value = '';
	var first_opt_name = document.createTextNode(
		this.first_opt_text
	);
	first_opt.appendChild( first_opt_name );
	this.ele.budget.appendChild( first_opt );
	// the rest is from master
	for (var i in HP_BUDGET_MASTER){
		var opt = document.createElement("OPTION");
		opt.value = i;
		if(opt.value == arg.default_value){
			opt.selected = true;
		}
		var name = HP_BUDGET_MASTER[i].name;
		var txt = document.createTextNode( name );
		opt.appendChild(txt);
		this.ele.budget.appendChild(opt);
	}
}

Hotpepper.Budget.Pulldown.prototype.resolve_text
= function (arg){
	arg = $H( arg || {} );
	var arg_defaults = $H({
		value : undefined
	});
	arg = arg_defaults.merge( arg );
	if( !arg.value ){ return }
	return HP_BUDGET_MASTER[ arg.value ].name;
}