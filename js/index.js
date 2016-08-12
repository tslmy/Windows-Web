var apps = {
    "Internet Explorer": {
        "href": "homepage.html", 
        "name": "Internet Explorer",
        "icon": "fa-internet-explorer",
        "color": "#1A9AF0",
        "width": "530px",
        "height": "400px"
    },
    "Calculator": {
        "href": "https://mozilla.github.io/calculator/app/", 
        "name": "Calculator",
        "icon": "fa-calculator",
        "color": "#f97c17",
        "width": "420px",
        "height": "530px"
    },
    "Next Bus To": {
        "href": "https://nextbus.to/", 
        "name": "Next Bus To",
        "color": "#1df7b0",
        "icon": "fa-bus",
        "width": "357px",
        "height": "544px"
    },
    "Chatroom": {
        "href": "https://tlk.io/tslmy", 
        "name": "Chatroom",
        "color": "#00aaff",
        "icon": "fa-cloud"
    },
    "Pomodoro Timer": {
        "href": "http://pomodo.work/", 
        "name": "Pomodoro Timer",
        "color": "#e35d5b",
        "icon": "fa-hourglass-start",
        "height": "370px",
        "width": "350px"
    },
    "Google Maps": {
        "href": "https://www.google.com/maps/embed", 
        "name": "Google Maps",
        "icon": "fa-map",
        "width": "460px",
        "height": "280px",
        "color": "#A1CA88"
    },
    "Notepad": {
        "href": "https://tslmy.github.io/textpad/", 
        "name": "Notepad",
        "color": "#ccc",
        "icon": "fa-file-text-o"
    },
    "Virtual Machine": {
        "href": "https://tslmy.github.io/Windows-Web/", 
        "name": "Virtual Machine",
        "icon": "fa-desktop",
        "width": "720px",
        "height": "570px",
        "color": "#DBAD71"
    },
    "AirDrop": {
        "href": "https://snapdrop.net/", 
        "name": "Snapdrop",
        "icon": "fa-wifi",
        "width": "720px",
        "height": "570px",
        "color": "#4285f4"
    },
    "Pokedex": {
        "href": "https://www.pokedex.org", 
        "name": "Pokedex",
        "icon": "fa-get-pocket",
        "width": "400px",
        "height": "620px",
        "color": "rgb(160,64,160)"
    },
    "Net Speed Test": {
        "href": "https://www.fast.com", 
        "name": "Fast by Netflix",
        "icon": "fa-bolt",
        "width": "400px",
        "height": "430px",
        "color": "rgb(226,18,33)"
    },
    "Protein Viewer": {
        "href": "https://arose.github.io/ngl/", 
        "name": "Protein Viewer",
        "icon": "fa-flask",
        "color": "#1C1F26",
        "width": "720px",
        "height": "570px"
    },
    "Siri Commands List": {
        "href": "https://hey-siri.io/", 
        "name": "Siri Commands List",
        "icon": "fa-microphone",
        "width": "720px",
        "height": "570px"
    },
    "Google Now Commands": {
        "href": "https://ok-google.io/", 
        "name": "Google Now Commands List",
        "icon": "fa-microphone",
        "width": "720px",
        "height": "570px"
    }
};

function generateDomForNewBrowserWindow(appName, href, icon, browserWindowID, width, height, color) {
    return `        <div class="window window--browser" data-window="browser` + browserWindowID + `" style="width:` + width + `;height:` + height + `;top:` + browserWindowID * 32 + `px;left:` + browserWindowID * 32 + `px;">
            <div class="window__titlebar">
                <div class="window__controls window__controls--left">
                    <a class="window__icon" href="#" style="background:` + color + `"><i class="fa ` + icon + `"></i></a>
                </div>
                <span class="window__title">` + appName + `</span>

            </div>
                <div class="window__controls window__controls--right">
                    <a class="window__minimize" href="#"><i class="fa fa-minus"></i></a>
                    <a class="window__maximize" href="#"><i class="fa"></i></a>
                    <a class="window__close" href="#"><i class="fa fa-close"></i></a>
                </div>
            <div class="window__body">
                <div class="window__main">
                    <iframe class="full-iframe" src="` + href + `"></iframe>
                </div>
            </div>
        </div>`;
};

function generateDomForNewBrowserTaskbarButton(appName, href, icon, browserWindowID) {
    return `<a class="taskbar__item taskbar__item--open taskbar__item--browser" href="#" data-window="browser` + browserWindowID + `">
            <i class="fa ` + icon + `"></i>
        </a>`;
};

function openAppNewWindow(e) {
    e.preventDefault();
    //get usable parameters
    var appName = $(this).data('appname') || 'Untitled';
    var icon = $(this).data('icon') || 'fa-cube';
    var href = $(this).data('href') || 'about:blank';
    var width = $(this).data('width') || '400px';
    var height = $(this).data('height') || '515px';
    var color = $(this).data('color') || '#7bb6ef';
    browserWindowCount += 1;
    console.log('Creating window for ', appName, ' that points to ', href, '...');
    //generate dom
    WindowDomString = generateDomForNewBrowserWindow(appName, href, icon, browserWindowCount, width, height, color);
    TaskbarButtonDomString = generateDomForNewBrowserTaskbarButton(appName, href, icon, browserWindowCount);
    var targetWindow = $(WindowDomString);
    var targetTaskbar = $(TaskbarButtonDomString);
    //deactivate, if any, current active window
    $('.taskbar__item').removeClass('taskbar__item--active');
    //inject new dom elements:
    targetWindow.appendTo('.desktop');
    targetTaskbar.appendTo('.taskbar');
    //re-activate event listeners on those new doms:
    targetTaskbar.click(unminimizeApp);
    targetWindow.click(windowClickHandler);
    targetWindow.click();
    targetWindow.resizable(resizablePlugin_configurations);
    targetWindow.draggable(draggablePlugin_configurations);
    var thisTitlebar = $('.window__titlebar', targetWindow);
    thisTitlebar.each(initialize_a_titlebar);
    thisTitlebar.mouseup(tiltingHandler);
    //event listeners for debugging:
    targetTaskbar.click(function () {
        console.log('Clicked on taskbar button.')
    });
    thisTitlebar.click(function () {
        console.log('Clicked on titlebar.')
    });
    targetWindow.click(function () {
        console.log('Clicked on window.')
    });
    $('a', thisTitlebar).click(function () {
        console.log('Clicked on window controls.')
    });
};

function initialize_a_titlebar() {
    var parentWindow = $(this).closest('.window');

    $(this).find('a').click(function (e) {
        e.preventDefault();
    });

    $(this).find('.window__icon').click(function (e) {
        $(this).siblings('.window__menutoggle').trigger('click');
    });

    $(this).find('.window__menutoggle').click(function (e) {
        $(parentWindow).find('.window__menu').fadeToggle(100).toggleClass('window__menu--open');
        $(this).toggleClass('window__menutoggle--open');
    });

    $(parentWindow).find('.window__close').click(function (e) {
        console.log('Close window');
        $(parentWindow).addClass('window--closing');

        setTimeout(function () {
            $(parentWindow).hide().removeClass('window--closing').addClass('window--opening');
        }, 500);

        var appName = $(parentWindow).data('window');

        $('.taskbar__item[data-window="' + appName + '"]').removeClass('taskbar__item--open').removeClass('taskbar__item--active');

        var closest = $('.window').not('.window--minimized, .window--closing, .window--opening').filter(function () {
            return $(this).css('z-index') < zIndex
        }).first();

        $(closest).addClass('window--active');
    });

    $(parentWindow).find('.window__minimize').click(function (e) {
        $(parentWindow).addClass('window--minimized');

        var appName = $(parentWindow).data('window');
        var targetTaskbar = $('.taskbar__item[data-window="' + appName + '"]');

        //alert(targetTaskbar.attr('class'));
        $(targetTaskbar).removeClass('taskbar__item--active');

    });

    $(parentWindow).find('.window__maximize').click(function (e) {

        $(parentWindow).toggleClass('window--maximized');

        if (!$(parentWindow).hasClass('window--maximized')) {
            $(parentWindow).css({
                'height': initialHeight,
                'width': initialWidth,
                'top': initialTop,
                'left': initialLeft
            });
        } else {
            initialHeight = $(parentWindow).height();
            initialWidth = $(parentWindow).width();
            initialTop = $(parentWindow).position().top;
            initialLeft = $(parentWindow).position().left;

            $(parentWindow).css({
                'height': fullHeight,
                'width': fullWidth,
                'top': 0,
                'left': 0
            });
        }
    });
};

function tiltingHandler(e) {
    var parentWindow = $(this).closest('.window');
    var pos_top = $(parentWindow).offset().top;
    var pos_left = $(parentWindow).offset().left;
    if (pos_top < -5) {
        //alert('at top')
        $(parentWindow).addClass('window--maximized');

        initialHeight = $(parentWindow).height();
        initialWidth = $(parentWindow).width();
        initialTop = $(parentWindow).position().top;
        initialLeft = $(parentWindow).position().left;

        $(parentWindow).css({
            'height': fullHeight,
            'width': fullWidth,
            'top': 0,
            'left': 0
        });
    } else if (pos_left < -$(parentWindow).width() / 2) {
        //alert('at left')
        $(parentWindow).addClass('window--maximized')
        initialHeight = $(parentWindow).height();
        initialWidth = $(parentWindow).width();
        initialTop = $(parentWindow).position().top;
        initialLeft = $(parentWindow).position().left;

        $(parentWindow).css({
            'height': fullHeight,
            'width': fullWidth / 2,
            'top': 0,
            'left': 0
        });
    } else if (pos_left > fullWidth - $(parentWindow).width() / 2) {
        //alert('at right')
        $(parentWindow).addClass('window--maximized');
        initialHeight = $(parentWindow).height();
        initialWidth = $(parentWindow).width();
        initialTop = $(parentWindow).position().top;
        initialLeft = $(parentWindow).position().left;

        $(parentWindow).css({
            'height': fullHeight,
            'width': fullWidth / 2,
            'top': 0,
            'left': fullWidth / 2
        });
    }

};

function unminimizeApp(e) {
    var appName = $(this).data('window');
    var targetWindow = $('.window[data-window="' + appName + '"]');
    var targetTaskbar = $('.taskbar__item[data-window="' + appName + '"]');

    e.preventDefault();
    $('.taskbar__item').removeClass('taskbar__item--active');

    if (targetWindow.is(':visible')) {
        if (targetWindow.hasClass('window--active')) {
            $(targetWindow).toggleClass('window--minimized');

            if (!targetWindow.hasClass('window--minimized')) {
                var initialHeight = $(targetWindow).height(),
                    initialWidth = $(targetWindow).width(),
                    initialTop = $(targetWindow).position().top,
                    initialLeft = $(targetWindow).position().left;

                $('.window').removeClass('window--active');

                $(targetWindow).addClass('window--active').css({
                    'z-index': zIndex++
                });

                $(targetTaskbar).addClass('taskbar__item--active');
            }
        } else {
            $('.window').removeClass('window--active');
            $(targetWindow).addClass('window--active').removeClass('window--minimized').css({
                'z-index': zIndex++
            });

            $(targetTaskbar).addClass('taskbar__item--active');
        }
    } else {
        $('.window').removeClass('window--active');

        $('.window[data-window="' + appName + '"]').css({
            'z-index': zIndex++
        }).addClass('window--active').show();

        setTimeout(function () {
            $('.window[data-window="' + appName + '"]').removeClass('window--opening');
        }, 500);

        $(targetTaskbar).addClass('taskbar__item--active').addClass('taskbar__item--open');
    }
};

function toggleStart(e) {
    $('.start-menu-fade').fadeToggle(500);
    $('.start-menu').fadeToggle(250).toggleClass('start-menu--open');
    $('.taskbar__item--start').toggleClass('start--open');
}

function listToggleClickHandler() {
    $(this).closest('li').children('ul').animate({
        'height': 'toggle',
        'opacity': 'toggle'
    }, 250);
    $(this).closest('li').toggleClass('side__list--open');
};

function windowClickHandler(e) {
    if (!$(this).is('.window--active')) {
        $('.window').removeClass('window--active');
    }

    $(this).addClass('window--active');
    $(this).css({
        'z-index': zIndex++
    });

    var appName = $(this).data('window');
    var targetTaskbar = $('.taskbar__item[data-window="' + appName + '"]');

    if (!$('.window__close').is(e.target) && $('.window__close').has(e.target).length === 0 && !$('.window__minimize').is(e.target) && $('.window__minimize').has(e.target).length === 0) {
        $('.taskbar__item').removeClass('taskbar__item--active');
        $(targetTaskbar).addClass('taskbar__item--active');

    }
};

function menuToggleInitiator() {
    var menuName = $(this).data('menu');
    var menu = $('.menu[data-menu="' + menuName + '"]');
    var pos = $(this).position();
    var height = $(this).outerHeight();

    if (!$(menu).hasClass('menu--bottom')) {
        $(menu).position({
            my: 'left top',
            at: 'left bottom',
            of: this,
            collision: 'none'
        });
    } else {

    }

    $(menu).hide();

    $(this).click(function (e) {
        e.preventDefault();
        $('.menu').not(menu).hide();
        $(menu).toggle();
    });
};

function initializeTimer() {
    var a_p = "";
    var d = new Date();
    var curr_hour = d.getHours();
    if (curr_hour < 12) {
        a_p = "AM";
    } else {
        a_p = "PM";
    }
    if (curr_hour == 0) {
        curr_hour = 12;
    }
    if (curr_hour > 12) {
        curr_hour = curr_hour - 12;
    }
    var curr_min = d.getMinutes();
    if (curr_min < 10) {
        curr_min = '0' + curr_min;
    }
    $('.time').html(curr_hour + ':' + curr_min + ' ' + a_p);
};


//initilize global variables:
var zIndex = 1;
var browserWindowCount = 0;
var fullHeight = $(window).height() - 48,
    fullWidth = $(window).width();
$(window).resize(function () { //these variable above should be tracked:
    fullHeight = $(window).height() - 48;
    fullWidth = $(window).width();
});
    var resizablePlugin_configurations = {
        handles: 'n,ne,e,se,s,sw,w,nw',
        stop: function () {
            var initialHeight = $(this).height(),
                initialWidth = $(this).width(),
                initialTop = $(this).position().top,
                initialLeft = $(this).position().left;
        }
    };
    var draggablePlugin_configurations = {
        handle: '.window__titlebar',
        stop: function (event, ui) {
            console.log('Drag stopped.');
            var initialHeight = $(this).height(),
                initialWidth = $(this).width(),
                initialTop = $(this).position().top,
                initialLeft = $(this).position().left;
        },
        start: function (event, ui) {
            console.log('Drag started.');
            var mouseX = event.pageX + 'px';

            $('.window').removeClass('window--active');

            $(this).addClass('window--active');
            $(this).css({
                'z-index': zIndex++
            });

            if ($(this).hasClass('window--maximized')) {

                //alert(mouseX);
                $(this).removeClass('window--maximized').css({
                    'height': initialHeight,
                    'width': initialWidth,
                    'top': 0,
                    'left': mouseX
                });
            }

            var appName = $(this).data('window');
            var targetTaskbar = $('.taskbar__item[data-window="' + appName + '"]')
            $('.taskbar__item').removeClass('taskbar__item--active');
            $(targetTaskbar).addClass('taskbar__item--active');
        }
    };

//close menu that is not clicked upon upon any click:
$(document).mouseup(function (e) {
    if ($('.menu').has(e.target).length === 0 && !$('.menu-toggle').is(e.target) && $('.menu-toggle').has(e.target).length === 0) {
        $('.menu').hide();
    }
});

$(function () { //main
    //populate start menu:
    for (var i in apps) {  
        $('.start-menu__recent').append(`
            <li class="start-menu__browser_newWindow">
                <a href="#" data-href="`+apps[i].href+`" data-appname="`+apps[i].name+`" data-icon="`+apps[i].icon+`" data-color="`+apps[i].color+`" data-width="`+apps[i].width+`" data-height="`+apps[i].height+`">
                    <i class="fa `+apps[i].icon+`" style="background:`+apps[i].color+`"></i> `+i+`
                </a>
            </li>`);
        $('.start-screen').append(`
            <a class="start-screen__tile masonry-item" style="background:`+apps[i].color+`" href="`+apps[i].href+`" data-href="`+apps[i].href+`" data-appname="`+apps[i].name+`" data-icon="`+apps[i].icon+`" data-color="`+apps[i].color+`" data-width="`+apps[i].width+`" data-height="`+apps[i].height+`">
                <i class="fa `+apps[i].icon+`"></i>
                <span>`+i+`</span>
            </a>`);
    }

    //fix touch device behavior:
    FastClick.attach(document.body); //better responsive speed on touch devices
    $('body').on('touchmove', function (e) { //ignore elastic scroll
        // this is the node the touchmove event fired on
        if ($(e.target).hasClass('window__titlebar')) {
            // ignore as we want the scroll to happen
        } else {
            e.preventDefault();
        }
    });

    $('.taskbar__item').click(unminimizeApp);
    $('.start-menu__recent li a').click(openAppNewWindow);
    $('.start-screen__tile').click(openAppNewWindow);

    //Bind events:
    $('.all-apps').click(function() {$('.start-screen-scroll').toggle()});
    $('.taskbar__item--start').click(toggleStart);
    $('.start-menu__recent li a').click(toggleStart);
    $('.start-screen__tile').click(toggleStart);
    $('.list__toggle').click(listToggleClickHandler);
    $('.taskbar__item--start').click(function () {// Prevent "open" class on start
        $(this).removeClass('taskbar__item--open taskbar__item--active');
    });
    $('.desktop').click(function (e) {// Unfocus windows when desktop is clicked
        if ($('.desktop').has(e.target).length === 0) {
            $('.window').removeClass('window--active');
            $('.taskbar__item').removeClass('taskbar__item--active');
        }
    });

    // when the startup menu is visible and user clicked outside the menu, it should be closed:
    $(document).mouseup(function (e) {
        var start = $('.start-menu');
        var startToggle = $('.taskbar__item--start');
        if (start.is(':visible') && !startToggle.is(e.target) && startToggle.has(e.target).length === 0 && !start.is(e.target) && start.has(e.target).length === 0) {
            toggleStart();
            //alert('clicked outside start');
        }
    });
    //timer support:
    initializeTimer();
    
    //initialize plugins:
    $('.taskbar').sortable({axis: "x"}); //sortable plugin
    $('.start-screen').masonry({ //tiles plugin
        itemSelector: '.masonry-item',
        columnWidth: 128
    });
    
    //initialize visual components:
    $('.start-menu').hide().css('opacity', 1);
    $('.menu-toggle').each(menuToggleInitiator);
    $('.side__list ul').each(function () {
        if ($(this).find('ul').is(':visible')) {
            $(this).children('li').addClass('side__list--open');
        }
    });
    $('.side__list li').each(function () {
        if ($(this).children('ul').length) {
            //$(this).addClass('list__sublist');
            $(this).children('a').append('<span class="list__toggle"></span>');
        }
        if ($(this).children('ul').is(':visible')) {
            $(this).addClass('side__list--open');
        }
    });
    
});
