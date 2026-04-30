import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialData = {
  users: [
    { username: 'Admin', password: 'Admin123', role: 'admin' }
  ],
  students: [],
  menuItems: [],
  transactions: []
};

export const AppProvider = ({ children }) => {
  const loadState = (key) => {
    const storageKey = `smart_canteen_v4_${key}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : initialData[key];
  };

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('smart_canteen_v4_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => loadState('users'));
  const [students, setStudents] = useState(() => loadState('students'));
  const [menuItems, setMenuItems] = useState(() => loadState('menuItems'));
  const [transactions, setTransactions] = useState(() => loadState('transactions'));

  // Save to local storage whenever state changes
  useEffect(() => localStorage.setItem('smart_canteen_v4_currentUser', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('smart_canteen_v4_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('smart_canteen_v4_students', JSON.stringify(students)), [students]);
  useEffect(() => localStorage.setItem('smart_canteen_v4_menuItems', JSON.stringify(menuItems)), [menuItems]);
  useEffect(() => localStorage.setItem('smart_canteen_v4_transactions', JSON.stringify(transactions)), [transactions]);

  // Auth Functions
  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signupParent = (name, username, password) => {
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username already exists' };
    }
    const newUser = { username, password, role: 'parent', name };
    setUsers([...users, newUser]);
    return { success: true };
  };

  // Canteen Operator Functions
  const processPurchase = (studentId, cartItems) => {
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return { success: false, message: 'Student not found' };

    const student = students[studentIndex];
    let totalCost = 0;

    for (const item of cartItems) {
      // Check restrictions
      if (student.restrictedItems.includes(item.name) || student.restrictedItems.includes(item.id)) {
        return { success: false, message: `Item ${item.name} is restricted for this student!` };
      }
      totalCost += item.price;
    }

    if (student.balance < totalCost) {
      return { success: false, message: 'Insufficient balance!' };
    }

    if (student.dailyLimit > 0 && (student.spentToday + totalCost) > student.dailyLimit) {
      return { success: false, message: 'Daily spending limit exceeded!' };
    }

    // Process transaction
    const newStudents = [...students];
    newStudents[studentIndex] = {
      ...student,
      balance: student.balance - totalCost,
      spentToday: student.spentToday + totalCost
    };

    const newTransaction = {
      id: `TXN${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      items: cartItems.map(i => i.name).join(', '),
      total: totalCost,
      date: new Date().toISOString()
    };

    setStudents(newStudents);
    setTransactions([newTransaction, ...transactions]);
    return { success: true, message: 'Purchase successful!' };
  };

  const getStudent = (id) => students.find(s => s.id === id);

  // Admin
  const addStudent = (studentData) => {
    setStudents([...students, { ...studentData, balance: 0, dailyLimit: 0, spentToday: 0, restrictedItems: [] }]);
  };
  const removeStudent = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };
  const removeUser = (username) => {
    setUsers(users.filter(u => u.username !== username));
  };
  const addOperator = (username, password) => {
    setUsers([...users, { username, password, role: 'operator' }]);
  };
  const addMenuItem = (item) => {
    setMenuItems([...menuItems, { ...item, id: `M${Date.now()}`, image: item.image || null }]);
  };
  const updateMenuItem = (id, newProps) => {
    setMenuItems(menuItems.map(m => m.id === id ? { ...m, ...newProps } : m));
  };
  const removeMenuItem = (id) => {
    setMenuItems(menuItems.filter(m => m.id !== id));
  };

  // Parent Functions
  const topUpWallet = (studentId, amount) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, balance: s.balance + amount } : s));
  };
  const updateStudentLimits = (studentId, limit, restrictedItems) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, dailyLimit: limit, restrictedItems } : s));
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, students, menuItems, transactions,
      login, logout, signupParent,
      processPurchase, getStudent,
      addStudent, removeStudent, addOperator, removeUser, addMenuItem, updateMenuItem, removeMenuItem,
      topUpWallet, updateStudentLimits
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
