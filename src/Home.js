import React, { Component } from 'react';
import logo from "./logo.svg";
var clientId="895015088966-l5laoefi5c5892rmjfbd65n6oomm61uo.apps.googleusercontent.com";

var redirectUri=encodeURIComponent("http://localhost:3000/auth/callback"); //needs to be changed.

var scope=encodeURIComponent('https://www.googleapis.com/auth/userinfo.email');
var url="https://accounts.google.com/o/oauth2/v2/auth?client_id="+clientId+"&scope="+scope+"&redirect_uri="+redirectUri+"&response_type=code"

class Home extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">

                    <h2>Login to the Dashboard.</h2>
                    <img src={logo} className="App-logo" alt="logo" />
                    {/*<Link id="buttonLink" to="/login"><button className="button">Login to Dashboard</button></Link>*/}
                    <a id="buttonLink" href={url}><button className="button">Google Login to Dashboard</button></a>

                </header>

            </div>
        );
    }
}

export default Home;
