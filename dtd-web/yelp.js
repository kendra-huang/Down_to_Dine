
function getYelpData() {
    const yelp = require('yelp-fusion');

    const apiKey = 'EjKBKGiEKnrhbi-wjpdU-5Ch3Xs8QbL3dKnz3efiJKLLND6qSPoTAH469ah0TQ5C67qQKiLZDo7HNZas-JCEbb0Tz70D-t2pA6SdxgcAUwz2JdwMOZm7LGG7e3RQXnYx';

    const searchRequest = {
        term: 'Four Barrel Coffee',
        location: 'san francisco, ca'
    };

    const client = yelp.client(apiKey);
    
    client.search(searchRequest).then(response => {
        const firstResult = response.jsonBody.businesses[0];
        const prettyJson = JSON.stringify(firstResult, null, 4);
        console.log(prettyJson);
    }).catch(e => {
        console.log(e);
    });     
};

test();


yelpRequest() { 
    var searchRequest = {
      term: 'Chick-fil-a',
    }
    var yelp_corsanywhere = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/";
    var searchType = 'businesses/search?'
    var queryParamString = querystring.stringify(searchRequest);
    const header = {
      method: 'GET',
      headers: new Headers({
        "Authorization": "Bearer "+apiKey
      })
    }
    fetch(yelp_corsanywhere+searchType+queryParamString, header
    ).then(response => {
      return response.json();
    }).then(json => {
      console.log(json);
    });
  }