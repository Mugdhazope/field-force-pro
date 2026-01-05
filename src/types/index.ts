// Core types for Pharma Field-Force Management Platform

export type UserRole = 'admin' | 'manager' | 'mr';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  companyId: string;
  headquarters: string;
  avatar?: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  themeColor: string;
  address: string;
  phone: string;
  email: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  town: string;
  headquarters: string;
  address: string;
  phone: string;
  email?: string;
  visitFrequency: {
    thisWeek: number;
    thisMonth: number;
  };
  lastVisit?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  businessEntry?: number;
  companyId: string;
}

export interface Shop {
  id: string;
  name: string;
  address: string;
  town: string;
  phone: string;
  contactPerson: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  companyId: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  targetFrequency: number;
  price: number;
  sku: string;
  isActive: boolean;
  companyId: string;
}

export interface Visit {
  id: string;
  type: 'doctor' | 'shop';
  mrId: string;
  mrName: string;
  doctorId?: string;
  doctorName?: string;
  shopId?: string;
  shopName?: string;
  timestamp: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  notes: string;
  productsPromoted: string[];
  taskId?: string;
  companyId: string;
}

export interface Task {
  id: string;
  mrId: string;
  mrName: string;
  type: 'doctor' | 'shop';
  doctorId?: string;
  doctorName?: string;
  shopId?: string;
  shopName?: string;
  dueDate: string;
  notes: string;
  status: 'pending' | 'completed' | 'overdue';
  completedAt?: string;
  visitId?: string;
  createdBy: string;
  companyId: string;
}

export interface Attendance {
  id: string;
  mrId: string;
  mrName: string;
  date: string;
  firstPunch?: string;
  lastPunch?: string;
  totalVisits: number;
  status: 'present' | 'absent' | 'half-day';
  route: Array<{
    timestamp: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    type: 'punch' | 'visit';
    label: string;
  }>;
  companyId: string;
}

export interface DailyExplanation {
  id: string;
  mrId: string;
  mrName: string;
  date: string;
  reason: string;
  reasonCategory: 'fewer_visits' | 'task_incomplete' | 'late_start' | 'early_end' | 'other';
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  companyId: string;
}

export interface Expense {
  id: string;
  mrId: string;
  mrName: string;
  date: string;
  dailyFare: number;
  hqAllowance: number;
  otherExpenses: number;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  companyId: string;
}

export interface DashboardMetrics {
  totalVisitsToday: number;
  attendancePercentage: number;
  activeMRs: number;
  totalMRs: number;
  doctorsCovered: number;
  shopsCovered: number;
  pendingTasks: number;
  pendingApprovals: number;
}

export interface MRDashboardMetrics {
  assignedTasks: number;
  completedVisits: number;
  pendingApprovals: number;
  todaysRoute: Visit[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ProductPromotion {
  productId: string;
  productName: string;
  mrId: string;
  mrName: string;
  doctorId?: string;
  doctorName?: string;
  count: number;
  period: 'week' | 'month';
}
