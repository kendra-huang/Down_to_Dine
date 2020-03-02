
jQuery(document).ready(function($){
    
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
        var list = $(this);
        if(list[0].scrollHeight - list.scrollTop() <= list.height()){
            list = document.getElementById("listing-area");
            loadLocations(list, 10);
        }
    });

    /*$("#price").getBusinessInfo(function() {
        //var priceList = $(this);
        
    });*/

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

        // new
        this.filterBtn.addClass('active');
    }

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
            /*
        selectedProducts.each(function(index){
            var product = $(this),
                leftTranslate = containerOffsetLeft + index*self.productWidth + scrollLeft - product.offset().left;
            setTranformX(product, leftTranslate);
            
            if(index == numberProducts - 1 ) {
                product.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
                    setTimeout(function(){
                        //self.element.addClass('no-product-transition');
                    }, 50);
                    setTimeout(function(){
                        //self.element.addClass('filtered');
                        self.productsWrapper.scrollLeft(0);
                        self.tableColumns.css('width', self.productWidth*numberProducts + 'px');
                        selectedProducts.attr('style', '');
                        product.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
                        self.updateNavigationVisibility(0);
                    }, 100);
                    
                });
            }
            
        });

        if( $('.no-csstransitions').length > 0 ) {
            //browser not supporting css transitions
            self.element.addClass('filtered');
            self.productsWrapper.scrollLeft(0);
            self.tableColumns.css('width', self.productWidth*numberProducts + 'px');
            selectedProducts.attr('style', '');
            self.updateNavigationVisibility(0);
        }
        */      
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

    var comparisonTables = [];
    $('.cd-products-comparison-table').each(function(){
        //create a productsTable object for each .cd-products-comparison-table
        comparisonTables.push(new productsTable($(this)));
    });

    var windowScrolling = false;
    //detect window scroll - fix product top-info on scrolling
    /*
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
        alert('resize');
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

function loadLocations(list, amount) {
    console.log('called');
    yelpRequest({
        location:   document.getElementById("location").value,
        term:       document.getElementById("description").value,
        offset:     mostRecentSearchOffset
    }).then(response => {
        if (response != undefined){
            for (i = 0; i < amount; i++){
                list.innerHTML = list.innerHTML +
                '<li><div class="blog-img"><img src="'+
                // img address
                response.businesses[i].image_url
                +'" alt="blog-img">'+'</div><div class="content-right"><h3>'+
                //rating
                response.businesses[i].rating
                +'</h3></div></li>';
            }
        }
    });
    mostRecentSearchOffset += amount;
}

// Yelp api Function calls
const apiKey = 'EjKBKGiEKnrhbi-wjpdU-5Ch3Xs8QbL3dKnz3efiJKLLND6qSPoTAH469ah0TQ5C67qQKiLZDo7HNZas-JCEbb0Tz70D-t2pA6SdxgcAUwz2JdwMOZm7LGG7e3RQXnYx';

function search_btn_press() {
    var description = document.getElementById("description").value;
    var location = document.getElementById("location").value;
    console.log('Search Bar Params: ', description, location);
    mostRecentSearchOffset = 0;
    window.location.href = '#listing';
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
    var yelp_corsanywhere = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/";
    var searchType = 'businesses/search?';

    const header = {
        method: 'GET',
        headers: new Headers({
            "Authorization": "Bearer "+apiKey
        })
    }
    var response;
    try {
        // turn params into a queuestring and fetch 
        response = await fetch(
            yelp_corsanywhere + searchType + $.param(params),
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
    var inputfield = document.getElementById("location");
    if (inputfield.value == "Your Location") {
        if (navigator.geolocation){
            inputfield.value = "Finding Location...";
            navigator.geolocation.getCurrentPosition(position => {
                yelpRequest({
                    latitude:   position.coords.latitude,
                    longitude:  position.coords.longitude
                }).then(response => {
                    let first = response.businesses[0];
                    inputfield.value = first.location.city + ', ' + first.location.state;
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
            });
        }else{
            console.log("geolocation not permitted");
        }
    }
}

// number of times user adds restaurant
var count = 0;
function userAddClick() {      
    //document.getElementById("result").innerHTML = "Restaurant added ";
    count++;
}

function userRemoveClick() {
    //document.getElementById("remove").innerHTML = "Restaurant removed ";
    count--;
}

/*function search_btn_press() {
    var description = document.getElementById("description").value;
    var location = document.getElementById("location").value;
    console.log('Search Bar Params: ', description, location);
    yelpRequest(location, description).then(response => {
        mostRecentSearchOffset = 0;
    });
    window.location.href = '#listing';
}*/

// total number of businesses in array
var numBusiness = 0;
/*$("#listing-area").scroll(function() {
    var list = $(this);
    if(list[0].scrollHeight - list.scrollTop() <= list.height()){
        list = document.getElementById("listing-area");
        loadLocations(list, 10);
    }
});*/
function getBusinessInfo(priceList, count) {
    console.log('called');
    yelpRequest(document.getElementById("name").value, 
                document.getElementById("price").value,
                document.getElementById("rating").value,
                document.getElementById("location").value).then(response => {
        if (response != undefined){
            for (i = 0; i < count; i++){
                /*priceList.innerHTML = priceList.innerHTML +
                '<li><div '*/
            }
        }
    });
}        

//CUISINE
        //LOCATION
function loadBusinessInfo(list, amount) {
    console.log('called');
    yelpRequest(document.getElementById("location").value,
                document.getElementById("description").value).then(response => {
        if (response != undefined){
            for (i = 0; i < amount; i++){
                /*list.innerHTML = list.innerHTML +
                '<li><div class="blog-img"><img src="'+
                // img address
                response.businesses[i].image_url
                +'" alt="blog-img">'+'</div><div class="content-right"><h3>'+
                //rating
                response.businesses[i].rating
                +'</h3></div></li>';*/
            }
        }
    });
    //mostRecentSearchOffset += amount;
}
