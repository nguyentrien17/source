import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message } from "antd";
import PropertyList from "./components/PropertyList";
import PropertyForm from "./components/PropertyForm";
import { fetchProvinces, fetchWards } from "@/utils/location";
import api, { isAxiosError } from "@/utils/api";

const getApiErrorMessage = (err) => {
  if (!err) return "Có lỗi xảy ra";
  if (isAxiosError(err)) {
    return err.response?.data?.message || err.response?.data?.error || err.message || "Có lỗi xảy ra";
  }
  return err?.message || "Có lỗi xảy ra";
};

export default function PropertyManager() {
  const [properties, setProperties] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const view = searchParams.get("view");
  const propertyId = searchParams.get("id");

  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    if (view === "edit" && propertyId) {
      (async () => {
        try {
          const res = await api.get(`/properties/${propertyId}`);
          console.log(res);
          
          setSelectedProperty(res?.data?.data || null);
        } catch (err) {
          setSelectedProperty(null);
          message.error(getApiErrorMessage(err));
        }
      })();
    } else {
      setSelectedProperty(null);
    }
  }, [view, propertyId]);

  const loadProperties = useCallback(async () => {
    try {
      const res = await api.get("/properties", { params: { page: 1, limit: 50 } });
      const items = res?.data?.data?.data || [];
      setProperties(items);
    } catch (err) {
      message.error(getApiErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    fetchProvinces().then(setProvinces);
    loadProperties();
  }, [loadProperties]);

  // Tự động load Wards nếu đang ở chế độ edit và có selectedProperty
  useEffect(() => {
    if (selectedProperty?.province_code) {
      handleProvinceChange(selectedProperty.province_code);
    } else if (selectedProperty?.province) {
      handleProvinceChange(selectedProperty.province);
    }
  }, [selectedProperty]);

  const handleProvinceChange = useCallback(async (provinceCode) => {
    if (!provinceCode) {
      setWards([]);
      return;
    }
    const wardsData = await fetchWards(provinceCode);
    setWards(wardsData);
  }, []);

  const handleAddClick = () => {
    setSearchParams({ view: "add" });
  };

  const handleEditClick = (prop) => {
    setSearchParams({ view: "edit", id: prop.id });
  };

  const handleBack = () => {
    setSearchParams({});
  };

  const handleDeleteProperty = async (id) => {
    try {
      await api.delete(`/properties/${id}`);
      message.success("Đã xóa khu trọ");
      await loadProperties();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    }
  };

  const handleSubmitProperty = async (values) => {
    console.log(values);
    
    try {
      if (view === "edit" && propertyId) {
        await api.put(`/properties/${propertyId}`, values);
        message.success("Cập nhật khu trọ thành công");
      } else {
        await api.post("/properties", values);
        message.success("Thêm khu trọ thành công");
      }
      handleBack();
      await loadProperties();
    } catch (err) {
      message.error(getApiErrorMessage(err));
    }
  };

  const handleManageRooms = (prop) => {
    navigate(`/landlord/rooms?propertyId=${prop.id}`);
  };

  return (
    <div className="h-full min-h-0">
      {!view && (
        <PropertyList
          data={properties}
          handleAddClick={handleAddClick}
          handleEditClick={handleEditClick}
          onDeleteConfirm={handleDeleteProperty}
          handleManageRooms={handleManageRooms}
        />
      )}
      {(view === "add" || view === "edit") && (
        <PropertyForm
          initialData={view === "edit" ? selectedProperty : null}
          onBack={handleBack}
          onSubmit={handleSubmitProperty}
          provinces={provinces}
          wards={wards}
          onProvinceChange={handleProvinceChange}
        />
      )}
    </div>
  );
}