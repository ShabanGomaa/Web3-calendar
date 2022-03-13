import './App.css';
import detectEthereumProvider from '@metamask/detect-provider';
import { useState, useEffect } from 'react';

import Calendar from "./components/calendar";

function App() {
  const [account, setAccount] = useState(false);

  useEffect(() => {
    isConnected();
  }, []);

  const isConnected = async () => {
    const provider = await detectEthereumProvider();
    const accounts = await provider.request({ method: "eth_accounts" });

    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      console.log("No authorized account found")
    }
  }

  const connect = async () => {
    try {
      const provider = await detectEthereumProvider();

      // returns an array of accounts
      const accounts = await provider.request({ method: "eth_requestAccounts" });

      // check if array at least one element
      if (accounts.length > 0) {
        console.log('account found', accounts);
        setAccount(accounts[0]);
        console.log(account);

      } else {
        console.log('No account found');
        alert('No account found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Calender - web3</h1>
        <div id="slogan">Make appointment using web3</div>

      </header>
      {!account && <button onClick={connect}>Connect wallet</button>}
      {account && <Calendar></Calendar>}
    </div>
  );
}

export default App;
