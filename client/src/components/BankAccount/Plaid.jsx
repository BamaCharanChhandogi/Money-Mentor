import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Building, CreditCard, RefreshCw, Loader2 } from 'lucide-react';
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
    <div className={`fixed top-24 right-4 p-4 rounded shadow-lg ${
      type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`}>
      {message}
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
      className="w-full bg-blue-500 text-white p-3 rounded-lg flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300"
    >
      <Building className="mr-2 h-4 w-4" />
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
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CreditCard className="h-6 w-6 text-gray-500" />
          <div>
            <h3 className="font-medium">{account.accountName}</h3>
            <p className="text-sm text-gray-500">
              {account.accountType} • {account.accountSubtype}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-medium">
              ${account.balance?.current?.toFixed(2) || '0.00'}
            </p>
            <p className="text-sm text-gray-500">Current Balance</p>
          </div>
          <button
            className="p-2 rounded-lg border hover:bg-pink-50"
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
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
      <div className="text-center py-8 text-gray-500">
        No connected accounts found
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
};

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
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      {toastMessage && (
        <Toast
          message={toastMessage.text}
          type={toastMessage.type}
          onClose={() => setToastMessage(null)}
        />
      )}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Connected Accounts</h2>
        <PlaidLinkButton
          onSuccess={handlePlaidSuccess}
          onExit={handlePlaidExit}
        />
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <AccountList
            accounts={accounts}
            onSync={handleSync}
          />
        )}
      </div>
    </div>
  );
};

export default PlaidIntegration;