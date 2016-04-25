$(document).ready(function(){
	var webData ={};
	webData.mlabApikey = "n6FXodWWCdM14KrePZHrRPPovbzboRn6";
	webData.loginerrortxt = "帳號或密碼錯誤，請重新輸入";
	webData.signerrortxt = "此帳號有人註冊過，請換一個帳號";
	webData.creatUsererrortxt = "請填寫完整資料";
	

	//Addlistener	
	$('.login_pagein .submitbtn').click(function(){signup();});
	$('.login_pagein .cancelbtn').click(function(){gosignup(false);});
	$('.login_pagein .singupbtn').click(function(){gosignup(true);});
	$('.login_pagein .surebtn').click(function(){userlogin($('.login_page .useraccount').val(),$('.login_page .userpassword').val());});
	

	$(window).load(function(){
		if(checkLogin()) userlogin($.cookie("useraccount"),$.cookie("userpassword"));
		else showLoading(false);
	});

	//Event	
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
			$.cookie("useraccount", webData.islogin[0].useraccount);
			$.cookie("userpassword", webData.islogin[0].userpassword);
			$.cookie("username", webData.islogin[0].username);
			window.location.href="main.html" + window.location.hash;
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
	function clearForm(){
		$('.login_page_sign .signname').val('');
		$('.login_page_sign .signpassword').val('');
		$('.login_page_sign .signaccount').val('');
		$('.login_page_sign .signemail').val('');
		$('.login_pagein').find('input').val('');
	}	
	function showLoading(_t){
		if(_t) $('.loading').fadeIn();
		else{
			if(!$('.loading').hasClass('on')) $('.loading').addClass('on');
			$('.loading').fadeOut();
		}
	}
	
})//ready end  
































































































