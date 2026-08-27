import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button } from '../components/UI';
import { api } from '../api';
import { 
  Zap 
} from 'lucide-react';

export default function FraudCheckPage({ onCheckComplete }) {
  const navigate = useNavigate();
  const [identifierType, setIdentifierType] = useState('upi'); // 'upi' | 'account'
  const [identifier, setIdentifier] = useState('rajesh.mule@oksbi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide a valid Account Number or UPI ID');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const result = await api.checkFraud({
        identifierType,
        identifier: identifier.trim(),
        fileComplaint: false // Complaint filing moved to the risk result page
      });

      if (onCheckComplete) {
        onCheckComplete(result);
      }
      // Save result in session for page reload resilience
      sessionStorage.setItem('fraudshield_last_result', JSON.stringify(result));
      navigate('/result');
    } catch (err) {
      setError(err.message || 'Risk evaluation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 620, margin: '48px auto', padding: '0 16px' }}>
      
      {/* Top Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Beneficiary Fraud Check
        </h1>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginTop: 8, maxWidth: 480, margin: '8px auto 0' }}>
          Run an instant topological risk evaluation before sending money via UPI or NetBanking.
        </p>
      </div>

      {/* Main Glass Card */}
      <GlassCard style={{ padding: '32px' }}>
        
        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--risk-high-bg)', border: '1px solid var(--risk-high-border)', color: 'var(--risk-high)', fontSize: '0.8125rem', marginBottom: 18 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Identifier Type Switcher */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => {
                setIdentifierType('upi');
                if (identifier.startsWith('ACC-')) setIdentifier('');
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderColor: identifierType === 'upi' ? '#0284C7' : 'rgba(203,213,225,0.7)',
                background: identifierType === 'upi' ? '#E0F2FE' : 'transparent',
                color: identifierType === 'upi' ? '#0284C7' : 'var(--text-secondary)'
              }}
            >
              UPI ID / VPA
            </button>
            <button
              type="button"
              onClick={() => {
                setIdentifierType('account');
                if (identifier.includes('@')) setIdentifier('');
              }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderColor: identifierType === 'account' ? '#0284C7' : 'rgba(203,213,225,0.7)',
                background: identifierType === 'account' ? '#E0F2FE' : 'transparent',
                color: identifierType === 'account' ? '#0284C7' : 'var(--text-secondary)'
              }}
            >
              Bank Account Number
            </button>
          </div>

          {/* Identifier Input */}
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">
              {identifierType === 'upi' ? 'Recipient UPI ID' : 'Recipient Account Number'}
            </label>
            <input
              type="text"
              className="glass-input glass-input-mono"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={identifierType === 'upi' ? 'e.g. name@bank or phone@upi' : 'e.g. ACC-100962849'}
              required
              autoFocus
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={<Zap style={{ width: 16, height: 16 }} />}
            style={{ width: '100%', padding: '14px 20px', fontSize: '1rem' }}
          >
            Check Risk Score
          </Button>

        </form>

      </GlassCard>

    </div>
  );
}
