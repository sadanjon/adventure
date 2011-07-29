/**
 * file: main.js
 */

$(document).ready(function() {
    if (!adventure.setup()) {
        return;
    }
    ui.setup();
    
    var guy = Guy({position: {left: 0, top: 300}, facing: Guy.facings.left});
    adv.guy = guy;
    
    adv.cutscenes.current = adv.cutscenes.opening;
    adv.cutscenes.doNext();
    
    $(window).bind('click', function(e) {
    	adv.click({left: e.pageX, top: e.pageY});
    });
    
    setInterval(function() {
    	guy.update(20);
    }, 20);
    
});
