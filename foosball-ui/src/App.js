import "ui/style/style.css";
import "./App.css";

import React, { Component } from "react";
import Login from "ui/component/Login";
import Main from "ui/component/Main";
import axios from "axios";
import { connect } from "react-redux";
import { updatePlayer } from "action/PlayerActions";

class App extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    window.addEventListener("load", this.onLoad.bind(this));
  }

  getUser() {
    axios.get(`/api/whoami`).then(res => {
      if (res.data !== "Unauthorized") {
        var sPlayerImageUrl = `http://graph.facebook.com/${
          res.data.id
        }/picture`;
        var oPlayer = {
          id: res.data.id,
          name: res.data.displayName,
          image: sPlayerImageUrl
        };
        console.log("Current user: ", oPlayer);
        this.props.dispatch(updatePlayer(oPlayer));
      }
    });
  }

  onLoad() {
    if (window.location.hash === "#_=_") {
      history.replaceState
        ? history.replaceState(null, null, window.location.href.split("#")[0])
        : (window.location.hash = "");
    }

    this.getUser();
  }

  render() {
    return (
      <div className="App">
        {this.props.player.id ? <Main /> : <Login />}
      </div>
    );
  }
}


function mapStateToProps(state) {

  const { player } = state;
 
  return {
    player
  }
}

export default connect(mapStateToProps)(App);
