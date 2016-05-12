$(document).ready(function(){
	var webData ={};
	webData.wrp=$('.wrapper');
	webData.mlabApikey = "n6FXodWWCdM14KrePZHrRPPovbzboRn6";
	webData.imgurappid = "752b0363900112d";
	webData.creatUsererrortxt = "請填寫完整資料";

	//textarea value 換行
	//text = text.replace(/\n\r?/g, '<br />');

	//init
	webData.nowpage = getUrlVars()['page'].replace('#access_token','');	
	if(webData.wrp.hasClass('about')) getDataCollection('aboutus_page',aboutfunction);

	//Addlistener	
	$('.menua').click(function(){menuaclick($(this));});
	$("#imgInput").change(function(){readURL(this,$(this));});
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
	function aboutfunction(data){
		$('.paper').html('');
		for(i in webData.newPaperdata){
			var _img;
			if(!webData.newPaperdata[i].cover) _img='<img src="images/space.png">';
			else _img = '<img src="' + webData.newPaperdata[i].cover + '">';
			$('.paper').eq(0).append('<li><div class="postphoto">'+_img+'</div><div class="posttitle">'+webData.newPaperdata[i].title+'</div><div class="postdes">'+webData.newPaperdata[i].info+'</div><div class="postid">　</div><div class="btn"><div class="motify"></div></div></li>');
		}
		for(i in webData.newPaperdata[0].list){
			var _img;
			if(!webData.newPaperdata[0].list[i].pic) _img='<img src="images/space.png">';
			else _img = '<img src="' + webData.newPaperdata[0].list[i].pic + '">';
			$('.paper').eq(1).append('<li><div class="postphoto">'+_img+'</div><div class="posttitle">'+webData.newPaperdata[0].list[i].name+'</div><div class="postdes">'+webData.newPaperdata[0].list[i].des+'</div><div class="postid">　</div><div class="btn"><div class="motify"></div><div class="delbtn"></div></div></li>');
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
		if($('.sec_menu').length>0) $('.sec_menu a').eq(webData.nowpage-1).addClass('on');
		showLoading(false);
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
	function deletPaper(_n,_num){
		showLoading(true);
		//FAIL DELETE
		webData.newPaperdata[0].list.splice(_n,_n);
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
		//REAL DELETE
		// $.ajax({
		// 	url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/paperid/'+webData.newPaperdata[_n]._id.$oid+'?apiKey='+ webData.mlabApikey,
		// 	type: "DELETE",
		// 	async: true,
		// 	timeout: 300000,
		// 	contentType: 'application/json',			
		// 	success: function(data) {				
		// 		getPaper();
		// 	},error: function(xhr, textStatus, errorThrown) {             
		// 		console.log("error:", xhr, textStatus, errorThrown);
		// 	}
		// });		
	}
	function motifyPaper(_t,_n,_num){
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
	function motifyPaperEnd(_n,_num){		
		showLoading(true);
		webData._n = _n;
		webData._num = _num;
		if($('.paper').eq(_num).find('li').eq(_n).find('.postphoto').find('img').hasClass('on')) uploadimgtoImgur(webData.uploadImg,motifyPaperFinal);
		else{
			webData.uploadImgTrue = $('.paper').eq(_num).find('li').eq(_n).find('.postphoto').find('img').attr('src');
			motifyPaperFinal();
		}
	}
	function motifyPaperFinal(){
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
		webData.posttitleval = $('.new .posttitle').val();
		webData.postdesval = $('.new .postdes').val();
		if(!webData.posttitleval || !webData.postdesval){
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
              Authorization: 'Bearer '+webData.imgurToken,
              Accept: 'application/json'
            },
            data: {
              image: _imgurl,
              type: 'base64'
            },
            success: function(result) {
            	webData.uploadImgTrue = result.data.link;
            	callback();
            },error: function(xhr, textStatus, errorThrown) {             
				console.log("error:", xhr, textStatus, errorThrown);
				window.location.href = 'https://api.imgur.com/oauth2/authorize?response_type=token&client_id='+webData.imgurappid;
			}
        });        
	}
	function insertPaperEnd(){
		//FAIL INSERT
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

		//REAL INSERT
		// $.ajax({
		// 	url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/paperid?apiKey='+ webData.mlabApikey,
		// 	type: 'POST',
		// 	contentType: 'application/json',
		// 	data:JSON.stringify({
		// 		postdate:webData.nowtime,
		// 		postdes:webData.postdesval,
		// 		postid:"0000",
		// 		posttitle:webData.posttitleval,
		// 		postphoto:webData.uploadImgTrue,
		// 	}),
		// 	success: function(data) {				
		// 		clearForm();
		// 		getPaper();
		// 	},error: function(xhr, textStatus, errorThrown) {             
		// 		console.log("error:", xhr, textStatus, errorThrown);
		// 	}
		// });
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
	function getDataCollection(_collectname,_callback){
		$.ajax({
			url: 'https://api.mlab.com/api/1/databases/chinesechess2016/collections/'+_collectname+webData.nowpage+'?apiKey='+ webData.mlabApikey,
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
	
})//ready end  
function getUrlVars(){
  var vars=[],hash;var hashes=window.location.href.slice(window.location.href.indexOf('?')+1).split('&');
  for(var i=0;i<hashes.length;i++){hash=hashes[i].split('=');vars.push(hash[0]);vars[hash[0]]=hash[1]}
  return vars
}
