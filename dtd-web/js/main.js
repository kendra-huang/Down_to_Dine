const apiKey = 'EjKBKGiEKnrhbi-wjpdU-5Ch3Xs8QbL3dKnz3efiJKLLND6qSPoTAH469ah0TQ5C67qQKiLZDo7HNZas-JCEbb0Tz70D-t2pA6SdxgcAUwz2JdwMOZm7LGG7e3RQXnYx';
const querystring = require('querystring');

$(document).ready(function(){
    
    // Makes the Nav-bar stick to the top
    $("#navigation").sticky();
    
    

    /*
        These JQuery functions really slow down the interface,
        so im disabling them. Some HTML will be affected,
        but nothing that manually writing HTML/CSS wont fix

    $("#owl-example").owlCarousel({
        // Most important owl features
        items : 4,
        pagination : true,
        paginationSpeed : 1000,
        navigation : true,
        navigationText : ["","<i class='fa fa-angle-right'></i>"],
        slideSpeed : 800,
    });

	$('#nav').onePageNav({
		currentClass: 'current',
		changeHash: true,
		scrollSpeed: 15000,
		scrollThreshold: 0.5,
		filter: '',
		easing: 'easeInOutExpo'
    });
     $('#top-nav').onePageNav({
         currentClass: 'active',
         changeHash: true,
         scrollSpeed: 1200
    });
    */

//Initiate WOW JS
    new WOW().init();

});

function search_btn_press() {
    var description = document.getElementById("description").value;
    var location = document.getElementById("location").value;
    console.log(description, location);


}
