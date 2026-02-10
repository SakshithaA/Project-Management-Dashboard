import { Card, Form, Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

const { Title } = Typography;

interface FormTemplateProps {
  backPath: string;
  title: string;
  subtitle: string;
  submitText: string;
  cancelText?: string;
  onFinish: (values: any) => void;
  onCancel?: () => void;
  form: any;
  sections: Array<{
    key: string;
    title: string;
    subtitle: string;
    color: string;
    content: ReactNode;
  }>;
  extraActions?: ReactNode;
  initialValues?: any;
  submitDisabled?: boolean;
  loading?: boolean;
  width?: string;
}

export default function FormTemplate({
  backPath,
  title,
  subtitle,
  submitText,
  cancelText = "Cancel",
  onFinish,
  onCancel,
  form,
  sections,
  extraActions,
  initialValues,
  submitDisabled = false,
  loading = false,
  width = "65%"
}: FormTemplateProps) {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(backPath);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full"
          style={{ maxWidth: width }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-300 px-6 py-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={handleCancel}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                />
                <div>
                  <Title level={3} className="text-gray-900 mb-1">
                    {title}
                  </Title>
                  <p className="text-gray-700 text-sm font-medium">{subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={initialValues}
              disabled={loading}
            >
              {/* Dynamic Sections */}
              {sections.map((section) => (
                <Card 
                  key={section.key}
                  className="mb-6 border border-gray-300 rounded-lg shadow-sm last:mb-0"
                >
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-3 h-3 rounded-full mr-3 shadow-sm"
                      style={{ backgroundColor: section.color }}
                    ></div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
                      <p className="text-gray-600 text-sm font-medium">{section.subtitle}</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {section.content}
                  </div>
                </Card>
              ))}

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-300 -mx-6 px-6">
                <div className="flex justify-end items-center gap-3">
                  {extraActions}
                  <Button
                    size="large"
                    onClick={handleCancel}
                    className="font-medium border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                    disabled={loading}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="font-medium bg-blue-600 hover:bg-blue-700 border-blue-600"
                    disabled={submitDisabled || loading}
                    loading={loading}
                  >
                    {submitText}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}