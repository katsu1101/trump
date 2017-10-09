
//ToDo: 祝日対応, 昨日の天気をクッキーで再現
var code = '4410';
var ws={"0":"SUN","1":"MON","2":"TUE","3":"WED",
		"4":"THU","5":"FRI","6":"SAT"};
		
var now = new Date(); 
var nowms = now.getTime();
after = 24*60*60*1000;
ans = new Date(nowms);
m=ans.getMonth() + 1;
y=ans.getFullYear();

function toIcon(data) {
	var s2i = {
		"晴れ": "sun.gif",
		"晴時々曇": "sun_clouds_st.gif",
		"晴後曇": "sun_clouds_af.gif",
		"晴時々雨": "sun_rain_st.gif",
		"晴後雨": "sun_rain_af.gif",
		"曇り":"clouds.gif",
		"曇後晴": "clouds_sun_af.gif",
		"曇時々晴":"clouds_sun_st.gif",
		"曇時々雨": "clouds_rain_st.gif",
		"曇後雨": "clouds_rain_af.gif",
		"雨後晴": "rain_sun_af.gif",
		"雨後曇": "rain_clouds_af.gif",
		"雪": "snow.gif",
		"雨": "rain.gif",
		"雨時々曇": "rain_clouds_st.gif",
	};
	var a = data.description.split(' - ');
	var help = "";
	if( !s2i[a[0]] ) {
		help = a[0];
	}
	if( s2i[a[0]] ) {
		return '<br><a href="'+data.link+'">'
			+'<img src="img/'+s2i[a[0]]+'" width=72></a><br>'
			+'<b>'+a[1]+'</b>';
	}else{
		return '<br>' + help + '<br>'
			+'<b>'+a[1]+'</b>';
	}
}

var MAX_COUNT = 8;
after = 24*60*60*1000;

function getKey(i) {

	var now = new Date(); 
	var nowms = now.getTime();
	ans = new Date(nowms+after*(i-1));
	y=ans.getFullYear();
	m=ans.getMonth() + 1;
	d=ans.getDate();
	return y + '_' + m + '_' + d;
}

function getBirthday( aans ) {
	var m = aans.getMonth() + 1;
	var d = aans.getDate();
	if( m == 4 == 2 && d == 3 ) {
		return "天海春香"; 
	}else if ( m == 2 && d == 25 ) {
		return "如月千早";
	}else if ( m == 12 && d == 24 ) {
		return "萩原雪歩";
	}else if ( m == 3 && d == 25 ) {
		return "高槻やよい";
	}else if ( m == 6 && d == 23 ) {
		return "秋月律子";
	}else if ( m == 5 && d == 5 ) {
		return "水瀬伊織";
	}else if ( m == 7 && d == 19 ) {
		return "三浦あずさ";
	}else if ( m == 5 && d == 22 ) {
		return "双海亜美・真美";
	}else if ( m == 8 && d == 29 ) {
		return "菊地真";
	}else if ( m == 11 && d == 23 ) {
		return "星井美希";
	}else if ( m == 10 && d == 10 ) {
		return "我那覇響";
	}else if ( m == 1 && d == 21 ) {
		return "四条貴音";
	}else if ( m == 6 && d == 25 ) {
		return "日高愛";
	}else if ( m == 3 && d == 7 ) {
		return "水谷絵理";
	}else if ( m == 9 && d == 15 ) {
		return "秋月涼";
	}
	return "";
}

function getHolday( aans ) {
	
	var w = aans.getDay();
	var lnowms = aans.getTime();
	var lans = new Date(lnowms - after);
	var nens = new Date(lnowms + after);
	
	var hdnm = getHolday2( aans );
	if( hdnm != "" ){
		return hdnm;
	}else if ( w == 1 && getHolday2( lans ) != "" ) {
		return "振替休日";
	}else if ( getHolday2( lans ) != "" && getHolday2( nens ) != "" ){
		return "国民の休日";
	}
	return "";
}

function getHolday2( aans ) {
	
	var y = aans.getFullYear();
	var m = aans.getMonth() + 1;
	var d = aans.getDate();
	var w = aans.getDay();
	var a = ~~( ( d - 1 ) / 7 ) + 1;
	
	if( m == 1 && d == 1 ){
		return "元旦";
	}else if ( m == 2 && d == 11 ) {
		return "建国記念の日";
	}else if ( m == 4 && d == 29 ) {
		return "昭和の日";
	}else if ( m == 5 && d == 3 ) {
		return "憲法記念日";
	}else if ( m == 5 && d == 4 ) {
		return "みどりの日";
	}else if ( m == 5 && d == 5 ) {
		return "こどもの日";
	}else if ( m == 11 && d == 3 ) {
		return "文化の日";
	}else if ( m == 11 && d == 23 ) {
		return "勤労感謝の日";
	}else if ( m == 12 && d == 23 ) {
		return "天皇誕生日";
	}else if ( m == 1 && a == 2 && w == 1 ) {
		return "成人の日";
	}else if ( m == 7 && a == 3 && w == 1 ) {
		return "海の日";
	}else if ( m == 9 && a == 3 && w == 1 ) {
		return "敬老の日";
	}else if ( m == 10 && a == 2 && w == 1 ) {
		return "体育の日";
	}else if ( m == 3 && d == ~~(20.8431 + 0.242194 * ( y - 1980)) - ~~((y - 1980)/4) ) {
		return "春分の日";
	}else if ( m == 9 && d == ~~(23.2488 + 0.242194 * ( y - 1980)) - ~~((y - 1980)/ 4) ) {
		return "秋分の日";
	}
	return "";
}

function getColor( ans ) {
	w = ans.getDay();
	h = getHolday( ans );
	if( h == "振替休日" || h == "国民の休日" ) {
		return "#FF8080";
	}else if( w == 0 || h != "" ){
		return "red";
	}else if( w == 6 ){
		return "#0000FF";
	}else{
		return "";
	}
}

function getDateHTML( i ) {
	ans = new Date(nowms+after*(i-1));
	
	d = ans.getDate();
	w = ans.getDay();
	c = getColor( ans, i );
	h = getHolday( ans )
	b = getBirthday( ans );
	return "<div style='font-size:30; color: " + c + "'>" + ws[w] + "</div>"
		+ "<div style='font-size:72; color: " + c + "''>"+d+"</div>"
		+ "<div style='font-size:30; color: " + c + "'>" + h + b + "</div>";
}

function showRSSfromJSON(json) {

	for(i=0; i<MAX_COUNT; i++){
		var j='';
		if(i>0){
			j = toIcon(json.value.items[i-1]);
			$.cookie(getKey(i),j, {expires: 10});
		}else{
			j = $.cookie(getKey(i));
			if(!j){j="";}
		}
		$('#d'+i).html(getDateHTML(i)+j);
	}
	
}

$(function(){


	winWidth = $(window).width();
	$('#month').html(m);
	$('#y').html(y);
	$('#y').css({"left": (winWidth/2-50)});

	for(i=0; i<MAX_COUNT; i++){
		$('#d'+i).width(winWidth/MAX_COUNT);
		$('#d'+i).css({"color": "#FFFFFF", "text-align": "center", "vertical-align": "top", "padding": 20});
		if(i==1){
			$('#d'+i).css({"color": "#000000"});
		}
		j = $.cookie(getKey(i));
		if(!j){j="";}
		$('#d'+i).html(getDateHTML(i)+j);
	}
	var s=document.createElement('script');
	s.charset='UTF-8';
	s.src='http://pipes.yahoo.com/yager/rss2json?_render=json'
		+'&_callback=showRSSfromJSON&url='
		+encodeURIComponent('http://rss.weather.yahoo.co.jp/rss/days/'+code+'.xml');
	document.body.appendChild(s);
	//$("#fc2_qr_code_header").top(600);
});

