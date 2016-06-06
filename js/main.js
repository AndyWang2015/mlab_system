$(document).ready(function(){
	var webData ={};
	webData.wrp=$('.wrapper');
	webData.mlabApikey = "n6FXodWWCdM14KrePZHrRPPovbzboRn6";
	webData.imgurappid = "752b0363900112d";
	webData.creatUsererrortxt = "請填寫完整資料";
	webData.motifyerrortxt = "上一筆資料還在修改中，請先完成上一筆修改再繼續。";

	//init
	try{webData.nowpage = getUrlVars()['page'].replace('#access_token','');}
	catch(err){webData.nowpage = 1;}
	if($('.sec_menu').length>0){
		$('.sec_menu a').eq(webData.nowpage-1).addClass('on');
		$('.title').eq(0).html($('.sec_menu a').eq(webData.nowpage-1).text());
	}	

	if(webData.wrp.hasClass('about')) getDataCollection('aboutus_page',aboutfunction);
	else if(webData.wrp.hasClass('news')) getDataCollection('news_page',newsfunction);
	else if(webData.wrp.hasClass('learn')){
		webData.learnload=0;
		webData.learndata = [];
		getDataLearnCollection('learning_page',learnfunction);
		getDataLearnCollection('learning_photo_page',learnfunction);
	}
	else if(webData.wrp.hasClass('awards')) getDataCollection('awards',awardsfunction);
	else if(webData.wrp.hasClass('link')) getDataCollection('otherlink',linkfunction);
	else if(webData.wrp.hasClass('contact')){
		webData.contactload=0;
		webData.learndata = [];
		getDataLearnCollection('contactus',contactfunction);
		getDataLearnCollection('emailbox',contactfunction);
	}
	else if(webData.wrp.hasClass('index')){
		webData.indexload=0;
		webData.learndata = [];
		getDataLearnCollection('index_banner',indexfunction);
		getDataLearnCollection('index_photo',indexfunction);
		getDataLearnCollection('index_video',indexfunction);
	}

	else showLoading(false);

	//Addlistener	
	$("#indeximgInput").change(function(){indexreadURL(this,$(this),0);});
	$("#indeximgInput2").change(function(){indexreadURL(this,$(this),1);});
	$('.maingobtn').click(function(){insertmainPaper($(this).parent().attr('nam'));});
	$('.gogamebtn').click(function(){insertgame();});
	$('.menua').click(function(){menuaclick($(this));});
	$("#imgInput").change(function(){readURL(this,$(this));});
	$("#newsimgInput").change(function(){newsreadURL(this,$(this),0);});
	$("#newsimgInput2").change(function(){newsreadURL(this,$(this),1);});
	$('.userMenu .logoutbtn').click(function(){logout();});	
	$(".new .gobtn").click(function(){insertPaper();});

	$(window).load(function(){
		if(checkLogin()){
			try{
				webData.imgurToken = window.location.href.split('#')[1].split('&')[0].replace('access_token=','');
				$('.userMenu .icon').html($.cookie("useraccount").substring(0, 1));
				$('.userMenu .name').html($.cookie("username"));
			}
			catch(err){
				window.location.href = 'https://api.imgur.com/oauth2/authorize?response_type=token&client_id='+webData.imgurappid;
			}												
		}
		else window.location.href="index.html" + window.location.hash;
	});

	//Event	
	function insertmainPaper(_name){
		showLoading(true);
		if(_name == "banner"){
			if(webData.indexbanneruploadImg){
				uploadimgtoImgur(webData.indexbanneruploadImg,insertmainPaperEnd);
			}else{alert("請新增一張圖片");showLoading(false);return;}			
		}
		else if(_name == "photo"){
			if(webData.indexphotouploadImg){
				uploadimgtoImgur(webData.indexphotouploadImg,insertmainPaperEnd2);
			}else{alert("請新增一張圖片");showLoading(false);return;}
		}
	}
	function insertmainPaperEnd(){
		webData.insertdata ={pic:webData.uploadImgTrue};
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/index_banner'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
			type: 'POST',
			contentType: 'application/json',
			data:JSON.stringify(webData.insertdata),
			success: function(data) {
				location.reload();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function insertmainPaperEnd2(){
		webData.insertdata ={pic:webData.uploadImgTrue};
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/index_photo'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
			type: 'POST',
			contentType: 'application/json',
			data:JSON.stringify(webData.insertdata),
			success: function(data) {
				location.reload();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function indexfunction(){
		webData.indexload+=1;
		if(webData.indexload<3)return;
		for(var i=0;i<webData.learndata.length;i++){
			if(webData.learndata[i].collectname=="index_banner"){
				$('.paper.banner').attr('num',i);
				for(var j=0;j<webData.learndata[i].length;j++){
					$('.paper.banner').append('<li><div class="postphoto"><img src="'+webData.learndata[i][j].pic+'"></div><div class="btn" item="'+j+'" num="'+i+'"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>')
				}
			}
			else if(webData.learndata[i].collectname=="index_photo"){
				$('.paper.photo').attr('num',i);
				for(var j=0;j<webData.learndata[i].length;j++){
					$('.paper.photo').append('<li><div class="postphoto"><img src="'+webData.learndata[i][j].pic+'"></div><div class="btn" item="'+j+'" num="'+i+'"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>')
				}
			}
			else if(webData.learndata[i].collectname=="index_video"){
				$('.paper.video').attr('num',i);
				for(var j=0;j<webData.learndata[i].length;j++){
					$('.paper.video').append('<li><div class="posttitle"><a href="'+webData.learndata[i][j].video+'" target="blank">'+webData.learndata[i][j].video+'</a></div><div class="btn" item="'+j+'" num="'+i+'"><div title="修改" class="motify"></div></div></li>')
				}
			}
		}
		afterinsertindexdata();
	}
	function afterinsertindexdata(){
		$('.paper .delbtn').click(function(){	
			if($(this).parent().find('.motify').hasClass('on')){
				$(this).parent().find('.motify').removeClass('on');
				motifyPaper(false,$(this).parent().attr('item'),$(this).parent().attr('num'));
			}
			else deletPaper($(this).parent().attr('item'),$(this).parent().attr('num'));
		});
		$('.paper .motify').click(function(){				
			if($(this).hasClass('on')){
				$(this).removeClass('on');	
				motifyPaperEnd($(this).parent().attr('item'),$(this).parent().attr('num'));
			}
			else{
				$(this).addClass('on');
				motifyPaper(true,$(this).parent().attr('item'),$(this).parent().attr('num'));
			}
		});
		$('.menuin a').removeClass('on').eq(0).addClass('on');
		showLoading(false);
	}
	/*不要動*/
	function contactfunction(){
		webData.contactload+=1;
		if(webData.contactload<2)return;
		for(var i =0;i<webData.learndata.length;i++){
			if(webData.learndata[i].collectname == "contactus"){
				for(var j=0;j<webData.learndata[i].length;j++) $('.paper_addr').append('<li><div class="posttitle">'+webData.learndata[i][j].addr+'</div><div class="btn" item="'+j+'" num="'+i+'"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>');
			}
			else if(webData.learndata[i].collectname == "emailbox"){
				for(var j=0;j<webData.learndata[i].length;j++){
					$('.paper_mail').append('<li><div class="contact_name">'+webData.learndata[i][j].username+'</div><div class="contact_phone">'+webData.learndata[i][j].userphone+'</div><div class="contact_email">'+webData.learndata[i][j].useremail+'</div><div class="contact_des">'+webData.learndata[i][j].userword+'</div><div class="contact_date">'+webData.learndata[i][j].postdate+'</div><div class="btn" item="'+j+'" num="'+i+'"><div title="刪除" class="delbtn"></div></div></li>');
				}
			}
		}
		afterinsertcontactdata();
	}
	function afterinsertcontactdata(){
		$('.paper_addr .delbtn').click(function(){	
			if($(this).parent().find('.motify').hasClass('on')){
				$(this).parent().find('.motify').removeClass('on');
				motifyPaper(false,$(this).parent().attr('item'),$(this).parent().attr('num'));
			}else alert("地址是必要資料，無法刪除。");
		});
		$('.paper_addr .motify').click(function(){			
			if($(this).hasClass('on')){
				$(this).removeClass('on');	
				motifyPaperEnd($(this).parent().attr('item'),$(this).parent().attr('num'));
			}
			else{
				$(this).addClass('on');
				motifyPaper(true,$(this).parent().attr('item'));
			}
		});
		$('.paper_mail .delbtn').click(function(){
			var r = confirm("確定刪除留言嗎?");
		    if (r == true) deletPaper($(this).parent().attr('item'),$(this).parent().attr('num'));
		});
		$('.menuin a').removeClass('on').eq(6).addClass('on');
		showLoading(false);
	}
	function linkfunction(){
		console.log(webData.newPaperdata);
		for(var i=0;i<webData.newPaperdata.length;i++){
			$('.paper').append('<li><div class="postphoto"><img src="'+webData.newPaperdata[i].pic +'"></div><div class="posttitle"><a href="'+webData.newPaperdata[i].link+'" target="_blank">'+webData.newPaperdata[i].link+'</a></div><div class="btn" item="'+i+'"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>');
		}
		afterinsertlinkdata();
	}
	function afterinsertlinkdata(){
		$('.paper .delbtn').click(function(){	
			if($(this).parent().find('.motify').hasClass('on')){
				$(this).parent().find('.motify').removeClass('on');
				motifyPaper(false,$(this).parent().attr('item'));
			}
			else deletPaper($(this).parent().attr('item'));
		});
		$('.paper .motify').click(function(){			
			if($(this).hasClass('on')){
				$(this).removeClass('on');	
				motifyPaperEnd($(this).parent().attr('item'));
			}
			else{
				$(this).addClass('on');
				motifyPaper(true,$(this).parent().attr('item'));
			}
		});
		$('.menuin a').removeClass('on').eq(5).addClass('on');
		showLoading(false);
	}	
	function insertgame(){
		webData.insertdata = {
			title:$('.addgame .posttitle').val().replace(/\n\r?/g, '<br>'),
			list:[]
		};
		if(!webData.insertdata.title){
			alert(webData.creatUsererrortxt);
			return;
		}
		showLoading(true);
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
			type: 'POST',
			contentType: 'application/json',
			data:JSON.stringify(webData.insertdata),
			success: function(data) {
				location.reload();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function awardsfunction(data){
		$('.gameboxout').html('');
		for(i in webData.newPaperdata){
			$('.gameboxout').append('<div class="gamebox" gamenum="'+i+'"><div class="t awardspapertitle"><div class="posttitle">比賽名稱</div><div class="btn">功能</div></div><ul class="paper awardspapertitle" num="0"><li><div class="posttitle">'+ webData.newPaperdata[i].title +'</div><div class="btn"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li></ul><div class="new awardspapertitle"><div class="databox"><div class="lt"><input type="text" placeholder="請輸入姓名" class="username"><input type="text" placeholder="請輸入獎項" class="userdes"></div></div><button class="gobtn" gamenum="'+i+'">確定新增</button></div><div class="t"><div class="posttitle">姓名</div><div class="postdes">獎項</div><div class="btn">功能</div></div><ul class="paper awarditem" num="1"></ul></div>');
			for(j in webData.newPaperdata[i].list){
				$('.gamebox').eq(i).find('.paper').eq(1).append('<li><div class="posttitle">'+webData.newPaperdata[i].list[j].name+'</div><div class="postdes">'+webData.newPaperdata[i].list[j].word+'</div><div class="btn" gamenum="'+i+'" item="'+j+'"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>');
			}
		}
		afterinsertAwardsdata();
	}
	function afterinsertAwardsdata(){
		$('.paper.awardspapertitle .delbtn').click(function(){	
			if($(this).parent().find('.motify').hasClass('on')){
				$(this).parent().find('.motify').removeClass('on');
				awardsmotifyPaper(false,$(this).parent().parent().parent().parent().attr('gamenum'));
			}
			else awardsdeletPaper($(this).parent().parent().parent().parent().attr('gamenum'));
		});
		$('.paper.awardspapertitle .motify').click(function(){			
			if($(this).hasClass('on')){
				$(this).removeClass('on');				
				awardsmotifyPaperEnd($(this).parent().parent().parent().parent().attr('gamenum'));
			}
			else{
				$(this).addClass('on');
				awardsmotifyPaper(true,$(this).parent().parent().parent().parent().attr('gamenum'));
			}
		});
		$(".new .gobtn").click(function(){awardsinsertPaper($(this).attr('gamenum'));});
		$('.paper.awarditem .delbtn').click(function(){	
			if($(this).parent().find('.motify').hasClass('on')){
				$(this).parent().find('.motify').removeClass('on');
				awarditemmotifyPaper(false,$(this).parent().attr('gamenum'),$(this).parent().attr('item'));
			}
			else awarditemdeletPaper($(this).parent().attr('gamenum'),$(this).parent().attr('item'));
		});
		$('.paper.awarditem .motify').click(function(){			
			if($(this).hasClass('on')){
				$(this).removeClass('on');				
				awarditemmotifyPaperEnd($(this).parent().attr('gamenum'),$(this).parent().attr('item'));				
			}
			else{
				$(this).addClass('on');
				awarditemmotifyPaper(true,$(this).parent().attr('gamenum'),$(this).parent().attr('item'));
			}
		});
		$('.menuin a').removeClass('on').eq(4).addClass('on');
		showLoading(false);
	}
	function awarditemdeletPaper(_num,_n){
		showLoading(true);
		webData.newPaperdata[_num].list.splice(_n,1);		
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards'+webData.nowpage+'/'+webData.newPaperdata[_num]._id.$oid+'?apiKey='+ webData.mlabApikey,
			type: 'PUT',
			contentType: 'application/json',
			data:JSON.stringify(webData.newPaperdata[_num]),
			success: function(data) {
				location.reload();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function awarditemmotifyPaperEnd(_num,_n){
		showLoading(true);
		webData.newPaperdata[_num].list[_n].name =$('.gamebox').eq(_num).find('.paper.awarditem li').eq(_n).find('.posttitle textarea').val().replace(/\n\r?/g, '<br>');
		webData.newPaperdata[_num].list[_n].word =$('.gamebox').eq(_num).find('.paper.awarditem li').eq(_n).find('.postdes textarea').val().replace(/\n\r?/g, '<br>');
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards'+webData.nowpage+'/'+webData.newPaperdata[_num]._id.$oid+'?apiKey='+ webData.mlabApikey,
			type: 'PUT',
			contentType: 'application/json',
			data:JSON.stringify(webData.newPaperdata[_num]),
			success: function(data) {
				location.reload();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function awarditemmotifyPaper(_t,_num,_n){
		if(_t){
			$('.gamebox').eq(_num).find('.paper.awarditem li').eq(_n).find('.posttitle').html('<textarea>'+$('.gamebox').eq(_num).find('.paper.awarditem li').eq(_n).find('.posttitle').html().replace(/<br>/g,'\n')+'</textarea>');
			$('.gamebox').eq(_num).find('.paper.awarditem li').eq(_n).find('.postdes').html('<textarea>'+$('.gamebox').eq(_num).find('.paper.awarditem li').eq(_n).find('.postdes').html().replace(/<br>/g,'\n')+'</textarea>');
		}
		else{
			$('.gamebox').eq(_num).find('.paper.awarditem li').eq(_n).find('.posttitle').html(webData.newPaperdata[_num].list[_n].name);
			$('.gamebox').eq(_num).find('.paper.awarditem li').eq(_n).find('.postdes').html(webData.newPaperdata[_num].list[_n].word);
		}
	}
	function awardsinsertPaper(_num){
		showLoading(true);
		webData.newPaperdata[_num].list.push({
			name:$('.gamebox').eq(_num).find('.new .username').val().replace(/\n\r?/g, '<br>'),
			word:$('.gamebox').eq(_num).find('.new .userdes').val().replace(/\n\r?/g, '<br>')
		});
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards'+webData.nowpage+'/'+webData.newPaperdata[_num]._id.$oid+'?apiKey='+ webData.mlabApikey,
			type: 'PUT',
			contentType: 'application/json',
			data:JSON.stringify(webData.newPaperdata[_num]),
			success: function(data) {
				location.reload();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function awardsmotifyPaper(_t,_num){
		if(_t){
			$('.gamebox').eq(_num).find('.paper.awardspapertitle').find('.posttitle').html('<textarea>'+$('.gamebox').eq(_num).find('.paper.awardspapertitle').find('.posttitle').html().replace(/<br>/g,'\n')+'</textarea>');
		}
		else $('.gamebox').eq(_num).find('.paper.awardspapertitle').find('.posttitle').html(webData.newPaperdata[_num].title);
	}
	function awardsmotifyPaperEnd(_num){
		showLoading(true);
		webData.newPaperdata[_num].title = $('.gamebox').eq(_num).find('.paper.awardspapertitle').find('.posttitle textarea').val().replace(/\n\r?/g, '<br>');		
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards'+webData.nowpage+'/'+webData.newPaperdata[_num]._id.$oid+'?apiKey='+ webData.mlabApikey,
			type: 'PUT',
			contentType: 'application/json',
			data:JSON.stringify(webData.newPaperdata[_num]),
			success: function(data) {
				location.reload();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function awardsdeletPaper(_num){
		showLoading(true);
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards'+webData.nowpage+'/'+webData.newPaperdata[_num]._id.$oid+'?apiKey='+ webData.mlabApikey,
			type: "DELETE",
			async: true,
			timeout: 300000,
			contentType: 'application/json',			
			success: function(data) {
				location.reload();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}	
	function learnfunction(){
		webData.learnload+=1;
		if(webData.learnload<2)return;
		for(var i=0;i<webData.learndata.length;i++){
			if(webData.learndata[i].collectname=="learning_page"){
				$('.paper').eq(0).append('<li><div class="postphoto"><img src="'+webData.learndata[i][0].photo +'"></div><div class="posttitle">'+webData.learndata[i][0].classinfo+'</div><div class="postdes">'+webData.learndata[i][0].classdes+'</div><div class="postid">　</div><div class="btn"><div title="修改" class="motify"></div></div></li>');
			}else if(webData.learndata[i].collectname=="learning_photo_page"){
				for(var j=0;j<webData.learndata[i].length;j++){
					$('.paper').eq(1).append('<li><div class="postphoto"><img src="'+webData.learndata[i][j].pic +'"></div><div class="btn"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>');
				}
			}
		}
		afterinsertLearndata();
	}
	function afterinsertLearndata(){
		$('.paper .delbtn').click(function(){	
			if($(this).parent().find('.motify').hasClass('on')){
				$(this).parent().find('.motify').removeClass('on');
				motifyPaper(false,$(this).parent().parent().index(),$(this).parent().parent().parent().attr('num'));
			}
			else deletPaper($(this).parent().parent().index(),$(this).parent().parent().parent().attr('num'));			
		});
		$('.paper .motify').click(function(){			
			if($(this).hasClass('on')){
				$(this).removeClass('on');				
				motifyPaperEnd($(this).parent().parent().index(),$(this).parent().parent().parent().attr('num'));
			}
			else{
				$(this).addClass('on');
				motifyPaper(true,$(this).parent().parent().index(),$(this).parent().parent().parent().attr('num'));
			}
		});
		$('.menuin a').removeClass('on').eq(3).addClass('on');
		showLoading(false);
	}	
	function newsfunction(data){
		$('.paper').html('');
		for(i in webData.newPaperdata){
			if(!webData.newPaperdata[i].bpic) webData.newPaperdata[i].bpic='images/space.png';
			if(!webData.newPaperdata[i].spic) webData.newPaperdata[i].spic='images/space.png';
			$('.paper').append('<li><div class="newsbpic"><img src="'+webData.newPaperdata[i].bpic +'"></div><div class="newsspic"><img src="'+webData.newPaperdata[i].spic +'"></div><div class="newstitle">'+webData.newPaperdata[i].title+'</div><div class="newssword">'+webData.newPaperdata[i].sword+'</div><div class="newsbword">'+webData.newPaperdata[i].bword+'</div><div class="btn"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>');
		}		
		afterinsertNewsdata();
	}
	function afterinsertNewsdata(){
		$('.paper .delbtn').click(function(){	
			if($(this).parent().find('.motify').hasClass('on')){
				$(this).parent().find('.motify').removeClass('on');
				motifyPaper(false,$(this).parent().parent().index());
			}
			else deletPaper($(this).parent().parent().index());			
		});
		$('.paper .motify').click(function(){			
			if($(this).hasClass('on')){
				$(this).removeClass('on');				
				motifyPaperEnd($(this).parent().parent().index());
			}
			else{
				$(this).addClass('on');
				motifyPaper(true,$(this).parent().parent().index());
			}
		});

		$('.menuin a').removeClass('on').eq(2).addClass('on');
		showLoading(false);
	}
	function aboutfunction(data){
		$('.paper').html('');
		for(i in webData.newPaperdata){
			var _img;
			if(!webData.newPaperdata[i].cover) _img='<img src="images/space.png">';
			else _img = '<img src="' + webData.newPaperdata[i].cover + '">';
			$('.paper').eq(0).append('<li><div class="postphoto">'+_img+'</div><div class="posttitle">'+webData.newPaperdata[i].title+'</div><div class="postdes">'+webData.newPaperdata[i].info+'</div><div class="postid">　</div><div class="btn"><div title="修改" class="motify"></div></div></li>');
		}
		for(i in webData.newPaperdata[0].list){
			var _img;
			if(!webData.newPaperdata[0].list[i].pic) _img='<img src="images/space.png">';
			else _img = '<img src="' + webData.newPaperdata[0].list[i].pic + '">';
			$('.paper').eq(1).append('<li><div class="postphoto">'+_img+'</div><div class="posttitle">'+webData.newPaperdata[0].list[i].name+'</div><div class="postdes">'+webData.newPaperdata[0].list[i].des+'</div><div class="postid">　</div><div class="btn"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>');
		}
		afterinsertAboutdata();
	}
	function afterinsertAboutdata(){
		$('.paper .delbtn').click(function(){	
			if($(this).parent().find('.motify').hasClass('on')){
				$(this).parent().find('.motify').removeClass('on');
				motifyPaper(false,$(this).parent().parent().index(),$(this).parent().parent().parent().attr('num'));
			}
			else deletPaper($(this).parent().parent().index(),$(this).parent().parent().parent().attr('num'));			
		});
		$('.paper .motify').click(function(){			
			if($(this).hasClass('on')){
				$(this).removeClass('on');				
				motifyPaperEnd($(this).parent().parent().index(),$(this).parent().parent().parent().attr('num'));
			}
			else{
				$(this).addClass('on');
				motifyPaper(true,$(this).parent().parent().index(),$(this).parent().parent().parent().attr('num'));
			}
		});
		$('.menuin a').removeClass('on').eq(1).addClass('on');
		showLoading(false);
	}
	/*不要動*/
	
	function motifyPaper(_t,_n,_num){
		if(_t){
			if(webData.motifyPapering){
				alert(webData.motifyerrortxt);
				if(_num){
					for(var i = 0; i<$('ul').length;i++){
						if($('ul').eq(i).attr('num')==_num) $('ul').eq(i).find('li').eq(_n).find('.motify').removeClass('on');
					}
				}
				else $('ul li').eq(_n).find('.motify').removeClass('on');
				return;
			}
			else webData.motifyPapering=true;
		}else webData.motifyPapering=false;
		//About
		if(webData.wrp.hasClass('about')){
			var _tmp = $('.paper').eq(_num).find('li').eq(_n);
			if(_t){
				_tmp.find('.posttitle').html('<textarea>'+_tmp.find('.posttitle').html().replace(/<br>/g,'\n')+'</textarea>');
				_tmp.find('.postdes').html('<textarea>'+_tmp.find('.postdes').html().replace(/<br>/g,'\n')+'</textarea>');
				_tmp.find('.postphoto').prepend('<input type="file" name="file" id="imgInputMotify" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify"><span>點擊更換</span></label>');
				$("#imgInputMotify").change(function(){readURL(this,$(this));});
			}else{			
				_tmp.find('.posttitle').html(_tmp.find('.posttitle textarea').val().replace(/\n\r?/g, '<br>'));
				_tmp.find('.postdes').html(_tmp.find('.postdes textarea').val().replace(/\n\r?/g, '<br>'));			
				_tmp.find('.postphoto').html('<img src="' + webData.newPaperdata[0].list[_n].pic + '">');
			}
		}
		//News
		else if(webData.wrp.hasClass('news')){
			var _tmp = $('.paper').find('li').eq(_n);
			if(_t){				
				_tmp.find('.newstitle').html('<textarea>'+_tmp.find('.newstitle').html().replace(/<br>/g,'\n')+'</textarea>');
				_tmp.find('.newsbword').html('<textarea>'+_tmp.find('.newsbword').html().replace(/<br>/g,'\n')+'</textarea>');
				_tmp.find('.newssword').html('<textarea>'+_tmp.find('.newssword').html().replace(/<br>/g,'\n')+'</textarea>');
				_tmp.find('.newsbpic').prepend('<input type="file" name="file" id="imgInputMotify" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify"><span>點擊更換</span></label>');
				$("#imgInputMotify").change(function(){readURL(this,$(this),0);});
				_tmp.find('.newsspic').prepend('<input type="file" name="file" id="imgInputMotify2" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify2"><span>點擊更換</span></label>');
				$("#imgInputMotify2").change(function(){readURL(this,$(this),1);});
			}else{			
				_tmp.find('.newstitle').html(_tmp.find('.newstitle textarea').val().replace(/\n\r?/g, '<br>'));
				_tmp.find('.newsbword').html(_tmp.find('.newsbword textarea').val().replace(/\n\r?/g, '<br>'));
				_tmp.find('.newssword').html(_tmp.find('.newssword textarea').val().replace(/\n\r?/g, '<br>'));
				_tmp.find('.newsbpic').html('<img src="' + webData.newPaperdata[_n].bpic + '">');
				_tmp.find('.newsspic').html('<img src="' + webData.newPaperdata[_n].spic + '">');				
			}
		}
		//learn
		else if(webData.wrp.hasClass('learn')){
			var _tmp = $('.paper').eq(_num).find('li').eq(_n);
			if(_t){
				if(_num==0){
					_tmp.find('.posttitle').html('<textarea>'+_tmp.find('.posttitle').html().replace(/<br>/g,'\n')+'</textarea>');
					_tmp.find('.postdes').html('<textarea>'+_tmp.find('.postdes').html().replace(/<br>/g,'\n')+'</textarea>');					
				}
				_tmp.find('.postphoto').prepend('<input type="file" name="file" id="imgInputMotify" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify"><span>點擊更換</span></label>');
				$("#imgInputMotify").change(function(){readURL(this,$(this));});				
			}else{	
				_tmp.find('.postphoto').html('<img src="' + webData.learndata[1][_n].pic + '">');
			}
		}
		//link
		else if(webData.wrp.hasClass('link')){
			var _tmp = $('.paper li').eq(_n);			
			if(_t){				
				_tmp.find('.posttitle').html('<textarea>'+_tmp.find('.posttitle a').html()+'</textarea>');								
				_tmp.find('.postphoto').prepend('<input type="file" name="file" id="imgInputMotify" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify"><span>點擊更換</span></label>');
				$("#imgInputMotify").change(function(){readURL(this,$(this));});				
			}else{	
				_tmp.find('.posttitle').html('<a href="'+webData.newPaperdata[_n].link+'">'+webData.newPaperdata[_n].link+'</a>');
				_tmp.find('.postphoto').html('<img src="' + webData.newPaperdata[_n].pic + '">');
			}
		}	
		//contact
		else if(webData.wrp.hasClass('contact')){
			if(_t) $('.paper_addr li').eq(_n).find('.posttitle').html('<textarea>'+ $('.paper_addr li').eq(_n).find('.posttitle').html().replace(/<br>/g,'\n')+'</textarea>');
			else $('.paper_addr li').eq(_n).find('.posttitle').html(webData.learndata[_num][_n].addr);
		}	
		//index
		else if(webData.wrp.hasClass('index')){
			if(webData.learndata[_num].collectname=="index_banner"){
				var _tmp = $('.paper.banner li').eq(_n);
				if(_t){
					_tmp.find('.postphoto').prepend('<input type="file" name="file" id="imgInputMotify" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify"><span>點擊更換</span></label>');
					$("#imgInputMotify").change(function(){readURL(this,$(this),0);});				
				}else{						
					_tmp.find('.postphoto').html('<img src="' + webData.learndata[_num][_n].pic + '">');
				}
			}
			else if(webData.learndata[_num].collectname=="index_photo"){
				var _tmp = $('.paper.photo li').eq(_n);
				if(_t){
					_tmp.find('.postphoto').prepend('<input type="file" name="file" id="imgInputMotify2" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify2"><span>點擊更換</span></label>');
					$("#imgInputMotify2").change(function(){readURL(this,$(this),1);});				
				}else{	
					_tmp.find('.postphoto').html('<img src="' + webData.learndata[_num][_n].pic + '">');
				}
			}
			else if(webData.learndata[_num].collectname=="index_video"){
				var _tmp = $('.paper.video li').eq(_n);
				if(_t){
					_tmp.find('.posttitle').html('<textarea>'+_tmp.find('.posttitle a').html()+'</textarea>');
				}else{	
					_tmp.find('.posttitle').html('<a href="'+webData.learndata[_num][_n].video+'">'+webData.learndata[_num][_n].video+'</a>');					
				}
			}			
		}				
	}
	function motifyPaperEnd(_n,_num){		
		showLoading(true);
		//About
		if(webData.wrp.hasClass('about')){
			webData._n = _n;
			webData._num = _num;
			if($('.paper').eq(_num).find('li').eq(_n).find('.postphoto').find('img').hasClass('on')) uploadimgtoImgur(webData.uploadImg,motifyPaperFinal);
			else{
				webData.uploadImgTrue = $('.paper').eq(_num).find('li').eq(_n).find('.postphoto').find('img').attr('src');
				motifyPaperFinal();
			}
		}
		//News
		else if(webData.wrp.hasClass('news')){
			webData._n = _n;
			webData.newspiccheck=0;
			if($('.paper').find('li').eq(_n).find('.newsbpic').find('img').hasClass('on')) uploadimgtoImgur(webData.uploadImgbpic,motifyPaperFinal,0);
			else{webData.newspiccheck+=1; webData.uploadImgbpic = $('.paper').find('li').eq(_n).find('.newsbpic').find('img').attr('src');}
			if($('.paper').find('li').eq(_n).find('.newsspic').find('img').hasClass('on')) uploadimgtoImgur(webData.uploadImgspic,motifyPaperFinal,1);
			else{webData.newspiccheck+=1; webData.uploadImgspic = $('.paper').find('li').eq(_n).find('.newsspic').find('img').attr('src');}
			motifyPaperFinal();
		}
		//learn
		else if(webData.wrp.hasClass('learn')){
			webData._n = _n;
			webData._num = _num;
			if($('.paper').eq(_num).find('li').eq(_n).find('.postphoto').find('img').hasClass('on')) uploadimgtoImgur(webData.uploadImg,motifyPaperFinal);
			else{
				webData.uploadImgTrue = $('.paper').eq(_num).find('li').eq(_n).find('.postphoto').find('img').attr('src');
				motifyPaperFinal();
			}
		}
		//link
		else if(webData.wrp.hasClass('link')){
			webData._n = _n;			
			if($('.paper li').eq(_n).find('.postphoto').find('img').hasClass('on')) uploadimgtoImgur(webData.uploadImg,motifyPaperFinal);
			else{
				webData.uploadImgTrue = $('.paper li').eq(_n).find('.postphoto').find('img').attr('src');
				motifyPaperFinal();
			}
		}
		//contact
		else if(webData.wrp.hasClass('contact')){
			webData._n = _n;	
			webData._num = _num;			
			motifyPaperFinal();			
		}
		//index
		else if(webData.wrp.hasClass('index')){
			webData._n = _n;	
			webData._num = _num;
			if(webData.learndata[webData._num].collectname == "index_banner"){
				if($('.paper.banner li').eq(webData._n).find('.postphoto').find('img').hasClass('on')) uploadimgtoImgur(webData.uploadImgindexbannerpic,motifyPaperFinal);
				else{
					webData.uploadImgTrue = $('.paper.banner li').eq(webData._n).find('.postphoto').find('img').attr('src');
					motifyPaperFinal();
				}
			}
			else if(webData.learndata[webData._num].collectname == "index_photo"){
				if($('.paper.photo li').eq(webData._n).find('.postphoto').find('img').hasClass('on')) uploadimgtoImgur(webData.uploadImgindexphotopic,motifyPaperFinal);
				else{
					webData.uploadImgTrue = $('.paper.photo li').eq(webData._n).find('.postphoto').find('img').attr('src');
					motifyPaperFinal();
				}
			}
			else if(webData.learndata[webData._num].collectname == "index_video"){				
				motifyPaperFinal();
			}
		}
	}	
	function motifyPaperFinal(){
		if(webData.wrp.hasClass('about')){
			if(webData._num==0){
				webData.newPaperdata[0].title = $('.paper').eq(webData._num).find('li').eq(webData._n).find('.posttitle').find('textarea').val().replace(/\n\r?/g, '<br>');
				webData.newPaperdata[0].info = $('.paper').eq(webData._num).find('li').eq(webData._n).find('.postdes').find('textarea').val().replace(/\n\r?/g, '<br>');
				webData.newPaperdata[0].cover = webData.uploadImgTrue;			
			}else if(webData._num==1){
				webData.newPaperdata[0].list[webData._n].name = $('.paper').eq(webData._num).find('li').eq(webData._n).find('.posttitle').find('textarea').val().replace(/\n\r?/g, '<br>');
				webData.newPaperdata[0].list[webData._n].des = $('.paper').eq(webData._num).find('li').eq(webData._n).find('.postdes').find('textarea').val().replace(/\n\r?/g, '<br>');
				webData.newPaperdata[0].list[webData._n].pic = webData.uploadImgTrue;			
			}
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/aboutus_page'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
				type: 'PUT',
				contentType: 'application/json',
				data:JSON.stringify(webData.newPaperdata),
				success: function(data) {
					getDataCollection('aboutus_page',aboutfunction);
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
		else if(webData.wrp.hasClass('news')){
			if(webData.newspiccheck<2) return;
			webData.newPaperdata[webData._n].title = $('.paper').find('li').eq(webData._n).find('.newstitle').find('textarea').val().replace(/\n\r?/g, '<br>');
			webData.newPaperdata[webData._n].spic = webData.uploadImgspic;
			webData.newPaperdata[webData._n].bpic = webData.uploadImgbpic;
			webData.newPaperdata[webData._n].date = new Date().getFullYear()+"/"+ (new Date().getMonth()*1+1) + "/"+new Date().getDate() + "星期"+changeDay(new Date().getDay());
			webData.newPaperdata[webData._n].sword = $('.paper').find('li').eq(webData._n).find('.newssword').find('textarea').val().replace(/\n\r?/g, '<br>');
			webData.newPaperdata[webData._n].bword = $('.paper').find('li').eq(webData._n).find('.newsbword').find('textarea').val().replace(/\n\r?/g, '<br>');
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/news_page'+webData.nowpage+'/'+webData.newPaperdata[webData._n]._id.$oid+'?apiKey='+ webData.mlabApikey,
				type: 'PUT',
				contentType: 'application/json',
				data:JSON.stringify(webData.newPaperdata[webData._n]),
				success: function(data) {
					getDataCollection('news_page',newsfunction);
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
		else if(webData.wrp.hasClass('learn')){
			if(webData._num==0){
				webData.learndata[0][0].classinfo = $('.paper').eq(webData._num).find('li').eq(webData._n).find('.posttitle').find('textarea').val().replace(/\n\r?/g, '<br>');
				webData.learndata[0][0].classdes = $('.paper').eq(webData._num).find('li').eq(webData._n).find('.postdes').find('textarea').val().replace(/\n\r?/g, '<br>');
				webData.learndata[0][0].photo = webData.uploadImgTrue;
				webData.learndata[0][0].title = webData.learndata[0][0].title;
				console.log(webData.learndata[0][0].title);
				$.ajax({
					url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/learning_page'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
					type: 'PUT',
					contentType: 'application/json',
					data:JSON.stringify(webData.learndata[0]),
					success: function(data) {
						location.reload();
					},error: function(xhr, textStatus, errorThrown) {             
						console.log("error:", xhr, textStatus, errorThrown);
					}
				});
			}else if(webData._num==1){
				webData.learndata[1][webData._n].pic = webData.uploadImgTrue;
				$.ajax({
					url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/learning_photo_page'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
					type: 'PUT',
					contentType: 'application/json',
					data:JSON.stringify(webData.learndata[1]),
					success: function(data) {
						location.reload();
					},error: function(xhr, textStatus, errorThrown) {             
						console.log("error:", xhr, textStatus, errorThrown);
					}
				});
			}			
		}
		else if(webData.wrp.hasClass('link')){			
			webData.newPaperdata[webData._n].link = $('.paper li').eq(webData._n).find('.posttitle textarea').val();
			webData.newPaperdata[webData._n].pic = webData.uploadImgTrue;			
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/otherlink'+webData.nowpage+'/'+webData.newPaperdata[webData._n]._id.$oid+'?apiKey='+ webData.mlabApikey,
				type: 'PUT',
				contentType: 'application/json',
				data:JSON.stringify(webData.newPaperdata[webData._n]),
				success: function(data) {
					location.reload();
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});	
		}
		else if(webData.wrp.hasClass('contact')){
			webData.learndata[webData._num][webData._n].addr = $('.paper_addr li').eq(webData._n).find('.posttitle textarea').val();
			if(!webData.learndata[webData._num][webData._n].addr){alert(webData.creatUsererrortxt);return;}
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/contactus'+webData.nowpage+'/'+webData.learndata[webData._num][webData._n]._id.$oid+'?apiKey='+ webData.mlabApikey,
				type: 'PUT',
				contentType: 'application/json',
				data:JSON.stringify(webData.learndata[webData._num][webData._n]),
				success: function(data) {
					location.reload();
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});	
		}
		else if(webData.wrp.hasClass('index')){			
			if(webData.learndata[webData._num].collectname == "index_banner"){
				webData.learndata[webData._num][webData._n].pic = webData.uploadImgTrue;				
				$.ajax({
					url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/index_banner'+webData.nowpage+'/'+webData.learndata[webData._num][webData._n]._id.$oid+'?apiKey='+ webData.mlabApikey,
					type: 'PUT',
					contentType: 'application/json',
					data:JSON.stringify(webData.learndata[webData._num][webData._n]),
					success: function(data) {
						location.reload();
					},error: function(xhr, textStatus, errorThrown) {
						console.log("error:", xhr, textStatus, errorThrown);
					}
				});
			}
			else if(webData.learndata[webData._num].collectname == "index_photo"){
				webData.learndata[webData._num][webData._n].pic = webData.uploadImgTrue;				
				$.ajax({
					url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/index_photo'+webData.nowpage+'/'+webData.learndata[webData._num][webData._n]._id.$oid+'?apiKey='+ webData.mlabApikey,
					type: 'PUT',
					contentType: 'application/json',
					data:JSON.stringify(webData.learndata[webData._num][webData._n]),
					success: function(data) {
						location.reload();
					},error: function(xhr, textStatus, errorThrown) {
						console.log("error:", xhr, textStatus, errorThrown);
					}
				});
			}
			else if(webData.learndata[webData._num].collectname == "index_video"){				
				webData.learndata[webData._num][webData._n].video = $('.paper.video li').eq(webData._n).find('.posttitle textarea').val();
				if(!webData.learndata[webData._num][webData._n].video){alert(webData.creatUsererrortxt);return;}
				$.ajax({
					url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/index_video'+webData.nowpage+'/'+webData.learndata[webData._num][webData._n]._id.$oid+'?apiKey='+ webData.mlabApikey,
					type: 'PUT',
					contentType: 'application/json',
					data:JSON.stringify(webData.learndata[webData._num][webData._n]),
					success: function(data) {
						location.reload();
					},error: function(xhr, textStatus, errorThrown) {
						console.log("error:", xhr, textStatus, errorThrown);
					}
				});
			}
		}
	}
	function deletPaper(_n,_num){
		showLoading(true);
		if(webData.wrp.hasClass('about')){
			webData.newPaperdata[0].list.splice(_n,1);
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/aboutus_page'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
				type: 'PUT',
				contentType: 'application/json',
				data:JSON.stringify(webData.newPaperdata),
				success: function(data) {
					getDataCollection('aboutus_page',aboutfunction);
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}		
		else if(webData.wrp.hasClass('news')){
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/news_page'+webData.nowpage+'/'+webData.newPaperdata[_n]._id.$oid+'?apiKey='+ webData.mlabApikey,
				type: "DELETE",
				async: true,
				timeout: 300000,
				contentType: 'application/json',			
				success: function(data) {
					getDataCollection('news_page',newsfunction);
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
		else if(webData.wrp.hasClass('learn')){
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/learning_photo_page'+webData.nowpage+'/'+webData.learndata[_num][_n]._id.$oid+'?apiKey='+ webData.mlabApikey,
				type: "DELETE",
				async: true,
				timeout: 300000,
				contentType: 'application/json',			
				success: function(data) {
					location.reload();
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
		else if(webData.wrp.hasClass('link')){
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/otherlink'+webData.nowpage+'/'+webData.newPaperdata[_n]._id.$oid+'?apiKey='+ webData.mlabApikey,
				type: "DELETE",
				async: true,
				timeout: 300000,
				contentType: 'application/json',			
				success: function(data) {
					location.reload();
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
		else if(webData.wrp.hasClass('contact')){
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/emailbox'+webData.nowpage+'/'+webData.learndata[_num][_n]._id.$oid+'?apiKey='+ webData.mlabApikey,
				type: "DELETE",
				async: true,
				timeout: 300000,
				contentType: 'application/json',			
				success: function(data) {
					location.reload();
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
		else if(webData.wrp.hasClass('index')){
			var _url;
			if(webData.learndata[_num].collectname=="index_banner"){
				_url = 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/index_banner'+webData.nowpage+'/'+webData.learndata[_num][_n]._id.$oid+'?apiKey='+ webData.mlabApikey;
			}
			else if(webData.learndata[_num].collectname=="index_photo"){
				_url = 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/index_photo'+webData.nowpage+'/'+webData.learndata[_num][_n]._id.$oid+'?apiKey='+ webData.mlabApikey;
			}
			else if(webData.learndata[_num].collectname=="index_video"){
				_url = 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/index_video'+webData.nowpage+'/'+webData.learndata[_num][_n]._id.$oid+'?apiKey='+ webData.mlabApikey;
			}			
			$.ajax({
				url: _url,
				type: "DELETE",
				async: true,
				timeout: 300000,
				contentType: 'application/json',			
				success: function(data) {
					location.reload();
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
	}
	function indexreadURL(input,_o,_n){
		if (input.files && input.files[0]) {
            var reader = new FileReader();            
            reader.onload = function (e) {
            	if(_n == 0) webData.indexbanneruploadImg = e.target.result.replace(/.*,/, '');
            	else webData.indexphotouploadImg = e.target.result.replace(/.*,/, '');	            	
            	_o.parent().addClass('on').find('img').addClass('on').attr('src',e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
	}
	function newsreadURL(input,_o,_n){
		if (input.files && input.files[0]) {
            var reader = new FileReader();            
            reader.onload = function (e) {
            	if(_n == 0) webData.newsuploadImgbpic = e.target.result.replace(/.*,/, '');
            	else webData.newsuploadImgspic = e.target.result.replace(/.*,/, '');	            	
            	_o.parent().addClass('on').find('img').addClass('on').attr('src',e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
	}
	function readURL(input,_o,_n) {
		if(webData.wrp.hasClass('about') || webData.wrp.hasClass('learn') || webData.wrp.hasClass('link')){
			if (input.files && input.files[0]) {
	            var reader = new FileReader();            
	            reader.onload = function (e) {
	            	webData.uploadImg = e.target.result.replace(/.*,/, '');
	            	_o.parent().addClass('on').find('img').addClass('on').attr('src',e.target.result);
	            }
	            reader.readAsDataURL(input.files[0]);
	        }
		}
		else if(webData.wrp.hasClass('news')){
			if (input.files && input.files[0]) {
	            var reader = new FileReader();            
	            reader.onload = function (e) {
	            	if(_n == 0) webData.uploadImgbpic = e.target.result.replace(/.*,/, '');
	            	else webData.uploadImgspic = e.target.result.replace(/.*,/, '');	            	
	            	_o.parent().addClass('on').find('img').addClass('on').attr('src',e.target.result);
	            }
	            reader.readAsDataURL(input.files[0]);
	        }
		}
		else if(webData.wrp.hasClass('index')){
			if (input.files && input.files[0]) {
	            var reader = new FileReader();            
	            reader.onload = function (e) {
	            	if(_n == 0) webData.uploadImgindexbannerpic = e.target.result.replace(/.*,/, '');
	            	else webData.uploadImgindexphotopic = e.target.result.replace(/.*,/, '');	            	
	            	console.log(_o.parent().addClass('on').find('img').addClass('on'));
	            	_o.parent().addClass('on').find('img').addClass('on').attr('src',e.target.result);
	            }
	            reader.readAsDataURL(input.files[0]);
	        }
		}        
    }
	function insertPaper(){
		if(webData.wrp.hasClass('about')){
			webData.posttitleval = $('.new .posttitle').val();
			webData.postdesval = $('.new .postdes').val();
			if(!webData.posttitleval || !webData.postdesval){
				alert(webData.creatUsererrortxt);
				return;
			}
			showLoading(true);
			if(webData.uploadImg){
				uploadimgtoImgur(webData.uploadImg,insertPaperEnd);
			}
			else insertPaperEnd();	
		}
		else if(webData.wrp.hasClass('news')){
			webData.insertdata = {
				title:$('.new .newstitle').val().replace(/\n\r?/g, '<br>'),
				date:new Date().getFullYear()+"/"+ (new Date().getMonth()*1+1) + "/"+new Date().getDate() + "星期"+changeDay(new Date().getDay()),
				sword:$('.new .newssword').val().replace(/\n\r?/g, '<br>'),
				bword:$('.new .newsbword').val().replace(/\n\r?/g, '<br>')
			};
			
			if(!webData.insertdata.title || !webData.insertdata.sword || !webData.insertdata.bword){
				alert(webData.creatUsererrortxt);
				return;
			}
			showLoading(true);
			webData.newsinsertpiccheck =0;
			if(webData.newsuploadImgbpic) newsuploadimgtoImgur(webData.newsuploadImgbpic,insertPaperEnd,0);
			else{webData.newsinsertpiccheck+=1;webData.newsuploadImgbpic = 'images/space.png';}
			if(webData.newsuploadImgspic) newsuploadimgtoImgur(webData.newsuploadImgspic,insertPaperEnd,1);
			else{webData.newsinsertpiccheck+=1;webData.newsuploadImgspic = 'images/space.png';}
			insertPaperEnd();
		}
		else if(webData.wrp.hasClass('learn')){
			showLoading(true);
			if(webData.uploadImg) uploadimgtoImgur(webData.uploadImg,insertPaperEnd);
			else alert(webData.creatUsererrortxt);
		}
		else if(webData.wrp.hasClass('link')){
			showLoading(true);
			webData.insertdata={link: $('.new .posttitle').val()};
			if(!webData.insertdata.link){alert(webData.creatUsererrortxt);return;}
			if(webData.uploadImg) uploadimgtoImgur(webData.uploadImg,insertPaperEnd);
			else alert(webData.creatUsererrortxt);
		}
	}	
	function insertPaperEnd(){		
		if(webData.wrp.hasClass('about')){
			webData.newPaperdata[0].list.push({
				name:webData.posttitleval.replace(/\n\r?/g, '<br>'),
				des:webData.postdesval.replace(/\n\r?/g, '<br>'),
				pic:webData.uploadImgTrue,
			});
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/aboutus_page'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
				type: 'PUT',
				contentType: 'application/json',
				data:JSON.stringify(webData.newPaperdata),
				success: function(data) {
					clearForm();
					getDataCollection('aboutus_page',aboutfunction);
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
		else if(webData.wrp.hasClass('news')){
			if(webData.newsinsertpiccheck<2) return;
			webData.insertdata.bpic = webData.newsuploadImgbpic;
			webData.insertdata.spic = webData.newsuploadImgspic;
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/news_page'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
				type: 'POST',
				contentType: 'application/json',
				data:JSON.stringify(webData.insertdata),
				success: function(data) {
					location.reload();
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
		else if(webData.wrp.hasClass('learn')){
			webData.insertdata={pic:webData.uploadImgTrue};
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/learning_photo_page'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
				type: 'POST',
				contentType: 'application/json',
				data:JSON.stringify(webData.insertdata),
				success: function(data) {
					location.reload();
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
		else if(webData.wrp.hasClass('link')){
			webData.insertdata.pic=webData.uploadImgTrue;
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/otherlink'+webData.nowpage+'?apiKey='+ webData.mlabApikey,
				type: 'POST',
				contentType: 'application/json',
				data:JSON.stringify(webData.insertdata),
				success: function(data) {
					location.reload();
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}
	}	
	function newsuploadimgtoImgur(_imgurl,callback,_n){
		$.ajax({
            url: 'https://api.imgur.com/3/image',
            method: 'POST',
            headers: {
              Authorization: 'Bearer '+webData.imgurToken,
              Accept: 'application/json'
            },
            data: {
              image: _imgurl,
              type: 'base64'
            },
            success: function(result) {            	
            	if(webData.wrp.hasClass('news')){
            		webData.newsinsertpiccheck+=1;
            		if(_n==0) webData.newsuploadImgbpic = result.data.link;
            		else webData.newsuploadImgspic = result.data.link;
            	}
            	callback();
            },error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
				window.location.href = 'https://api.imgur.com/oauth2/authorize?response_type=token&client_id='+webData.imgurappid;
			}
        });        
	}
	function uploadimgtoImgur(_imgurl,callback,_n){
		$.ajax({
            url: 'https://api.imgur.com/3/image',
            method: 'POST',
            headers: {
              Authorization: 'Bearer '+webData.imgurToken,
              Accept: 'application/json'
            },
            data: {
              image: _imgurl,
              type: 'base64'
            },
            success: function(result) {
            	if(webData.wrp.hasClass('about') || webData.wrp.hasClass('learn') || webData.wrp.hasClass('link') || webData.wrp.hasClass('index')) webData.uploadImgTrue = result.data.link;
            	if(webData.wrp.hasClass('news')){
            		webData.newspiccheck+=1;
            		if(_n==0) webData.uploadImgbpic = result.data.link;
            		else webData.uploadImgspic = result.data.link;
            	}
            	callback();
            },error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
				window.location.href = 'https://api.imgur.com/oauth2/authorize?response_type=token&client_id='+webData.imgurappid;
			}
        });        
	}
	function getDataCollection(_collectname,_callback){
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/'+_collectname+webData.nowpage+'?s={"_id":-1}&apiKey='+ webData.mlabApikey,
			type: 'GET',
			contentType: 'application/json',
			success: function(data) {
				webData.newPaperdata = data;
				_callback(data);
			},error: function(xhr, textStatus, errorThrown) {
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function getDataLearnCollection(_collectname,_callback){
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/'+_collectname+webData.nowpage+'?s={"_id":-1}&apiKey='+ webData.mlabApikey,
			type: 'GET',
			contentType: 'application/json',
			success: function(data) {
				webData.learndata.push(data);
				webData.learndata[webData.learndata.length-1].collectname = _collectname;
				_callback();
			},error: function(xhr, textStatus, errorThrown) {
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function changeDay(_d){		
		if(_d==0) _d="日";
		else if(_d==1) _d="一";
		else if(_d==2) _d="二";
		else if(_d==3) _d="三";
		else if(_d==4) _d="四";
		else if(_d==5) _d="五";
		else if(_d==6) _d="六";
		return _d;
	}
	function menuaclick(_o){
		window.location.href = _o.attr('gopage') + "#access_token=" + window.location.href.split('#access_token=')[1];
	}
	function logout(){
		$.cookie("useraccount", '');
		$.cookie("userpassword", '');
		window.location.href="index.html";
	}	
	function checkLogin(){
		var _t = false;
		if($.cookie("useraccount") && $.cookie("userpassword")) _t = true;
		return _t;
	}
	function clearForm(){
		webData.posttitleval = '';
		webData.nowtime = '';
		webData.postdesval = '';
		webData.uploadImg='';
		webData.uploadImgTrue='';
		$('.new .posttitle').val('');
		$('.new .postdes').val('');
		$('.new .addImg').removeClass('on').find('img').attr('src','');		
	}	
	function showLoading(_t){
		if(_t) $('.loading').fadeIn();
		else{
			if(!$('.loading').hasClass('on')) $('.loading').addClass('on');
			$('.loading').fadeOut();
		}
	}
	
})//ready end  
function getUrlVars(){
  var vars=[],hash;var hashes=window.location.href.slice(window.location.href.indexOf('?')+1).split('&');
  for(var i=0;i<hashes.length;i++){hash=hashes[i].split('=');vars.push(hash[0]);vars[hash[0]]=hash[1]}
  return vars
}
