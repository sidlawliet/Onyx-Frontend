import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button } from '../components/UI';
import { api } from '../api';
import { 
  Search, 
  Filter, 
  ArrowRight
} from 'lucide-react';

export default function ComplaintsDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await api.getOfficerComplaints();
      setComplaints(data);
    } catch (e) {
      console.error('Failed to fetch complaints', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.targetIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.filedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ maxWidth: 1080, margin: '36px auto', padding: '0 20px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Fraud Complaints
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={loadComplaints}>
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Main Glass Table Container Card */}
      <GlassCard style={{ padding: '24px' }}>
        
        {/* Search and Filters Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <input
              type="text"
              className="glass-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Ticket ID, Target UPI, or Account..."
              style={{ paddingLeft: 38 }}
            />
            <Search style={{ width: 16, height: 16, color: 'var(--text-muted)', position: 'absolute', left: 14, top: 14 }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter style={{ width: 16, height: 16, color: 'var(--text-muted)' }} />
            <select
              className="glass-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '10px 14px', width: 'auto', cursor: 'pointer' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="NEW_SUBMISSION">NEW_SUBMISSION</option>
              <option value="FROZEN">FROZEN</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </div>

        {/* Table of Complaints */}
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Loading live complaints registry...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No complaints found matching current filters.
          </div>
        ) : (
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Filed By</th>
                  <th>Target Identifier</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Filed Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((item) => {
                  const isHigh = item.riskScore > 70;
                  const isMed = item.riskScore > 35 && item.riskScore <= 70;
                  return (
                    <tr
                      key={item.complaintId}
                      className="clickable-row"
                      onClick={() => navigate(`/complaints/${item.complaintId}`)}
                    >
                      <td style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0284C7' }}>
                        {item.complaintId}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {item.filedBy}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          {item.targetIdentifier}
                        </div>
                        {item.holderName && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.holderName}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${isHigh ? 'badge-high' : isMed ? 'badge-med' : 'badge-low'}`}>
                          {item.riskScore}%
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          item.status === 'FROZEN' ? 'badge-frozen' :
                          item.status === 'RESOLVED' ? 'badge-low' : 'badge-high'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {item.filedAt}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/complaints/${item.complaintId}`);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          <span>Review &gt;&gt;</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </GlassCard>

    </div>
  );
}
