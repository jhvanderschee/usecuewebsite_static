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
    b.getAttribute("href") && b.hostname !== location.hostname && (b.target = "_blank")
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
/* SMOOTH SCROLL */

function scrollPageTo(event) {
    var href=event.target.getAttribute('href');
    if(href.indexOf("#")> -1) {
        event.preventDefault(); 
        var id = event.target.getAttribute('href').replace('#','').replace('/','');
        if(id) element = document.getElementById(id);
        else element = '';
        if(element) {
            doScroll(element);
            history.pushState(null, null, '#'+element.getAttribute('id'));
        }
    }
}
function doScroll(element) {
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.offsetTop - 60
    });
}

function documentReady() {

    if(window.location.hash) {
    	var id = window.location.hash.substring(1);
    	if(id) element = document.getElementById(id);
        else element = '';
        if(element) {
            window.scroll({
                behavior: 'auto',
                left: 0,
                top: element.offsetTop - 60
            });
		}
    }

    var elements = document.querySelectorAll('a');
    elements.forEach(element => {
        element.addEventListener("click", function(event) {
            scrollPageTo(event);
        });
    });

    setTimeout(function(){ 
        var elements = document.querySelectorAll('.fullscreen');
        elements.forEach(element => {
            element.style.minHeight = element.offsetHeight + 'px';
        });
    }, 150);
}

document.addEventListener("DOMContentLoaded", documentReady);