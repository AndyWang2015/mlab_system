function getUrlVars(){for(var a,e=[],t=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),n=0;n<t.length;n++)a=t[n].split("="),e.push(a[0]),e[a[0]]=a[1];return e}$(document).ready(function(){function a(){console.log(N.newPaperdata);for(var a=0;a<N.newPaperdata.length;a++)$(".paper").append('<li><div class="postphoto"><img src="'+N.newPaperdata[a].pic+'"></div><div class="posttitle"><a href="'+N.newPaperdata[a].link+'" target="_blank">'+N.newPaperdata[a].link+'</a></div><div class="btn" item="'+a+'"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>');e()}function e(){$(".paper .delbtn").click(function(){$(this).parent().find(".motify").hasClass("on")?($(this).parent().find(".motify").removeClass("on"),v(!1,$(this).parent().attr("item"))):P($(this).parent().attr("item"))}),$(".paper .motify").click(function(){$(this).hasClass("on")?($(this).removeClass("on"),y($(this).parent().attr("item"))):($(this).addClass("on"),v(!0,$(this).parent().attr("item")))}),$(".menuin a").removeClass("on").eq(5).addClass("on"),J(!1)}function t(){return N.insertdata={title:$(".addgame .posttitle").val().replace(/\n\r?/g,"<br>"),list:[]},N.insertdata.title?(J(!0),void $.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards"+N.nowpage+"?apiKey="+N.mlabApikey,type:"POST",contentType:"application/json",data:JSON.stringify(N.insertdata),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})):void alert(N.creatUsererrortxt)}function n(a){$(".gameboxout").html("");for(i in N.newPaperdata){$(".gameboxout").append('<div class="gamebox" gamenum="'+i+'"><div class="t awardspapertitle"><div class="posttitle">比賽名稱</div><div class="btn">功能</div></div><ul class="paper awardspapertitle" num="0"><li><div class="posttitle">'+N.newPaperdata[i].title+'</div><div class="btn"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li></ul><div class="new awardspapertitle"><div class="databox"><div class="lt"><input type="text" placeholder="請輸入姓名" class="username"><input type="text" placeholder="請輸入獎項" class="userdes"></div></div><button class="gobtn" gamenum="'+i+'">確定新增</button></div><div class="t"><div class="posttitle">姓名</div><div class="postdes">獎項</div><div class="btn">功能</div></div><ul class="paper awarditem" num="1"></ul></div>');for(j in N.newPaperdata[i].list)$(".gamebox").eq(i).find(".paper").eq(1).append('<li><div class="posttitle">'+N.newPaperdata[i].list[j].name+'</div><div class="postdes">'+N.newPaperdata[i].list[j].word+'</div><div class="btn" gamenum="'+i+'" item="'+j+'"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>')}s()}function s(){$(".paper.awardspapertitle .delbtn").click(function(){$(this).parent().find(".motify").hasClass("on")?($(this).parent().find(".motify").removeClass("on"),d(!1,$(this).parent().parent().parent().parent().attr("gamenum"))):m($(this).parent().parent().parent().parent().attr("gamenum"))}),$(".paper.awardspapertitle .motify").click(function(){$(this).hasClass("on")?($(this).removeClass("on"),c($(this).parent().parent().parent().parent().attr("gamenum"))):($(this).addClass("on"),d(!0,$(this).parent().parent().parent().parent().attr("gamenum")))}),$(".new .gobtn").click(function(){l($(this).attr("gamenum"))}),$(".paper.awarditem .delbtn").click(function(){$(this).parent().find(".motify").hasClass("on")?($(this).parent().find(".motify").removeClass("on"),o(!1,$(this).parent().attr("gamenum"),$(this).parent().attr("item"))):r($(this).parent().attr("gamenum"),$(this).parent().attr("item"))}),$(".paper.awarditem .motify").click(function(){$(this).hasClass("on")?($(this).removeClass("on"),p($(this).parent().attr("gamenum"),$(this).parent().attr("item"))):($(this).addClass("on"),o(!0,$(this).parent().attr("gamenum"),$(this).parent().attr("item")))}),$(".menuin a").removeClass("on").eq(4).addClass("on"),J(!1)}function r(a,e){J(!0),N.newPaperdata[a].list.splice(e,1),$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards"+N.nowpage+"/"+N.newPaperdata[a]._id.$oid+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.newPaperdata[a]),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})}function p(a,e){J(!0),N.newPaperdata[a].list[e].name=$(".gamebox").eq(a).find(".paper.awarditem li").eq(e).find(".posttitle textarea").val().replace(/\n\r?/g,"<br>"),N.newPaperdata[a].list[e].word=$(".gamebox").eq(a).find(".paper.awarditem li").eq(e).find(".postdes textarea").val().replace(/\n\r?/g,"<br>"),$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards"+N.nowpage+"/"+N.newPaperdata[a]._id.$oid+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.newPaperdata[a]),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})}function o(a,e,t){a?($(".gamebox").eq(e).find(".paper.awarditem li").eq(t).find(".posttitle").html("<textarea>"+$(".gamebox").eq(e).find(".paper.awarditem li").eq(t).find(".posttitle").html().replace(/<br>/g,"\n")+"</textarea>"),$(".gamebox").eq(e).find(".paper.awarditem li").eq(t).find(".postdes").html("<textarea>"+$(".gamebox").eq(e).find(".paper.awarditem li").eq(t).find(".postdes").html().replace(/<br>/g,"\n")+"</textarea>")):($(".gamebox").eq(e).find(".paper.awarditem li").eq(t).find(".posttitle").html(N.newPaperdata[e].list[t].name),$(".gamebox").eq(e).find(".paper.awarditem li").eq(t).find(".postdes").html(N.newPaperdata[e].list[t].word))}function l(a){J(!0),N.newPaperdata[a].list.push({name:$(".gamebox").eq(a).find(".new .username").val().replace(/\n\r?/g,"<br>"),word:$(".gamebox").eq(a).find(".new .userdes").val().replace(/\n\r?/g,"<br>")}),$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards"+N.nowpage+"/"+N.newPaperdata[a]._id.$oid+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.newPaperdata[a]),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})}function d(a,e){a?$(".gamebox").eq(e).find(".paper.awardspapertitle").find(".posttitle").html("<textarea>"+$(".gamebox").eq(e).find(".paper.awardspapertitle").find(".posttitle").html().replace(/<br>/g,"\n")+"</textarea>"):$(".gamebox").eq(e).find(".paper.awardspapertitle").find(".posttitle").html(N.newPaperdata[e].title)}function c(a){J(!0),N.newPaperdata[a].title=$(".gamebox").eq(a).find(".paper.awardspapertitle").find(".posttitle textarea").val().replace(/\n\r?/g,"<br>"),$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards"+N.nowpage+"/"+N.newPaperdata[a]._id.$oid+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.newPaperdata[a]),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})}function m(a){J(!0),$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/awards"+N.nowpage+"/"+N.newPaperdata[a]._id.$oid+"?apiKey="+N.mlabApikey,type:"DELETE",async:!0,timeout:3e5,contentType:"application/json",success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})}function u(){if(N.learnload+=1,!(N.learnload<2)){for(var a=0;a<N.learndata.length;a++)if("learning_page"==N.learndata[a].collectname)$(".paper").eq(0).append('<li><div class="postphoto"><img src="'+N.learndata[a][0].photo+'"></div><div class="posttitle">'+N.learndata[a][0].classinfo+'</div><div class="postdes">'+N.learndata[a][0].classdes+'</div><div class="postid">　</div><div class="btn"><div title="修改" class="motify"></div></div></li>');else if("learning_photo_page"==N.learndata[a].collectname)for(var e=0;e<N.learndata[a].length;e++)$(".paper").eq(1).append('<li><div class="postphoto"><img src="'+N.learndata[a][e].pic+'"></div><div class="btn"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>');f()}}function f(){$(".paper .delbtn").click(function(){$(this).parent().find(".motify").hasClass("on")?($(this).parent().find(".motify").removeClass("on"),v(!1,$(this).parent().parent().index(),$(this).parent().parent().parent().attr("num"))):P($(this).parent().parent().index(),$(this).parent().parent().parent().attr("num"))}),$(".paper .motify").click(function(){$(this).hasClass("on")?($(this).removeClass("on"),y($(this).parent().parent().index(),$(this).parent().parent().parent().attr("num"))):($(this).addClass("on"),v(!0,$(this).parent().parent().index(),$(this).parent().parent().parent().attr("num")))}),$(".menuin a").removeClass("on").eq(3).addClass("on"),J(!1)}function h(a){$(".paper").html("");for(i in N.newPaperdata)N.newPaperdata[i].bpic||(N.newPaperdata[i].bpic="images/space.png"),N.newPaperdata[i].spic||(N.newPaperdata[i].spic="images/space.png"),$(".paper").append('<li><div class="newsbpic"><img src="'+N.newPaperdata[i].bpic+'"></div><div class="newsspic"><img src="'+N.newPaperdata[i].spic+'"></div><div class="newstitle">'+N.newPaperdata[i].title+'</div><div class="newssword">'+N.newPaperdata[i].sword+'</div><div class="newsbword">'+N.newPaperdata[i].bword+'</div><div class="btn"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>');g()}function g(){$(".paper .delbtn").click(function(){$(this).parent().find(".motify").hasClass("on")?($(this).parent().find(".motify").removeClass("on"),v(!1,$(this).parent().parent().index())):P($(this).parent().parent().index())}),$(".paper .motify").click(function(){$(this).hasClass("on")?($(this).removeClass("on"),y($(this).parent().parent().index())):($(this).addClass("on"),v(!0,$(this).parent().parent().index()))}),$(".menuin a").removeClass("on").eq(2).addClass("on"),J(!1)}function w(a){$(".paper").html("");for(i in N.newPaperdata){var e;e=N.newPaperdata[i].cover?'<img src="'+N.newPaperdata[i].cover+'">':'<img src="images/space.png">',$(".paper").eq(0).append('<li><div class="postphoto">'+e+'</div><div class="posttitle">'+N.newPaperdata[i].title+'</div><div class="postdes">'+N.newPaperdata[i].info+'</div><div class="postid">　</div><div class="btn"><div title="修改" class="motify"></div></div></li>')}for(i in N.newPaperdata[0].list){var e;e=N.newPaperdata[0].list[i].pic?'<img src="'+N.newPaperdata[0].list[i].pic+'">':'<img src="images/space.png">',$(".paper").eq(1).append('<li><div class="postphoto">'+e+'</div><div class="posttitle">'+N.newPaperdata[0].list[i].name+'</div><div class="postdes">'+N.newPaperdata[0].list[i].des+'</div><div class="postid">　</div><div class="btn"><div title="修改" class="motify"></div><div title="刪除" class="delbtn"></div></div></li>')}b()}function b(){$(".paper .delbtn").click(function(){$(this).parent().find(".motify").hasClass("on")?($(this).parent().find(".motify").removeClass("on"),v(!1,$(this).parent().parent().index(),$(this).parent().parent().parent().attr("num"))):P($(this).parent().parent().index(),$(this).parent().parent().parent().attr("num"))}),$(".paper .motify").click(function(){$(this).hasClass("on")?($(this).removeClass("on"),y($(this).parent().parent().index(),$(this).parent().parent().parent().attr("num"))):($(this).addClass("on"),v(!0,$(this).parent().parent().index(),$(this).parent().parent().parent().attr("num")))}),$(".menuin a").removeClass("on").eq(1).addClass("on"),J(!1)}function v(a,e,t){if(N.wrp.hasClass("about")){var n=$(".paper").eq(t).find("li").eq(e);a?(n.find(".posttitle").html("<textarea>"+n.find(".posttitle").html().replace(/<br>/g,"\n")+"</textarea>"),n.find(".postdes").html("<textarea>"+n.find(".postdes").html().replace(/<br>/g,"\n")+"</textarea>"),n.find(".postphoto").prepend('<input type="file" name="file" id="imgInputMotify" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify"><span>點擊更換</span></label>'),$("#imgInputMotify").change(function(){_(this,$(this))})):(n.find(".posttitle").html(n.find(".posttitle textarea").val().replace(/\n\r?/g,"<br>")),n.find(".postdes").html(n.find(".postdes textarea").val().replace(/\n\r?/g,"<br>")),n.find(".postphoto").html('<img src="'+N.newPaperdata[0].list[e].pic+'">'))}else if(N.wrp.hasClass("news")){var n=$(".paper").find("li").eq(e);a?(n.find(".newstitle").html("<textarea>"+n.find(".newstitle").html().replace(/<br>/g,"\n")+"</textarea>"),n.find(".newsbword").html("<textarea>"+n.find(".newsbword").html().replace(/<br>/g,"\n")+"</textarea>"),n.find(".newssword").html("<textarea>"+n.find(".newssword").html().replace(/<br>/g,"\n")+"</textarea>"),n.find(".newsbpic").prepend('<input type="file" name="file" id="imgInputMotify" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify"><span>點擊更換</span></label>'),$("#imgInputMotify").change(function(){_(this,$(this),0)}),n.find(".newsspic").prepend('<input type="file" name="file" id="imgInputMotify2" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify2"><span>點擊更換</span></label>'),$("#imgInputMotify2").change(function(){_(this,$(this),1)})):(n.find(".newstitle").html(n.find(".newstitle textarea").val().replace(/\n\r?/g,"<br>")),n.find(".newsbword").html(n.find(".newsbword textarea").val().replace(/\n\r?/g,"<br>")),n.find(".newssword").html(n.find(".newssword textarea").val().replace(/\n\r?/g,"<br>")),n.find(".newsbpic").html('<img src="'+N.newPaperdata[e].bpic+'">'),n.find(".newsspic").html('<img src="'+N.newPaperdata[e].spic+'">'))}else if(N.wrp.hasClass("learn")){var n=$(".paper").eq(t).find("li").eq(e);a?(0==t&&(n.find(".posttitle").html("<textarea>"+n.find(".posttitle").html().replace(/<br>/g,"\n")+"</textarea>"),n.find(".postdes").html("<textarea>"+n.find(".postdes").html().replace(/<br>/g,"\n")+"</textarea>")),n.find(".postphoto").prepend('<input type="file" name="file" id="imgInputMotify" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify"><span>點擊更換</span></label>'),$("#imgInputMotify").change(function(){_(this,$(this))})):n.find(".postphoto").html('<img src="'+N.learndata[1][e].pic+'">')}else if(N.wrp.hasClass("link")){var n=$(".paper li").eq(e);a?(n.find(".posttitle").html("<textarea>"+n.find(".posttitle a").html()+"</textarea>"),n.find(".postphoto").prepend('<input type="file" name="file" id="imgInputMotify" accept="image/*" capture="camera"><label class="imgInputlabel" for="imgInputMotify"><span>點擊更換</span></label>'),$("#imgInputMotify").change(function(){_(this,$(this))})):(n.find(".posttitle").html('<a href="'+N.newPaperdata[e].link+'">'+N.newPaperdata[e].link+"</a>"),n.find(".postphoto").html('<img src="'+N.newPaperdata[e].pic+'">'))}}function y(a,e){J(!0),N.wrp.hasClass("about")?(N._n=a,N._num=e,$(".paper").eq(e).find("li").eq(a).find(".postphoto").find("img").hasClass("on")?T(N.uploadImg,x):(N.uploadImgTrue=$(".paper").eq(e).find("li").eq(a).find(".postphoto").find("img").attr("src"),x())):N.wrp.hasClass("news")?(N._n=a,N.newspiccheck=0,$(".paper").find("li").eq(a).find(".newsbpic").find("img").hasClass("on")?T(N.uploadImgbpic,x,0):(N.newspiccheck+=1,N.uploadImgbpic=$(".paper").find("li").eq(a).find(".newsbpic").find("img").attr("src")),$(".paper").find("li").eq(a).find(".newsspic").find("img").hasClass("on")?T(N.uploadImgspic,x,1):(N.newspiccheck+=1,N.uploadImgspic=$(".paper").find("li").eq(a).find(".newsspic").find("img").attr("src")),x()):N.wrp.hasClass("learn")?(N._n=a,N._num=e,$(".paper").eq(e).find("li").eq(a).find(".postphoto").find("img").hasClass("on")?T(N.uploadImg,x):(N.uploadImgTrue=$(".paper").eq(e).find("li").eq(a).find(".postphoto").find("img").attr("src"),x())):N.wrp.hasClass("link")&&(N._n=a,$(".paper li").eq(a).find(".postphoto").find("img").hasClass("on")?T(N.uploadImg,x):(N.uploadImgTrue=$(".paper li").eq(a).find(".postphoto").find("img").attr("src"),x()))}function x(){if(N.wrp.hasClass("about"))0==N._num?(N.newPaperdata[0].title=$(".paper").eq(N._num).find("li").eq(N._n).find(".posttitle").find("textarea").val().replace(/\n\r?/g,"<br>"),N.newPaperdata[0].info=$(".paper").eq(N._num).find("li").eq(N._n).find(".postdes").find("textarea").val().replace(/\n\r?/g,"<br>"),N.newPaperdata[0].cover=N.uploadImgTrue):1==N._num&&(N.newPaperdata[0].list[N._n].name=$(".paper").eq(N._num).find("li").eq(N._n).find(".posttitle").find("textarea").val().replace(/\n\r?/g,"<br>"),N.newPaperdata[0].list[N._n].des=$(".paper").eq(N._num).find("li").eq(N._n).find(".postdes").find("textarea").val().replace(/\n\r?/g,"<br>"),N.newPaperdata[0].list[N._n].pic=N.uploadImgTrue),$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/aboutus_page"+N.nowpage+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.newPaperdata),success:function(a){A("aboutus_page",w)},error:function(a,e,t){console.log("error:",a,e,t)}});else if(N.wrp.hasClass("news")){if(N.newspiccheck<2)return;N.newPaperdata[N._n].title=$(".paper").find("li").eq(N._n).find(".newstitle").find("textarea").val().replace(/\n\r?/g,"<br>"),N.newPaperdata[N._n].spic=N.uploadImgspic,N.newPaperdata[N._n].bpic=N.uploadImgbpic,N.newPaperdata[N._n].date=(new Date).getFullYear()+"/"+(1*(new Date).getMonth()+1)+"/"+(new Date).getDate()+"星期"+U((new Date).getDay()),N.newPaperdata[N._n].sword=$(".paper").find("li").eq(N._n).find(".newssword").find("textarea").val().replace(/\n\r?/g,"<br>"),N.newPaperdata[N._n].bword=$(".paper").find("li").eq(N._n).find(".newsbword").find("textarea").val().replace(/\n\r?/g,"<br>"),$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/news_page"+N.nowpage+"/"+N.newPaperdata[N._n]._id.$oid+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.newPaperdata[N._n]),success:function(a){A("news_page",h)},error:function(a,e,t){console.log("error:",a,e,t)}})}else N.wrp.hasClass("learn")?0==N._num?(N.learndata[0][0].classinfo=$(".paper").eq(N._num).find("li").eq(N._n).find(".posttitle").find("textarea").val().replace(/\n\r?/g,"<br>"),N.learndata[0][0].classdes=$(".paper").eq(N._num).find("li").eq(N._n).find(".postdes").find("textarea").val().replace(/\n\r?/g,"<br>"),N.learndata[0][0].photo=N.uploadImgTrue,N.learndata[0][0].title=N.learndata[0][0].title,console.log(N.learndata[0][0].title),$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/learning_page"+N.nowpage+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.learndata[0]),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})):1==N._num&&(N.learndata[1][N._n].pic=N.uploadImgTrue,$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/learning_photo_page"+N.nowpage+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.learndata[1]),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})):N.wrp.hasClass("link")&&(N.newPaperdata[N._n].link=$(".paper li").eq(N._n).find(".posttitle textarea").val(),N.newPaperdata[N._n].pic=N.uploadImgTrue,$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/otherlink"+N.nowpage+"/"+N.newPaperdata[N._n]._id.$oid+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.newPaperdata[N._n]),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}}))}function P(a,e){J(!0),N.wrp.hasClass("about")?(N.newPaperdata[0].list.splice(a,1),$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/aboutus_page"+N.nowpage+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.newPaperdata),success:function(a){A("aboutus_page",w)},error:function(a,e,t){console.log("error:",a,e,t)}})):N.wrp.hasClass("news")?$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/news_page"+N.nowpage+"/"+N.newPaperdata[a]._id.$oid+"?apiKey="+N.mlabApikey,type:"DELETE",async:!0,timeout:3e5,contentType:"application/json",success:function(a){A("news_page",h)},error:function(a,e,t){console.log("error:",a,e,t)}}):N.wrp.hasClass("learn")?$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/learning_photo_page"+N.nowpage+"/"+N.learndata[e][a]._id.$oid+"?apiKey="+N.mlabApikey,type:"DELETE",async:!0,timeout:3e5,contentType:"application/json",success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}}):N.wrp.hasClass("link")&&$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/otherlink"+N.nowpage+"/"+N.newPaperdata[a]._id.$oid+"?apiKey="+N.mlabApikey,type:"DELETE",async:!0,timeout:3e5,contentType:"application/json",success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})}function C(a,e,t){if(a.files&&a.files[0]){var n=new FileReader;n.onload=function(a){0==t?N.newsuploadImgbpic=a.target.result.replace(/.*,/,""):N.newsuploadImgspic=a.target.result.replace(/.*,/,""),e.parent().addClass("on").find("img").addClass("on").attr("src",a.target.result)},n.readAsDataURL(a.files[0])}}function _(a,e,t){if(N.wrp.hasClass("about")||N.wrp.hasClass("learn")||N.wrp.hasClass("link")){if(a.files&&a.files[0]){var n=new FileReader;n.onload=function(a){N.uploadImg=a.target.result.replace(/.*,/,""),e.parent().addClass("on").find("img").addClass("on").attr("src",a.target.result)},n.readAsDataURL(a.files[0])}}else if(N.wrp.hasClass("news")&&a.files&&a.files[0]){var n=new FileReader;n.onload=function(a){0==t?N.uploadImgbpic=a.target.result.replace(/.*,/,""):N.uploadImgspic=a.target.result.replace(/.*,/,""),e.parent().addClass("on").find("img").addClass("on").attr("src",a.target.result)},n.readAsDataURL(a.files[0])}}function k(){if(N.wrp.hasClass("about")){if(N.posttitleval=$(".new .posttitle").val(),N.postdesval=$(".new .postdes").val(),!N.posttitleval||!N.postdesval)return void alert(N.creatUsererrortxt);J(!0),N.uploadImg?T(N.uploadImg,q):q()}else if(N.wrp.hasClass("news")){if(N.insertdata={title:$(".new .newstitle").val().replace(/\n\r?/g,"<br>"),date:(new Date).getFullYear()+"/"+(1*(new Date).getMonth()+1)+"/"+(new Date).getDate()+"星期"+U((new Date).getDay()),sword:$(".new .newssword").val().replace(/\n\r?/g,"<br>"),bword:$(".new .newsbword").val().replace(/\n\r?/g,"<br>")},!N.insertdata.title||!N.insertdata.sword||!N.insertdata.bword)return void alert(N.creatUsererrortxt);J(!0),N.newsinsertpiccheck=0,N.newsuploadImgbpic?I(N.newsuploadImgbpic,q,0):(N.newsinsertpiccheck+=1,N.newsuploadImgbpic="images/space.png"),N.newsuploadImgspic?I(N.newsuploadImgspic,q,1):(N.newsinsertpiccheck+=1,N.newsuploadImgspic="images/space.png"),q()}else if(N.wrp.hasClass("learn"))J(!0),N.uploadImg?T(N.uploadImg,q):alert(N.creatUsererrortxt);else if(N.wrp.hasClass("link")){if(J(!0),N.insertdata={link:$(".new .posttitle").val()},!N.insertdata.link)return void alert(N.creatUsererrortxt);N.uploadImg?T(N.uploadImg,q):alert(N.creatUsererrortxt)}}function q(){if(N.wrp.hasClass("about"))N.newPaperdata[0].list.push({name:N.posttitleval.replace(/\n\r?/g,"<br>"),des:N.postdesval.replace(/\n\r?/g,"<br>"),pic:N.uploadImgTrue}),$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/aboutus_page"+N.nowpage+"?apiKey="+N.mlabApikey,type:"PUT",contentType:"application/json",data:JSON.stringify(N.newPaperdata),success:function(a){D(),A("aboutus_page",w)},error:function(a,e,t){console.log("error:",a,e,t)}});else if(N.wrp.hasClass("news")){if(N.newsinsertpiccheck<2)return;N.insertdata.bpic=N.newsuploadImgbpic,N.insertdata.spic=N.newsuploadImgspic,$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/news_page"+N.nowpage+"?apiKey="+N.mlabApikey,type:"POST",contentType:"application/json",data:JSON.stringify(N.insertdata),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})}else N.wrp.hasClass("learn")?(N.insertdata={pic:N.uploadImgTrue},$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/learning_photo_page"+N.nowpage+"?apiKey="+N.mlabApikey,type:"POST",contentType:"application/json",data:JSON.stringify(N.insertdata),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}})):N.wrp.hasClass("link")&&(N.insertdata.pic=N.uploadImgTrue,$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/otherlink"+N.nowpage+"?apiKey="+N.mlabApikey,type:"POST",contentType:"application/json",data:JSON.stringify(N.insertdata),success:function(a){location.reload()},error:function(a,e,t){console.log("error:",a,e,t)}}))}function I(a,e,t){$.ajax({url:"https://api.imgur.com/3/image",method:"POST",headers:{Authorization:"Bearer "+N.imgurToken,Accept:"application/json"},data:{image:a,type:"base64"},success:function(a){N.wrp.hasClass("news")&&(N.newsinsertpiccheck+=1,0==t?N.newsuploadImgbpic=a.data.link:N.newsuploadImgspic=a.data.link),e()},error:function(a,e,t){console.log("error:",a,e,t),window.location.href="https://api.imgur.com/oauth2/authorize?response_type=token&client_id="+N.imgurappid}})}function T(a,e,t){$.ajax({url:"https://api.imgur.com/3/image",method:"POST",headers:{Authorization:"Bearer "+N.imgurToken,Accept:"application/json"},data:{image:a,type:"base64"},success:function(a){(N.wrp.hasClass("about")||N.wrp.hasClass("learn")||N.wrp.hasClass("link"))&&(N.uploadImgTrue=a.data.link),N.wrp.hasClass("news")&&(N.newspiccheck+=1,0==t?N.uploadImgbpic=a.data.link:N.uploadImgspic=a.data.link),e()},error:function(a,e,t){console.log("error:",a,e,t),window.location.href="https://api.imgur.com/oauth2/authorize?response_type=token&client_id="+N.imgurappid}})}function A(a,e){$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/"+a+N.nowpage+"?apiKey="+N.mlabApikey,type:"GET",contentType:"application/json",success:function(a){N.newPaperdata=a,e(a)},error:function(a,e,t){console.log("error:",a,e,t)}})}function O(a,e){$.ajax({url:"https://api.mlab.com/api/1/databases/chinesechess2016/collections/"+a+N.nowpage+"?apiKey="+N.mlabApikey,type:"GET",contentType:"application/json",success:function(t){N.learndata.push(t),N.learndata[N.learndata.length-1].collectname=a,e()},error:function(a,e,t){console.log("error:",a,e,t)}})}function U(a){return 0==a?a="日":1==a?a="一":2==a?a="二":3==a?a="三":4==a?a="四":5==a?a="五":6==a&&(a="六"),a}function K(a){window.location.href=a.attr("gopage")+"#access_token="+window.location.href.split("#access_token=")[1]}function M(){$.cookie("useraccount",""),$.cookie("userpassword",""),window.location.href="index.html"}function S(){var a=!1;return $.cookie("useraccount")&&$.cookie("userpassword")&&(a=!0),a}function D(){N.posttitleval="",N.nowtime="",N.postdesval="",N.uploadImg="",N.uploadImgTrue="",$(".new .posttitle").val(""),$(".new .postdes").val(""),$(".new .addImg").removeClass("on").find("img").attr("src","")}function J(a){a?$(".loading").fadeIn():($(".loading").hasClass("on")||$(".loading").addClass("on"),$(".loading").fadeOut())}var N={};N.wrp=$(".wrapper"),N.mlabApikey="n6FXodWWCdM14KrePZHrRPPovbzboRn6",N.imgurappid="752b0363900112d",N.creatUsererrortxt="請填寫完整資料";try{N.nowpage=getUrlVars().page.replace("#access_token","")}catch(E){N.nowpage=1}$(".sec_menu").length>0&&($(".sec_menu a").eq(N.nowpage-1).addClass("on"),$(".title").eq(0).html($(".sec_menu a").eq(N.nowpage-1).text())),N.wrp.hasClass("about")?A("aboutus_page",w):N.wrp.hasClass("news")?A("news_page",h):N.wrp.hasClass("learn")?(N.learnload=0,N.learndata=[],O("learning_page",u),O("learning_photo_page",u)):N.wrp.hasClass("awards")?A("awards",n):N.wrp.hasClass("link")?A("otherlink",a):J(!1),$(".gogamebtn").click(function(){t()}),$(".menua").click(function(){K($(this))}),$("#imgInput").change(function(){_(this,$(this))}),$("#newsimgInput").change(function(){C(this,$(this),0)}),$("#newsimgInput2").change(function(){C(this,$(this),1)}),$(".userMenu .logoutbtn").click(function(){M()}),$(".new .gobtn").click(function(){k()}),$(window).load(function(){if(S())try{N.imgurToken=window.location.href.split("#")[1].split("&")[0].replace("access_token=",""),$(".userMenu .icon").html($.cookie("useraccount").substring(0,1)),$(".userMenu .name").html($.cookie("username"))}catch(a){window.location.href="https://api.imgur.com/oauth2/authorize?response_type=token&client_id="+N.imgurappid}else window.location.href="index.html"+window.location.hash})});