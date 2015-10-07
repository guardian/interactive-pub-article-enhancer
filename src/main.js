var template = require('./html/base.html');
var header = require('./html/header.html');

	
var chapters = [
	{
		chapter: 'Part 2',
		url: 'http://media.guim.co.uk/9100a7cc1f11b84b250067559800860e715efe7b/0_14_5760_3457',
		ratio: {
			width: 5760,
			height: 3457
		},
		styles: 'gv-right-center',
		sizes: [140,500,1000,2000,5760]
	},
	{
		chapter: 'Part 3',
		url: 'http://media.guim.co.uk/5b129014c70352284e173607aa2eda51c2d1c15e/0_288_5703_3423',
		ratio: {
			width: 5703,
			height: 3423
		},
		styles: '',
		sizes: [140,500,1000,2000,5703]
	},
	{
		chapter: 'Part 4',
		url: 'http://media.guim.co.uk/7575b16065c13516a52f9e671db8c93317a3bf40/0_0_5760_3456',
		ratio: {
			width: 5760,
			height: 3456
		},
		styles: '',
		sizes: [140,500,1000,2000,5760]
	},

	{
		chapter: 'Part 5',
		url: 'http://media.guim.co.uk/c800177cf99dadb48db0db5b1328563a08e6587d/0_382_5760_3457',
		ratio: {
			width: 5760,
			height: 3457
		},
		styles: '',
		sizes: [140,500,1000,2000,5760]
	},

	{
		chapter: 'Part 6',
		url: 'http://media.guim.co.uk/75b129b1e2a735460df2cfe945cb9f313e31d2fb/0_382_5760_3457',
		ratio: {
			width: 5760,
			height: 3457
		},
		styles: '',
		sizes: [140,500,1000,2000,5760]
	},
	{
		chapter: 'Part 7',
		url: 'http://media.guim.co.uk/0c0c1dd492435d6566752919fbc92153daac15f3/0_382_5760_3457',
		ratio: {
			width: 5760,
			height: 3457
		},
		styles: '',
		sizes: [140,500,1000,2000,5760]
	},
	{
		chapter: 'Part 8',
		url: 'http://media.guim.co.uk/60f6d9cde5ac2c427102440abcde43987a90e4c2/0_88_5724_3435',
		ratio: {
			width: 5724,
			height: 3435
		},
		styles: '',
		sizes: [140,500,1000,2000,5724]
	}

	

]


function boot(el) {

	//replace drop caps

	var wrappers = document.querySelectorAll('.drop-cap');
	for(var i = 0; i < wrappers.length; i ++){
		wrappers[i].className = 'gv-first-char-wrap';
	}
	var caps = document.querySelectorAll('.drop-cap__inner');
	for(var c = 0; c < caps.length; c ++){
		caps[c].className = 'gv-first-char';
	}

	//update headers
	var headers = document.querySelectorAll('h2');

	for(var h = 0; h < headers.length; h ++){
		//loop through each header
		var chapterH2 = headers[h].innerHTML;
		
		for(var c = 0; c < chapters.length; c ++){
			//match each header to an h2 tag		
			if(chapterH2.search( chapters[c].chapter ) >=0){
				//once matched, insert html content above the h2 tag in the body copy
				createChapterHeader(headers[h], chapters[c]);
				break;
			}
		}
	}



	initAdvancer(el);
}

function createChapterHeader(h2, content){
	//console.log(h2, content)

	var div = document.createElement("div"); 
	var base = header;
	var chapter_headline = h2.innerHTML.replace(content.chapter + ': ', '').replace('<strong>', '').replace('</strong>', '');

	var size = getImageSize(content.ratio, content.sizes);

	base = base.replace('{{image}}', content.url + '/' + size + '.jpg')
			
				.replace('{{heading}}', chapter_headline)
				.replace('{{styles}}', content.styles)

	div.innerHTML = base;

	h2.parentNode.insertBefore(div, h2);
	//add rule
	var r = document.createElement("div");
	r.className = 'gv-drop-cap-rule'
	h2.parentNode.insertBefore(r, h2);

	//edit html
	var p = h2.nextElementSibling.innerHTML;
	h2.nextElementSibling.innerHTML = '<span class="gv-first-char-wrap"><span class="gv-first-char">' + p.slice(0,1) + '</span></span>' + p.slice(1, p.length - 1);

	h2.parentNode.removeChild(h2);

}

function getImageSize(ratio, sizes){

	var w = window.innerWidth;
	if(w <	660 ){
		var h = window.innerHeight;
		var multiplier = ratio.height / ratio.width;
		for(var s = 0; s < sizes.length; s ++){
			if( sizes[s] * multiplier > h * .9){
				return sizes[s];
			}
		}
		return sizes[sizes.length-1];

	} else {

		if( w > 1300){
			w = 1300;
		}

		for(var s = 0; s < sizes.length; s ++){
			//console.log(s)
			if(sizes[s] >= w){
				return sizes[s];
			}
		};

	}

	return sizes[2];
}

//page advancer code

var template = require('./html/base.html');
// first add raf shim
// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function initAdvancer(el) {


	if( window.innerWidth <= 760 ){
		el.innerHTML = template;
	
		el.querySelector('.gv-button').addEventListener('click', function(){
			//scroll
			scrollToY(window.scrollY + window.innerHeight, 1500, 'easeInOutQuint');

		})
	}
	
}


// main function
function scrollToY(scrollTargetY, speed, easing) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use

    var scrollY = window.scrollY,
        scrollTargetY = scrollTargetY || 0,
        speed = speed || 2000,
        easing = easing || 'easeOutSine',
        currentTime = 0;

    // min time .1, max time .8 seconds
    var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    var PI_D2 = Math.PI / 2,
        easingEquations = {
            easeOutSine: function (pos) {
                return Math.sin(pos * (Math.PI / 2));
            },
            easeInOutSine: function (pos) {
                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
            },
            easeInOutQuint: function (pos) {
                if ((pos /= 0.5) < 1) {
                    return 0.5 * Math.pow(pos, 5);
                }
                return 0.5 * (Math.pow((pos - 2), 5) + 2);
            }
        };

    // add animation loop
    function tick() {
        currentTime += 1 / 60;

        var p = currentTime / time;
        var t = easingEquations[easing](p);

        if (p < 1) {
            requestAnimFrame(tick);

            window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
        } else {
            console.log('scroll done');
            window.scrollTo(0, scrollTargetY);
        }
    }

    // call it once to get started
    tick();
}



module.exports = { boot: boot };
