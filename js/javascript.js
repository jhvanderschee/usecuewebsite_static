/* DETECT WINDOW SCROLL */

function windowScroll() {
    var top = window.pageYOffset || document.documentElement.scrollTop;
    if (top > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
    if (window.innerHeight + top >= document.documentElement.scrollHeight) {
        document.body.classList.add('scrolledend');
    } else {
        document.body.classList.remove('scrolledend');
    }
}

window.addEventListener("scroll",windowScroll);

windowScroll();
//open external links in a new window
function external_new_window() {
    for(var c = document.getElementsByTagName("a"), a = 0;a < c.length;a++) {
        var b = c[a];
        if(b.getAttribute("href") && b.hostname !== location.hostname) {
            b.target = "_blank";
            b.rel = "noopener";
        }
    }
}
//open PDF links in a new window
function pdf_new_window ()
{
    if (!document.getElementsByTagName) return false;
    var links = document.getElementsByTagName("a");
    for (var eleLink=0; eleLink < links.length; eleLink ++) {
    if ((links[eleLink].href.indexOf('.pdf') !== -1)||(links[eleLink].href.indexOf('.doc') !== -1)||(links[eleLink].href.indexOf('.docx') !== -1)) {
        links[eleLink].onclick =
        function() {
            window.open(this.href);
            return false;
        }
    }
    }
} 
pdf_new_window();
external_new_window();
    function is_youtubelink(url) {
      var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      return (url.match(p)) ? RegExp.$1 : false;
    }
    function is_imagelink(url) {
        var p = /([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i;
        return (url.match(p)) ? true : false;
    }
    function is_vimeolink(url,el) {
        var id = false;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
                if (xmlhttp.status == 200) {
                    var response = JSON.parse(xmlhttp.responseText);
                    id = response.video_id;
                    console.log(id);
                    el.classList.add('lightbox-vimeo');
                    el.setAttribute('data-id',id);

                    el.addEventListener("click", function(event) {
                        event.preventDefault();
                        document.getElementById('lightbox').innerHTML = '<a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://player.vimeo.com/video/'+el.getAttribute('data-id')+'/?autoplay=1&byline=0&title=0&portrait=0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div></div>';
                        document.getElementById('lightbox').style.display = 'block';

                        setGallery(this);
                    });
                }
                else if (xmlhttp.status == 400) {
                    alert('There was an error 400');
                }
                else {
                    alert('something else other than 200 was returned');
                }
            }
        };
        xmlhttp.open("GET", 'https://vimeo.com/api/oembed.json?url='+url, true);
        xmlhttp.send();
    }
    function setGallery(el) {
        var elements = document.body.querySelectorAll(".gallery");
        elements.forEach(element => {
            element.classList.remove('gallery');
        });
        var link_elements = el.parentNode.querySelectorAll("a[class*='lightbox-']");
        link_elements.forEach(link_element => {
            link_element.classList.remove('current');
        });
        link_elements.forEach(link_element => {
            if(el.getAttribute('href') == link_element.getAttribute('href')) {
                link_element.classList.add('current');
            }
        });
        if(link_elements.length>1) {
            document.getElementById('lightbox').classList.add('gallery');
            link_elements.forEach(link_element => {
                link_element.classList.add('gallery');
            });
        }
        var currentkey;
        var gallery_elements = document.querySelectorAll('a.gallery');
        Object.keys(gallery_elements).forEach(function (k) {
            if(gallery_elements[k].classList.contains('current')) currentkey = k;
        });
        if(currentkey==(gallery_elements.length-1)) var nextkey = 0;
        else var nextkey = parseInt(currentkey+1);
        if(currentkey==0) var prevkey = (gallery_elements.length-1);
        else var prevkey = parseInt(currentkey-1);

        document.getElementById('next').addEventListener("click", function() {
            gallery_elements[nextkey].click();
        });
        document.getElementById('prev').addEventListener("click", function() {
             gallery_elements[prevkey].click();
        });
    }

    document.addEventListener("DOMContentLoaded", function() {
        
        //add classes to links to be able to initiate lightboxes
        var elements = document.querySelectorAll('a');
        elements.forEach(element => {
            var url = element.getAttribute('href');
            if(url) {
                if(url.indexOf('vimeo') !== -1 && !element.classList.contains('no-lightbox')) {
                    is_vimeolink(url,element);
                }
                if(is_youtubelink(url) && !element.classList.contains('no-lightbox')) {
                    element.classList.add('lightbox-youtube');
                    element.setAttribute('data-id',is_youtubelink(url));
                }
                if(is_imagelink(url) && !element.classList.contains('no-lightbox')) {
                    element.classList.add('lightbox-image');
                    var href = element.getAttribute('href');
                    var filename = href.split('/').pop();
                    var split = filename.split(".");
                    var name = split[0];
                    element.setAttribute('title',element.innerText);
                }
            }
        });



        //remove the clicked lightbox
        document.getElementById('lightbox').addEventListener("click", function(event) {
            if(event.target.id != 'next' && event.target.id != 'prev'){
                this.innerHTML = '';
                document.getElementById('lightbox').style.display = 'none';
            }
        });
      
        //add the youtube lightbox on click
        var elements = document.querySelectorAll('a.lightbox-youtube');
        elements.forEach(element => {
            element.addEventListener("click", function(event) {
                event.preventDefault();
                document.getElementById('lightbox').innerHTML = '<a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="videoWrapperContainer"><div class="videoWrapper"><iframe src="https://www.youtube.com/embed/'+this.getAttribute('data-id')+'?autoplay=1&showinfo=0&rel=0"></iframe></div>';
                document.getElementById('lightbox').style.display = 'block';

                setGallery(this);
            });
        });

        //add the image lightbox on click
        var elements = document.querySelectorAll('a.lightbox-image');
        elements.forEach(element => {
            element.addEventListener("click", function(event) {
                event.preventDefault();
                document.getElementById('lightbox').innerHTML = '<a id="close"></a><a id="next">&rsaquo;</a><a id="prev">&lsaquo;</a><div class="img" style="background: url(\''+this.getAttribute('href')+'\') center center / contain no-repeat;" title="'+this.getAttribute('title')+'" ><img src="'+this.getAttribute('href')+'" alt="'+this.getAttribute('title')+'" /></div><span>'+this.getAttribute('title')+'</span>';
                document.getElementById('lightbox').style.display = 'block';

                setGallery(this);
            });
        });

        

    });

function toggleLightmode() {
    if(document.getElementById('top').parentElement.classList.contains('lightmode')){
        document.getElementById('top').parentElement.classList.remove('lightmode');
        document.getElementById('top').parentElement.classList.add('darkmode');
        localStorage.setItem('mode', 'dark'); 
    } else if (document.getElementById('top').parentElement.classList.contains('darkmode')) {
        document.getElementById('top').parentElement.classList.remove('darkmode');
        localStorage.setItem('mode', 'blue'); 
    } else {
        document.getElementById('top').parentElement.classList.add('lightmode');
        localStorage.setItem('mode', 'light'); 
    }
    document.getElementById('lightmode').blur();
}

if(document.body.classList.contains('error') && window.location.href.indexOf("/nl/") != -1) {
    var elements = document.querySelectorAll('.english');
    for (var i=0; i < elements.length; i ++) {
        elements[i].style.display = 'none';
    }
    var elements = document.querySelectorAll('.nederlands');
    for (var i=0; i < elements.length; i ++) {
        elements[i].style.display = 'block';
    }
} else {
    var elements = document.querySelectorAll('.english');
    for (var i=0; i < elements.length; i ++) {
        elements[i].style.display = 'block';
    }
    var elements = document.querySelectorAll('.nederlands');
    for (var i=0; i < elements.length; i ++) {
        elements[i].style.display = 'none';
    }
}
function writeImages() {
    var oImg = document.createElement("img");
    oImg.setAttribute('src', '/img/bananaleft2.svg');
    oImg.setAttribute('id', 'bananaleft');
    oImg.setAttribute('alt', 'Banana leafs left');
    document.body.appendChild(oImg);
    var oImg = document.createElement("img");
    oImg.setAttribute('src', '/img/bananaright2.svg');
    oImg.setAttribute('id', 'bananaright');
    oImg.setAttribute('alt', 'Banana leafs right');
    document.body.appendChild(oImg);
    if(!sessionStorage.loaded) var delay = 1000;
    else var delay = 0;
    setTimeout(function(){document.body.classList.add('loaded');},delay);
    sessionStorage.loaded = true;
}
if (sessionStorage.loaded) {
    writeImages();
} else {
    var loaded = false;

    //An array of DOM events that should be interpreted as
    //user activity.
    var activityEvents = [
        'mousedown', 'mousemove', 'keydown',
        'scroll', 'touchstart'
    ];
 
    //add these events to the document.
    //register the activity function as the listener parameter.
    activityEvents.forEach(function(eventName) {
        document.addEventListener(eventName, function() {
            if(loaded==false){
                writeImages();
                loaded = true;
            }
        });
    });
}
