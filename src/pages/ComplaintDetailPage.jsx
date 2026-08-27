import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard, RiskGauge, FreezeButton, Button } from '../components/UI';
import { api } from '../api';
import { 
  ArrowLeft, 
  ShieldAlert, 
  ShieldCheck, 
  User, 
  Lock, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity,
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [freezingAccount, setFreezingAccount] = useState(null);
  const [actionAlert, setActionAlert] = useState(null);

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await api.getComplaintDetail(id);
      setComplaint(data);
    } catch (e) {
      console.error('Failed to load complaint detail', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFreezeAccount = async (accountNumber) => {
    setFreezingAccount(accountNumber);
    try {
      const res = await api.freezeAccount(accountNumber, {
        reason: `Officer Action on Ticket ${id}`
      });
      setActionAlert({
        type: 'SUCCESS',
        message: `Account ${accountNumber} has been frozen globally across inter-bank clearing switches.`
      });
      // Refresh local state
      await loadDetail();
    } catch (e) {
      console.error('Freeze failed', e);
    } finally {
      setFreezingAccount(null);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1080, margin: '60px auto', padding: '0 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading case file {id}...
      </div>
    );
  }

  if (!complaint) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 20px', textAlign: 'center' }}>
        <GlassCard style={{ padding: '32px' }}>
          <h2>Complaint Not Found</h2>
          <Button variant="secondary" onClick={() => navigate('/complaints')} style={{ marginTop: 16 }}>
            Back to Dashboard
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1080, margin: '36px auto', padding: '0 20px 60px' }}>
      
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <button
          onClick={() => navigate('/complaints')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(203,213,225,0.7)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} />
          <span>&lt; Back to Complaints Queue</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Case Status:</span>
          <span className={`badge ${complaint.status === 'FROZEN' ? 'badge-frozen' : 'badge-high'}`}>
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionAlert && (
        <div style={{ padding: '12px 18px', borderRadius: 12, background: 'var(--risk-low-bg)', border: '1px solid var(--risk-low-border)', color: 'var(--risk-low)', fontSize: '0.875rem', fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0 }} />
          <span>{actionAlert.message}</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 24 }}>
        
        {/* Left Column: Case Overview & Risk Gauge */}
        <GlassCard style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  DISPUTE DOSSIER
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                  {complaint.complaintId}
                </h2>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Filed: {complaint.filedAt}
              </span>
            </div>

            <div style={{ background: 'rgba(248, 250, 252, 0.8)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(226, 232, 240, 0.8)', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Complainant:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{complaint.filedBy}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Suspect:</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--risk-high)' }}>{complaint.targetIdentifier}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Account Holder Name:</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{complaint.holderName || complaint.holderMasked || 'Rajesh Kumar'}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              <strong>Evidence &amp; Heuristic Note:</strong><br />
              {complaint.details}
            </div>
          </div>

          <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid rgba(226, 232, 240, 0.7)' }}>
            <RiskGauge score={complaint.riskScore} size={150} strokeWidth={12} />
          </div>
        </GlassCard>

        {/* Right Column: Linked Accounts Panel with 1-Click Freeze */}
        <GlassCard style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Layers style={{ width: 18, height: 18, color: '#0284C7' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Linked Accounts &amp; Mule Pass-Throughs
            </h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 18 }}>
            AI topological graph identified downstream layer nodes linked to this transaction flow.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(complaint.linkedAccounts || []).map((acc) => {
              const isFrozen = acc.status === 'FROZEN';
              const isHigh = acc.riskScore > 70;
              return (
                <div
                  key={acc.accountNumber}
                  style={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(226, 232, 240, 0.9)', borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
                        {acc.accountNumber}
                      </span>
                      <span className={`badge ${isHigh ? 'badge-high' : 'badge-low'}`} style={{ fontSize: '0.65rem' }}>
                        {acc.riskScore}% Risk
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      {acc.holderName}
                    </div>
                  </div>

                  <div>
                    <FreezeButton
                      isFrozen={isFrozen}
                      loading={freezingAccount === acc.accountNumber}
                      onFreeze={() => handleFreezeAccount(acc.accountNumber)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

      </div>

      {/* Transaction Trail Table */}
      {complaint.transactionTrail && complaint.transactionTrail.length > 0 && (
        <GlassCard style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Activity style={{ width: 18, height: 18, color: '#D97706' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Transaction Trail &amp; Escrow Intercepts
            </h3>
          </div>

          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>TXN ID</th>
                  <th>Source Account</th>
                  <th>Destination</th>
                  <th>Amount</th>
                  <th>Timestamp</th>
                  <th>Settlement Status</th>
                </tr>
              </thead>
              <tbody>
                {complaint.transactionTrail.map((txn) => (
                  <tr key={txn.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                      {txn.id}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {txn.from}
                    </td>
                    <td style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--risk-high)' }}>
                      {txn.to}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      {txn.amount}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {txn.date}
                    </td>
                    <td>
                      <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

    </div>
  );
}
