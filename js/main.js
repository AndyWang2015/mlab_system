$(document).ready(function(){
	var webData ={};
	webData.mlabApikey = "n6FXodWWCdM14KrePZHrRPPovbzboRn6";
	webData.creatUsererrortxt = "請填寫完整資料";

	//Addlistener
	$("#imgInput").change(function(){readURL(this,$(this));});
	$('.userMenu .logoutbtn').click(function(){logout();});	
	$(".andy_test .new .gobtn").click(function(){insertPaper();});

	$(window).load(function(){
		if(checkLogin()){
			$('.userMenu .icon').html($.cookie("useraccount").substring(0, 1));
			$('.userMenu .name').html($.cookie("username"));
			getPaper();
		}
		else window.location.href="index.html";
	});

	//Event	
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
	function deletPaper(_n){
		showLoading(true);
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
		$('.paper li').eq(_n).find('.postphoto').prepend('<input type="file" name="file" id="imgInputMotify" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify"><span>點擊更換</span></label>');
		$("#imgInputMotify").change(function(){readURL(this,$(this));});
	}
	function motifyPaperEnd(_n){
		webData.nowmotifyPaperEnd = _n;
		showLoading(true);
		if($('.paper li').eq(_n).find('.postphoto').find('img').hasClass('on')) uploadimgtoImgur(webData.uploadImg,motifyPaperFinal);
		else{
			webData.uploadImgTrue = $('.paper li').eq(_n).find('.postphoto').find('img').attr('src');
			motifyPaperFinal();
		}
	}
	function motifyPaperFinal(){
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/paperid/'+webData.newPaperdata[webData.nowmotifyPaperEnd]._id.$oid+'?apiKey='+ webData.mlabApikey,
			type: 'PUT',
			contentType: 'application/json',
			data:JSON.stringify({
				postdate:new Date(),
				postdes:$('.paper li').eq(webData.nowmotifyPaperEnd).find('.postdes').find('textarea').val(),
				postid:webData.newPaperdata[webData.nowmotifyPaperEnd].postid,
				posttitle:$('.paper li').eq(webData.nowmotifyPaperEnd).find('.posttitle').find('textarea').val(),
				postphoto:webData.uploadImgTrue,
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
			var _img;
			if(!webData.newPaperdata[i].postphoto) _img='<img src="http://bizdev.medialand.com.tw/andy/mongoDB_mLab/images/space.png">';
			else _img = '<img src="' + webData.newPaperdata[i].postphoto + '">';
			$('.paper').append('<li><div class="postphoto">'+_img+'</div><div class="posttitle">'+webData.newPaperdata[i].posttitle+'</div><div class="postdes">'+webData.newPaperdata[i].postdes+'</div><div class="postid">'+webData.newPaperdata[i].postdate+'</div><div class="btn"><div class="motify"></div><div class="delbtn"></div></div></li>');
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
	function readURL(input,_o) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();            
            reader.onload = function (e) {
            	webData.uploadImg = e.target.result.replace(/.*,/, '');
            	_o.parent().addClass('on').find('img').addClass('on').attr('src',e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
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
		if(webData.uploadImg){
			uploadimgtoImgur(webData.uploadImg,insertPaperEnd);
		}
		else insertPaperEnd();	
	}
	function uploadimgtoImgur(_imgurl,callback){
		$.ajax({
            url: 'https://api.imgur.com/3/image',
            method: 'POST',
            headers: {
              Authorization: 'Bearer 7cca1c5c91788293fee47eae1579c66b28db8c41',
              Accept: 'application/json'
            },
            data: {
              image: _imgurl,
              type: 'base64'
            },
            success: function(result) {
            	webData.uploadImgTrue = result.data.link;
            	callback();
            }
        });
	}
	function insertPaperEnd(){
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/paperid?apiKey='+ webData.mlabApikey,
			type: 'POST',
			contentType: 'application/json',
			data:JSON.stringify({
				postdate:webData.nowtime,
				postdes:webData.postdesval,
				postid:"0000",
				posttitle:webData.posttitleval,
				postphoto:webData.uploadImgTrue,
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
































































































