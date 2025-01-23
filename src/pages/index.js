'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function WalletConnection() {
  const [address, setAddress] = useState('');
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);

  useEffect(() => {
    // Check if MetaMask is available
    const checkMetaMaskAvailability = () => {
      const { ethereum } = window;
      setIsMetaMaskAvailable(Boolean(ethereum && ethereum.isMetaMask));
    };

    checkMetaMaskAvailability();
    window.addEventListener('ethereum#initialized', checkMetaMaskAvailability);

    return () => {
      window.removeEventListener('ethereum#initialized', checkMetaMaskAvailability);
    };
  }, []);

  const connectWallet = async () => {
    if (!isMetaMaskAvailable) {
      alert('MetaMask not detected. Please install MetaMask.');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Check network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const telosTestnetChainId = '0x29';

      if (chainId !== telosTestnetChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: telosTestnetChainId }]
          });
        } catch (switchError) {
          // If the network is not added, add Telos testnet
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: telosTestnetChainId,
              chainName: 'Telos Testnet',
              rpcUrls: ['https://testnet.telos.net/evm'],
              nativeCurrency: {
                name: 'TLOS',
                symbol: 'TLOS',
                decimals: 18
              }
            }]
          });
        }
      }

      // Set the first account
      setAddress(accounts[0]);
    } catch (error) {
      console.error('Wallet connection failed', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {address ? (
        <div>
          <p className="text-green-600 font-bold">
            Connected Wallet: 
            <span className="ml-2">
              {address.substring(0, 6)}...{address.substring(address.length - 4)}
            </span>
          </p>
        </div>
      ) : (
        <button 
          onClick={connectWallet}
          className={`w-full py-2 rounded ${
            isMetaMaskAvailable 
              ? 'bg-blue-500 hover:bg-blue-600 text-white' 
              : 'bg-gray-300 cursor-not-allowed text-gray-500'
          }`}
          disabled={!isMetaMaskAvailable}
        >
          {isMetaMaskAvailable 
            ? 'Connect MetaMask' 
            : 'MetaMask Not Installed'}
        </button>
      )}
    </div>
  );
}