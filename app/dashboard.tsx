return (
    <div className="min-h-screen bg-[#0a0c10] text-white p-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>

      <div className="card-menu">
        <div className="menu-title mb-3 text-sm text-slate-400">تحويل الزائر 📁</div>

        {menuItems.map((item, i) => (
          <button
            key={item.label}
            className={`menu-btn ${i === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            <div className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <div className="radio"></div>
          </button>
        ))}
      </div>

      <style jsx>{`
        .card-menu {
          width: 240px;
          background: #0a0c10;
          border: 1px solid #1e2433;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.6);
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
          box-shadow: 0 0 0 1px #3b82f6, 0 0 16px rgba(59, 130, 246, 0.25);
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
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.25);
        }
      `}</style>
    </div>
  )
}
