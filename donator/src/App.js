import React, { Component } from 'react';
import logo from './handshake.png';
import './App.css';
import 'grommet/grommet.min.css';
import GApp from 'grommet/components/App';
import GBox from 'grommet/components/Box';
import GImage from 'grommet/components/Image';
import GLabel from 'grommet/components/Label';
import GHeading from 'grommet/components/Heading';
import GButton from 'grommet/components/Button';
import GNotification from 'grommet/components/Notification';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cause: 'Help rebuild homes destroyed by the recent flood in Nueva Ecija, Philippines',
      hasDonated: false,
      notification: null,
    };
  }
  startPoll() {
    if (!this._interval) {
      this._interval = setInterval(() => {
        console.log('fetching');
        fetch('http://localhost:8085/api/donation-notifications', {
          method: 'get',
        }).then(res => res.json())
          .then((res) => {
            if (res.donations.length > 0) {
              this.setState({
                notification: true,
              }, () => {
                setTimeout(() => {
                  this.setState({
                    hasDonated: false,
                    notification: false
                  });
                }, 2500);
              });
            }
          });
      }, 1000);
    }
  }
  render() {
    this.startPoll();
    return (
      <GApp>
        { this.state.notification ? <GNotification message='You just helped Rj Bernaldo.' /> : null }
        <GBox style={{ justifyContent: 'center', alignItems: 'center' }}>
          <GBox style={{ padding: 50, marginTop: 50 }}>
            <GImage src={logo} style={{ width: 100 }} />
          </GBox>
          <GBox>
            <GHeading>RSCUE</GHeading>
          </GBox>
          { !this.state.hasDonated ? (
            <GBox>
              <GBox>
                <GLabel style={{ textAlign: 'center', paddingLeft: 25, paddingRight: 25 }}>
                  {this.state.cause}
                </GLabel>
              </GBox>
              <GBox style={{ padding: 50 }}>
                <GButton label="Donate" href="#" onClick={() => {
                  fetch('http://localhost:8085/api/donations', {
                    method: 'post',
                    // body: JSON.stringify({
                    //   cause: this.state.cause,
                    //   donator: 'Rj',
                    // }),
                  }).then(res => res.json())
                    .then((res) => {
                      this.setState({ hasDonated: true });
                    });
                }}/>
              </GBox>
            </GBox>
          ) : (
            <GBox>
              <GLabel style={{ textAlign: 'center', paddingLeft: 25, paddingRight: 25 }}>Thanks! You will be notified when you help someone.</GLabel>
            </GBox>
          )}
        </GBox>
      </GApp>
    );
  }
}

export default App;
