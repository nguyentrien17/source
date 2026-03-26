import React, { useEffect } from 'react';
import { Form, Row, Col, Card } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import AppButton from '@/components/ui/AppButton';
import FormField from '@/components/common/FormField';
import { antdFileListToUrls, urlsToAntdFileList } from '@/utils/upload';

const DEFAULT_VALUES = {
  type: 'phong_tro',
  status: 'available',
  amenities: [],
  images: [],
};

const AMENITIES = [
  { label: 'Wifi miễn phí', value: 'wifi' },
  { label: 'Máy lạnh', value: 'ac' },
  { label: 'Máy giặt', value: 'washing_machine' },
  { label: 'Chỗ để xe', value: 'parking' },
  { label: 'Tủ lạnh', value: 'fridge' },
  { label: 'Giường nệm', value: 'bed' },
  { label: 'Kệ bếp', value: 'kitchen' },
  { label: 'An ninh 24/7', value: 'security' },
];

export default function RoomForm({ property, initialData, onBack, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    const mappedImages = urlsToAntdFileList(initialData?.images || [], 'init');

    form.resetFields();
    form.setFieldsValue({
      ...DEFAULT_VALUES,
      ...(initialData || {}),
      images: mappedImages,
    });
  }, [initialData, form]);

  const onFinish = (values) => {
    const images = antdFileListToUrls(values.images || []);

    onSubmit?.({
      ...values,
      images,
      amenities: values.amenities || [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <AppButton variant="text" onClick={onBack} className="inline-flex items-center gap-2">
          <ArrowLeftOutlined />
          Quay lại
        </AppButton>
        <h2 className="text-xl font-bold text-slate-800">
          {initialData ? 'Chỉnh sửa phòng' : `Thêm phòng mới - ${property?.name || ''}`}
        </h2>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={DEFAULT_VALUES}>
        <Row gutter={24}>
          <Col span={16}>
            <Card title="Thông tin cơ bản" className="shadow-sm">
              <FormField
                name="title"
                label="Tiêu đề phòng"
                required
                placeholder="VD: Phòng 101 - Có ban công"
              />

              <Row gutter={16}>
                <Col span={8}>
                  <FormField
                    name="price"
                    label="Giá thuê (VNĐ)"
                    type="number"
                    required
                    min={0}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => (value ? Number(String(value).replaceAll(',', '')) : 0)}
                  />
                </Col>
                <Col span={8}>
                  <FormField name="area" label="Diện tích (m²)" type="number" required min={1} />
                </Col>
                <Col span={8}>
                  <FormField name="capacity" label="Sức chứa (người)" type="number" required min={1} />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <FormField name="floor" label="Tầng" placeholder="VD: 1, Trệt" />
                </Col>
                <Col span={12}>
                  <FormField name="room_number" label="Số phòng" placeholder="VD: 101" />
                </Col>
              </Row>
            </Card>

            <Card title="Chi phí & Thông tin khác" className="shadow-sm mt-4">
              <Row gutter={16}>
                <Col span={12}>
                  <FormField name="electricity_price" label="Giá điện (VNĐ/kWh)" type="number" min={0} />
                </Col>
                <Col span={12}>
                  <FormField name="water_price" label="Giá nước (VNĐ)" type="number" min={0} />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <FormField name="other_costs" label="Chi phí khác (VNĐ/tháng)" type="number" min={0} />
                </Col>
                <Col span={12}>
                  <FormField name="deposit" label="Tiền cọc (VNĐ)" type="number" min={0} />
                </Col>
              </Row>

              <FormField name="min_lease_term" label="Thời gian thuê tối thiểu (tháng)" type="number" min={1} />
            </Card>

            <Card title="Tiện ích & Hình ảnh" className="shadow-sm mt-4">
              <FormField
                name="amenities"
                label="Tiện ích sẵn có"
                type="checkbox-group"
                options={AMENITIES}
                className="flex flex-wrap gap-4"
              />

              <FormField
                name="images"
                label="Hình ảnh phòng"
                type="upload"
                formItemProps={{ valuePropName: 'fileList' }}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Quản lý" className="shadow-sm">
              <FormField
                name="type"
                label="Loại phòng"
                type="select"
                required
                options={[
                  { value: 'phong_tro', label: 'Phòng trọ' },
                  { value: 'can_ho', label: 'Căn hộ' },
                  { value: 'nha_nguyen_can', label: 'Nhà nguyên căn' },
                ]}
              />

              <FormField
                name="status"
                label="Trạng thái"
                type="select"
                required
                options={[
                  { value: 'available', label: 'Còn trống' },
                  { value: 'rented', label: 'Đã thuê' },
                  { value: 'maintenance', label: 'Bảo trì' },
                ]}
              />

              <AppButton variant="primary" type="submit" className="w-full mt-2 inline-flex items-center justify-center gap-2">
                <SaveOutlined />
                Lưu thông tin
              </AppButton>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
