// src/utils/theme.ts
import type { ThemeConfig } from "antd";

export const antTheme: ThemeConfig = {
  token: {
    // Màu chủ đạo Xanh lá (Emerald 500)
    colorPrimary: '#10b981', 
    
    // Các màu bổ trợ cho tông xanh
    colorSuccess: '#059669',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#10b981',

    // Chỉ số bo góc lớn cho hiện đại
    borderRadius: 16,
    
    // Font chữ hệ thống sạch sẽ
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    
    // Tùy chỉnh độ cao mặc định của các nút và input cho dễ bấm
    controlHeight: 40,
  },
  components: {
    Button: {
      controlHeightLG: 48,
      fontWeight: 600,
      borderRadius: 12, // Bo góc riêng cho nút
    },
    Input: {
      controlHeightLG: 48,
      borderRadius: 12,
    },
    Card: {
      borderRadiusLG: 24, // Card bo góc cực lớn
    },
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f8fafc', // Nền trang hơi xám xanh nhẹ
    }
  }
};