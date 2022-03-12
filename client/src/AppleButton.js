import React from "react";
import AppleLogin from "react-apple-login";
import axios from "axios";
import { Container } from "reactstrap";

class AppleButton extends React.Component {
  state = {
    authResponse: {}
  };
  appleResponse = response => {
    if (!response.error) {
      axios
        .post("/auth", response)
        .then(res => this.setState({ authResponse: res.data }))
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <div>
        <Container className="text-center mt-5">
          <div>
            {Object.keys(this.state.authResponse).length === 0 ? (
              <AppleLogin
                clientId="YOUR_CLIENT_ID"
                redirectURI="https://example.com/auth"
                usePopup={true}
                callback={this.appleResponse}
                scope="email name"
                responseMode="query"
                render={renderProps => (
                  <button
                    onClick={renderProps.onClick}
                    style={{
                      backgroundColor: "white",
                      padding: 10,
                      border: "1px solid black",
                      fontFamily: "none",
                      lineHeight: "25px",
                      fontSize: "25px"
                    }}
                  >
                    <i className="fa-brands fa-apple px-2 "></i>
                    Continue with Apple
                  </button>
                )}
              />
            ) : (
              <p style={{ fontFamily: "none" }}>
                {JSON.stringify(this.state.authResponse)}
              </p>
            )}
          </div>
        </Container>
      </div>
    );
  }
}

export default AppleButton;
