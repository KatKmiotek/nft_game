import React, { useEffect, useState} from 'react';
import { ethers } from 'ethers';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import MyEpicNFT from './utils/MyEpicNFT.json';


// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);


  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

 const renderContent = () => {

  

  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <a href="https://imgur.com/p5wg6di"><img src="https://i.imgur.com/p5wg6di.gif" title="source: imgur.com" /></a>
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Connect Wallet To Get Started
        </button>
      </div>
    );
  } else {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;	
	/*
	* If there is a connected wallet and characterNFT, it's time to battle!
	*/
  } 
}; 


  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  

  useEffect(() => {
     checkIfWalletIsConnected();
  }, []);

 useEffect(() => {
   /*
    * The function we will call that interacts with out smart contract
    */
   const fetchNFTMetadata = async () => {
     console.log('Checking for Character NFT on address:', currentAccount);

     const provider = new ethers.providers.Web3Provider(window.ethereum);
     const signer = provider.getSigner();
     const gameContract = new ethers.Contract(
       CONTRACT_ADDRESS,
       MyEpicNFT.abi,
       signer
     );

       const characterNFT = await gameContract.checkIfUserHasNFT();
    if (characterNFT.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(characterNFT));
    }

    /*
     * Once we are done with all the fetching, set loading state to false
     */


     const txn = await gameContract.checkIfUserHasNFT();
     if (txn.name) {
       console.log('User has character NFT');
       setCharacterNFT(transformCharacterData(txn));
     } else {
       console.log('No character NFT found');
     }
        console.log(txn);

   };

   /*
    * We only want to run this, if we have a connected wallet
    */
   if (currentAccount) {
     console.log('CurrentAccount:', currentAccount);
     fetchNFTMetadata();
   }
 }, [currentAccount]);
 

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🗡️Mario Fight🗡️</p>
          <p className="sub-text">Good luck bros!</p>
          {/* This is where our button and image code used to be!
           *	Remember we moved it into the render method.
           */}
          {renderContent()}
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;