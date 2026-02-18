import type { RoundStats } from '@/types';
import { FireOutlined } from '@ant-design/icons';
import { Modal, Space } from 'antd';

interface StatsDetailModalProps {
  open: boolean;
  stats: RoundStats | null;
  onClose: () => void;
}

const StatsDetailModal: React.FC<StatsDetailModalProps> = ({ open, stats, onClose }) => {
  return (
    <Modal
      title="詳細投注統計"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
    >
      {stats?.typeSummary && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {stats.typeSummary.map((type) => (
            <div
              key={type.betTypeName}
              style={{
                background: 'var(--bg-inner)',
                padding: 20,
                borderRadius: 10,
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--accent-gold)' }}>
                {type.betTypeName}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>總金額</span>
                <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>${type.totalAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>投注筆數</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{type.totalCount}</span>
              </div>
              {type.details && type.details.length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    細項分布
                  </div>
                  {type.details.slice(0, 5).map((d, idx) => (
                    <div key={idx} style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{d.betTypeName}</span>
                      <span style={{ color: '#f0a020' }}>${(d._sum.betAmount || 0).toLocaleString()}</span>
                    </div>
                  ))}
                  {type.details.length > 5 && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                      還有 {type.details.length - 5} 項...
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {stats?.popularBets && stats.popularBets.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
            <FireOutlined /> 熱門投注 TOP 10
          </h3>
          <div style={{ background: 'var(--bg-inner)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            {stats.popularBets.map((bet, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderBottom: index < stats.popularBets!.length - 1 ? '1px solid var(--border-color)' : 'none',
                }}
              >
                <Space>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    background: index < 3 ? 'rgba(240, 185, 11, 0.15)' : 'var(--bg-card)',
                    color: index < 3 ? 'var(--accent-gold)' : 'var(--text-muted)',
                  }}>
                    {index + 1}
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>
                    {bet.betTypeName} - {bet.betContentDisplay}
                  </span>
                </Space>
                <Space size="middle">
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{bet.count}筆</span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: 13 }}>
                    ${bet.totalAmount.toLocaleString()}
                  </span>
                </Space>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StatsDetailModal;
