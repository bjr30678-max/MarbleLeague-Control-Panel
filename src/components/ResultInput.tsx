import { PLAYER_NUMBERS } from '@/constants';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { App, Button, Select } from 'antd';
import { useState } from 'react';

interface ResultInputProps {
  onSubmit: (result: number[]) => void;
  onCancel: () => void;
  loading: boolean;
}

const ResultInput: React.FC<ResultInputProps> = ({ onSubmit, onCancel, loading }) => {
  const { message } = App.useApp();
  const [positions, setPositions] = useState<(number | null)[]>(Array(10).fill(null));

  const handleChange = (index: number, value: number | null) => {
    setPositions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const getUsedNumbers = (): Set<number> => {
    return new Set(positions.filter((v): v is number => v !== null));
  };

  const handleSubmit = () => {
    for (let i = 0; i < 10; i++) {
      if (positions[i] === null) {
        message.error(`請選擇第${i + 1}名`);
        return;
      }
    }

    const used = new Set<number>();
    for (let i = 0; i < 10; i++) {
      const num = positions[i]!;
      if (used.has(num)) {
        message.error(`車號 ${num} 重複選擇`);
        return;
      }
      used.add(num);
    }

    onSubmit(positions as number[]);
  };

  const usedNumbers = getUsedNumbers();

  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-gold)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        輸入開獎結果
      </div>
      <div className="result-grid">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="result-pos">
            <div className="result-pos-label">
              第<span className="result-pos-num">{i + 1}</span>名
            </div>
            <Select
              value={positions[i]}
              onChange={(value) => handleChange(i, value)}
              placeholder="-"
              style={{ width: '100%' }}
              allowClear
              onClear={() => handleChange(i, null)}
            >
              {PLAYER_NUMBERS.map((num) => (
                <Select.Option
                  key={num}
                  value={num}
                  disabled={usedNumbers.has(num) && positions[i] !== num}
                >
                  {num}
                </Select.Option>
              ))}
            </Select>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          loading={loading}
          icon={<CheckOutlined />}
          className="btn-start"
        >
          提交結果
        </Button>
        <Button
          size="large"
          onClick={onCancel}
          icon={<CloseOutlined />}
          style={{ height: 52, fontWeight: 600, borderRadius: 10 }}
        >
          取消
        </Button>
      </div>
    </div>
  );
};

export default ResultInput;
