import React, { useState, useRef, useEffect } from 'react';

// 원형 타이머를 위한 유틸 함수
function getCircleDasharray(percent: number) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  return `${circumference * percent} ${circumference * (1 - percent)}`;
}

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const TimeTimer: React.FC = () => {
  const [inputMinutes, setInputMinutes] = useState<number>(1);
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalSeconds = clamp(inputMinutes, 1, 60) * 60;

  useEffect(() => {
    setSecondsLeft(clamp(inputMinutes, 1, 60) * 60);
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [inputMinutes]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current!);
    }
    return () => clearInterval(timerRef.current!);
  }, [isRunning, secondsLeft]);

  const handleStart = () => {
    if (secondsLeft > 0) setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
  };

  const percent = secondsLeft / totalSeconds;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <h2>Time Timer</h2>
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#ddd"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#ff5c5c"
          strokeWidth="10"
          strokeDasharray={getCircleDasharray(percent)}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="55" textAnchor="middle" fontSize="20" fill="#333">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </text>
      </svg>
      <div style={{ margin: '16px 0' }}>
        <input
          type="number"
          min="1"
          max="60"
          value={inputMinutes}
          onChange={e => setInputMinutes(Number(e.target.value))}
          disabled={isRunning}
          style={{ width: 60, fontSize: 16, textAlign: 'center' }}
        />{' '}
        분
      </div>
      <div>
        <button onClick={handleStart} disabled={isRunning || secondsLeft === 0} style={{ marginRight: 8 }}>시작</button>
        <button onClick={handlePause} disabled={!isRunning} style={{ marginRight: 8 }}>일시정지</button>
        <button onClick={handleReset}>리셋</button>
      </div>
    </div>
  );
};

export default TimeTimer;
