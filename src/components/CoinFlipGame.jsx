import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ConnectButton from './ConnectButton';
import { TOKEN_ABI, TOKEN_ADDRESS } from '../contracts/TokenABI';
import './CoinFlipGame.css';
import { FaMoon, FaSun } from 'react-icons/fa';

const CoinFlipGame = () => {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState('');
  const [userChoice, setUserChoice] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [message, setMessage] = useState('');
  const [accountAddress, setAccountAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [web3, setWeb3] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      setWeb3(new Web3(window.ethereum));
    } else {
      console.log('Please install MetaMask!');
    }
  }, []);

  useEffect(() => {
    if (web3 && accountAddress) {
      const fetchTokenDetails = async () => {
        try {
          const contract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

          // Fetch token balance
          const balance = await contract.methods.balanceOf(accountAddress).call();
          setTokenBalance(web3.utils.fromWei(balance, 'ether'));

          // Fetch token symbol
          const symbol = await contract.methods.symbol().call();
          setTokenSymbol(symbol);

        } catch (error) {
          console.error('Failed to fetch token details:', error);
          setMessage('Failed to fetch token details.');
        }
      };
      fetchTokenDetails();
    }
  }, [web3, accountAddress]);

  const handleBetChange = (e) => setBetAmount(e.target.value);
  const handleChoiceChange = (choice) => setUserChoice(choice);

  const flipCoin = async () => {
    if (!userChoice) {
      alert('Please select Heads or Tails before flipping the coin!');
      return;
    }

    if (!betAmount) {
      alert('Please enter your bet amount!');
      return;
    }

    if (parseFloat(betAmount) > parseFloat(tokenBalance)) {
      setMessage("You don't have enough tokens to place this bet!");
      return;
    }

    setFlipping(true);

    setTimeout(async () => {
      const isHeads = Math.random() > 0.5;
      const coinResult = isHeads ? 'heads' : 'tails';
      setResult(coinResult);
      setFlipping(false);

      // Simulate balance update
      if (coinResult === userChoice) {
        setTokenBalance(prevBalance => {
          const newBalance = parseFloat(prevBalance) + parseFloat(betAmount);
          return newBalance.toFixed(2);
        });
        setMessage(`You won! The coin landed on ${coinResult}.`);
      } else {
        setTokenBalance(prevBalance => {
          const newBalance = Math.max(parseFloat(prevBalance) - parseFloat(betAmount), 0);
          return newBalance.toFixed(2);
        });
        setMessage(`You lost! The coin landed on ${coinResult}.`);
      }

      // Optionally update token balance in contract (mock only)
      try {
        // Replace with actual contract interactions if needed
        // For example, if you still want to simulate contract calls, you can mock them
        // await contract.methods.updateBalance(accountAddress, weiBetAmount).send({ from: accountAddress });
      } catch (error) {
        console.error('Transaction failed:', error);
        setMessage('Transaction failed.');
      }

      setBetAmount('');
    }, 3000);
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <nav className={`w-full p-4 text-center flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-blue-500'}`}>
        <h1 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Token Balance: {tokenBalance} {tokenSymbol}</h1>
        <div className="flex items-center space-x-4">
          <ConnectButton setAccountAddress={setAccountAddress} setTokenBalance={setTokenBalance} />
          <button onClick={toggleTheme} className={`text-2xl ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </nav>
      <div className={`shadow-lg rounded-lg p-8 w-full max-w-md mt-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className={`text-3xl font-extrabold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Coin Flip Game</h1>
        <div className="mb-6">
          <label className={`block text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Enter your bet amount:</label>
          <input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            className={`border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
          />
        </div>
        <div className="mb-6 flex justify-center space-x-4">
          <button
            onClick={() => handleChoiceChange('heads')}
            className={`px-4 py-2 border rounded-lg ${userChoice === 'heads' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            Heads
          </button>
          <button
            onClick={() => handleChoiceChange('tails')}
            className={`px-4 py-2 border rounded-lg ${userChoice === 'tails' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            Tails
          </button>
        </div>
        <button
          onClick={flipCoin}
          className={`w-full p-3 rounded-lg font-semibold transition duration-200 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Flip Coin
        </button>
        <div className="mt-6 flex justify-center items-center">
          <div className={`coin ${flipping ? 'flipping' : ''}`}>
            <div className="coin-face coin-heads">Heads</div>
            <div className="coin-face coin-tails">Tails</div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default CoinFlipGame;
