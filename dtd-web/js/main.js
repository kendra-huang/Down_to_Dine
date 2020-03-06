var tableAdd, tableRemove;
var map, markers = [];
var useGPSLocation = false;

jQuery(document).ready(function($){
    // Top Search Bar Entries
    _description = document.getElementById("description");
    _location = document.getElementById("location");
    _position = {
        lat: undefined,
        lng: undefined
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
        this.tableHeight = 650;//this.table.height();
        this.productsWrapper = this.table.children('.cd-products-wrapper');
        this.tableColumns = this.productsWrapper.children('.cd-products-columns');
        this.products = this.tableColumns.children('.product');
        this.productsNumber = this.products.length;
        this.productWidth = 310;//this.products.eq(0).width();
        this.productsTopInfo = this.table.find('.top-info');
        this.featuresTopInfo = this.table.children('.features').children('.top-info');
        this.topInfoHeight = this.featuresTopInfo.innerHeight() + 30;
        this.leftScrolling = false;
        this.filterBtn = this.element.find('.filter');
        this.resetBtn = this.element.find('.reset');
        this.filtering = false,
        this.selectedproductsNumber = this.productsNumber;
        this.filterActive = true;
        this.navigation = this.table.children('.cd-table-navigation');
        // bind table events
        this.bindEvents();

        // NEW 
        this.tableColumns.css('width', this.productWidth*this.productsNumber + 'px');
        this.tableColumns.css('height', this.tableHeight + 'px');
    }


    comparisonMap = {};
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
        console.log('current position (lat, long) >> ', pos.lat, pos.lng);
        return (Math.sqrt(Math.pow(business.coordinates.latitude - pos.lat, 2) + Math.pow(business.coordinates.longitude - pos.lng, 2)) * 69.09 ).toFixed(2);
    }
    productsTable.prototype.tableAdd = function(businessObj) {
        let newElement = $(
        '<li class="product selected" id="'+businessObj.id+'">'+
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
                '<li>'+ getBusinessDistance(businessObj, _position) +' Miles from You</li>'+
                '<li class="delete" style="cursor: pointer"></li>'+
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
        });
        newElement.on('click', '.delete', function() {
            comp.tableRemove(businessObj);
        });
        comp.productsTopInfo = comp.table.find('.top-info');
        comp.products = comp.tableColumns.children('.product');
        comp.productsNumber += 1;
        comp.selectedproductsNumber += 1;
        comp.tableColumns.css('width', comp.productWidth+comp.tableColumns.width() + 'px');
    }
    tableAdd = productsTable.prototype.tableAdd;

    productsTable.prototype.tableRemove = function(businessObj) {
        let comp = comparisonTables[0];
        let removed = comp.tableColumns.children("#"+businessObj.id);
        comp.products = comp.tableColumns.children('.product');
        comp.productsNumber -= 1;
        comp.selectedproductsNumber += ( removed.hasClass('selected') ? -1 : 0 );
        comp.tableColumns.css('width', ( removed.hasClass('removed') ? 0 : -comp.productWidth )+comp.tableColumns.width() + 'px'); 
        removed.remove();
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
                self.products.removeClass('removed selected');
                self.resetSelection();
                self.products.addClass('selected')
                
            //}
            self.selectedproductsNumber = self.productsNumber;
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
    console.log('loadLocations() called with, useGPSLocation = '+useGPSLocation);
    let params = {
        term:       "restaurant "+_description.value,
        offset:     mostRecentSearchOffset,
        limit:      amount
    }
    if (useGPSLocation){
        params.longitude = _position.lng;
        params.latitude = _position.lat;
    }else{
        params.location = _location.value;
    }


    for (let i = 1; i <= 4; i++){
        if (document.getElementById("cb"+i).checked){
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
            // if the page currently has a loading card, remove it before loading
            if (list.innerHTML[4] == 'l'){
                list.innerHTML = "";
            }
            // url for the yelp star rating
            var starPicURL = '';
            for (i = 0; i < amount; i++){
                let businessObj = response.businesses[i];
                businessMap[businessObj.id] = businessObj;
                starPicURL = getRatingImgURL(businessObj.rating);
                
                list.innerHTML +=
                '<li>'+
                    '<div class="blog-img">' +
                        '<a href="' + businessObj.url + '"geocodtarget="_blank">' + '<img src="' + businessObj.image_url +'" alt="blog-img">' + '</a>' +
                    '</div>' +
                    '<div class="content-right">' +
                        '<h3>'+(markers.length+1)+ '<br>' + businessObj.name + '</h3>' +
                        '<img src="' + starPicURL +'">' +
                    '<div>' + businessObj.review_count + ' Reviews</div>' +
                    '<div>' + (businessObj.price != undefined ? businessObj.price : "Price Unavailable") + '</div>' +
                    // Add/Remove Button Toggl
                    '<button onclick="btnUpdate(this)" value="' + businessObj.id + '">Add</button>' +
                '</li>';

                // creates new marker for each restaurant generated
                let marker = new google.maps.Marker({
                    position: new google.maps.LatLng(businessObj.coordinates.latitude, businessObj.coordinates.longitude),
                    map: map,
                    label: ""+(markers.length+1),
                    title: 'Click to zoom'
                })

                let businessAddress = "";
                if (businessObj.location.address1 != undefined) {
                    businessAddress = "" + businessObj.location.address1;
                    if (businessObj.location.address2 != undefined) {
                        businessAddress += " " + businessObj.location.address2;
                        if (businessObj.location.address3 != undefined) {
                            businessAddress += " " + businessObj.location.address3;
                        }
                    }
                }
                if (businessObj.location.city != undefined) {
                    businessAddress += " " + businessObj.location.city;
                }
                if (businessObj.location.state != undefined){
                    businessAddress += ", " + businessObj.location.state;
                }
                if (businessObj.location.zip_code != undefined) {
                    businessAddress += " " + businessObj.location.zip_code;
                }

                console.log(businessAddress);

                var placeService = new google.maps.places.PlacesService(map)

                const request = {
                    query: businessAddress,
                    fields: ['place_id']/*, 'name', 'formatted_address', 'icon', 'geometry'],*/
                }

                var businessIDarr = [];
                placeService.findPlaceFromQuery(request, (results, status) => {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        results.forEach((businessObj) => {
                            console.log(businessObj)
                        });
                        /*for (var j = 0; j < results.length; j++) {
                            if (results[j].place_id != undefined){
                                businessIDarr[j].push(results[j].place_id);
                            }
                        // place_id, name, formatted_address, geometry.location, icon
                        }*/
                    }
                })
                console.log(businessIDarr);

                let info_window = new google.maps.InfoWindow({    
                    content: '<h3>' + businessObj.name + '</h3>' +
                                '<img src="' + starPicURL +'">' +
                                '<div>' + businessObj.review_count + ' Reviews</div>' +
                                '<div>' + businessObj.price + '</div>' + '<div><a href="https://www.google.com/maps/search/?api=1&query='
                                + businessObj.coordinates.latitude + ',' 
                                + businessObj.coordinates.longitude 
                                //+ businessObj.location
                                + '&query_place_id='
                                + businessIDarr[i] + '">' + 'View on Google Maps</a></div>'
                })

                console.log(businessObj.place_id);
                console.log(businessObj.coordinates.latitude);                
                console.log(businessObj.coordinates.longitude);

                marker.addListener('click', function(){
                    map.setZoom(16);
                    map.setCenter(this.getPosition());
                    info_window.open(map, this);
                });
                markers.push(marker);
            }
        }
    });
    mostRecentSearchOffset += amount;
}

// Adds or Removes a location in the list to
// the comparison table
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

// gets yelp star rating picture based off of yelp star rating
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

// Yelp api Key
const apiKey = 'EjKBKGiEKnrhbi-wjpdU-5Ch3Xs8QbL3dKnz3efiJKLLND6qSPoTAH469ah0TQ5C67qQKiLZDo7HNZas-JCEbb0Tz70D-t2pA6SdxgcAUwz2JdwMOZm7LGG7e3RQXnYx';

// functions to convert address to coords
// or coords to address
// *get defined in initMap()*
var geocodeAddressAndCenter,
    geocodeLatLngAndCenter;

// Initialize Google Map
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 38.9242, lng: -77.2142983},
        zoom: 11
    });
    // geocoder object 
    var geocoder = new google.maps.Geocoder();

    //  Use Geocoding
    geocodeAddressAndCenter = function() {
        console.log('geocodeAddress called');
        geocoder.geocode({'address': _location.value }, function(results, status) {
            if (status === 'OK') {
                // set the location from the geocoding to the _position variable    TODO
                _position.lat = results[0].geometry.location.lat;
                _position.lng = results[0].geometry.location.lng;
                console.log(results[0].geometry.location.lat);
                let infoWindow = new google.maps.InfoWindow({
                    content: 'Your Location'
                });
                map.setCenter(results[0].geometry.location);
                new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    icon: {
                        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    }
                }).addListener('click', function(){
                    infoWindow.setPosition(this.getPosition());
                    infoWindow.open(map, this);
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    // Use reverse Geocoding
    geocodeLatLngAndCenter = function() {
        console.log('geocodeLatLng called');
        geocoder.geocode({'location': _position }, function(results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    let infoWindow = new google.maps.InfoWindow({
                        content: 'Your Location'
                    });
                    
                    map.setCenter(results[0].geometry.location);
                    new google.maps.Marker({
                        position: results[0].geometry.location,
                        map: map,
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }
                    }).addListener('click', function(){
                        infoWindow.setPosition(this.getPosition());
                        infoWindow.open(map, this);
                    });
                    _location.value = results[0].formatted_address;
                } else {
                    console.log('No results found');
                    _location.value = "Location could not be Found."
                    setTimeout(function() {
                        _location.value = "";
                    }, 1000);
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
                _location.value = "Location could not be Found."
                setTimeout(function() {
                    _location.value = "";
                }, 1000);
            }
        });
    }
}

// Call after search button has been pressed
// calls refreshList() to load restaurants into the listing
// then direct the user to the listing section
function search_btn_press() {
    console.log('Search Bar Params: ', _description.value, _location.value);
    refreshList();
    window.location.href = '#listing';
}

// refreshes restaurant list after user has applied certain filters,
// changed the location, or wanted to renew the map
function refreshList(){
    let list = document.getElementById("listing-area");
    list.innerHTML =    "<li LoadingTag><h1 class=\"heading\"><span>Loading</span></h1></li>" + 
                        "<li><h1 class=\"heading\"><span> . . . </span></h1></li>";
    mostRecentSearchOffset = 0;
    // Remove all current markers from the map, 
    // but markers still remain in array
    console.log('Removing all Markers');
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    // empty the array/ set the array to a new empty one
    markers = [];
    // clear markers from map TODO
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
        // turn params into a querystring and fetch 
        response = await fetch(
            queryString,
            header
        )
        try {
            // turn the response into a Json/ array format
            response = await response.json();
            console.log(response);
        } catch (error) {
            console.log('JSON error = ',error);
        }
    } catch(error) {
        console.log('FETCH error = ', error);
    }
    // return the promise of the JSON for callback usage 
    return response;
}

// Sets the City and State of the user into the location bar whenever
// they choose the "Your Location" option
function setLocation() {
    if (_location.value == "Your Location") {
        useGPSLocation = true;
        if (navigator.geolocation){
            _location.value = "Finding Location...";
            // HTML5 Geolocation call to get GPS coords
            navigator.geolocation.getCurrentPosition(position => {
                _position.lat = position.coords.latitude;
                _position.lng = position.coords.longitude;
                // Pull the Location name from the GPS coords
                geocodeLatLngAndCenter();
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
    }else {
        useGPSLocation = false;
        // Pull the GPS coords from the Address/Name
        geocodeAddressAndCenter();
    }
}