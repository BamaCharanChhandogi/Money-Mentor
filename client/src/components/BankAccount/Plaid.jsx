import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Building, CreditCard, RefreshCw, Loader2, Check, AlertTriangle } from 'lucide-react';
import { BASE_URL } from '../../api';

// API service for backend communication
const plaidApi = {
  createLinkToken: async () => {
    const response = await fetch(`${BASE_URL}/plaid/create-link-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.link_token;
  },

  exchangePublicToken: async (publicToken) => {
    const response = await fetch(`${BASE_URL}/plaid/exchange-public-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ public_token: publicToken })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.accounts;
  },

  getAccounts: async () => {
    const response = await fetch(`${BASE_URL}/plaid/accounts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  syncTransactions: async (accountId) => {
    const response = await fetch(`${BASE_URL}/plaid/sync-transactions/${accountId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data.transactions;
  }
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out 
      ${type === 'error' 
        ? 'bg-red-600 text-white border-2 border-red-700' 
        : 'bg-green-600 text-white border-2 border-green-700'
      } flex items-center space-x-3 animate-slide-in`}>
      {type === 'error' ? (
        <AlertTriangle className="h-5 w-5" />
      ) : (
        <Check className="h-5 w-5" />
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};

const PlaidLinkButton = ({ onSuccess, onExit }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLinkToken = async () => {
      try {
        const token = await plaidApi.createLinkToken();
        setLinkToken(token);
      } catch (err) {
        setError(err.message);
      }
    };
    getLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      onSuccess(public_token, metadata);
    },
    onExit: (err, metadata) => {
      onExit(err, metadata);
    },
  });

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white 
        p-4 rounded-xl flex items-center justify-center 
        hover:from-indigo-700 hover:to-purple-800 
        transition-all duration-300 ease-in-out 
        focus:outline-none focus:ring-4 focus:ring-purple-300 
        disabled:opacity-50 disabled:cursor-not-allowed 
        transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
    >
      <Building className="mr-3 h-5 w-5" />
      Connect Bank Account
    </button>
  );
};

const AccountCard = ({ account, onSync }) => {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await onSync(account._id);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 
      border border-gray-200 overflow-hidden">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{account.accountName}</h3>
            <p className="text-sm text-gray-500">
              {account.accountType} • {account.accountSubtype}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">
              ${account.balance?.current?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Current Balance</p>
          </div>
          <button
            className="p-3 rounded-full bg-purple-50 hover:bg-purple-100 
              transition-all duration-300 ease-in-out 
              focus:outline-none focus:ring-2 focus:ring-purple-300"
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5 text-purple-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const AccountList = ({ accounts, onSync }) => {
  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="bg-purple-100 p-4 rounded-full inline-block mb-4">
          <CreditCard className="h-8 w-8 text-purple-600" />
        </div>
        <p className="text-lg text-gray-600">No connected accounts found</p>
        <p className="text-sm text-gray-500 mt-2">Connect a bank account to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <AccountCard
          key={account._id}
          account={account}
          onSync={onSync}
        />
      ))}
    </div>
  );
}

const PlaidIntegration = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchAccounts = useCallback(async () => {
    try {
      const fetchedAccounts = await plaidApi.getAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      setToastMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handlePlaidSuccess = async (publicToken, metadata) => {
    setLoading(true);
    try {
      const newAccounts = await plaidApi.exchangePublicToken(publicToken);
      await fetchAccounts(); // Refresh the accounts list
      setToastMessage({ text: "Bank account connected successfully", type: "success" });
    } catch (error) {
      setToastMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidExit = (err, metadata) => {
    if (err) {
      setToastMessage({ text: err.message, type: "error" });
    }
  };

  const handleSync = async (accountId) => {
    try {
      await plaidApi.syncTransactions(accountId);
      setToastMessage({ text: "Transactions synchronized successfully", type: "success" });
      await fetchAccounts(); // Refresh account data after sync
    } catch (error) {
      setToastMessage({ text: error.message, type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {toastMessage && (
          <Toast
            message={toastMessage.text}
            type={toastMessage.type}
            onClose={() => setToastMessage(null)}
          />
        )}
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Connected Accounts</h2>
          </div>
          
          <PlaidLinkButton
            onSuccess={handlePlaidSuccess}
            onExit={handlePlaidExit}
          />
          
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
              </div>
            ) : (
              <AccountList
                accounts={accounts}
                onSync={handleSync}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaidIntegration;