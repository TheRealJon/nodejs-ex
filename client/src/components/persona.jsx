import React, { Component } from 'react';

class Persona extends Component {
  render() {
    let skills = this.props.skills.map(function(skill){
      let stars = "";
      while(stars.length < skill.rating){
        stars += "⭐";
      }
      return (
        <li>
          {skill.name}
          <br/>
          {stars}
        </li>
      )
    });

    return (
      <div>
        <h1>
          {this.props.name}
        </h1>
        <em>
          {this.props.quote}
        </em>
        <ul>
          {skills}
        </ul>
      </div>
    );
  }
}

export default Persona;
