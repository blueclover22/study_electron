import React, { useState } from "react";
import "./MainMenu.css";

interface MenuOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

interface MainMenuProps {
  username: string;
  onSelectMenu: (menuId: string) => void;
  onLogout: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  username,
  onSelectMenu,
  onLogout,
}) => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const menuOptions: MenuOption[] = [
    {
      id: "ticket-sales",
      label: "발매관리",
      icon: "🎫",
      color: "#667eea",
      description: "티켓 발매 및 판매 관리",
    },
    {
      id: "season-pass",
      label: "시즌권관리",
      icon: "🎟️",
      color: "#764ba2",
      description: "시즌권 판매 및 관리",
    },
    {
      id: "naver-sales",
      label: "네이버판매",
      icon: "🛒",
      color: "#f093fb",
      description: "네이버 채널 판매 관리",
    },
    {
      id: "open-management",
      label: "개점관리",
      icon: "🔓",
      color: "#ff9a9e",
      description: "일일 개점 및 마감 관리",
    },
    {
      id: "device-management",
      label: "장치관리",
      icon: "🖥️",
      color: "#a18cd1",
      description: "프린터 및 장치 설정 관리",
    },
    {
      id: "settings",
      label: "설정",
      icon: "⚙️",
      color: "#4facfe",
      description: "시스템 설정 및 구성",
    },
  ];

  return (
    <div className="main-menu-container">
      <header className="menu-header">
        <div className="header-left">
          <h1>POS 시스템 (Electron)</h1>
        </div>
        <div className="header-right">
          <span className="user-greeting">{username}님 반갑습니다</span>
          <button className="logout-button" onClick={onLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <main className="menu-content">
        <div className="menu-intro">
          <h2>메뉴를 선택하세요</h2>
          <p>원하는 작업을 선택하여 시작하세요</p>
        </div>

        <div className="menu-grid">
          {menuOptions.map((menu) => (
            <div
              key={menu.id}
              className={`menu-card ${hoveredMenu === menu.id ? "hovered" : ""}`}
              style={
                {
                  "--menu-color": menu.color,
                } as React.CSSProperties
              }
              onMouseEnter={() => setHoveredMenu(menu.id)}
              onMouseLeave={() => setHoveredMenu(null)}
              onClick={() => onSelectMenu(menu.id)}
            >
              <div className="menu-card-inner">
                <div className="menu-icon">{menu.icon}</div>
                <div className="menu-info">
                  <h3 className="menu-title">{menu.label}</h3>
                  <p className="menu-description">{menu.description}</p>
                </div>
                <div className="menu-arrow">→</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="menu-footer">
        <p>POS System v1.0 | © 2026 Electron Edition</p>
      </footer>
    </div>
  );
};
