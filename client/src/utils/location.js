import api from "./api";

// Lấy danh sách tỉnh/thành
export async function fetchProvinces() {
  try {
    const res = await api.get("/provinces");
    return res.data.data || [];
  } catch {
    return [];
  }
}

// Lấy danh sách quận/huyện theo mã tỉnh
export async function fetchWards(provinceCode) {
  if (!provinceCode) return [];
  try {
    const res = await api.get(`/provinces?parent=${provinceCode}`);
    return res.data.data || [];
  } catch {
    return [];
  }
}
