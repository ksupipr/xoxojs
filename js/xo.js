// класс игрока

function Player(_name, _type, _gui_id) {
	this.name = _name; // введенное имя игрока
	this.score = 0; // очки
	this.type = _type; // тип игрока. определяет вид фишек
	this.gui_obj = []; // масив GUI
	this.gui_obj["id"] = document.getElementById(_gui_id);
	this.gui_obj["name"] = this.gui_obj["id"].children[0].children[1];
	this.gui_obj["score"] = this.gui_obj["id"].children[1];
	this.gui_obj["type"] = this.gui_obj["id"].children[0].children[0];

	
	// установка нового имени
	this.setName = function(new_name) {
		this.name = new_name;
		this.showName();
	}
	
	// установка нового type
	this.setType = function(new_type) {
		this.type = new_type;
		this.showType();
	}
	
	// установка score
	this.setScore = function(new_score) {
		this.score = new_score;
		this.showScore();
	}
	
	// установка добавление значения к score
	this.addScore = function(num) {
		num = num || 1;
		this.score += num;
		this.showScore();
	}
	
	// отображение параметров игрока
	// скоре
	this.showScore = function() {
		this.gui_obj["score"].innerHTML = this.score;
	}
	
	// имя
	this.showName = function() {
		this.gui_obj["name"].innerHTML = this.name;
	}
	
	// тип
	this.showType = function() {
		this.gui_obj["type"].innerHTML = drawType(this.type);
	}
	
	// всех параметров
	this.showInfo = function() {
		this.showName();
		this.showScore();
		this.showType();
	}
	
	// помечам, что это игрок сейчас ходит
	this.setActive = function() {
		addClass(this.gui_obj["id"], 'player_active');
		//log('Ходит игрок: '+this.name);
	}
	
	this.removeActive = function() {
		removeClass(this.gui_obj["id"], 'player_active');
	}
	
	this.showInfo();
}


function Pole(nx, ny) {
//т.к. первый вариант с 2х мерной матрицой оказался провальным, то завожу класс поля

// dx & dy - смещене относительно 0й ячейки карты, что позволит скролить карту бесконечно долго
// points - список только тех точек, которые стоят, а не всего поля.

	this.max_x = nx; // координаты точки без сдвига, т.е. считая что 0 в левом верхнем углу
	this.max_y = ny;
	this.dx = 0; // сдвиг карты от 0й точки по х, ниже по у
	this.dy = 0;
	this.points = []; // список установленных точек
	this.game_pole = document.getElementById('game_pole'); // GUI поля
	this.autoscroll = true; // флаг автоскролла
	this.scrollnum = 1; // на сколько клеток сдвигать

	// записываем метку игрока в точку
	this.setPoint = function(x, y, type) {
		this.points[(x+this.dx)+"x"+(y+this.dy)] = type;
		this.drawCell(x, y, type);
	}
	
	this.checkAutoscroll = function(x, y) {
	//если включен автоскролл, то при установке в крайнее положение, скролить экран
		if (this.autoscroll) {
			if (x==0) this.scroll(-1, 0);
			if (y==0) this.scroll(0, -1);
			if (x==this.max_x-1) this.scroll(1, 0);
			if (y==this.max_y-1) this.scroll(0, 1);
		}
	}
	
	// получаем
	this.getPoint = function(x, y) {
		var point_now = this.points[(x+this.dx)+"x"+(y+this.dy)];
		if (point_now == 'undefined') return null;
		else return point_now;
	}
	
	// определяем максимальную ширину и высоту для отображения в браузере
	this.getMax = function() {
		this.max_x = Math.ceil(((document.documentElement.clientWidth-this.game_pole.offsetLeft)-30)/30);
		this.max_y = Math.ceil(((document.documentElement.clientHeight-this.game_pole.offsetTop)-90)/30);
	}
	
	
	// рисуем поле
	this.drawPole = function() {
		var point_now = null;
		var pole_out='<table id="pole" cellpadding="0" cellspacing="3">';
	    for (j=0; j<this.max_y; j++) 
		{
        	pole_out+='<tr>'; 
			for (i=0;i<this.max_x;i++) 
			{ 
				point_now = this.getPoint(i, j);
				if (point_now==null)
					pole_out+='<td onclick="GameClass.cellClick('+i+', '+j+');"><div class="cell">&nbsp;</div></td>';
				else
					pole_out+='<td><div class="cell">'+drawType(point_now)+'</div></td>';
			}
			pole_out+='</tr>';
		}
		this.game_pole.innerHTML = pole_out+'</table>'; 
		
		document.getElementById('scroll_left').style.height = this.game_pole.offsetHeight+'px';
		document.getElementById('scroll_left').children[0].style.marginTop = (this.game_pole.offsetHeight/2 - 10)+'px';
		document.getElementById('scroll_right').style.height = this.game_pole.offsetHeight+'px';
		document.getElementById('scroll_right').children[0].style.marginTop = (this.game_pole.offsetHeight/2 - 10)+'px';
		
		/*
		// определение координат ячейки клика
			var i = 0;
			while( (e = e.previousSibling) != null ) 
				i++;
				
			var j = 0;
			var epar = e.parentNode;
			while( ( epar= epar.previousSibling) != null ) 
				j++;
				
			alert(i+', '+j);
			GameClass.cellClick(i, j);
		*/
		
	}
	
	// рисуем фишку в ячейке
	this.drawCell = function(x, y, type) {
		this.game_pole.children[0].children[0].children[y].children[x].children[0].innerHTML = drawType(type);
	}
	
	// скролируем поле
	this.scroll = function(_dx, _dy) {
		this.dx +=_dx*this.scrollnum;
		this.dy +=_dy*this.scrollnum;
		this.drawPole();
	}
	
	
	// рисуем ячейки, которые привели игрока к победе
	this.drawWin = function(nx, ny, nc, dnx, dny, ptype) {
		addClass(this.game_pole.children[0].children[0].children[ny].children[nx].children[0], 'win_cell');
		var move = 1;
		var gpx = 0;
		var gpy = 0;
		for (i=0; i<nc; i++) {
			gpx = nx+(move*dnx);
			gpy = ny+(move*dny);
			if (this.getPoint(gpx,gpy) == ptype) {
				// если все норм, то красим
				if ((gpx>=0) && (gpx<this.max_x) && (gpy>=0) && (gpy<this.max_y)) // проверка, если победившие фишки выше линии скролла
					addClass(this.game_pole.children[0].children[0].children[ny+(move*dny)].children[nx+(move*dnx)].children[0], 'win_cell');
				if (move>0) move++; else move--;
			} else { if (move>0) move = -1; else i=nc; }
		}
	}		
	
	this.getMax();
	
}

// класс самой игры
var GameClass = {
    raund : 0, // количество раундов, т.к. поле не ограничено, то по сути сумма score обоих игроков
	pole : null, // игровое поле
	player : [], // массив объектов игроков
	max_players : 2, // максимальное количество игроков
	player_now : 0, //какой игрок сейчас ходит
	
    constructor: function( callback ) {
	// конструктор, проверяет загружен ли документ и если да, то выполняет стартовую функцию
            var listener = window.addEventListener ? [ "addEventListener", "" ] : 
                                    [ "attachEvent", "on" ];

            // проверим, возможно документ загружен
            if ( document.readyState === "complete" ) {
                if ( callback && typeof callback === "function" ) {
                    callback.call( this );
                }
                return;
            }
            var self = this;

            // событие на загрузку документа, если документ еще не загружен
            window[ listener[ 0 ] ]( listener[ 1 ] + "load", function() {

                if ( callback && typeof callback === "function" ) {
                    callback.call( self );
                }
            }, false );
    },

       // стартовое меню
	start: function() {
		var wn_out = '<div id="begin_logo"><span class="lx">X</span><span class="lo">O</span><br /><span class="lx2">X</span><span class="lo2">O</span></div>' +
			'<div id="ok" class="button" onClick="GameClass.begin(); closeWin(\'gamebegin\');">начать игру</div>';
		openWin(0, wn_out, 'gamebegin');
	},
	 // начало
	begin: function() {

		
		// стартуем игру
		this.newGame();
		// вешаем событие на изменение рзмера окна
		window.onresize = function(){ GameClass.pole.getMax(); GameClass.pole.drawPole(); }
	},
	
    newGame: function() {
		// новая игра. Вызываем в начале и при нажатии кнопки newGame
		// обнуляем все необходимые значения и изменяем игрока, который будет ходить первый. Хотя сейчас ходят по очереди и 1м ходит либо 0й игрок, либо победитель
		// запрашиваем имена всех игроков по очереди
		document.getElementById('all_game').style.display='none';
		this.makePlayer(0, "player_info1");
		
		this.clearAll();		
		
    },
	
	newRoundAll: function() {
		// новый раунд
		if (this.player[this.player_now]) this.player[this.player_now].removeActive();
		this.clearAll();
		if (this.player[this.player_now]) this.player[this.player_now].setActive();
    },
	
	newRound: function() {
		// новый раунд
		this.setRaund(0); //обнуляем счетчик ходов
		var s1 = this.pole.autoscroll; // запоминаем настройки карты
		var s2 = this.pole.scrollnum; // тут тоже. надо бы переделать все настройки под 1 массив.
		this.pole = new Pole(); 
		this.pole.drawPole();	// рисуем новое поле
		this.pole.autoscroll = s1; // востанавливаем
		this.pole.scrollnum = s2;
		if (this.player[this.player_now]) this.player[this.player_now].setActive();
    },
	
	clearAll: function() {
	// новая игра
		this.setRaund(0); //обнуляем счетчик ходов
		if (this.pole != null) {
			var s1 = this.pole.autoscroll; // запоминаем настройки карты
			var s2 = this.pole.scrollnum; // тут тоже. надо бы переделать все настройки под 1 массив.
			this.pole = new Pole(); 
			this.pole.autoscroll = s1;
			this.pole.scrollnum = s2;
		} else {
			this.pole = new Pole();
		}
		this.pole.drawPole(); // рисуем новое поле
		this.player_now = 0;
		// обнуляем всех игроков
		for (i=0; i<this.max_players; i++) 
			if ( this.player[i]) this.player[i].setScore(0);
	},
	
	makePlayer: function(type, gui_id, name) {
	// запрашиваем имя, если небыло заданно.
		name = name || null;
		if (name != null) {
			this.player[type] = new Player(name, type, gui_id);
			//после того как завели пользователя 0, можно заводить остальных
			if (type<(this.max_players-1)) {
				this.makePlayer(type+1, "player_info"+(type+2));
				} else { //если завели все, стартуем игру
					document.getElementById('all_game').style.display='block';
					this.newRound();
				}
		} else {
			this.requestName(type, gui_id);
		}
	},
	
	requestName: function(type, gui_id) {
	// рисуем окошко с запросом имени
		var wn_out = 'Имя игрока ' + (type+1) + ':<br><input type="text" id="input_name_'+type+'" class="input_text" />' +
					 '<div id="ok" class="button" onClick="GameClass.makePlayer('+type+', \''+gui_id+'\', checkTextEnter(document.getElementById(\'input_name_'+type+'\').value)); closeWin(\'npn'+type+'\');">OK</div>';
		openWin(0, wn_out, 'npn'+type);
	},

	cellClick: function(nx, ny) {
	//log(nx+'x'+ ny);

	// обрабатываем клик
	if (this.pole.getPoint(nx,ny)==null) { 
			this.setCell(nx, ny);
			// проверяем, победил ли текущий игрок
			if (this.isWin(nx,ny)) {
				this.setWinner();
			} else {
			// иначе передаем ход следующему
				this.pole.checkAutoscroll(nx, ny); 
				this.nextPlayer();
			}
			
		}
		
		
	},
	// переход хода
	nextPlayer: function() {
		this.player[this.player_now].removeActive();
		this.player_now++;
		if (this.player.length<=this.player_now) this.player_now = 0;
		this.player[this.player_now].setActive();
	},
	// установка фишки в ячейку
	setCell: function(nx, ny) {
		this.pole.setPoint(nx, ny, this.player_now);
		this.addRaund();
	},
	// добавление количества ходов
	addRaund: function() {
		this.raund++;
		document.getElementById('raund').innerHTML = Math.ceil(this.raund/this.max_players);
	},
	// установка количества ходов
	setRaund: function(num) {
		this.raund = num;
		document.getElementById('raund').innerHTML = Math.ceil(this.raund/this.max_players);
	},
	// скролл карты
	scroll: function(dx, dy) {
		this.pole.scroll(dx, dy);
	},
	// проверка на победу
	isWin: function(nx,ny) {

		//проверяем горизонталь
		if (this.winTest(nx, ny, 5, 1, 0)) return true;
		//проверяем вертикаль
		if (this.winTest(nx, ny, 5, 0, 1)) return true;
		// диагонали
		if (this.winTest(nx, ny, 5, 1, 1)) return true;
		if (this.winTest(nx, ny, 5, 1, -1)) return true;

		return false;
	},

	winTest:function(nx, ny, nc, dnx, dny) {
	// функция проверки линий заполнения
		var count = 1;
		var move = 1;
		for (i=0; i<nc; i++) {
			if (this.pole.getPoint(nx+(move*dnx),ny+(move*dny)) == this.player_now) { 
				count++;
				if (move>0) move++; else move--;
			} else { if (move>0) move = -1; else i=nc; }
		}
		if (count>=nc) {
			// сообщаем полю, что надо раскрасить выйгрышную комбинацию
			this.pole.drawWin(nx, ny, nc, dnx, dny, this.player_now);
			return true; 
		}
		else return false;
	},
	
	setWinner: function() {
		// выводим поздравление
		var wn_out = 'Победа игрока<h1>'+this.player[this.player_now].name+'</h1>' +
					 '<div id="ok" class="button" onClick="GameClass.newRound(); closeWin(\'winwin\');">OK</div>';
		openWin(0, wn_out, 'winwin');
		//начисляем очки победителю
		this.player[this.player_now].addScore(1);
		
	},
	// выхов игрового меню
	menu: function() {
		var wn_out = '<div id="ok" class="button" onClick="closeWin(\'menu\');">вернуться в игру</div><br/>'+
					 '<div id="new_raund" class="button" onClick="GameClass.newRoundAll(); closeWin(\'menu\');">новый раунд</div><br/>'+
					 '<div id="new_game" class="button" onClick="GameClass.newGame(); closeWin(\'menu\');">новая игра</div><br/>'+
					 '<div id="b_settings" class="button" onClick="GameClass.settings(); closeWin(\'menu\');">настройки</div>';
		openWin(0, wn_out, 'menu');
	},
	// окно настроек
	settings: function() {
		var wn_out = 	'Шаг перемотки поля (max: '+((this.pole.max_x < this.pole.max_y) ? (this.pole.max_x-1) : (this.pole.max_y-1))+'): <input type="text" id="settings_w_1" class="input_input"  onchange="return numOnly(this)" onkeyup="return numOnly(this)" value="'+this.pole.scrollnum+'" /><br/>'+
						'Автоскролл: <input '+((this.pole.autoscroll) ? 'checked' : '')+' type="checkbox" id="settings_w_2" value="1" /><br/>'+
						'<div id="ok" class="button" onClick="GameClass.saveSettings(); closeWin(\'settings_w\');">применить</div><br/>';
		openWin(0, wn_out, 'settings_w');
	},
	// сохранение настроек
	saveSettings: function() {
		var settings_w_1_val = document.getElementById('settings_w_1').value.replace(/[^\d]/g, ''); // клетки скролла. только число и не больше максимального значения и не меньше 0
		var settings_w_2_val = document.getElementById('settings_w_2').checked; // автоскролл 
		this.pole.autoscroll = settings_w_2_val;
		this.pole.scrollnum = settings_w_1_val;
	}
	
} 

GameClass.constructor(GameClass.start);