// проверка введенного текста
function checkTextEnter(text)
{
	text = text || null;
	if (text != null) 
	{
		var reg_pusto = text.replace(/\s+/,'');
		// проверяем, не написали ли вместо имени одни пробелы, если нет, то пропускаем как есть иначе возвращаем нулл
		if (reg_pusto.length==0) text = null;
	}
	
	return text;
}
//открытие окошка
function openWin(type, html, id) {
    id = id || new Date().getTime();
	document.getElementById('window_out').innerHTML += '<div id="win_'+id+'" class="win win'+type+'">'+html+'</div>';
	document.getElementById('window_out').style.display="block";
	document.getElementById('overlay').style.display="block";
}
//закрытие
function closeWin(id) {
	var win =  document.getElementById('win_'+id);
	win.parentNode.removeChild(win);	
	
	var winout = document.getElementById('window_out');
	if (checkTextEnter(winout.innerHTML)==null) {
		winout.innerHTML = '';
		winout.style.display='none';
		document.getElementById('overlay').style.display='none';
	}
}

// функция, которая определяет вид фишек, добавить какие угодно, можно картинки, для любого количества игроков
function drawType(type) {
		switch(type) {
			case 0 : return 'X';
			case 1 : return 'O';
			default: return 'Z'
		}
}

// проверка на ввод только цифр
function numOnly(input) {
	var iv = input.value.replace(/[^\d]/g, '');
//	if (iv<1) iv = 1;
	if (iv>GameClass.pole.max_x) iv=GameClass.pole.max_x-1;
	if (iv>GameClass.pole.max_y) iv=GameClass.pole.max_y-1;
	input.value = iv;
};

// добавляем класс к элементу
function addClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    if (re.test(o.className)) return
    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}
 
 // удаляем класс
function removeClass(o, c){
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g")
    o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "")
}

// отладочно информационные функции
function log(text) {
	document.getElementById('debug').innerHTML = text;
}


