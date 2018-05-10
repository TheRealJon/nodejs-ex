import React, { Component } from 'react';
import Persona from './components/persona';

class App extends Component {

  constructor(props){
    super(props);
    this._handleResponse = this._handleResponse.bind(this);
    this._req = new XMLHttpRequest();
    this._req.addEventListener('load', this._handleResponse);
    this._req.open('GET', 'http://0.0.0.0:8080/api/persona/1');
    this.state = {
      loading: true,
      persona: {}
    }
  }
  componentDidMount(){
    this._req.send();
  }

  _handleResponse(e){
    this.setState(function(){
      return {
        loading: false,
        persona: JSON.parse(this._req.responseText)
      }
    })
    console.dir(this._req.response);
  }

  render() {
    return <div>
      { this.state.loading && <h1>Loading...</h1> }
      { this.state.persona.id &&
        <Persona
          name={this.state.persona.name}
          quote={this.state.persona.quote}
          skills={this.state.persona.skills}
        />
      }
    </div>;
  }
}

export default App;
