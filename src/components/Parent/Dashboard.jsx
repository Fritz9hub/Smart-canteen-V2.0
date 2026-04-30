import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function ParentDashboard() {
  const { currentUser, logout, students, menuItems, transactions, topUpWallet, updateStudentLimits } = useAppContext();
  
  // Find students belonging to this parent parentUsername === currentUser.username
  // (In AppContext my mock data uses parentUsername: 'Parent1', currentUser.username is 'Parent1')
  const myStudents = students.filter(s => s.parentUsername === currentUser.username);
  
  const [activeStudentId, setActiveStudentId] = useState(myStudents.length > 0 ? myStudents[0].id : null);
  const [topUpAmount, setTopUpAmount] = useState('');
  
  if (myStudents.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '10vh' }}>
        <h2>Parent Dashboard</h2>
        <p>No students linked to your account yet. Please contact the Admin.</p>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
    );
  }

  const activeStudent = students.find(s => s.id === activeStudentId);
  const [dailyLimit, setDailyLimit] = useState(activeStudent ? activeStudent.dailyLimit : 0);
  const [restrictedItems, setRestrictedItems] = useState(activeStudent ? activeStudent.restrictedItems : []);

  const handleTopUp = (e) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (amount > 0) {
      topUpWallet(activeStudentId, amount);
      setTopUpAmount('');
      alert(`Successfully added ₵${amount} to ${activeStudent.name}'s wallet!`);
    }
  };

  const handleSaveLimits = (e) => {
    e.preventDefault();
    updateStudentLimits(activeStudentId, parseFloat(dailyLimit), restrictedItems);
    alert('Controls and Restrictions updated successfully!');
  };

  const toggleRestriction = (itemName) => {
    if (restrictedItems.includes(itemName)) {
      setRestrictedItems(restrictedItems.filter(i => i !== itemName));
    } else {
      setRestrictedItems([...restrictedItems, itemName]);
    }
  };

  const studentTransactions = transactions.filter(t => t.studentId === activeStudentId);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Left Sidebar */}
      <div style={{ width: '250px', backgroundColor: 'var(--card-bg)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', padding: '2rem 1rem' }}>
        <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.3rem' }}>Parent Portal</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <label className="input-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Select Child:</label>
          <select 
            className="input-field" 
            value={activeStudentId} 
            onChange={(e) => {
               setActiveStudentId(e.target.value);
               const s = students.find(st => st.id === e.target.value);
               setDailyLimit(s.dailyLimit);
               setRestrictedItems(s.restrictedItems);
            }}
            style={{ width: '100%', margin: 0 }}
          >
            {myStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div style={{ flex: 1 }} />
        
        <button 
          className="btn btn-danger" 
          onClick={logout} 
          style={{ width: '100%', textAlign: 'center', justifyContent: 'center', padding: '0.75rem' }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <h1>{activeStudent.name}'s Profile</h1>
        
        <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
          {/* Wallet Control */}
          <div className="card">
            <h3>Wallet Balance</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1rem' }}>
              ₵{activeStudent.balance.toFixed(2)}
            </p>
            <form onSubmit={handleTopUp} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="number" 
                step="0.01" 
                min="1"
                className="input-field" 
                placeholder="Amount to add" 
                value={topUpAmount} 
                onChange={e => setTopUpAmount(e.target.value)} 
                required 
              />
              <button type="submit" className="btn btn-primary">Top Up</button>
            </form>
          </div>

          {/* Spending Control */}
          <div className="card">
            <h3>Spending Control</h3>
            <form onSubmit={handleSaveLimits} style={{ marginTop: '1rem' }}>
              <div className="input-group">
                <label className="input-label">Daily Spending Limit (₵)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="input-field" 
                  value={dailyLimit} 
                  onChange={e => setDailyLimit(e.target.value)} 
                />
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Currently spent today: ₵{activeStudent.spentToday.toFixed(2)}
              </p>
              <button type="submit" className="btn btn-primary">Save Controls</button>
            </form>
          </div>
        </div>

        <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
          {/* Dietary Restrictions */}
          <div className="card">
            <h3>Dietary Restrictions</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Select items that {activeStudent.name} is NOT allowed to purchase.
            </p>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem' }}>
              {menuItems.map(item => (
                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={restrictedItems.includes(item.name) || restrictedItems.includes(item.id)}
                    onChange={() => toggleRestriction(item.name)}
                  />
                  <span>{item.name}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>₵{item.price.toFixed(2)}</span>
                </label>
              ))}
            </div>
            <button className="btn btn-primary" onClick={handleSaveLimits} style={{ marginTop: '1rem', width: '100%' }}>Apply Dietary Restrictions</button>
          </div>

          {/* Notifications (Simulated) */}
          <div className="card">
            <h3>Notifications & Alerts</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
              {/* Simulated attempted restricted purchase */}
              {restrictedItems.length > 0 && (
                <div style={{ padding: '0.75rem', borderLeft: '4px solid var(--danger-color)', backgroundColor: '#FEE2E2', borderRadius: '4px' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>Attempted purchase blocked!</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{activeStudent.name} tried to buy restricted item(s). The operator blocked this action.</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Simulated Alert - Just now</p>
                </div>
              )}
              {studentTransactions.slice(0,3).map(tx => (
                <div key={tx.id} style={{ padding: '0.75rem', borderLeft: '4px solid var(--success-color)', backgroundColor: '#D1FAE5', borderRadius: '4px' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--success-color)' }}>Purchase Successful</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{activeStudent.name} spent ₵{tx.total.toFixed(2)} on {tx.items}.</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              ))}
              {studentTransactions.length === 0 && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No recent alerts.</p>}
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="card">
          <h3>Purchase History</h3>
          <div className="table-container" style={{ marginTop: '1rem' }}>
            <table className="table">
              <thead>
                <tr><th>Transaction ID</th><th>Date & Time</th><th>Items Bought</th><th>Amount</th></tr>
              </thead>
              <tbody>
                {studentTransactions.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.id}</td>
                    <td>{new Date(tx.date).toLocaleString()}</td>
                    <td>{tx.items}</td>
                    <td>₵{tx.total.toFixed(2)}</td>
                  </tr>
                ))}
                {studentTransactions.length === 0 && <tr><td colSpan="4">No past transactions.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
