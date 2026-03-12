import React, { useState } from "react";
import "./DeviceManagement.css";

interface DeviceStatus {
  id: string;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "error";
  lastChecked: string;
  icon: string;
}

interface DeviceManagementProps {
  onBack: () => void;
  onLogout: () => void;
  username: string;
}

export const DeviceManagement: React.FC<DeviceManagementProps> = ({
  onBack,
  onLogout,
  username,
}) => {
  const [devices, setDevices] = useState<DeviceStatus[]>([
    {
      id: "card-terminal",
      name: "카드 단말기",
      type: "Payment",
      status: "connected",
      lastChecked: new Date().toLocaleTimeString(),
      icon: "💳",
    },
    {
      id: "receipt-printer",
      name: "영수증 프린터",
      type: "Printer",
      status: "connected",
      lastChecked: new Date().toLocaleTimeString(),
      icon: "🧾",
    },
    {
      id: "barcode-scanner",
      name: "바코드 스캐너",
      type: "Scanner",
      status: "disconnected",
      lastChecked: new Date().toLocaleTimeString(),
      icon: "🔍",
    },
    {
      id: "ticket-printer",
      name: "티켓 프린터",
      type: "Printer",
      status: "error",
      lastChecked: new Date().toLocaleTimeString(),
      icon: "🎟️",
    },
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = () => {
    setIsRefreshing(true);
    // Electron 스타일: 실제 구현에서는 여기서 IPC를 통해 장치 상태를 체크합니다.
    setTimeout(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        lastChecked: new Date().toLocaleTimeString()
      })));
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "#2ecc71";
      case "disconnected": return "#95a5a6";
      case "error": return "#e74c3c";
      default: return "#95a5a6";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected": return "연결됨";
      case "disconnected": return "연결 안됨";
      case "error": return "오류 발생";
      default: return "알 수 없음";
    }
  };

  return (
    <div className="device-mgmt-container">
      <header className="dashboard-header">
        <div className="header-content">
          <button className="back-button" onClick={onBack}>
            ← 돌아가기
          </button>
          <h1>장치 관리 (Electron)</h1>
          <div className="user-info">
            <span className="username">{username}</span>
            <button className="logout-button" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="device-mgmt-content">
        <div className="section-header">
          <div className="title-area">
            <h2>장치 연결 상태</h2>
            <p>현재 시스템에 연결된 주변 장치의 상태를 확인하고 테스트합니다.</p>
          </div>
          <button 
            className={`refresh-button ${isRefreshing ? 'loading' : ''}`} 
            onClick={refreshStatus}
            disabled={isRefreshing}
          >
            {isRefreshing ? "동기화 중..." : "상태 새로고침"}
          </button>
        </div>

        <div className="device-grid">
          {devices.map((device) => (
            <div key={device.id} className={`device-card status-${device.status}`}>
              <div className="device-card-header">
                <span className="device-icon">{device.icon}</span>
                <div className="device-main-info">
                  <h3>{device.name}</h3>
                  <span className="device-type">{device.type}</span>
                </div>
                <div 
                  className="status-indicator" 
                  style={{ backgroundColor: getStatusColor(device.status) }}
                ></div>
              </div>
              
              <div className="device-card-body">
                <div className="info-row">
                  <span className="label">상태:</span>
                  <span className="value" style={{ color: getStatusColor(device.status), fontWeight: 'bold' }}>
                    {getStatusText(device.status)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">마지막 확인:</span>
                  <span className="value">{device.lastChecked}</span>
                </div>
              </div>

              <div className="device-card-footer">
                <button className="test-button" onClick={() => alert(`${device.name} 테스트 화면으로 이동합니다.`)}>
                  장치 테스트
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="troubleshooting-tips">
          <h3>💡 연결 문제 해결 팁</h3>
          <ul>
            <li>장치의 전원이 켜져 있는지 확인하십시오.</li>
            <li>USB 케이블 또는 네트워크 연결 상태를 확인하십시오.</li>
            <li>장치 드라이버가 최신 버전인지 확인하십시오.</li>
            <li>문제가 지속되면 시스템을 재시작해 보십시오.</li>
          </ul>
        </div>
      </main>
    </div>
  );
};
