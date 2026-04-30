import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function AdminDashboard() {
  const { logout, students, users, menuItems, transactions, addStudent, removeStudent, signupParent, removeUser, addOperator } = useAppContext();
  const [activeTab, setActiveTab] = useState('monitoring');

  // Forms states
  const [newStudent, setNewStudent] = useState({ name: '', parentUsername: '' });
  const [newParent, setNewParent] = useState({ name: '', username: '', password: '' });
  const [newOp, setNewOp] = useState({ username: '', password: '' });

  // Monitoring Stats
  const totalRevenue = transactions.reduce((acc, t) => acc + t.total, 0);
  const totalPurchases = transactions.length;

  const itemCounts = {};
  transactions.forEach(tx => {
    if (tx.items) {
      tx.items.split(', ').forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      });
    }
  });
  const sortedItems = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]);
  const mostSold = sortedItems.length > 0 ? sortedItems[0][0] : 'None';
  const leastBought = sortedItems.length > 0 ? sortedItems[sortedItems.length - 1][0] : 'None';

  const handleAddStudent = (e) => {
    e.preventDefault();
    addStudent({ ...newStudent, id: `STU${Date.now()}` });
    setNewStudent({ name: '', parentUsername: '' });
    alert('Student added successfully!');
  };

  const handleAddParent = (e) => {
    e.preventDefault();
    const res = signupParent(newParent.name, newParent.username, newParent.password);
    if (res.success) {
      setNewParent({ name: '', username: '', password: '' });
      alert('Parent added successfully!');
    } else {
      alert(res.message);
    }
  };

  const handleAddOperator = (e) => {
    e.preventDefault();
    addOperator(newOp.username, newOp.password);
    setNewOp({ username: '', password: '' });
    alert('Operator added successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--card-bg)', padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, marginRight: '2rem' }}>Admin Panel</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn ${activeTab === 'monitoring' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('monitoring')}>Statistics</button>
          <button className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('users')}>Users Management</button>
          <button className={`btn ${activeTab === 'operators' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('operators')}>Operators</button>
        </div>
        <button className="btn btn-danger" onClick={logout} style={{ marginLeft: 'auto' }}>
          Logout
        </button>
      </div>

      <div className="main-content" style={{ position: 'relative' }}>
        {activeTab === 'monitoring' && (
          <div>
            <h1>Dashboard Statistics</h1>
            <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
              <div className="card">
                <h3>Total Revenue</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>₵{totalRevenue.toFixed(2)}</p>
              </div>
              <div className="card">
                <h3>Total Purchases</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{totalPurchases}</p>
              </div>
              <div className="card">
                <h3>Most Sold Item</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.5rem' }}>{mostSold}</p>
                <h3 style={{ marginTop: '0.5rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Least Bought: {leastBought}</h3>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Recent Transactions</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>ID</th><th>Student</th><th>Items</th><th>Total</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map(tx => (
                    <tr key={tx.id}>
                      <td>{tx.id}</td>
                      <td>{tx.studentName}</td>
                      <td>{tx.items}</td>
                      <td>₵{tx.total.toFixed(2)}</td>
                      <td>{new Date(tx.date).toLocaleString()}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && <tr><td colSpan="5">No transactions yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h1>Users Management</h1>
            <div className="grid-cols-2" style={{ marginBottom: '2rem' }}>
              <div className="card">
                <h3>Add New Parent</h3>
                <form onSubmit={handleAddParent} style={{ marginTop: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Name</label>
                    <input type="text" className="input-field" value={newParent.name} onChange={e => setNewParent({ ...newParent, name: e.target.value })} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Username</label>
                    <input type="text" className="input-field" value={newParent.username} onChange={e => setNewParent({ ...newParent, username: e.target.value })} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="input-label">Password</label>
                    <input type="password" className="input-field" value={newParent.password} onChange={e => setNewParent({ ...newParent, password: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Parent</button>
                </form>
              </div>

              <div className="card">
                <h3>Add New Student</h3>
                <form onSubmit={handleAddStudent} style={{ marginTop: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Student Name</label>
                    <input type="text" className="input-field" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="input-label">Parent Username</label>
                    <input type="text" className="input-field" value={newStudent.parentUsername} onChange={e => setNewStudent({ ...newStudent, parentUsername: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>Add Student</button>
                </form>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Registered Parents</h3>
            <div className="table-container" style={{ marginBottom: '2rem' }}>
              <table className="table">
                <thead>
                  <tr><th>Name</th><th>Username</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === 'parent').map(p => (
                    <tr key={p.username}>
                      <td>{p.name || '-'}</td>
                      <td>{p.username}</td>
                      <td>
                        <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => removeUser(p.username)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                  {users.filter(u => u.role === 'parent').length === 0 && (
                    <tr><td colSpan="3">No parents registered.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Student List & QR Codes</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>QR / ID</th><th>Name</th><th>Parent</th><th>Wallet Balance</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id}>
                      <td><span className="badge" style={{ background: '#E5E7EB', color: '#374151', fontFamily: 'monospace', fontSize: '1rem' }}>{s.id}</span></td>
                      <td>{s.name}</td>
                      <td>{s.parentUsername}</td>
                      <td>₵{s.balance.toFixed(2)}</td>
                      <td>
                        <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => removeStudent(s.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan="5">No students registered.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'operators' && (
          <div>
            <h1>Operator Management</h1>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Add Canteen Operator</h3>
              <form onSubmit={handleAddOperator} className="grid-cols-3" style={{ marginTop: '1rem', alignItems: 'end' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Username</label>
                  <input type="text" className="input-field" value={newOp.username} onChange={e => setNewOp({ ...newOp, username: e.target.value })} required />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Password</label>
                  <input type="password" className="input-field" value={newOp.password} onChange={e => setNewOp({ ...newOp, password: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>Add Operator</button>
              </form>
            </div>

            <h3>Current Operators</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>Username</th><th>Role</th></tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === 'operator').map(u => (
                    <tr key={u.username}>
                      <td>{u.username}</td>
                      <td><span className="badge badge-success">Operator</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
