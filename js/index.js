$(function () {
    var $container = $('.start-screen');

    $container.masonry({
        itemSelector: '.masonry-item',
        columnWidth: 128
    });
    
    $('body').on('touchmove', function(e) {
        // this is the node the touchmove event fired on
        if ($(e.target).hasClass('window__titlebar')){
            // ignore as we want the scroll to happen
        } else {
            e.preventDefault();
        }
    });
    
    $('.start-menu').hide().css('opacity', 1);
    $('.taskbar').sortable({axis: "x"});

    $('.menu-toggle').each(menuToggleInitiator);
    
    
    var zIndex = 1;

    var fullHeight = $(window).height() - 48,
        fullWidth = $(window).width();

    $(window).resize(function () {
        fullHeight = $(window).height() - 48;
        fullWidth = $(window).width();
    });


    function windowClickHandler (e) {
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
    $('.window').resizable(resizablePlugin_configurations);
    $('.window').draggable(draggablePlugin_configurations);

    function openApp(e) {
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
    }
    var browserWindowCount = 0;
    function generateDomForNewBrowserWindow(appName, href, icon, browserWindowID) {
        return `        <div class="window window--browser" data-window="browser`+browserWindowID+`" style="width:400px;height:515px;top:`+browserWindowID*32+`px;left:`+browserWindowID*32+`px;">
                <div class="window__titlebar">
                    <div class="window__controls window__controls--left">
                        <a class="window__icon" href="#"><i class="fa `+icon+`"></i></a>
                    </div>
                    <span class="window__title">`+appName+`</span>

                </div>
                    <div class="window__controls window__controls--right">
                        <a class="window__minimize" href="#"><i class="fa fa-minus"></i></a>
                        <a class="window__maximize" href="#"><i class="fa"></i></a>
                        <a class="window__close" href="#"><i class="fa fa-close"></i></a>
                    </div>
                <div class="window__body">
                    <div class="window__main">
                        <iframe class="full-iframe" src="`+href+`"></iframe>
                    </div>
                </div>
            </div>`;
    };
    function generateDomForNewBrowserTaskbarButton(appName, href, icon, browserWindowID) {
        return `<a class="taskbar__item taskbar__item--open taskbar__item--browser" href="#" data-window="browser`+browserWindowID+`">
                <i class="fa `+icon+`"></i>
            </a>`;
    };
                
    function openAppNewWindow(e) {
        e.preventDefault();
        //get usable parameters
        var appName = $(this).data('appname');
        var icon = $(this).data('icon');
        var href = $(this).data('href');
        browserWindowCount += 1;
        console.log('Creating window for ', appName, ' that points to ', href, '...');
        //generate dom
        WindowDomString = generateDomForNewBrowserWindow(appName, href, icon, browserWindowCount);
        TaskbarButtonDomString = generateDomForNewBrowserTaskbarButton(appName, href, icon, browserWindowCount);
        var targetWindow = $(WindowDomString);
        var targetTaskbar = $(TaskbarButtonDomString);
        //deactivate, if any, current active window
        $('.taskbar__item').removeClass('taskbar__item--active');
        //inject new dom elements:
        targetWindow.appendTo('.desktop');
        targetTaskbar.appendTo('.taskbar');
        //re-activate event listeners on those new doms:
        targetTaskbar.click(openApp);
        targetWindow.click(windowClickHandler);
        targetWindow.click();
        targetWindow.resizable(resizablePlugin_configurations);
        targetWindow.draggable(draggablePlugin_configurations);
        var thisTitlebar = $('.window__titlebar', targetWindow);
        thisTitlebar.each(initialize_a_titlebar);
        thisTitlebar.mouseup(tiltingHandler);
        //event listeners for debugging:
        targetTaskbar.click(function(){console.log('Clicked on taskbar button.')});
        thisTitlebar.click(function(){console.log('Clicked on titlebar.')});
        targetWindow.click(function(){console.log('Clicked on window.')});
        $('a', thisTitlebar).click(function(){console.log('Clicked on window controls.')});
        //TODO
    }

    $('.taskbar__item').click(openApp);
    $('.start-menu__recent li a').click(openAppNewWindow);
    //$('.start-screen__tile').click(openApp);




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

    function tiltingHandler (e) {
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
        } else if (pos_left < -$(parentWindow).width()/2) {
            //alert('at left')
            $(parentWindow).addClass('window--maximized')
            initialHeight = $(parentWindow).height();
            initialWidth = $(parentWindow).width();
            initialTop = $(parentWindow).position().top;
            initialLeft = $(parentWindow).position().left;

            $(parentWindow).css({
                'height': fullHeight,
                'width': fullWidth/2,
                'top': 0,
                'left': 0
            });
        } else if (pos_left > fullWidth-$(parentWindow).width()/2) {
            //alert('at right')
            $(parentWindow).addClass('window--maximized');
            initialHeight = $(parentWindow).height();
            initialWidth = $(parentWindow).width();
            initialTop = $(parentWindow).position().top;
            initialLeft = $(parentWindow).position().left;

            $(parentWindow).css({
                'height': fullHeight,
                'width': fullWidth/2,
                'top': 0,
                'left': fullWidth/2
            });
        }

    };
    /* //only needed when there are autolaunch apps
$(function () {
        var initialActive = $('.window:visible').not('.window--minimized').first();
        var appName = $(initialActive).data('window');

        $(initialActive).addClass('window--active').css({
            'z-index': zIndex++
        });
        $('.taskbar__item[data-window="' + appName + '"]').addClass('taskbar__item--active');
    });
    
    $('.window__titlebar').each(initialize_a_titlebar);
   $('.window').click(windowClickHandler); $('.window__titlebar').mouseup(titlebarButtonMouseUpEventHandler); */
});



// Unfocus windows when desktop is clicked
$('.desktop').click(function (e) {
    if ($('.desktop').has(e.target).length === 0) {
        $('.window').removeClass('window--active');
        $('.taskbar__item').removeClass('taskbar__item--active');
    }
});





$(function () {
    $('.side__list ul').each(function () {
        if ($(this).find('ul').is(':visible')) {
            $(this).children('li').addClass('side__list--open');
        }
    });
});



$(function () {
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

$(document).on('click', '.list__toggle', function () {

    $(this).closest('li').children('ul').animate({
        'height': 'toggle',
        'opacity': 'toggle'
    }, 250);

    $(this).closest('li').toggleClass('side__list--open');


});




function toggleStart(e) {
    $('.start-menu-fade').fadeToggle(500);
    $('.start-menu').fadeToggle(250).toggleClass('start-menu--open');
    $('.taskbar__item--start').toggleClass('start--open');
}
$('.taskbar__item--start').click(toggleStart);
$('.start-menu__recent li a').click(toggleStart);
$('.start-screen__tile').click(toggleStart);

// Prevent "open" class on start
$(function () {
    $('.taskbar__item--start').click(function () {
        $(this).removeClass('taskbar__item--open taskbar__item--active');
    });
});


$(document).mouseup(function (e) {
    var start = $('.start-menu');
    var startToggle = $('.taskbar__item--start');


    if (start.is(':visible') && !startToggle.is(e.target) && startToggle.has(e.target).length === 0 && !start.is(e.target) && start.has(e.target).length === 0) {
        toggleStart();
        //alert('clicked outside start');
    }



});




// Current time 
$(function () {
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
});

function menuToggleInitiator () {
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

//close menu that is not clicked upon upon any click:
$(document).mouseup(function (e) {
    if ($('.menu').has(e.target).length === 0 && !$('.menu-toggle').is(e.target) && $('.menu-toggle').has(e.target).length === 0) {
        $('.menu').hide();
    }
});
