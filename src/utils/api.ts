
import axios from 'axios';
import { QRCodeItem } from '@/components/QRHistoryList';

const generateMockData = (count: number): QRCodeItem[] => {
  const types: ('generated' | 'scanned')[] = ['generated', 'scanned'];
  const urls = [
    'https://github.com',
    'https://twitter.com',
    'https://youtube.com',
    'https://linkedin.com',
    'https://facebook.com',
    'https://instagram.com',
    'Plain text content',
    'Contact: Pranav, 123456789',
    'WiFi: charusat, Pranav@123',
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `qr-${Date.now()}-${i}`,
    content: urls[Math.floor(Math.random() * urls.length)],
    type: types[Math.floor(Math.random() * types.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
  }));
};

const initMockData = () => {
  const existingData = localStorage.getItem('qr_history');
  if (!existingData) {
    const mockData = generateMockData(15);
    localStorage.setItem('qr_history', JSON.stringify(mockData));
  }
};

export const getQRHistory = (
  page: number = 1,
  pageSize: number = 10,
  startDate: Date | null = null,
  endDate: Date | null = null
): { items: QRCodeItem[], totalItems: number, totalPages: number } => {
  initMockData();
  
  const historyData: QRCodeItem[] = JSON.parse(localStorage.getItem('qr_history') || '[]')
    .map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }))
    .sort((a: QRCodeItem, b: QRCodeItem) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  
  let filteredData = historyData;
  if (startDate) {
    const startDateTime = startDate.setHours(0, 0, 0, 0);
    filteredData = filteredData.filter(
      item => new Date(item.createdAt).getTime() >= startDateTime
    );
  }
  
  if (endDate) {
    const endDateTime = endDate.setHours(23, 59, 59, 999);
    filteredData = filteredData.filter(
      item => new Date(item.createdAt).getTime() <= endDateTime
    );
  }
  
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  return {
    items: paginatedData,
    totalItems,
    totalPages,
  };
};

export const addQRToHistory = (content: string, type: 'generated' | 'scanned'): void => {
  initMockData();
  
  const historyData: QRCodeItem[] = JSON.parse(localStorage.getItem('qr_history') || '[]');
  
  const newEntry: QRCodeItem = {
    id: `qr-${Date.now()}`,
    content,
    type,
    createdAt: new Date(),
  };
  
  localStorage.setItem('qr_history', JSON.stringify([newEntry, ...historyData]));
};

// In a real app, these functions would use axios to call a backend API
// Example of a real API call:
/*
export const getQRHistory = async (
  page: number = 1,
  pageSize: number = 10,
  startDate: Date | null = null,
  endDate: Date | null = null
) => {
  try {
    const params: any = { page, pageSize };
    
    if (startDate) {
      params.startDate = startDate.toISOString();
    }
    
    if (endDate) {
      params.endDate = endDate.toISOString();
    }
    
    const response = await axios.get('/api/qrcodes', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching QR history:', error);
    throw error;
  }
};

export const addQRToHistory = async (content: string, type: 'generated' | 'scanned') => {
  try {
    const response = await axios.post('/api/qrcodes', { content, type });
    return response.data;
  } catch (error) {
    console.error('Error adding QR to history:', error);
    throw error;
  }
};
*/
