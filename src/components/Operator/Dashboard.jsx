import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function OperatorDashboard() {
  const { logout, getStudent, menuItems, processPurchase, addMenuItem, removeMenuItem, updateMenuItem } = useAppContext();
  
  const [studentId, setStudentId] = useState('');
  const [scannedStudent, setScannedStudent] = useState(null);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('checkout');
  const [newItem, setNewItem] = useState({ name: '', price: 0, image: null });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItem, setEditingItem] = useState({ name: '', price: 0, image: null });

  const handleScan = (e) => {
    e.preventDefault();
    const s = getStudent(studentId.toUpperCase());
    if (s) {
      setScannedStudent(s);
      setCart([]);
      setMessage('');
    } else {
      setScannedStudent(null);
      setMessage('❌ Student not found. Please try again.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) {
      setMessage('❌ Please enter item name');
      return;
    }
    addMenuItem({ name: newItem.name, price: parseFloat(newItem.price), image: newItem.image, restricted: false });
    setNewItem({ name: '', price: 0, image: null });
    setMessage('✅ Item added successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const startEditItem = (item) => {
    setEditingItemId(item.id);
    setEditingItem({ name: item.name, price: item.price, image: item.image });
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem.name.trim()) {
      setMessage('❌ Please enter item name');
      return;
    }
    updateMenuItem(editingItemId, { 
      name: editingItem.name, 
      price: parseFloat(editingItem.price), 
      image: editingItem.image 
    });
    setEditingItemId(null);
    setEditingItem({ name: '', price: 0, image: null });
    setMessage('✅ Item updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditingItem({ name: '', price: 0, image: null });
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setMessage('❌ Cart is empty.');
      return;
    }
    const res = processPurchase(scannedStudent.id, cart);
    if (res.success) {
      setMessage('✅ ' + res.message);
      setCart([]);
      // Refresh student data stringently
      setScannedStudent(getStudent(scannedStudent.id));
    } else {
      setMessage('❌ ' + res.message);
    }
  };

  const cartTotal = cart.reduce((acc, i) => acc + i.price, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--card-bg)', padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ margin: 0, marginRight: '2rem' }}>Canteen POS</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={`btn ${activeTab === 'checkout' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('checkout')}>Checkout</button>
          <button className={`btn ${activeTab === 'menu' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('menu')}>Menu Management</button>
        </div>
        <button className="btn btn-danger" onClick={logout} style={{ marginLeft: 'auto' }}>
          Logout
        </button>
      </div>

      <div className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {activeTab === 'checkout' && (
          <>
            <div className="card" style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
              <form onSubmit={handleScan} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Scan Student ID (e.g. STU001)" 
                  value={studentId} 
                  onChange={e => setStudentId(e.target.value)} 
                  required 
                />
                <button type="submit" className="btn btn-primary">Scan</button>
              </form>
            </div>

            {message && (
              <div style={{ padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', backgroundColor: message.startsWith('❌') ? '#FEE2E2' : '#D1FAE5', color: message.startsWith('❌') ? '#991B1B' : '#065F46', fontWeight: 500 }}>
                {message}
              </div>
            )}

            {scannedStudent && (
              <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: '400px' }}>
                <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="card" style={{ backgroundColor: '#F3F4F6' }}>
                    <h3>{scannedStudent.name}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>ID: {scannedStudent.id}</p>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Wallet</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: scannedStudent.balance < 5 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                        ₵{scannedStudent.balance.toFixed(2)}
                      </span>
                    </div>
                    {scannedStudent.dailyLimit > 0 && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Remaining daily limit: ₵{(scannedStudent.dailyLimit - scannedStudent.spentToday).toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Menu Options</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                      {menuItems.map(item => (
                        <button 
                          key={item.id} 
                          onClick={() => addToCart(item)}
                          className="card" 
                          style={{ textAlign: 'center', cursor: 'pointer', padding: '0', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden', border: 'none', height: '100%' }}
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '120px', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                              No Image
                            </div>
                          )}
                          <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', width: '100%' }}>
                            <span style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.name}</span>
                            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>₵{item.price.toFixed(2)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '1rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Current Order</h3>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {cart.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                        <span>{item.name}</span>
                        <div>
                          <span style={{ marginRight: '0.5rem' }}>₵{item.price.toFixed(2)}</span>
                          <button onClick={() => removeFromCart(index)} style={{ color: 'var(--danger-color)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0 0.5rem' }}>×</button>
                        </div>
                      </div>
                    ))}
                    {cart.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', marginTop: '2rem' }}>Tap a menu item to add to the order</p>}
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1.2rem' }}>
                      <span>Total:</span>
                      <span>₵{cartTotal.toFixed(2)}</span>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={handleCheckout}>CHARGE ACCOUNT</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'menu' && (
          <div style={{ marginTop: '1rem' }}>
            <h1>Menu Management</h1>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Add New Food Item</h3>
              <form onSubmit={handleAddItem} style={{ marginTop: '1rem' }}>
                <div className="grid-cols-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Item Name</label>
                    <input type="text" className="input-field" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Price (₵)</label>
                    <input type="number" step="0.01" className="input-field" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} required />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Food Image</label>
                    <input type="file" className="input-field" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>
                {newItem.image && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Preview:</p>
                    <img src={newItem.image} alt="Preview" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '8px' }} />
                  </div>
                )}
                <button type="submit" className="btn btn-primary">Add Item to Menu</button>
              </form>
            </div>

            {message && (
              <div style={{ padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', backgroundColor: message.startsWith('❌') ? '#FEE2E2' : '#D1FAE5', color: message.startsWith('❌') ? '#991B1B' : '#065F46', fontWeight: 500 }}>
                {message}
              </div>
            )}

            <h3 style={{ marginBottom: '1rem' }}>Current Menu Items</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
              {menuItems.map(item => (
                <div key={item.id}>
                  {editingItemId === item.id ? (
                    // Edit Form
                    <div className="card" style={{ padding: '1rem', textAlign: 'left' }}>
                      <h4 style={{ marginBottom: '1rem', textAlign: 'center' }}>Edit Item</h4>
                      <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label className="input-label">Item Name</label>
                          <input 
                            type="text" 
                            className="input-field" 
                            value={editingItem.name} 
                            onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} 
                            required 
                          />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label className="input-label">Price (₵)</label>
                          <input 
                            type="number" 
                            step="0.01" 
                            className="input-field" 
                            value={editingItem.price} 
                            onChange={e => setEditingItem({ ...editingItem, price: e.target.value })} 
                            required 
                          />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label className="input-label">Food Image</label>
                          <input 
                            type="file" 
                            className="input-field" 
                            accept="image/*" 
                            onChange={handleEditImageUpload} 
                          />
                        </div>
                        {editingItem.image && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Preview:</p>
                            <img src={editingItem.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '6px' }} />
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>Save</button>
                          <button type="button" className="btn" style={{ flex: 1, padding: '0.5rem', backgroundColor: '#E5E7EB', color: '#374151' }} onClick={cancelEdit}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    // Display Card
                    <div className="card" style={{ padding: '1rem', textAlign: 'center', position: 'relative' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
                      ) : (
                        <div style={{ width: '100%', height: '150px', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', borderRadius: '8px', marginBottom: '1rem' }}>
                          No Image
                        </div>
                      )}
                      <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{item.name}</h4>
                      <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>₵{item.price.toFixed(2)}</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn" style={{ flex: 1, padding: '0.5rem', backgroundColor: '#DBEAFE', color: '#1E40AF' }} onClick={() => startEditItem(item)}>Edit</button>
                        <button className="btn btn-danger" style={{ flex: 1, padding: '0.5rem' }} onClick={() => removeMenuItem(item.id)}>Remove</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {menuItems.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                <p>No menu items yet. Add one to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
