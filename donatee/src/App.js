import React, { Component } from 'react';
import logo from './handshake.png';
import signature from './signature.png';
import emptySignature from './empty-signature.png';
import './App.css';
import 'grommet/grommet.min.css';
import GApp from 'grommet/components/App';
import GBox from 'grommet/components/Box';
import GImage from 'grommet/components/Image';
import GLabel from 'grommet/components/Label';
import GHeading from 'grommet/components/Heading';
import GButton from 'grommet/components/Button';
import GTextInput from 'grommet/components/TextInput';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cause: 'Help rebuild homes destroyed by the recent flood in Nueva Ecija, Philippines',
      currentDonation: null,
    };
  }

  startPoll() {
    if (!this.state.currentDonation && !this._interval) {
      this._interval = setInterval(() => {
        fetch('http://localhost:8085/api/donations', {
          method: 'get',
        }).then(res => res.json())
          .then((res) => {
            if (res.donations.length > 0) {
              this.setState({
                currentDonation: res.donations[0],
              }, () => {
                console.log(this.state.currentDonation);
                clearInterval(this._interval);
                this._interval = null;
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
        <GBox style={{ justifyContent: 'center', alignItems: 'center' }}>
          <GBox style={{ padding: 50, marginTop: 50 }}>
            <GImage src={logo} style={{ width: 100 }} />
          </GBox>
          <GBox>
            <GHeading>RSCUE</GHeading>
          </GBox>
          { !this.state.currentDonation ? (
            <GBox>
              <GLabel style={{ textAlign: 'center', paddingLeft: 25, paddingRight: 25 }}>Waiting for donations.</GLabel>
            </GBox>
          ) : (
            <GBox>
              <GBox>
                <GLabel style={{ textAlign: 'center', paddingLeft: 25, paddingRight: 25 }}>
                  Eloize just donated to your cause.
                </GLabel>
              </GBox>
              <GBox style={{ padding: 50, paddingBottom: 0, marginBottom: -50 }}>
                {
                  this.state.signature ? (
                    <GBox>
                      <GImage src={signature} style={{ paddingTop: 0, marginTop: -65, marginBottom: 10, border: '1px solid #000000' }} />
                    </GBox>
                  ) : (
                    <GBox>
                      <GImage src={emptySignature} style={{ paddingTop: 0, marginTop: -65, marginBottom: 10, border: '1px solid #000000' }} />
                    </GBox>
                  )
                }
                <GButton label="Say thanks" href="#" onClick={() => {
                  this.setState({
                    signature: true,
                  }, () => {
                    setTimeout(() => {
                      fetch('http://localhost:8085/api/process-donation/' + this.state.currentDonation._id, {
                        method: 'post',
                      }).then(res => res.json())
                        .then((res) => {
                          this.setState({ currentDonation: false, signature: false });
                        });
                    }, 2500);
                  });
                }}/>
              </GBox>
            </GBox>
          )}
        </GBox>
      </GApp>
    );
  }
}

export default App;
