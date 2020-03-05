

var tableAdd, tableRemove;

jQuery(document).ready(function($){
    // Top Search Bar Entries
    _description = document.getElementById("description");
    _location = document.getElementById("location");
    _position = {
        latitude: undefined,
        longitude: undefined
    }
    
    // Makes the Nav-bar stick to the top
    $("#navigation").sticky();    

    $("#owl-example").owlCarousel({
        // Most important owl features
        items : 4,
        pagination : true,
        paginationSpeed : 1000,
        navigation : true,
        navigationText : ["","<i class='fa fa-angle-right'></i>"],
        slideSpeed : 800,
    });

    $("#listing-area").scroll(function() {
        let list = $(this);
        if(list[0].scrollHeight - list.scrollTop() <= list.height()){
            list = document.getElementById("listing-area");
            loadLocations(list, 10);
        }
    });
    
    $("#refresh").click(refreshList);

    function alreadyAdded(itemTitle) {
        for (var i = 0; i < objArray.length; i++) {
            if (objArray[i].title === itemTitle) {
                return true;
            }
        }
        return false;
    };

    // Set a click handler for anything with a data-confirmation attribute. 
    $('[adding-restaurant]').click(function() { 
        var message = $(this).data('added'); 
        return confirm(message); 
    });

//Initiate WOW JS
    new WOW().init();

/*  Below code from this section (code modified to fit personal use)
    Project: https://github.com/CodyHouse/products-comparison-table 
    ©2014 - 2020 CodyHouse. A project by @romano_cla and @guerriero_se
    License (MIT License) https://github.com/CodyHouse/products-comparison-table
*/
// Updated Comparison Table

    function productsTable( element ) {
        this.element = element;
        this.table = this.element.children('.cd-products-table');
        this.tableHeight = this.table.height();
        this.productsWrapper = this.table.children('.cd-products-wrapper');
        this.tableColumns = this.productsWrapper.children('.cd-products-columns');
        this.products = this.tableColumns.children('.product');
        this.productsNumber = this.products.length;
        this.productWidth = this.products.eq(0).width();
        this.productsTopInfo = this.table.find('.top-info');
        this.featuresTopInfo = this.table.children('.features').children('.top-info');
        this.topInfoHeight = this.featuresTopInfo.innerHeight() + 30;
        this.leftScrolling = false;
        this.filterBtn = this.element.find('.filter');
        this.resetBtn = this.element.find('.reset');
        this.filtering = false,
        this.selectedproductsNumber = 0;
        this.filterActive = true;
        this.navigation = this.table.children('.cd-table-navigation');
        // bind table events
        this.bindEvents();

        // NEW 
        this.tableColumns.css('width', this.productWidth*this.productsNumber + 'px');
    }


    comparisonMap = {};
    //const acceptedCatagories = new Set(['American','Japanese', 'Vietnamese', 'Korean', 'Italian', 'Thai', 'Chinese', 'Mexican', 'Indian', 'Scottish', ]);
    function getCatagories(categories){
        let terms = '';
        for(i in categories)
            terms += categories[i].title+'<br>';
        return terms;
    }
    function getLocationInfo(address){
        let terms = '';
        for(i in address)
            terms += address[i]+'<br>';
        return terms;
    }
    function getBusinessDistance(business, pos){
        console.log('current position (lat, long) >> ', pos.latitude, pos.longitude);
        return (Math.sqrt(Math.pow(business.coordinates.latitude - pos.latitude, 2) + Math.pow(business.coordinates.longitude - pos.longitude, 2)) * 69.09 ).toFixed(2);
    }
    productsTable.prototype.tableAdd = function(businessObj) {
        let newElement = $(
        '<li class="product" id="'+businessObj.id+'">'+
            '<div class="top-info">'+
                '<div class="check"></div>'+
                '<img src="'+ businessObj.image_url +'" alt="product image">'+
                '<h3>'+ businessObj.name +'</h3>'+
            '</div>'+
            // .top-info ^
            '<ul class="cd-features-list">'+
                '<li>'+businessObj.price+'</li>'+
                '<li class="rate"><img src="'+getRatingImgURL(businessObj.rating)+'"></li>'+
                '<li>'+ getCatagories(businessObj.categories)+'</li>'+ // TODO
                '<li>'+ getLocationInfo(businessObj.location.display_address) +'</li>'+
                '<li>'+getBusinessDistance(businessObj, _position) +' Miles from You</li>'+
            '</ul>'+
        '</li>');
        let comp = comparisonTables[0];
        comp.tableColumns.append(newElement);
        newElement.on('click', '.top-info', function() {
            var product = $(this).parents('.product');
            if( product.hasClass('selected') ) {
                product.removeClass('selected');
                comp.selectedproductsNumber = comp.selectedproductsNumber - 1;
                comp.updateFilterBtn();
            } else if( !product.hasClass('selected') ) {
                product.addClass('selected');
                comp.selectedproductsNumber = comp.selectedproductsNumber + 1;
                comp.updateFilterBtn();
            }
        })
        comp.productsTopInfo = comp.table.find('.top-info');
        comp.products = comp.tableColumns.children('.product');
        comp.productsNumber += 1;
        comp.tableColumns.css('width', comp.productWidth*comp.productsNumber + 'px');
    }
    tableAdd = productsTable.prototype.tableAdd;

    productsTable.prototype.tableRemove = function(businessObj) {
        let comp = comparisonTables[0];
        comp.tableColumns.children("#"+businessObj.id).remove();
        //  `comp.productsTopInfo = comp.table.find('.top-info');
        comp.products = comp.tableColumns.children('.product');
        comp.productsNumber -= 1;
        comp.tableColumns.css('width', comp.productWidth*comp.productsNumber + 'px');
    }
    tableRemove = productsTable.prototype.tableRemove;
    
    productsTable.prototype.bindEvents = function() {
        var self = this;
        //detect scroll left inside producst table
        self.productsWrapper.on('scroll', function(){
            if(!self.leftScrolling) {
                self.leftScrolling = true;
                (!window.requestAnimationFrame) ? setTimeout(function(){self.updateLeftScrolling();}, 250) : window.requestAnimationFrame(function(){self.updateLeftScrolling();});
            }
        });
        //select single product to filter
        self.products.on('click', '.top-info', function(){
            var product = $(this).parents('.product');
            if( /* !self.filtering && */ product.hasClass('selected') ) {
                product.removeClass('selected');
                self.selectedproductsNumber = self.selectedproductsNumber - 1;
                self.updateFilterBtn();
            } else if( /* !self.filtering && */ !product.hasClass('selected') ) {
                product.addClass('selected');
                self.selectedproductsNumber = self.selectedproductsNumber + 1;
                self.updateFilterBtn();
            }
        });
        //filter products
        self.filterBtn.on('click', function(event){
            event.preventDefault();
            if(self.filterActive) {
                //self.filtering =  true;
                self.showSelection();
                //self.filterActive = false;
                //self.filterBtn.removeClass('active');
            }
        });
        //reset product selection
        self.resetBtn.on('click', function(event){
            event.preventDefault();
            /*
            if( self.filtering ) {
                self.filtering =  false;
                self.resetSelection();
            } else {
                */
                self.resetSelection();
                self.products.removeClass('removed selected');
            //}
            self.selectedproductsNumber = 0;
            self.updateFilterBtn();
        });
        //scroll inside products table
        this.navigation.on('click', 'a', function(event){
            event.preventDefault();
            self.updateSlider( $(event.target).hasClass('next') );
        });
    }

    productsTable.prototype.updateFilterBtn = function() {
        //show/hide filter btn
        if( this.selectedproductsNumber >= 2 ) {
            this.filterActive = true;
            this.filterBtn.addClass('active');
        } else {
            this.filterActive = false;
            this.filterBtn.removeClass('active');
        }
    }

    productsTable.prototype.updateLeftScrolling = function() {
        var totalTableWidth = parseInt(this.tableColumns.eq(0).outerWidth(true)),
            tableViewport = parseInt(this.element.width()),
            scrollLeft = this.productsWrapper.scrollLeft();

        ( scrollLeft > 0 ) ? this.table.addClass('scrolling') : this.table.removeClass('scrolling');

        if( this.table.hasClass('top-fixed') && checkMQ() == 'desktop') {
            setTranformX(this.productsTopInfo, '-'+scrollLeft);
            setTranformX(this.featuresTopInfo, '0');
        }

        this.leftScrolling =  false;

        this.updateNavigationVisibility(scrollLeft);
    }

    productsTable.prototype.updateNavigationVisibility = function(scrollLeft) {
        ( scrollLeft > 0 ) ? this.navigation.find('.prev').removeClass('inactive') : this.navigation.find('.prev').addClass('inactive');
        ( scrollLeft < this.tableColumns.outerWidth(true) - this.productsWrapper.width() && this.tableColumns.outerWidth(true) > this.productsWrapper.width() ) ? this.navigation.find('.next').removeClass('inactive') : this.navigation.find('.next').addClass('inactive');
    }

    productsTable.prototype.updateTopScrolling = function(scrollTop) {
        var offsetTop = this.table.offset().top,
            tableScrollLeft = this.productsWrapper.scrollLeft();
        
        if ( offsetTop <= scrollTop && offsetTop + this.tableHeight - this.topInfoHeight >= scrollTop ) {
            //fix products top-info && arrows navigation
            if( !this.table.hasClass('top-fixed') && $(document).height() > offsetTop + $(window).height() + 200) { 
                this.table.addClass('top-fixed').removeClass('top-scrolling');
                if( checkMQ() == 'desktop' ) {
                    this.productsTopInfo.css('top', '0');
                    this.navigation.find('a').css('top', '0px');
                }
            }

        } else if( offsetTop <= scrollTop ) {
            //product top-info && arrows navigation -  scroll with table
            this.table.removeClass('top-fixed').addClass('top-scrolling');
            if( checkMQ() == 'desktop' )  {
                this.productsTopInfo.css('top', (this.tableHeight - this.topInfoHeight) +'px');
                this.navigation.find('a').css('top', (this.tableHeight - this.topInfoHeight) +'px');
            }
        } else {
            //product top-info && arrows navigation -  reset style
            this.table.removeClass('top-fixed top-scrolling');
            this.productsTopInfo.attr('style', '');
            this.navigation.find('a').attr('style', '');
        }

        this.updateLeftScrolling();
    }

    productsTable.prototype.updateProperties = function() {
        this.tableHeight = this.table.height();
        this.productWidth = this.products.eq(0).width();
        this.topInfoHeight = this.featuresTopInfo.innerHeight() + 30;
        this.tableColumns.css('width', this.productWidth*this.productsNumber + 'px');
    }

    productsTable.prototype.showSelection = function() {
        //this.element.addClass('filtering'); 
        // make all the elements that were not selected dissappear  NEW CODE
        this.products.each(function(){
            let product = $(this);
            if (!product.hasClass('selected')){
                product.addClass('removed');
            }
        });
        this.filterProducts();  // slides all elements down
    }

    productsTable.prototype.resetSelection = function() {
        this.tableColumns.css('width', this.productWidth*this.productsNumber + 'px');
        this.element.removeClass('no-product-transition');
        this.resetProductsVisibility();
    }

    productsTable.prototype.filterProducts = function() {
        var self = this,
            containerOffsetLeft = self.tableColumns.offset().left,
            scrollLeft = self.productsWrapper.scrollLeft(),
            selectedProducts = this.products.filter('.selected'),
            numberProducts = selectedProducts.length;

        self.tableColumns.css('width', self.productWidth*numberProducts + 'px');
    }

    productsTable.prototype.resetProductsVisibility = function() {
        var self = this,
            containerOffsetLeft = self.tableColumns.offset().left,
            selectedProducts = this.products.filter('.selected'),
            numberProducts = selectedProducts.length,
            scrollLeft = self.productsWrapper.scrollLeft(),
            n = 0;

        self.element.addClass('no-product-transition').removeClass('filtered');

        self.products.each(function(index){
            var product = $(this);
            if (product.hasClass('selected')) {
                n = n + 1;
                var leftTranslate = (-index + n - 1)*self.productWidth;
                setTranformX(product, leftTranslate);
            }
        });

        setTimeout(function(){
            self.element.removeClass('no-product-transition filtering');
            setTranformX(selectedProducts, '0');
            selectedProducts.removeClass('selected').attr('style', '');
        }, 50);
    }

    productsTable.prototype.updateSlider = function(bool) {
        var scrollLeft = this.productsWrapper.scrollLeft();
        scrollLeft = ( bool ) ? scrollLeft + this.productWidth : scrollLeft - this.productWidth;

        if( scrollLeft < 0 ) scrollLeft = 0;
        if( scrollLeft > this.tableColumns.outerWidth(true) - this.productsWrapper.width() ) scrollLeft = this.tableColumns.outerWidth(true) - this.productsWrapper.width();
        
        this.productsWrapper.animate( {scrollLeft: scrollLeft}, 200 );
    }

    comparisonTables = [];
    $('.cd-products-comparison-table').each(function(){
        //create a productsTable object for each .cd-products-comparison-table
        comparisonTables.push(new productsTable($(this)));
    });
    /*
    var windowScrolling = false;
    //detect window scroll - fix product top-info on scrolling
    
    $(window).on('scroll', function(){
        if(!windowScrolling) {
            windowScrolling = true;
            (!window.requestAnimationFrame) ? setTimeout(checkScrolling, 250) : window.requestAnimationFrame(checkScrolling);
        }
    });
    */

    var windowResize = false;
    //detect window resize - reset .cd-products-comparison-table properties
    $(window).on('resize', function(){
        if(!windowResize) {
            windowResize = true;
            (!window.requestAnimationFrame) ? setTimeout(checkResize, 250) : window.requestAnimationFrame(checkResize);
        }
    });

    function checkScrolling(){
        var scrollTop = $(window).scrollTop();
        comparisonTables.forEach(function(element){
            element.updateTopScrolling(scrollTop);
        });
        windowScrolling = false;
    }

    function checkResize(){
        comparisonTables.forEach(function(element){
            element.updateProperties();
        });
        windowResize = false;
    }

    function checkMQ() {
        //check if mobile or desktop device
        return window.getComputedStyle(comparisonTables[0].element.get(0), '::after').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "");
    }
    function setTranformX(element, value) {
        element.css({
            '-moz-transform': 'translateX(' + value + 'px)',
            '-webkit-transform': 'translateX(' + value + 'px)',
            '-ms-transform': 'translateX(' + value + 'px)',
            '-o-transform': 'translateX(' + value + 'px)',
            'transform': 'translateX(' + value + 'px)'
        });
    }
    
});


// Stores the most recent yelp API search
var mostRecentSearchOffset = 0;
var businessMap = {};
function loadLocations(list, amount) {
    console.log('loadLocations() called');
    params = {
        location:   _location.value,
        term:       "restaurant "+_description.value,
        offset:     mostRecentSearchOffset,
        limit:      amount
    }
    for (let i = 1; i <= 4; i++){
        if (document.getElementById("cb"+i).checked){
            console.log(params.price);
            if(params.price == undefined){
                params.price = i;
            }else{
                params.price = params.price+", "+i;
            }
        }
    }
    for (let i = 1; i <= 5; i++){
        let choice = document.getElementById("rb"+i);
        if (choice.checked){
            params.range = 1609*choice.value;
        }
    }
    for (let i = 7; i <= 8; i++){
        let choice = document.getElementById("rb"+i);
        if (choice.checked){
            params.sort_by = choice.value;
        }
    }
    yelpRequest(params).then(response => {
        if (response != undefined){
            if (list.innerHTML[4] == 'l'){
                list.innerHTML = "";
            }
            var starPicURL = '';
            for (i = 0; i < amount; i++){
                var redirectToYelpURL = response.businesses[i].url;
                let businessID = response.businesses[i].id;
                let businessObj = response.businesses[i];
                businessMap[businessID] = businessObj;
                var rating = response.businesses[i].rating;
                starPicURL = getRatingImgURL(rating);
                
                list.innerHTML +=
                '<li>'+
                    '<div class="blog-img">' +
                        '<a href="' + redirectToYelpURL + '"target="_blank">' + '<img src="' + response.businesses[i].image_url +'" alt="blog-img">' + '</a>' +
                    '</div>' +
                    '<div class="content-right">' +
                        '<h3>' + businessName + '</h3>' +
                        '<img src="' + starPicURL +'">' +
                    '<div>' + response.businesses[i].review_count + ' Reviews</div>' +
                    '<div>' + (response.businesses[i].price != undefined ? response.businesses[i].price : "Price Unavailable") + '</div>' +
                    // Add/Remove Button Toggle
                    '<button onclick="btnUpdate(this)" value="' + response.businesses[i].id + '">Add</button>' +
                '</li>';


                  
                // still need to add function where user can click button and have content show
                // e.g. Business Name, Address, option to take you to google maps

                let info_window = new google.maps.InfoWindow({    
                    content: '<h3>' + businessName + '</h3>' +
                                '<img src="' + starPicURL +'">' +
                                '<div>' + response.businesses[i].review_count + ' Reviews</div>' +
                                '<div>' + response.businesses[i].price + '</div>'
                })
                // creates new marker for each restaurant generated
                new google.maps.Marker({
                    position: new google.maps.LatLng(bLat, bLong),
                    map: map,
                    label: i,
                    title: 'Click to zoom'
                }).addListener('click', function(){
                    map.setZoom(16);
                    map.setCenter(this.getPosition());
                    info_window.open(map, this);
                });
            }
        }
    });
    mostRecentSearchOffset += amount;
}


function btnUpdate(buttonObject){
    let btn = $(buttonObject);
    console.log(btn);
    var businessObj = businessMap[buttonObject.value];
    if (btn.text() == 'Add'){
        comparisonMap[buttonObject.value] = businessObj;
        tableAdd(businessObj);
        console.log('add to business array', businessObj);
    }
    else {
        comparisonMap[buttonObject.value] = undefined;
        tableRemove(businessObj);
        console.log('removed business from array', businessObj);
        //document.getElementById(0)
    }
    btn.text(btn.text() == 'Add' ? 'Remove' : 'Add');
}


function getRatingImgURL(rating){
    switch(rating){
        case 0: 
            return './yelp stars/yelp_stars/web_and_ios/regular/regular_0.png';
        case 1:
            return './yelp stars/yelp_stars/web_and_ios/regular/regular_1.png';
        case 1.5:
            return './yelp stars/yelp_stars/web_and_ios/regular/regular_1_half.png';
        case 2:
            return './yelp stars/yelp_stars/web_and_ios/regular/regular_2.png';
        case 2.5:
            return './yelp stars/yelp_stars/web_and_ios/regular/regular_2_half.png';
        case 3:
            return './yelp stars/yelp_stars/web_and_ios/regular/regular_3.png';
        case 3.5:
            return './yelp stars/yelp_stars/web_and_ios/regular/regular_3_half.png';
        case 4:
            return "./yelp stars/yelp_stars/web_and_ios/regular/regular_4.png";
        case 4.5:
            return './yelp stars/yelp_stars/web_and_ios/regular/regular_4_half.png';
        case 5:
            return './yelp stars/yelp_stars/web_and_ios/regular/regular_5.png';
        default:
            console.log("no rating image was found for rating = ", rating);
    }    
}


// Yelp api Function calls
const apiKey = 'EjKBKGiEKnrhbi-wjpdU-5Ch3Xs8QbL3dKnz3efiJKLLND6qSPoTAH469ah0TQ5C67qQKiLZDo7HNZas-JCEbb0Tz70D-t2pA6SdxgcAUwz2JdwMOZm7LGG7e3RQXnYx';

// Initialize and add the map
var map, infoWindow, marker;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 11
    });
    

    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        // The marker, positioned at your location
        new google.maps.Marker({
            position: pos,
            map: map,
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            },
            //draggable:true
        }).addListener('click', function(){
            //info_window.open(map, this);
            infoWindow.setPosition(pos);
            infoWindow.setContent('Current Location');
            infoWindow.open(map);
            //map.setCenter(pos);
        });

        //map.setZoom(16);
        map.setCenter(pos);


        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    /*var secretMessages = ['This', 'is', 'the', 'secret', 'message'];
    var lngSpan = bounds.east - bounds.west;
    var latSpan = bounds.north - bounds.south;

    for (var i = 0; i < secretMessages.length; ++i) {
        var marker = new google.maps.Marker({
            position: {
            lat: bounds.south + latSpan * Math.random(),
            lng: bounds.west + lngSpan * Math.random()
            },
            map: map
        });
        attachSecretMessage(marker, secretMessages[i]);
    }*/
}

// Attaches an info window to a marker with the provided message. When the
// marker is clicked, the info window will open with the secret message.
/*function attachSecretMessage(marker, secretMessage) {
    var infowindow = new google.maps.InfoWindow({
        content: secretMessage
    });

    marker.addListener('click', function() {
        infowindow.open(marker.get('map'), marker);
    }); 
}*/


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

//async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB_HRi3y7icUTSWgh-pWM69OCql3sno7K4&callback=initMap";

function search_btn_press() {
    console.log('Search Bar Params: ', _description.value, _location.value);
    refreshList()
    window.location.href = '#listing';
}

function refreshList(){
    let list = document.getElementById("listing-area");
    list.innerHTML =    "<li LoadingTag><h1 class=\"heading\"><span>Loading</span></h1></li>" + 
                        "<li><h1 class=\"heading\"><span> . . . </span></h1></li>";
    mostRecentSearchOffset = 0;
    loadLocations(list, 10); 
}

/*
    GUIDE TO USE "yelpRequest" FUNCTION
    ----------------------------------
    Access the businesses arrays by calling:

    yelpRequest({
        location: ___ ,
        term: __ ,
        latitude: __ ,
        longitude: __ ,
        offset: __ ,
        etc .. 
    }).then(response => {
        # response is the business array #
        # for Ex: #
        var business = response.businesses[i]   // holds the array for the i'th business

        // access business properties as variables
        business.rating                         // holds the rating for the business
    });
*/

// Several api variables listed out for usage or to leave blank
async function yelpRequest(params) { 
    let yelp_corsanywhere = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/";
    let searchType = 'businesses/search?'; 
    const header = {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer "+apiKey
        })
    }
    let queryString = yelp_corsanywhere + searchType + $.param(params);
    console.log("queryString = ", queryString);
    var response;
    try {
        // turn params into a queuestring and fetch 
        response = await fetch(
            queryString,
            header
        )
        try {
            // turn the response into a Json/ array format
            response = await response.json();
            console.log(response);
        } catch (error) {
            console.log('JSON ',error);
        }
    } catch(error) {
        console.log('FETCH ', error);
    }
    // return the promise of the JSON for callback usage 
    return response;
}

// Sets the City and State of the user into the location bar whenever
// they choose the "Your Location" option
function setLocation() {
    if (_location.value == "Your Location") {
        if (navigator.geolocation){
            _location.value = "Finding Location...";
            navigator.geolocation.getCurrentPosition(position => {

                _position.latitude = position.coords.latitude;
                _position.longitude = position.coords.longitude;

                yelpRequest({
                    latitude:   position.coords.latitude,
                    longitude:  position.coords.longitude,
                    limit: 1
                }).then(response => {
                    if (response != undefined){
                        let first = response.businesses[0];
                        _location.value = first.location.city + ', ' + first.location.state;                        
                    }else{
                        _location.value = "Location could not be Found."
                        setTimeout(function() {
                            _location.value = "";
                        }, 1000);
                    }
                });
            },error => {
                switch(error.code) {    
                    case error.PERMISSION_DENIED:
                    console.log("User denied the request for Geolocation.");
                    break;
                    case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                    case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                    case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred.");
                    break;
                }
                _location.value = "Location could not be Found."
                setTimeout(function() {
                    _location.value = "";
                }, 1000);
            });
        }else{
            console.log("geolocation not permitted");
        }
    }
}