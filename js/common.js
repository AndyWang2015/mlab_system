$(document).ready(function(){
	var webData ={};
	webData.mlabApikey = "n6FXodWWCdM14KrePZHrRPPovbzboRn6";
	webData.loginerrortxt = "帳號或密碼錯誤，請重新輸入";

	//Addlistener
	$('.login_pagein .surebtn').click(function(){userlogin();});	
	$(".gobtn").click(function(){insertPaper();});

	$(window).load(function(){
		showLoading(false);
	});

	//Event
	function clearlogin(){
		$('.login_pagein').find('input').val('');
	}
	function userlogin(){
		var _url = 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/user?q={useraccount:"'+$('.login_page .useraccount').val()+'",userpassword:"'+ $('.login_page .userpassword').val() +'"}&apiKey='+ webData.mlabApikey;
		showLoading(true);
		$.ajax({
			url: _url,
			type: 'GET',
			contentType: 'application/json',
			success: function(data) {
				console.log(data);
				webData.islogin = data;
				afterLogin();
				clearlogin();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function afterLogin(){
		if(webData.islogin!=''){			
			showlogin_page(false);
			getPaper();
		}else{			
			showLoading(false);
			alert(webData.loginerrortxt);			
		}
	}
	function deletPaper(_n){
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/paperid/'+webData.newPaperdata[_n]._id.$oid+'?apiKey='+ webData.mlabApikey,
			type: "DELETE",
			async: true,
			timeout: 300000,
			contentType: 'application/json',			
			success: function(data) {				
				getPaper();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function motifyPaper(_n){
		$('.paper li').eq(_n).find('.posttitle').html('<textarea>'+$('.paper li').eq(_n).find('.posttitle').text()+'</textarea>');
		$('.paper li').eq(_n).find('.postdes').html('<textarea>'+$('.paper li').eq(_n).find('.postdes').text()+'</textarea>');
	}
	function motifyPaperEnd(_n){
		showLoading(true);
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/paperid/'+webData.newPaperdata[_n]._id.$oid+'?apiKey='+ webData.mlabApikey,
			type: 'PUT',
			contentType: 'application/json',
			data:JSON.stringify({
				postdate:new Date(),
				postdes:$('.paper li').eq(_n).find('.postdes').find('textarea').val(),
				postid:webData.newPaperdata[_n].postid,
				posttitle:$('.paper li').eq(_n).find('.posttitle').find('textarea').val(),
			}),
			success: function(data) {
				console.log(data);
				getPaper();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function getPaper(){		
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/paperid?apiKey='+ webData.mlabApikey,
			type: 'GET',
			contentType: 'application/json',
			success: function(data) {				
				webData.newPaperdata = data;
				putPaper();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function putPaper(){
		$('.paper').html('');
		for(i in webData.newPaperdata){			
			$('.paper').append('<li><div class="postid">'+webData.newPaperdata[i].postdate+'</div><div class="posttitle">'+webData.newPaperdata[i].posttitle+'</div><div class="postdes">'+webData.newPaperdata[i].postdes+'</div><div class="btn"><div class="motify"></div><div class="delbtn"></div></div></li>');
		}
		$('.paper .delbtn').click(function(){
			deletPaper($(this).parent().parent().index());
		});
		$('.paper .motify').click(function(){
			if($(this).hasClass('on')){
				$(this).removeClass('on');
				motifyPaperEnd($(this).parent().parent().index());
			}
			else{
				$(this).addClass('on');
				motifyPaper($(this).parent().parent().index());
			}
		});
		showLoading(false);
	}
	function insertPaper(){
		webData.nowtime = new Date();
		webData.posttitleval = $('.new .posttitle').val();
		webData.postdesval = $('.new .postdes').val();
		if(!webData.posttitleval || !webData.nowtime || !webData.postdesval){
			alert("請填寫資料內容");
			return;
		}
		showLoading(true);
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/paperid?apiKey='+ webData.mlabApikey,
			type: 'POST',
			contentType: 'application/json',
			data:JSON.stringify({
				postdate:webData.nowtime,
				postdes:webData.postdesval,
				postid:"0000",
				posttitle:webData.posttitleval,
			}),
			success: function(data) {				
				clearForm();
				getPaper();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function clearForm(){
		webData.posttitleval = '';
		webData.nowtime = '';
		webData.postdesval = '';
		$('.new .posttitle').val('');
		$('.new .postdes').val('');
	}
	function showlogin_page(_t){		
		if(_t) $('.login_page').fadeIn();
		else $('.login_page').fadeOut();
	}
	function showLoading(_t){
		if(_t) $('.loading').fadeIn();
		else $('.loading').fadeOut();
	}
	
})//ready end  
































































































