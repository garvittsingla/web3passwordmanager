'use client';

import { useState, useEffect } from 'react';
import { WalletIcon, ShieldCheck, Lock, Key, Share2, History } from 'lucide-react';
import { ethers } from 'ethers';
// import { Router } from 'express';

export default function WalletConnection() {
  const [address, setAddress] = useState('');
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [modal,setModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulating connection delay
    setTimeout(() => setIsConnecting(false), 1000);
  };

  useEffect(() => {
    // Check if MetaMask is available
    const checkMetaMaskAvailability = () => {
      const { ethereum } = window;
      setIsMetaMaskAvailable(Boolean(ethereum && ethereum.isMetaMask));
      // address && Router.push('/dashboard');
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
    <div className=" bg-white rounded-lg shadow-md">
      {address ? (
        <div className='w-full min-h-screen bg-[#111111]'>
          {modal && <Modal setModal = {setModal}/>}
          <nav  className='p-4 flex items-center justify-between '>
            <div>
              <h1 className='text-white text-2xl 
              '>Web3 Password Manager</h1>
            </div>
            <div>
              <button 
                onClick={() => setAddress('')}
                className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded'
              >
                Disconnect
              </button>
            </div>
          </nav>
          <div className='p-4'>
            <h1 className='text-white text-2xl'>Welcome</h1>
            <p className='text-white'>Your address is <span className='text-slate-300'>{address}</span></p>
          </div>
          <div className='w-full h-24 flex items-center justify-center '>
            <button onClick={()=>{
              setModal(true)
            }} className='bg-green-500 px-3 py-2 text-white text-medium rounded-md'>Add a new password</button>
          </div>
          <div className='w-full flex items-center justify-center h-72 '>
            <div className='h-[90%] w-[90%] bg-green-400'>
               
            </div>
          </div>
        </div>
      ) : (
        <div>
        <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-2 py-3">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Key className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">CryptoVault</span>
          </div>
          <button
            onClick={connectWallet}
            disabled={!isMetaMaskAvailable}
            className={`flex items-center gap-2 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors ${
              isConnecting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isMetaMaskAvailable 
            ? 'Connect MetaMask' 
            : 'MetaMask Not Installed'}
          </button>
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Secure Your Digital Identity with Web3
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            The next generation of password management, powered by blockchain technology.
            Your credentials, your control, completely decentralized.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors font-semibold">
              Get Started
            </button>
            <button className="px-8 py-3 rounded-full border border-blue-600 hover:bg-blue-600/10 transition-colors font-semibold">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm">
            <ShieldCheck className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Military-Grade Encryption</h3>
            <p className="text-gray-400">
              Your passwords are encrypted using advanced blockchain technology, ensuring
              maximum security for your digital assets.
            </p>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm">
            <Share2 className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Secure Sharing</h3>
            <p className="text-gray-400">
              Share passwords securely with team members using smart contract-based
              access control.
            </p>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm">
            <History className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Access History</h3>
            <p className="text-gray-400">
              Track every access attempt with immutable blockchain records for
              enhanced security.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-20 border-t border-gray-800">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-500 mb-2">100k+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500 mb-2">1M+</div>
            <div className="text-gray-400">Passwords Secured</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500 mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800 text-center text-gray-400">
        <p>© 2024 CryptoVault. All rights reserved.</p>
      </footer>
    </main>
        </div>
      )}
    </div>
  );
}
function Modal ({setModal}){
  return(
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Add a New Password</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="site">
                Site
              </label>
              <input
                type="text"
                id="site"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={()=>{setModal(false)}}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}