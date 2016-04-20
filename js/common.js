$(document).ready(function(){
	var webData ={};
	webData.mlabApikey = "n6FXodWWCdM14KrePZHrRPPovbzboRn6";
	webData.loginerrortxt = "帳號或密碼錯誤，請重新輸入";
	webData.signerrortxt = "此帳號有人註冊過，請換一個帳號";
	webData.creatUsererrortxt = "請填寫完整資料";
	

	//Addlistener
	$('.userMenu .logoutbtn').click(function(){logout();});
	$('.login_pagein .submitbtn').click(function(){signup();});
	$('.login_pagein .cancelbtn').click(function(){gosignup(false);});
	$('.login_pagein .singupbtn').click(function(){gosignup(true);});
	$('.login_pagein .surebtn').click(function(){userlogin($('.login_page .useraccount').val(),$('.login_page .userpassword').val());});	
	$(".andy_test .new .gobtn").click(function(){insertPaper();});

	$(window).load(function(){
		if(checkLogin()) userlogin($.cookie("useraccount"),$.cookie("userpassword"));
		else showLoading(false);
	});

	//Event
	function logout(){
		$.cookie("useraccount", '');
		$.cookie("userpassword", '');
		location.reload();
	}
	function signup(){
		var _url = 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/user?q={useraccount:"'+$('.login_page .signaccount').val()+'"}&apiKey='+ webData.mlabApikey;
		showLoading(true);
		$.ajax({
			url: _url,
			type: 'GET',
			contentType: 'application/json',
			success: function(data) {
				webData.issignup = data;
				afterSignup();
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function afterSignup(){
		if(webData.issignup ==''){			
			if(!$('.login_page_sign .signname').val() || !$('.login_page_sign .signpassword').val() || !$('.login_page_sign .signaccount').val() || !$('.login_page_sign .signemail').val()){
				alert(webData.creatUsererrortxt);
				showLoading(false);
				return;
			}
			$.ajax({
				url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/user?apiKey='+ webData.mlabApikey,
				type: 'POST',
				contentType: 'application/json',
				data:JSON.stringify({
					username:$('.login_page_sign .signname').val(),
					userpassword:$('.login_page_sign .signpassword').val(),
					useraccount:$('.login_page_sign .signaccount').val(),
					useremail:$('.login_page_sign .signemail').val(),
				}),
				success: function(data) {				
					showLoading(false);
					$('.msg').fadeIn();
					setTimeout(function(){$('.msg').fadeOut();},5000);
					clearForm();
					gosignup(false);
				},error: function(xhr, textStatus, errorThrown) {             
					console.log("error:", xhr, textStatus, errorThrown);
				}
			});
		}else{			
			showLoading(false);
			alert(webData.signerrortxt);
		}
	}
	function gosignup(_t){
		if(_t) $('.login_pagein').addClass('on');
		else $('.login_pagein').removeClass('on');
	}	
	function userlogin(_useraccount,_userpassword){
		var _url = 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/user?q={useraccount:"'+_useraccount+'",userpassword:"'+ _userpassword +'"}&apiKey='+ webData.mlabApikey;
		showLoading(true);
		$.ajax({
			url: _url,
			type: 'GET',
			contentType: 'application/json',
			success: function(data) {
				webData.islogin = data;
				clearForm();
				afterLogin();				
			},error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
			}
		});
	}
	function afterLogin(){
		if(webData.islogin!=''){			
			showlogin_page(false);
			getPaper();
			$('.userMenu .icon').html(webData.islogin[0].useraccount.substring(0, 1));
			$('.userMenu .name').html(webData.islogin[0].username);
			$.cookie("useraccount", webData.islogin[0].useraccount);
			$.cookie("userpassword", webData.islogin[0].userpassword);			
		}else{			
			showLoading(false);
			alert(webData.loginerrortxt);			
		}
	}
	function checkLogin(){
		var _t = false;
		if($.cookie("useraccount") && $.cookie("userpassword")) _t = true;
		return _t;
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
		$('.login_page_sign .signname').val('');
		$('.login_page_sign .signpassword').val('');
		$('.login_page_sign .signaccount').val('');
		$('.login_page_sign .signemail').val('');
		$('.login_pagein').find('input').val('');
	}
	function showlogin_page(_t){		
		if(_t) $('.login_page').fadeIn();
		else $('.login_page').fadeOut();
	}
	function showLoading(_t){
		if(_t) $('.loading').fadeIn();
		else{
			if(!$('.loading').hasClass('on')) $('.loading').addClass('on');
			$('.loading').fadeOut();
		}
	}
	
})//ready end  
































































































