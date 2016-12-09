window.onload = function(){
    var total=16;
    var zWin =$(window);
    var render = function(){
        var padding =1;
        var winWidth=zWin.width();
        var picWidth=Math.floor((winWidth-padding*3)/4);
        var tmpl='';
        
        for(var i=1;i<total;i++){
            var p=padding;
        var imgSrc = 'img/'+i+'.jpg';
            if(i%4==1){
                p=0;
            }
        tmpl+='<li data-id="'+i+'" style="width:'+picWidth+'px;height:'+picWidth+'px;padding-top:'+padding+'px;padding-left:'+p+'px"><canvas id="cvs_'+i+'"></canvas></li>'
            var imageObj = new Image();
            imageObj.index = i;
            imageObj.onload = function(){
                var cvs = $("#cvs_"+this.index)[0].getContext('2d');
                cvs.width = this.width;
                cvs.height = this.height;
                cvs.drawImage(this,0,0)
            }
            imageObj.src = imgSrc;
        }
        $("#container").html(tmpl)
    }
    render();
    var wImage = $("#large_img");
    var domImage = wImage[0];
    function loadImg(id,callback){
        $("#large_container").css({
            width:zWin.width(),
            height:zWin.height()
        }).show();
        var imgsrc = 'img/'+id+'.large.jpg';
        var ImageObj = new Image();
        ImageObj.src = imgsrc;
        ImageObj.onload = function(){
            var w = this.width;
            var h = this.height;
			var winWidth = zWin.width();
			var winHeight = zWin.height();
            var realw = parseInt((winWidth - winHeight*w/h)/2);
			var realh = parseInt((winHeight - winWidth*h/w)/2);

			wImage.css('width','auto').css('height','auto');
			wImage.css('padding-left','0px').css('padding-top','0px');
			if(h/w>1.2){
				 wImage.attr('src',imgsrc).css('height',winHeight).css('padding-left',realw+'px');;
			}else{	
				 wImage.attr('src',imgsrc).css('width',winWidth).css('padding-top',realh+'px');
			}
            
        }
        callback&&callback();
    }
    var cid;
    //animated.css动画库
    $("li").addClass("animated bounceIn")
//    $("#container").delegate('li','tap',function(){
//        var _id = $(this).attr('data-id')
//        loadImg(_id);
//    });
    $("#container li").click(function(){
        var _id = cid = $(this).attr('data-id')
        loadImg(_id);
    })
    $("#large_container").tap(function(){
        $(this).hide();
    }).swipeLeft(function(){
        cid++;
        if(cid>total){
            cid=total;
        }else{
            loadImg(cid,function(){
			domImage.addEventListener('webkitAnimationEnd',function(){
				wImage.removeClass('animated bounceInRight');
				domImage.removeEventListener('webkitAnimationEnd',function(){});
			},false);
                wImage.addClass("animated bounceInRight");
            });
        }
    }).swipeRight(function(){
        cid--;
        if(cid<1){
            cid=1;
        }else{
            loadImg(cid,function(){
                wImage.addClass("animated bounceInLeft");
				domImage.addEventListener('webkitAnimationEnd',function(){
					wImage.removeClass('animated bounceInLeft');
					domImage.removeEventListener('webkitAnimationEnd',function(){});
				},false);
            })
        }
    });
    
    
}