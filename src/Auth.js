import React, { Component } from 'react';
import $ from 'jquery';
import queryString from 'query-string';
var clientId="895015088966-l5laoefi5c5892rmjfbd65n6oomm61uo.apps.googleusercontent.com";

var redirectUri="http://localhost:3000/auth/callback";
// var redirectUri="https://dashboard-ap.herokuapp.com/auth/callback";

var clientSecret="k1yxgWb9qpExfArSQg0c-k-i";


class Auth extends Component {
    componentWillMount() {
        let queryParams = queryString.parse(this.props.location.search);
        let error = queryParams.error;
        let authCode = queryParams.code;

        if(error) {
                // console.log("something went wrong.");
        } else {
            // Get the access token
            $.ajax({
                url:"https://www.googleapis.com/oauth2/v4/token",
                type:"post",
                contentType:"application/x-www-form-urlencoded",
                data:{
                    code:authCode,
                    redirect_uri:redirectUri,
                    client_id:clientId,
                    client_secret:clientSecret,
                    grant_type:"authorization_code"
                },
                success:(res)=>{
                    if (res.access_token){
                        sessionStorage.setItem("sessId",res.access_token);
                        this.props.history.push("/Dashboard");
                    }
                    // console.log(res);
                }
            })
        }

        // console.log(queryString.parse(this.props.location.search));
    }

    render() {
        return (
            <div>


            </div>
        );
    }
}

export default Auth;