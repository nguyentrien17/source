import React, { useEffect, useMemo } from "react";
import { Form, Input, Row, Col } from "antd";
import {
  InfoCircleOutlined,
  PictureOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import MapPicker from "./MapPicker";
import FormField from "@/components/common/FormField";
import EntityFormShell from "@/components/common/EntityFormShell";
import { antdFileListToUrls, urlsToAntdFileList } from "@/utils/upload";
import { parseCoordinates } from "@/utils/coordinates";

export default function PropertyForm({
  initialData,
  onBack,
  onSubmit,
  provinces = [],
  wards = [],
  onProvinceChange,
}) {
  const [form] = Form.useForm();

  const selectedProvince = Form.useWatch("province", form);
  const rawCoordinate = Form.useWatch("rawCoordinate", form);
  const derivedCoordinates = useMemo(
    () => parseCoordinates(rawCoordinate),
    [rawCoordinate],
  );

  useEffect(() => {
    if (typeof onProvinceChange !== "function") return;
    onProvinceChange(selectedProvince);
  }, [onProvinceChange, selectedProvince]);

  useEffect(() => {
    if (initialData) {
      const { location, ...rest } = initialData;
      let rawCoordinate = "";
      if (location) {
        try {
          const locObj = typeof location === "string" ? JSON.parse(location) : location;
          if (locObj.lat && locObj.lng) {
            rawCoordinate = `${locObj.lat}, ${locObj.lng}`;
          }
        } catch {}
      }
      const urls = rest.images || [];
      form.setFieldsValue({
        ...rest,
        rawCoordinate,
        images: urlsToAntdFileList(urls, "init"),
      });
      // Ask parent to prefill wards list if editing existing data
      if (
        typeof onProvinceChange === "function" &&
        (rest?.province_code || rest?.province)
      ) {
        const parentCode = rest.province_code || rest.province;
        onProvinceChange(parentCode);
      }
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "active", images: [], rawCoordinate: "" });
      if (typeof onProvinceChange === "function") {
        onProvinceChange(undefined);
      }
    }
  }, [form, initialData, onProvinceChange]);

  const onFinish = (values) => {
    const images = antdFileListToUrls(values.images || []);

    onSubmit?.({
      ...values,
      images,
    });
  };

  return (
    <EntityFormShell
      title={initialData ? "Chỉnh sửa khu trọ" : "Thêm khu trọ mới"}
      subtitle={
        initialData
          ? `Đang cập nhật: ${initialData.name}`
          : "Cung cấp tọa độ và thông tin để niêm yết khu trọ lên bản đồ."
      }
      onBack={onBack}
      onCancel={onBack}
      onSubmit={() => form.submit()}
      submitText="Lưu khu trọ"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-14"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CỘT TRÁI (8 CỘT): CHI TIẾT ĐỊA CHỈ & MAP */}
          <div className="lg:col-span-8 space-y-10">
            {/* Section: Thông tin định danh */}
            <section>
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <InfoCircleOutlined className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                  Thông tin định danh
                </h3>
              </div>

              <FormField
                name="name"
                label="Tên khu trọ/Tòa nhà"
                required
                placeholder="Ví dụ: Ký túc xá cao cấp Quận 7"
              />

              <Row gutter={20}>
                <Col span={12}>
                  <FormField
                    label="Tỉnh/Thành phố"
                    name="province"
                    type="select"
                    placeholder="Chọn Tỉnh/Thành phố"
                    onChange={(value) => {
                      form.setFieldsValue({ ward: undefined });
                      if (typeof onProvinceChange === "function") {
                        onProvinceChange(value);
                      }
                    }}
                    options={provinces.map((p) => ({
                      label: p.province_name,
                      value: p.province_code,
                    }))}
                  />
                </Col>
                <Col span={12}>
                  {/* Logic lấy Quận/Huyện dựa trên Tỉnh đã chọn */}
                  <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) =>
                      prev.province !== curr.province
                    }
                  >
                    {({ getFieldValue }) => {
                      const selectedProvince = getFieldValue("province");
                      return (
                        <FormField
                          label="Phường/xã"
                          name="ward"
                          type="select"
                          placeholder="Chọn Phường/xã"
                          disabled={!selectedProvince}
                          options={wards.map((w) => ({
                            label: w.province_name,
                            value: w.province_code,
                          }))}
                        />
                      );
                    }}
                  </Form.Item>
                </Col>
              </Row>

              <FormField
                name="address"
                label="Số nhà, Tên đường"
                required
                placeholder="Số 123, đường Nguyễn Văn Linh..."
              />
            </section>

            {/* Section: Vị trí Địa lý */}
            <section>
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <GlobalOutlined className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                  Vị trí địa lý & Tọa độ
                </h3>
              </div>

              <Form.Item
                name="rawCoordinate"
                label={
                  <span className="font-semibold text-slate-700">
                    Nhập tọa độ hoặc dán tạo độ từ Google Maps
                  </span>
                }
              >
                <Input
                  placeholder="Nhập tọa độ (VD: 10.8, 106.7) hoặc dán link Maps"
                  className="h-11 rounded-xl shadow-sm border-slate-300 focus:border-emerald-500"
                />
              </Form.Item>

              {/* Map Picker UI */}
              <div className="rounded-2xl overflow-hidden border-2 border-white shadow-lg ring-1 ring-slate-200 h-[400px]">
                <MapPicker
                  lat={derivedCoordinates?.lat}
                  lng={derivedCoordinates?.lng}
                  onChange={(lat, lng) => {
                    form.setFieldsValue({
                      rawCoordinate: `${lat}, ${lng}`,
                    });
                  }}
                />
              </div>
            </section>
          </div>

          {/* CỘT PHẢI (4 CỘT): QUẢN LÝ ẢNH & TRẠNG THÁI */}
          <div className="lg:col-span-4 space-y-8">
            {/* Khối Hình ảnh */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <PictureOutlined className="text-emerald-600 text-lg" />
                <h3 className="text-base font-bold text-slate-800">
                  Album hình ảnh
                </h3>
              </div>
              <div className="bg-white p-4 rounded-xl border border-dashed border-slate-300">
                <FormField
                  name="images"
                  type="upload"
                  formItemProps={{ valuePropName: "fileList" }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                * Định dạng hỗ trợ: JPG, PNG, WebP. <br />* Tối đa 8 ảnh. Nên
                chọn ảnh mặt tiền và bên trong phòng.
              </p>
            </div>

            {/* Khối Trạng thái & Mô tả */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <FormField
                name="status"
                label="Trạng thái vận hành"
                type="select"
                required
                options={[
                  { value: "active", label: "🟢 Đang hoạt động" },
                  { value: "maintenance", label: "🟡 Đang bảo trì" },
                  { value: "inactive", label: "🔴 Ngừng kinh doanh" },
                ]}
              />

              <FormField
                name="description"
                label="Mô tả chi tiết / Ghi chú"
                type="textarea"
                placeholder="Mô tả về tiện ích, an ninh, giờ giấc..."
                rows={6}
                className="rounded-xl"
              />
            </div>

            {/* Info Card nhỏ nhắc nhở */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
              <InfoCircleOutlined className="text-amber-500 mt-1" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Thông tin tọa độ chính xác giúp khách thuê dễ dàng tìm thấy khu
                trọ của bạn trên bản đồ tìm kiếm.
              </p>
            </div>
          </div>
        </div>
      </Form>
    </EntityFormShell>
  );
}
