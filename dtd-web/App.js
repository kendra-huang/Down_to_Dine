import React from 'react';
import './App.css';

const apiKey = 'EjKBKGiEKnrhbi-wjpdU-5Ch3Xs8QbL3dKnz3efiJKLLND6qSPoTAH469ah0TQ5C67qQKiLZDo7HNZas-JCEbb0Tz70D-t2pA6SdxgcAUwz2JdwMOZm7LGG7e3RQXnYx';
const querystring = require('querystring');

class App extends React.Component {
  state = {
    latitude: 0,
    longitude: 0,
    location: ''
  }
  
  GetLocation() {
    navigator.geolocation.getCurrentPosition(
    (position) => {
      this.setState({ latitude: position.coords.latitude });
      this.setState({ longitude: position.coords.longitude });
    },
    (error) => {
      switch(error.code) {
      case error.PERMISSION_DENIED:
        this.setState({coords: "User denied the request for Geolocation."});
        break;
      case error.POSITION_UNAVAILABLE:
        this.setState({coords: "Location information is unavailable."});
        break;
      case error.TIMEOUT:
        this.setState({coords: "The request to get user location timed out."});
        break;
      case error.UNKNOWN_ERROR:
        this.setState({coords: "An unknown error occurred."});
        break;
      }
    });   
  }

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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <EntryField onChange={event => {this.setState({location: event.target.value})}} variable={this.state.location}/>
          <button onClick={() => {
            this.yelpRequest();
          }}>Get Location</button>
          <p>Latitude: {this.state.latitude}</p>
          <p>Longitide: {this.state.longitude}</p>
        </header>
      </div>
    );
  }
}

const EntryField = ({ variable }) => 
  <input>{variable}</input>

export default App;
