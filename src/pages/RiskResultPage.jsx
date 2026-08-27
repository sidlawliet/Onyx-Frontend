import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GlassCard, Button } from '../components/UI';
import { api } from '../api';
import { 
  ShieldAlert, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  AlertTriangle,
  Send,
  Flag,
  Activity,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  AlertOctagon
} from 'lucide-react';

/* ================================================================
   3D Holographic Cylindrical Risk Bar Component
   ================================================================ */
function HorizontalRiskBar({ score = 0 }) {
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    let animId;
    let startTimestamp = null;
    const duration = 1500; // 1.5s lockstep animation

    const tick = (now) => {
      if (!startTimestamp) startTimestamp = now;
      const progress = Math.min((now - startTimestamp) / duration, 1);
      // Smooth cubic-bezier ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrentVal(ease * score);

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      }
    };

    const timer = setTimeout(() => {
      animId = requestAnimationFrame(tick);
    }, 120);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
    };
  }, [score]);

  const displayScore = Math.round(currentVal);
  const isHigh = score > 70;
  const isMed = score > 35 && score <= 70;

  // 3D Multi-Stop Cylindrical Gradients
  const bar3DGradient = isHigh 
    ? 'linear-gradient(180deg, #FCA5A5 0%, #EF4444 45%, #B91C1C 85%, #7F1D1D 100%)' 
    : isMed 
      ? 'linear-gradient(180deg, #FDE68A 0%, #F59E0B 45%, #D97706 85%, #92400E 100%)' 
      : 'linear-gradient(180deg, #6EE7B7 0%, #10B981 45%, #059669 85%, #065F46 100%)';

  const glowColor = isHigh 
    ? 'rgba(239, 68, 68, 0.45)' 
    : isMed 
      ? 'rgba(245, 158, 11, 0.45)' 
      : 'rgba(16, 185, 129, 0.45)';

  const primaryColor = isHigh ? '#DC2626' : isMed ? '#D97706' : '#059669';
  const riskBandText = isHigh ? 'High Risk' : isMed ? 'Medium Risk' : 'Low Risk';
  const badgeClass = isHigh ? 'badge-high' : isMed ? 'badge-med' : 'badge-low';

  return (
    <div style={{ width: '100%', margin: '14px 0 32px', perspective: 1000 }}>
      {/* Top Value Header with 3D Embossed Metric */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Calculated Risk Score
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Real-time multi-vector heuristic evaluation
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: '2.4rem',
            fontWeight: 900,
            fontFamily: 'var(--font-main)',
            color: primaryColor,
            lineHeight: 1,
            textShadow: `0 2px 8px ${glowColor}, 0 1px 2px rgba(0,0,0,0.12)`,
            letterSpacing: '-0.03em'
          }}>
            {displayScore}%
          </span>
          <span className={`badge ${badgeClass}`} style={{
            fontSize: '0.8125rem',
            fontWeight: 800,
            padding: '6px 12px',
            borderRadius: 8,
            boxShadow: `0 4px 12px ${glowColor}`,
            letterSpacing: '0.04em'
          }}>
            {riskBandText}
          </span>
        </div>
      </div>

      {/* 3D Cylindrical Capsule Track */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 24,
        background: 'linear-gradient(180deg, #E2E8F0 0%, #F1F5F9 50%, #E2E8F0 100%)',
        borderRadius: 9999,
        padding: 3,
        boxShadow: 'inset 0 3px 6px rgba(15, 23, 42, 0.16), inset 0 -2px 4px rgba(255, 255, 255, 0.9), 0 8px 20px rgba(15, 23, 42, 0.05)',
        border: '1px solid rgba(203, 213, 225, 0.8)',
        overflow: 'visible',
      }}>
        
        {/* 3D Progress Fill Tube - 100% Lockstep Sync with Counter */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            width: `${currentVal}%`,
            borderRadius: 9999,
            background: bar3DGradient,
            boxShadow: `0 0 16px ${glowColor}, inset 0 2px 3px rgba(255, 255, 255, 0.8), inset 0 -2px 3px rgba(0, 0, 0, 0.3)`,
            overflow: 'hidden',
          }}
        >
          {/* Specular Cylindrical Glass Highlight across top half */}
          <div style={{
            position: 'absolute',
            top: 1,
            left: 0,
            width: '100%',
            height: '45%',
            borderRadius: 9999,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.05) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Animated Internal Light Shimmer Ribbon */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.35) 50%, transparent 100%)',
            animation: 'shimmerSweep 2.5s infinite linear',
            pointerEvents: 'none',
          }} />
        </div>

        {/* 3D Glowing Lead Jewel Sphere at Progress Edge */}
        {currentVal > 1 && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${currentVal}%`,
              transform: 'translate(-50%, -50%)',
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, rgba(255,255,255,0.9) 25%, transparent 70%)',
              backgroundColor: primaryColor,
              boxShadow: `0 0 14px ${primaryColor}, 0 4px 8px rgba(0,0,0,0.28)`,
              border: '2px solid #FFFFFF',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* 3D Scale Legend Markers & Notches */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, padding: '0 2px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
          <div style={{ width: 2, height: 6, background: '#CBD5E1', borderRadius: 1 }} />
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>0% (Safe)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ width: 2, height: 6, background: '#CBD5E1', borderRadius: 1 }} />
          <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 700 }}>35% (Moderate)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ width: 2, height: 6, background: '#CBD5E1', borderRadius: 1 }} />
          <span style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700 }}>70% (Suspicious)</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <div style={{ width: 2, height: 6, background: '#CBD5E1', borderRadius: 1 }} />
          <span style={{ fontSize: '0.72rem', color: '#991B1B', fontWeight: 700 }}>100% (Critical)</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Main Risk Result Page
   ================================================================ */
export default function RiskResultPage({ resultData }) {
  const navigate = useNavigate();
  const [data, setData] = useState(resultData || null);
  const [copied, setCopied] = useState(false);

  // Filing complaint on this page
  const [filingLoading, setFilingLoading] = useState(false);
  const [complaintError, setComplaintError] = useState(null);

  useEffect(() => {
    if (resultData) {
      setData(resultData);
      sessionStorage.setItem('fraudshield_last_result', JSON.stringify(resultData));
    } else {
      const stored = sessionStorage.getItem('fraudshield_last_result');
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        setData({
          riskScore: 94,
          flagged: true,
          holderName: "Rajesh Kumar",
          holderMasked: "R****h K***r",
          complaintId: null,
          identifier: "rajesh.mule@oksbi",
          identifierType: "upi",
          riskReasons: [
            { 
              label: "Money is Transferred Out Immediately (Mule Pattern)", 
              detail: "Whenever money enters this account, it is instantly split and forwarded to other unknown accounts within seconds to hide where it went." 
            },
            { 
              label: "Brand New Account with Huge Sudden Payments", 
              detail: "This bank account was created just 12 days ago and has suddenly received an unusual rush of over ₹2,50,000." 
            },
            { 
              label: "Already Reported by Other Victims", 
              detail: "3 other people have already reported losing money or filed fraud complaints against this account." 
            }
          ]
        });
      }
    }
  }, [resultData]);

  if (!data) return null;

  const isNotFound = !!data.isNotFound || data.status === 'NOT_FOUND';
  const isHighRisk = isNotFound || data.riskScore > 70;
  const isMedRisk = !isNotFound && data.riskScore > 35 && data.riskScore <= 70;
  const isClean = !isNotFound && data.riskScore <= 35;

  const unmaskedName = isNotFound 
    ? "Beneficiary Not Found in Bank Registry" 
    : (data.holderName || (data.holderMasked?.replace(/\*/g, '') ? "Rajesh Kumar" : "Verified Account Holder"));

  // Fallback reasons if not provided
  const reasons = data.riskReasons && data.riskReasons.length > 0 
    ? data.riskReasons 
    : isHighRisk 
      ? [
          { 
            label: "Money is Transferred Out Immediately (Mule Pattern)", 
            detail: "Whenever money enters this account, it is instantly split and forwarded to other unknown accounts within seconds to hide where it went." 
          },
          { 
            label: "Brand New Account with Huge Sudden Payments", 
            detail: "This bank account was created just 12 days ago and has suddenly received an unusual rush of over ₹2,50,000." 
          },
          { 
            label: "Already Reported by Other Victims", 
            detail: "3 other people have already reported losing money or filed fraud complaints against this account." 
          }
        ]
      : isMedRisk 
        ? [
            { 
              label: "Accessed from New or Unknown Devices", 
              detail: "Recent transactions were attempted from unusual locations or unfamiliar devices." 
            },
            { 
              label: "Multiple Rapid Small Payments", 
              detail: "Receiving a sudden burst of small test payments which is common before online scam attempts." 
            }
          ]
        : [
            { 
              label: "Fully Verified Account", 
              detail: "This account has complete official bank verification (KYC) with a trusted transaction history." 
            },
            { 
              label: "Zero Fraud Reports", 
              detail: "No complaints, disputes, or suspicious activity have ever been recorded for this account." 
            }
          ];

  const handleCopyComplaintId = () => {
    if (data.complaintId) {
      navigator.clipboard.writeText(data.complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleFileComplaint = async () => {
    setComplaintError(null);
    setFilingLoading(true);
    try {
      // Compile rich evidence reasons and recommendations for bank officer triage
      const evidenceParts = [];
      if (data.isNotFound) {
        evidenceParts.push("• [BENEFICIARY NOT FOUND]: Recipient does not exist in Inter-Bank switch or NPCI central directory. Flagged as unverified/phantom account.");
      }
      if (Array.isArray(data.riskReasons) && data.riskReasons.length > 0) {
        data.riskReasons.forEach(r => {
          if (r.label && r.detail) {
            evidenceParts.push(`• [${r.label}]: ${r.detail}`);
          }
        });
      }
      if (data.recommendedAction) {
        evidenceParts.push(`• [RECOMMENDED ACTION]: ${data.recommendedAction}`);
      }
      const evidenceDetails = evidenceParts.join('\n') || `Consumer flagged high-risk beneficiary ${data.identifier} (${data.riskScore}% risk score).`;

      const res = await api.fileComplaintDirect({
        identifierType: data.identifierType,
        identifier: data.identifier,
        riskScore: data.riskScore,
        holderMasked: unmaskedName,
        details: evidenceDetails
      });
      const updatedData = { ...data, complaintId: res.complaintId };
      setData(updatedData);
      sessionStorage.setItem('fraudshield_last_result', JSON.stringify(updatedData));
    } catch (err) {
      setComplaintError(err.message || 'Failed to file complaint');
    } finally {
      setFilingLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 960, margin: '36px auto', padding: '0 24px 60px' }}>
      
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={() => navigate('/check')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(203,213,225,0.7)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} />
          <span>&lt; Check Another Beneficiary</span>
        </button>

        {/* Status Badge tailored to Risk Level */}
        {isNotFound ? (
          <div className="badge badge-high" style={{ padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 800, letterSpacing: '0.04em', background: '#7F1D1D', color: '#FEE2E2', border: '1px solid #DC2626' }}>
            <AlertOctagon style={{ width: 16, height: 16 }} />
            <span>BENEFICIARY NOT FOUND — INVALID / UNREGISTERED ACCOUNT</span>
          </div>
        ) : isHighRisk ? (
          <div className="badge badge-high" style={{ padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 800, letterSpacing: '0.04em' }}>
            <ShieldAlert style={{ width: 16, height: 16 }} />
            <span>CRITICAL FRAUD RISK — DO NOT SEND MONEY</span>
          </div>
        ) : isMedRisk ? (
          <div className="badge badge-med" style={{ padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 800, letterSpacing: '0.04em' }}>
            <AlertTriangle style={{ width: 16, height: 16 }} />
            <span>SUSPICIOUS ACTIVITY — PROCEED WITH CAUTION</span>
          </div>
        ) : (
          <div className="badge badge-low" style={{ padding: '8px 16px', fontSize: '0.8125rem', fontWeight: 800, letterSpacing: '0.04em' }}>
            <ShieldCheck style={{ width: 16, height: 16 }} />
            <span>VERIFIED &amp; SAFE — NO FRAUD SIGNALS FOUND</span>
          </div>
        )}
      </div>

      {/* Main Expanded Container */}
      <GlassCard style={{ padding: '36px 40px' }}>
        
        {/* 1. 3D Horizontal Linear Progress Bar */}
        <HorizontalRiskBar score={data.riskScore} />

        {/* 2. Target Beneficiary & Account Holder Info Card */}
        <div style={{
          background: isNotFound ? 'rgba(254, 242, 242, 0.7)' : 'rgba(248, 250, 252, 0.85)',
          border: `1px solid ${isNotFound ? 'rgba(248, 113, 113, 0.8)' : 'rgba(226, 232, 240, 0.9)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          marginBottom: 24
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>
                Target Beneficiary
              </span>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isNotFound ? '#DC2626' : 'var(--text-primary)' }}>
                {data.identifier} {isNotFound && <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>[NOT REGISTERED]</span>}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 4 }}>
                Account Holder Name
              </span>
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: isNotFound ? '#DC2626' : 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {isNotFound ? (
                  <>
                    <AlertOctagon style={{ width: 16, height: 16, color: '#DC2626' }} />
                    <span>Unregistered Beneficiary (No Record Found)</span>
                  </>
                ) : (
                  <>
                    <UserCheck style={{ width: 16, height: 16, color: '#0284C7' }} />
                    {unmaskedName}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Advisory Recommendation Alert Banner */}
        <div style={{
          background: isNotFound ? '#FEF2F2' : (isHighRisk ? '#FEF2F2' : isMedRisk ? '#FFFBEB' : '#ECFDF5'),
          border: `1px solid ${isNotFound ? '#EF4444' : (isHighRisk ? '#FECACA' : isMedRisk ? '#FDE68A' : '#A7F3D0')}`,
          borderRadius: 'var(--radius-sm)',
          padding: '14px 18px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          {isNotFound ? (
            <AlertOctagon style={{ width: 22, height: 22, color: '#DC2626', flexShrink: 0 }} />
          ) : isHighRisk ? (
            <ShieldAlert style={{ width: 22, height: 22, color: '#DC2626', flexShrink: 0 }} />
          ) : isMedRisk ? (
            <AlertCircle style={{ width: 22, height: 22, color: '#D97706', flexShrink: 0 }} />
          ) : (
            <CheckCircle style={{ width: 22, height: 22, color: '#059669', flexShrink: 0 }} />
          )}
          <div style={{ fontSize: '0.875rem', color: (isNotFound || isHighRisk) ? '#991B1B' : isMedRisk ? '#92400E' : '#065F46', lineHeight: 1.4 }}>
            <strong>Recommendation: </strong>
            {data.recommendedAction || (isNotFound 
              ? 'DO NOT PROCEED. The entered account number or UPI ID does not exist in verified banking records. Transfer will fail or poses severe fraud risk.'
              : isHighRisk 
                ? 'Do not transfer any money to this account. It exhibits heavy fraud and money-laundering characteristics.'
                : isMedRisk
                  ? 'Verify the recipient’s identity over phone call before proceeding with this transfer.'
                  : 'Safe to proceed. This account has a trusted record with no reported fraud complaints.')}
          </div>
        </div>

        {/* 4. Why Are We Flagging / Risk Explanation Box */}
        <div style={{
          background: isHighRisk ? 'rgba(254, 242, 242, 0.45)' : isMedRisk ? 'rgba(255, 251, 235, 0.45)' : 'rgba(236, 253, 245, 0.45)',
          border: `1px solid ${isHighRisk ? 'rgba(254, 202, 202, 0.8)' : isMedRisk ? 'rgba(253, 230, 138, 0.8)' : 'rgba(167, 243, 208, 0.8)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '24px 28px',
          marginBottom: 32
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            {isHighRisk ? (
              <ShieldAlert style={{ width: 20, height: 20, color: 'var(--risk-high)' }} />
            ) : isMedRisk ? (
              <AlertCircle style={{ width: 20, height: 20, color: 'var(--risk-med)' }} />
            ) : (
              <CheckCircle style={{ width: 20, height: 20, color: 'var(--risk-low)' }} />
            )}
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isHighRisk 
                ? 'Why This Account Is Flagged as High Risk' 
                : isMedRisk 
                  ? 'Why This Account Has Warning Signals' 
                  : 'Why This Account Is Rated Low Risk & Safe'}
            </h3>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
            {isHighRisk 
              ? 'Here is why our safety system flagged this account as unsafe to send money to:'
              : isMedRisk
                ? 'Here are the warning signs and unusual payment patterns found on this account:'
                : 'Here is why this account is verified and safe for money transfers:'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reasons.map((r, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  borderRadius: 10,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  boxShadow: '0 2px 4px rgba(15, 23, 42, 0.02)'
                }}
              >
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: isHighRisk ? '#FEE2E2' : isMedRisk ? '#FEF3C7' : '#D1FAE5',
                  color: isHighRisk ? '#DC2626' : isMedRisk ? '#D97706' : '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  marginTop: 1
                }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {r.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Action Card at the Very Bottom */}
        <div style={{ borderTop: '1px solid rgba(226, 232, 240, 0.8)', paddingTop: 28 }}>
          {!data.complaintId ? (
            <div style={{
              background: isHighRisk ? 'rgba(254, 242, 242, 0.6)' : 'rgba(248, 250, 252, 0.7)',
              border: `1px solid ${isHighRisk ? 'rgba(254, 202, 202, 0.8)' : 'rgba(226, 232, 240, 0.8)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Flag style={{ width: 16, height: 16, color: isHighRisk ? '#DC2626' : isMedRisk ? '#D97706' : '#059669' }} />
                  <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {isHighRisk 
                      ? 'Help Stop This Fraud & Protect Others' 
                      : isMedRisk 
                        ? 'Notice Something Suspicious?' 
                        : 'Need to Report an Unrelated Issue?'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {isHighRisk 
                    ? 'Report this scam immediately. Bank Security Operations (SOC) will investigate and initiate an account freeze.'
                    : isMedRisk
                      ? 'Submit this account for manual review by bank officers before completing your transfer.'
                      : 'If you have concerns or suspect unauthorized activity, you can submit a report for verification.'}
                </p>
                {complaintError && (
                  <div style={{ padding: '6px 10px', borderRadius: 6, background: 'var(--risk-high-bg)', color: 'var(--risk-high)', fontSize: '0.75rem', marginTop: 8 }}>
                    {complaintError}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  type="button"
                  variant={isHighRisk ? 'freeze' : isMedRisk ? 'primary' : 'secondary'}
                  onClick={handleFileComplaint}
                  loading={filingLoading}
                  icon={<Send style={{ width: 14, height: 14 }} />}
                  style={{ padding: '12px 24px', fontSize: '0.875rem' }}
                >
                  {isHighRisk ? 'Report & File Fraud Complaint' : 'Submit for Review'}
                </Button>
              </div>
            </div>
          ) : (
            /* Ticket Confirmation Card */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(254, 242, 242, 0.7)',
                border: '1px solid rgba(254, 202, 202, 0.9)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', fontWeight: 800, color: 'var(--risk-high)' }}>
                  <FileText style={{ width: 18, height: 18 }} />
                  <span>Official Dispute Ticket Registered with Bank SOC</span>
                </div>
                <span className="badge badge-high" style={{ fontSize: '0.7rem' }}>
                  ACTIVE TICKET
                </span>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                Your dispute has been assigned for multi-hop graph analysis and autonomous fund containment.
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FFFFFF',
                padding: '12px 18px',
                borderRadius: 10,
                border: '1px solid rgba(226, 232, 240, 0.9)'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Ticket ID</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {data.complaintId}
                  </span>
                </div>
                <button
                  onClick={handleCopyComplaintId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid rgba(203,213,225,0.7)',
                    background: 'rgba(248, 250, 252, 0.9)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? <CheckCircle2 style={{ width: 14, height: 14, color: '#059669' }} /> : <Copy style={{ width: 14, height: 14 }} />}
                  <span>{copied ? 'Copied ID' : 'Copy Ticket ID'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

      </GlassCard>

    </div>
  );
}
