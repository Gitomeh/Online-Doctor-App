// User Management System for localStorage-based authentication

export interface User {
  id: string;
  email: string;
  password: string; // In production, this should be hashed
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName?: string;
  firstName: string;
  lastName: string;
  date: string;
  reason: string;
  createdAt: string;
}

// User Management Functions
export const getUserById = (id: string): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const users = getUsers();
    return users.find(user => user.id === id) || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

export const getUserByEmail = (email: string): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
    return [];
  }
};

export const saveUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  try {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
    throw new Error('Failed to save user');
  }
};

export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Appointment Management Functions
export const getAppointmentsByUserId = (userId: string): Appointment[] => {
  if (typeof window === 'undefined') return [];
  try {
    const appointments = getAppointments();
    return appointments.filter(appointment => appointment.userId === userId);
  } catch (error) {
    console.error('Error getting appointments by user ID:', error);
    return [];
  }
};

export const getAppointments = (): Appointment[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading appointments from localStorage:', error);
    return [];
  }
};

export const saveAppointment = (appointment: Appointment): void => {
  if (typeof window === 'undefined') return;
  try {
    const existingAppointments = getAppointments();
    const updatedAppointments = [...existingAppointments, appointment];
    
    try {
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    } catch (error) {
      console.error('Error saving appointment to localStorage:', error);
      throw new Error('Failed to save appointment');
    }
  } catch (error) {
    console.error('Error preparing appointment data:', error);
    throw new Error('Failed to prepare appointment data');
  }
};

export const deleteAppointment = (appointmentId: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const appointments = getAppointments();
    const filtered = appointments.filter(appointment => appointment.id !== appointmentId);
    localStorage.setItem('appointments', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw new Error('Failed to delete appointment');
  }
};

// Authentication Functions
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return null;
    return getUserById(userId);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const setCurrentUser = (userId: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('currentUserId', userId);
  } catch (error) {
    console.error('Error setting current user:', error);
    throw new Error('Failed to set current user');
  }
};

export const logout = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('currentUserId');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const deleteUser = (userId: string): void => {
  if (typeof window === 'undefined') return;
  try {
    const users = getUsers();
    const filtered = users.filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(filtered));
    
    // Also delete all appointments for this user
    const appointments = getAppointments();
    const filteredAppointments = appointments.filter(appointment => appointment.userId !== userId);
    localStorage.setItem('appointments', JSON.stringify(filteredAppointments));
    
    // Clear current user if they were the deleted user
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId === userId) {
      localStorage.removeItem('currentUserId');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};

export const clearAllUsers = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('users');
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('appointments');
    console.log('✅ All accounts and data cleared from localStorage');
  } catch (error) {
    console.error('Error clearing all users:', error);
    throw new Error('Failed to clear all users');
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};