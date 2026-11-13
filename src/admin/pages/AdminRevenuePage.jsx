import React, { useState } from "react";
import { Coins, TrendingUp, ArrowDownLeft, ArrowUpRight, Download, Filter, CheckCircle2 } from "lucide-react";
import { getStoredAdminSalons } from "../adminData";

export default function AdminRevenuePage() {
  const [salons] = useState(getStoredAdminSalons);
  const totalGMV = salons.reduce((acc, s) => acc + (s.totalRevenue || 0), 0) + 384000;
  const platformCommission = Math.round(totalGMV * 0.15);
  const partnerPayouts = totalGMV - platformCommission;

  const transactions = [
    { id: "TXN_9801", salon: "Quick Groom Saloon", amount: 2400, fee: 360, date: "Today, 11:45 AM", method: "UPI / PhonePe", status: "SETTLED" },
    { id: "TXN_9802", salon: "Luxe Cut Barber Studio", amount: 1800, fee: 270, date: "Today, 10:30 AM", method: "Razorpay Card", status: "SETTLED" },
    { id: "TXN_9803", salon: "Urban Shave Lounge", amount: 950, fee: 142, date: "Today, 09:15 AM", method: "UPI / GPay", status: "SETTLED" },
    { id: "TXN_9804", salon: "Quick Groom Saloon", amount: 680, fee: 102, date: "Yesterday", method: "Prepaid NetBanking", status: "SETTLED" },
    { id: "TXN_9805", salon: "Quick Groom Saloon", amount: 3500, fee: 525, date: "Yesterday", method: "Razorpay Card", status: "SETTLED" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="admin-page-header">
        <div className="admin-header-title-col">
          <span className="admin-brand-badge">FINANCIAL SETTLEMENTS & COMMISSIONS</span>
          <h1 className="admin-page-title">Payments & Revenue Ledger</h1>
          <p className="admin-page-subtitle">
            Gross merchandise value (GMV), 15% platform commission collections, and partner salon payout settlements.
          </p>
        </div>

        <div className="admin-header-actions">
          <button type="button" className="admin-btn outline" onClick={() => alert("Exporting Financial Ledger CSV...")}>
            <Download size={15} /> Export Payout CSV
          </button>
        </div>
      </div>

      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Gross Platform GMV</h4>
            <div className="kpi-icon-wrap green">
              <Coins size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">₹{totalGMV.toLocaleString()}</span>
            <span className="kpi-trend up">+22.4%</span>
          </div>
          <p className="kpi-caption">Verified gross booking volume</p>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Platform Net Commission (15%)</h4>
            <div className="kpi-icon-wrap blue">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">₹{platformCommission.toLocaleString()}</span>
            <span className="kpi-trend up">+18.0%</span>
          </div>
          <p className="kpi-caption">Platform earnings after transaction costs</p>
        </div>

        <div className="admin-kpi-card">
          <div className="kpi-card-top">
            <h4 className="kpi-title">Salon Partner Net Payouts (85%)</h4>
            <div className="kpi-icon-wrap purple">
              <Coins size={18} />
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">₹{partnerPayouts.toLocaleString()}</span>
          </div>
          <p className="kpi-caption">Dispatched to verified salon bank accounts</p>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--admin-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ fontSize: "15px", color: "var(--admin-navy)" }}>Settled Booking Transactions Ledger</strong>
          <span className="admin-badge success">Auto-Reconciled T+1</span>
        </div>

        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Salon Partner</th>
              <th>Customer Paid (GMV)</th>
              <th>Platform Take (15%)</th>
              <th>Net Payout (85%)</th>
              <th>Date & Time</th>
              <th>Gateway Channel</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>
                  <code style={{ fontSize: "12.5px", fontWeight: "700", color: "var(--admin-blue)" }}>{t.id}</code>
                </td>
                <td>
                  <strong>{t.salon}</strong>
                </td>
                <td>
                  <strong style={{ color: "var(--admin-navy)" }}>₹{t.amount}</strong>
                </td>
                <td>
                  <span style={{ color: "#10b981", fontWeight: "700" }}>+₹{t.fee}</span>
                </td>
                <td>
                  <strong>₹{t.amount - t.fee}</strong>
                </td>
                <td>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{t.date}</span>
                </td>
                <td>
                  <span className="admin-badge neutral">{t.method}</span>
                </td>
                <td>
                  <span className="admin-badge success">✓ {t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
