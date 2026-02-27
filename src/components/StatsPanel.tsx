import { controlService } from '@/services/control.service';
import type { RoundStats } from '@/types';
import { BarChartOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import { App, Button, Card, Space } from 'antd';
import { useState } from 'react';
import StatsDetailModal from './StatsDetailModal';

interface StatsPanelProps {
  stats: RoundStats | null;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailedStats, setDetailedStats] = useState<RoundStats | null>(null);

  const handleShowDetail = async () => {
    try {
      const data = await controlService.getStatus(true);
      if (data.stats) {
        setDetailedStats(data.stats);
        setModalOpen(true);
      }
    } catch {
      message.error('載入統計失敗');
    }
  };

  const typeSummary = stats?.typeSummary || [];

  return (
    <>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <BarChartOutlined />
              <span>即時統計</span>
            </Space>
            <Button
              type="primary"
              size="small"
              ghost
              icon={<BarChartOutlined />}
              onClick={handleShowDetail}
            >
              詳細統計
            </Button>
          </div>
        }
        style={{ height: '100%' }}
      >
        {/* 統計卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div className="stat-card">
            <FileTextOutlined style={{ fontSize: 20, color: 'var(--accent-cyan)', marginBottom: 8 }} />
            <div className="stat-card-value">{stats?.totalBets || 0}</div>
            <div className="stat-card-label">總投注筆數</div>
          </div>
          <div className="stat-card">
            <DollarOutlined style={{ fontSize: 20, color: 'var(--accent-gold)', marginBottom: 8 }} />
            <div className="stat-card-value">${(stats?.totalAmount || 0).toLocaleString()}</div>
            <div className="stat-card-label">總投注金額</div>
          </div>
        </div>

        {/* 投注分布 */}
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          投注分布
        </div>
        <div className="bet-distribution">
          {typeSummary.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              暫無投注資料
            </div>
          ) : (
            typeSummary
              .sort((a, b) => b.totalAmount - a.totalAmount)
              .map((type) => (
                <div key={type.betTypeName}>
                  <div className="bet-dist-item">
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 13 }}>
                      {type.betTypeName}
                    </span>
                    <Space size="middle">
                      <span style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: 13 }}>
                        ${type.totalAmount.toLocaleString()}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                        {type.totalCount}筆
                      </span>
                    </Space>
                  </div>
                  {type.details && type.details.length > 0 && (
                    <div className="bet-detail-table">
                      {type.details.map((detail, idx) => (
                        <div key={idx} className="bet-detail-row">
                          <span className="bet-detail-name">{detail.betTypeName}</span>
                          <div className="bet-detail-stats">
                            <span className="bet-detail-amount">
                              ${(detail._sum.betAmount || 0).toLocaleString()}
                            </span>
                            <span className="bet-detail-count">
                              {detail._count.userId || 0}筆
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </Card>

      <StatsDetailModal
        open={modalOpen}
        stats={detailedStats}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default StatsPanel;
