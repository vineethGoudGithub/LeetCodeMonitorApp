import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, CheckCircle2, TrendingUp } from 'lucide-react';
import { studentApi } from '../services/api';
import { useToast } from '../context/ToastContext';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getStatistics();
        if (res.data) setStats(res.data);
      } catch (err) {
        addToast(err.message || 'Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [addToast]);

  if (loading || !stats) {
    return (
      <div className="page-content">
        <div style={{ marginBottom: '2rem' }}>
          <div className="skeleton" style={{ width: '220px', height: '32px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '380px', height: '18px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="skeleton" style={{ height: '340px', borderRadius: '16px' }} />
          <div className="skeleton" style={{ height: '340px', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  // Transform data for charts
  const yearData = Object.entries(stats.yearDistribution || {}).map(([key, val]) => ({
    name: key,
    students: val,
  }));

  const deptData = Object.entries(stats.departmentDistribution || {}).map(([key, val]) => ({
    name: key,
    students: val,
  }));

  const leetcodeData = [
    { name: 'Has LeetCode', value: stats.leetcodeProfiles },
    { name: 'Missing Profile', value: stats.missingProfiles },
  ].filter((d) => d.value > 0);

  const statusData = Object.entries(stats.placementStatusDistribution || {}).map(([key, val]) => ({
    name: key,
    count: val,
  }));

  const completionRates = stats.completionRates || { LeetCode: 100, GitHub: 0, LinkedIn: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="page-content"
    >
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Placement & Coding Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Visual insights computed dynamically from the student database.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Chart 1: Department & Year Distribution */}
        <div className="dashboard-section" style={{ margin: 0 }}>
          <div className="dashboard-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={20} style={{ color: 'var(--primary)' }} />
              <h3>Students by Department</h3>
            </div>
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="students" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: LeetCode Profiles Coverage */}
        <div className="dashboard-section" style={{ margin: 0 }}>
          <div className="dashboard-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieIcon size={20} style={{ color: 'var(--success)' }} />
              <h3>LeetCode Profile Coverage</h3>
            </div>
          </div>
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leetcodeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leetcodeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Chart 3: Placement Status */}
        <div className="dashboard-section" style={{ margin: 0 }}>
          <div className="dashboard-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} style={{ color: 'var(--accent-purple)' }} />
              <h3>Placement Status Breakdown</h3>
            </div>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="var(--accent-purple)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section 4: Student Data Completion Progress Bars (Section 17) */}
        <div className="dashboard-section" style={{ margin: 0 }}>
          <div className="dashboard-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} style={{ color: 'var(--primary)' }} />
              <h3>Student Data Completion</h3>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Accurate profile completeness metrics calculated from live records.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {Object.entries(completionRates).map(([platform, rate]) => (
              <div key={platform}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <span>{platform} Profiles</span>
                  <span style={{ color: rate > 50 ? 'var(--success-text)' : 'var(--text-muted)' }}>{rate}%</span>
                </div>
                <div style={{ height: '10px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rate}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: rate > 80 ? 'linear-gradient(90deg, #10b981, #059669)' : rate > 0 ? 'linear-gradient(90deg, #2563eb, #3b82f6)' : 'var(--text-muted)',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.75rem', padding: '0.85rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            💡 <strong>TPO Notice:</strong> GitHub and LinkedIn statistics will update automatically when students submit their developer profile links.
          </div>
        </div>
      </div>
    </motion.div>
  );
};
