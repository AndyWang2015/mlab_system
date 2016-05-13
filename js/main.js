$(document).ready(function(){
	var webData ={};
	webData.wrp=$('.wrapper');
	webData.mlabApikey = "n6FXodWWCdM14KrePZHrRPPovbzboRn6";
	webData.imgurappid = "752b0363900112d";
	webData.creatUsererrortxt = "請填寫完整資料";

	//init
	try{webData.nowpage = getUrlVars()['page'].replace('#access_token','');}
	catch(err){webData.nowpage = 1;}
	if($('.sec_menu').length>0) $('.sec_menu a').eq(webData.nowpage-1).addClass('on');
	$('.title').eq(0).html($('.sec_menu a').eq(webData.nowpage-1).text());

	if(webData.wrp.hasClass('about')) getDataCollection('aboutus_page',aboutfunction);
	else if(webData.wrp.hasClass('news')) getDataCollection('news_page',newsfunction);
	else showLoading(false);

	//Addlistener	
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
	function newsfunction(data){
		$('.paper').html('');
		for(i in webData.newPaperdata){
			if(!webData.newPaperdata[i].bpic) webData.newPaperdata[i].bpic='images/space.png';
			if(!webData.newPaperdata[i].spic) webData.newPaperdata[i].spic='images/space.png';
			$('.paper').append('<li><div class="newsbpic"><img src="'+webData.newPaperdata[i].bpic +'"></div><div class="newsspic"><img src="'+webData.newPaperdata[i].spic +'"></div><div class="newstitle">'+webData.newPaperdata[i].title+'</div><div class="newsbword">'+webData.newPaperdata[i].bword+'</div><div class="newssword">'+webData.newPaperdata[i].sword+'</div><div class="btn"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>');
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
	function motifyPaper(_t,_n,_num){
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
			webData.newPaperdata[webData._n].date = new Date();
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
	}
	function deletPaper(_n,_num){
		showLoading(true);
		if(webData.wrp.hasClass('about')){
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
		if(webData.wrp.hasClass('about')){
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
				date:new Date(),
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
            	if(webData.wrp.hasClass('about')) webData.uploadImgTrue = result.data.link;
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
