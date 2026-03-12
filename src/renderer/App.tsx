import { useState } from "react";
import { Login } from "./components/Login";
import { MainMenu } from "./components/MainMenu";
import { DeviceManagement } from "./components/DeviceManagement";
import { TicketSales } from "./components/TicketSales";
import "./App.css";

type AppScreen =
  | "login"
  | "menu"
  | "ticket-sales"
  | "season-pass"
  | "naver-sales"
  | "open-management"
  | "device-management"
  | "settings";

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("login");
  const [currentUser, setCurrentUser] = useState("");

  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    setCurrentScreen("menu");
  };

  const handleLogout = () => {
    setCurrentUser("");
    setCurrentScreen("login");
  };

  const handleSelectMenu = (menuId: string) => {
    switch (menuId) {
      case "ticket-sales":
        setCurrentScreen("ticket-sales");
        break;
      case "season-pass":
        setCurrentScreen("season-pass");
        break;
      case "naver-sales":
        setCurrentScreen("naver-sales");
        break;
      case "open-management":
        setCurrentScreen("open-management");
        break;
      case "device-management":
        setCurrentScreen("device-management");
        break;
      case "settings":
        setCurrentScreen("settings");
        break;
      default:
        break;
    }
  };

  if (currentScreen === "login") {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentScreen === "menu") {
    return (
      <MainMenu
        username={currentUser}
        onSelectMenu={handleSelectMenu}
        onLogout={handleLogout}
      />
    );
  }

  // 실제 구현된 화면들
  if (currentScreen === "device-management") {
    return (
      <DeviceManagement
        username={currentUser}
        onBack={() => setCurrentScreen("menu")}
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === "ticket-sales") {
    return (
      <TicketSales
        username={currentUser}
        onBack={() => setCurrentScreen("menu")}
        onLogout={handleLogout}
      />
    );
  }

  // 임시 placeholder 화면 렌더링 함수
  const renderPlaceholder = (title: string) => (
    <main className="placeholder-container">
      <header className="dashboard-header">
        <div className="header-content">
          <button
            className="back-button"
            onClick={() => setCurrentScreen("menu")}
          >
            ← 돌아가기
          </button>
          <h1>{title}</h1>
          <div className="user-info">
            <span className="username">{currentUser}</span>
            <button className="logout-button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="placeholder-content">
        <section className="placeholder-section">
          <h2>{title}</h2>
          <p>이 기능은 개발 중입니다.</p>
          <p style={{ marginTop: "20px", color: "#666", fontSize: "14px" }}>
            여기에 {title} 기능을 구현하세요.
          </p>
        </section>
      </div>
    </main>
  );

  // 나머지 placeholder 화면들
  switch (currentScreen) {
    case "season-pass":
      return renderPlaceholder("시즌권관리");
    case "naver-sales":
      return renderPlaceholder("네이버판매");
    case "open-management":
      return renderPlaceholder("개점관리");
    case "settings":
      return renderPlaceholder("설정");
    default:
      return <Login onLoginSuccess={handleLoginSuccess} />;
  }
}

export default App;
