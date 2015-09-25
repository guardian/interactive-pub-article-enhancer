/**
 * Replace header with video on desktop and photo on mobile.
 *
 * Usage:
 *          Embed enhancer boot.js and use alt feild to specify paths, eg.
 *          VideoURL;PhotoURL   NOTE the semicolon which is used to split.
 */

define([], function() {    
    'use strict';
    
    // FIXME: Change to production URL
    //var CSS_PATH = 'http://localhost:8000/enhancer/enhancer.css';
    var CSS_PATH = 'https://interactive.guim.co.uk/2015/09/pub-article-enhancer-chapters/enhancer/enhancer.css';


    // FIXME: Need a better way of detecting of in the apps
    var mode = ( document.location.origin === 'file://' ) ? 'app' : 'web';


    var mobileRegEx = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/;
    var isMobile = mobileRegEx.test( navigator.userAgent );


    var config = {
        selectors: {
            web: {
                headline: '.content__headline',
                standfirst: '.content__standfirst',
                header: '.content__head'
            },
            app: {
                headline: '.headline',
                standfirst: '.standfirst',
                header: '.article__header'
            }
        }
    };


    function addCSS(url) {
        var cssEl = document.createElement('link');
        cssEl.setAttribute('type', 'text/css');
        cssEl.setAttribute('rel', 'stylesheet');
        cssEl.setAttribute('href', url);
        var head = document.querySelector('head');
        head.appendChild(cssEl);
    }

    function createVideoEl(url) {
        var videoEl = document.createElement('video');
        videoEl.setAttribute('src', url);
        videoEl.setAttribute('class', 'gv__enhancer__video');
        videoEl.setAttribute('preload', 'auto');
        videoEl.loop = true;
        videoEl.autoplay = true;
        return videoEl;
    }


    function setupDOM(el) {
        console.log(mode, isMobile);
        var navigationTitle = document.createElement('h2');

        if (!el.dataset.hasOwnProperty('alt')) {
            return console.error('Enhancer error: Missing alt');
        }

        var altData = el.dataset.alt.split(';');
        var videoUrl = altData[0];
        var posterUrl = altData[1];
        console.log(altData);

        if (!altData || altData.length < 1) {
            console.error('Enhancer error: Missing video URL in alt');  
            return;
        }

        var body = document.querySelector('body');
        body.classList.add('has-feature-showcase-element');

        var containerEl = document.createElement('div');
        containerEl.setAttribute('class', 'gv__enhancer__container media-primary media-content media-primary--showcase');



        var headlineEl = document.querySelector(config.selectors[mode].headline);
        var standfirstEl = document.querySelector(config.selectors[mode].standfirst);
        var headerEl = document.querySelector(config.selectors[mode].header);

        var innerEl = document.createElement('div');
        innerEl.setAttribute('class', 'gv__enhancer__inner');

        var band_h = document.createElement('div');
        band_h.className = 'gv__bandh';
        innerEl.appendChild(band_h);

        var introHeaderEl = document.createElement('h1');
        introHeaderEl.className = 'gv__enhancer__headline content__headline';
        introHeaderEl.innerHTML = headlineEl.textContent;
        band_h.appendChild(introHeaderEl);

        var band_s = document.createElement('div');
        band_s.className = 'gv__bands';
        innerEl.appendChild(band_s);

        var standEl = document.createElement('p');
        standEl.className = 'gv__enhancer__standfirst content__standfirst';
        standEl.innerHTML = standfirstEl.textContent;
        band_s.appendChild(standEl);


        if (isMobile) {
            containerEl.style.backgroundImage = 'url('+posterUrl+')';
            containerEl.className += ' gv__enhancer__mobile';
        } else {
            var videoEl = createVideoEl(videoUrl);
            containerEl.appendChild(videoEl);

            var band = document.createElement('div');
            band.className = 'gv__banding';
            containerEl.appendChild(band);
        }
        
        containerEl.appendChild(innerEl);
        headerEl.parentNode.insertBefore(containerEl, headerEl);
        headerEl.parentNode.removeChild(headerEl);


        addCSS(CSS_PATH);
    }

    function boot(el) {
        setupDOM(el);
    }

    return {
        boot: boot
    };
});

