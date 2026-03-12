import React, { useState } from "react";
import "./TicketSales.css";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // 대메뉴
  subCategory: string; // 중메뉴
  type: string; // 소메뉴
}

interface SelectedItem extends Product {
  quantity: number;
}

interface SalesSummary {
  cash: number;
  card: number;
  unionPay: number;
  ticketExchange: number;
  credit: number;
}

interface TicketSalesProps {
  onBack: () => void;
  onLogout: () => void;
  username: string;
}

export const TicketSales: React.FC<TicketSalesProps> = ({
  onBack,
  onLogout,
  username,
}) => {
  // 상태 관리
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [activeMainCategory, setActiveMainCategory] = useState("전시");
  const [activeSubCategory, setActiveSubCategory] = useState("일반 요금");

  // 금일 판매 현황 (더미 데이터)
  const [salesSummary] = useState<SalesSummary>({
    cash: 150000,
    card: 450000,
    unionPay: 0,
    ticketExchange: 12,
    credit: 0,
  });

  const mainCategories = ["전시", "테마", "체험", "교육", "캐릭터", "교보재"];
  const subCategories = ["일반 요금", "도민(감경) 요금", "감경 선택"];
  const itemTypes = ["성인", "고등", "중등", "초등", "유아", "경로", "군경"];

  // 상품 리스트 생성 (데모용)
  const products: Product[] = [];
  mainCategories.forEach(main => {
    subCategories.forEach(sub => {
      itemTypes.forEach(type => {
        let price = 10000;
        if (sub === "도민(감경) 요금") price = 7000;
        if (sub === "감경 선택") price = 5000;
        if (type === "고등" || type === "중등") price -= 2000;
        if (type === "초등" || type === "유아") price -= 4000;
        if (type === "경로" || type === "군경") price -= 3000;

        products.push({
          id: `${main}-${sub}-${type}`,
          name: `${main} - ${type}`,
          price: price,
          category: main,
          subCategory: sub,
          type: type
        });
      });
    });
  });

  const filteredProducts = products.filter(
    p => p.category === activeMainCategory && p.subCategory === activeSubCategory
  );

  const addToCart = (product: Product) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="ticket-sales-container">
      <header className="dashboard-header">
        <div className="header-content">
          <button className="back-button" onClick={onBack}>← 돌아가기</button>
          <h1>발매 관리 (Electron)</h1>
          <div className="user-info">
            <span className="username">{username}</span>
            <button className="logout-button" onClick={onLogout}>로그아웃</button>
          </div>
        </div>
      </header>

      {/* 서브 네비게이션 버튼 바 추가 */}
      <nav className="sales-sub-nav">
        <div className="nav-group">
          <span className="group-label">기본업무</span>
          <button className="sub-nav-btn active">발매관리</button>
          <button className="sub-nav-btn" onClick={() => alert('네이버판매 화면으로 이동')}>네이버판매</button>
          <button className="sub-nav-btn" onClick={() => alert('시즌권관리 화면으로 이동')}>시즌권관리</button>
        </div>
        <div className="nav-divider"></div>
        <div className="nav-group">
          <span className="group-label">현황조회</span>
          <button className="sub-nav-btn status" onClick={() => alert('판매현황 화면으로 이동')}>판매현황</button>
          <button className="sub-nav-btn refund" onClick={() => alert('환불현황 화면으로 이동')}>환불현황</button>
          <button className="sub-nav-btn pos" onClick={() => alert('포스별 현황 화면으로 이동')}>포스별 현황</button>
          <button className="sub-nav-btn agency" onClick={() => alert('판매대행사 현황 화면으로 이동')}>판매대행사 현황</button>
        </div>
        <div className="nav-divider"></div>
        <div className="nav-group">
          <span className="group-label">시스템</span>
          <button className="sub-nav-btn" onClick={() => alert('시재관리 화면으로 이동')}>시재관리</button>
          <button className="sub-nav-btn" onClick={() => alert('거래처 대금 화면으로 이동')}>거래처 대금</button>
          <button className="sub-nav-btn" onClick={() => alert('설정 화면으로 이동')}>설정</button>
        </div>
      </nav>

      <div className="sales-layout">
        {/* 왼쪽: 선택 목록 및 판매 현황 */}
        <aside className="left-panel">
          <section className="cart-section">
            <h3>선택 상품 목록</h3>
            <div className="cart-list">
              {selectedItems.length === 0 ? (
                <p className="empty-msg">선택된 상품이 없습니다.</p>
              ) : (
                selectedItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-sub">{item.subCategory}</span>
                    </div>
                    <div className="item-controls">
                      <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span className="qty">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <span className="item-price">{(item.price * item.quantity).toLocaleString()}원</span>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
                  </div>
                ))
              )}
            </div>
            <div className="total-area">
              <div className="total-row">
                <span className="label">결제일</span>
                <span className="value">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="total-row">
                <span className="label">총 인원</span>
                <span className="value">
                  {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}명
                </span>
              </div>
              <div className="total-row">
                <span className="label">총 할인금액</span>
                <span className="value discount">0원</span>
              </div>
              <div className="total-row main">
                <span className="label">총 결제 금액</span>
                <span className="value price">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
          </section>

          <section className="summary-section">
            <h3>금일 판매 현황</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">현금</span>
                <span className="value">{salesSummary.cash.toLocaleString()}원</span>
              </div>
              <div className="summary-item">
                <span className="label">카드</span>
                <span className="value">{salesSummary.card.toLocaleString()}원</span>
              </div>
              <div className="summary-item">
                <span className="label">은련</span>
                <span className="value">{salesSummary.unionPay.toLocaleString()}원</span>
              </div>
              <div className="summary-item">
                <span className="label">티켓교환</span>
                <span className="value">{salesSummary.ticketExchange}건</span>
              </div>
              <div className="summary-item">
                <span className="label">외상</span>
                <span className="value">{salesSummary.credit.toLocaleString()}원</span>
              </div>
            </div>
          </section>
        </aside>

        {/* 오른쪽: 상품 선택 리스트 */}
        <main className="right-panel">
          <nav className="category-nav main">
            {mainCategories.map(cat => (
              <button
                key={cat}
                className={activeMainCategory === cat ? "active" : ""}
                onClick={() => setActiveMainCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </nav>

          <nav className="category-nav sub">
            {subCategories.map(sub => (
              <button
                key={sub}
                className={activeSubCategory === sub ? "active" : ""}
                onClick={() => setActiveSubCategory(sub)}
              >
                {sub}
              </button>
            ))}
          </nav>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                className="product-card"
                onClick={() => addToCart(product)}
              >
                <span className="product-type">{product.type}</span>
                <span className="product-price">{product.price.toLocaleString()}원</span>
              </button>
            ))}
          </div>

          {/* 하단 결제 및 주요 기능 버튼 영역 */}
          <div className="main-action-area">
            <div className="payment-buttons-grid">
              <button className="main-pay-btn cash">
                <span className="btn-icon">💵</span>
                <span className="btn-text">현금 결제</span>
              </button>
              <button className="main-pay-btn card">
                <span className="btn-icon">💳</span>
                <span className="btn-text">카드 결제</span>
              </button>
              <button className="main-pay-btn union">
                <span className="btn-icon">🏦</span>
                <span className="btn-text">은련 결제</span>
              </button>
              <button className="main-pay-btn voucher">
                <span className="btn-icon">🎫</span>
                <span className="btn-text">바우처 결제</span>
              </button>
            </div>
            <div className="extra-buttons-grid">
              <button className="action-btn status" onClick={() => alert('발매현황 화면으로 이동')}>
                <span className="btn-icon">📈</span>
                <span className="btn-text">발매현황</span>
              </button>
              <button className="action-btn reservation" onClick={() => alert('예약관리 화면으로 이동')}>
                <span className="btn-icon">📅</span>
                <span className="btn-text">예약관리</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
