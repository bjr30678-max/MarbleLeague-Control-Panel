import type { LogEntry } from '@/types';
import { FileTextOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';

interface OperationLogProps {
  logs: LogEntry[];
}

const OperationLog: React.FC<OperationLogProps> = ({ logs }) => {
  return (
    <Card
      title={
        <Space>
          <FileTextOutlined />
          <span>操作日誌</span>
          {logs.length > 0 && (
            <span style={{
              fontSize: 11,
              background: 'var(--bg-inner)',
              padding: '2px 8px',
              borderRadius: 10,
              color: 'var(--text-muted)',
              fontWeight: 400,
            }}>
              {logs.length}
            </span>
          )}
        </Space>
      }
    >
      <div className="log-container">
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            暫無操作日誌
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="log-entry">
              <span className={`log-dot ${log.level}`} />
              <span className="log-time">{log.time}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default OperationLog;
