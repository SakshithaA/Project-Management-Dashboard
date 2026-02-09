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
  submitDisabled = false
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
    <div className="min-h-screen bg-gray-50 m-0 font-sansation">
      {/* Navbar-like Back Bar */}
      <div className="bg-white border-b border-gray-200 px-0 py-4 m-0">
        <div className="max-w-4xl mx-auto">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(backPath)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-150 font-sansation"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-7">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Title level={2} className="font-sansation text-gray-900 mb-2">
              {title}
            </Title>
            <p className="text-gray-500 font-sansation">{subtitle}</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialValues}
          >
            {/* Dynamic Sections */}
            {sections.map((section) => (
              <Card 
                key={section.key}
                title={
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: section.color }}
                    ></div>
                    <span className="text-lg font-semibold font-sansation">{section.title}</span>
                  </div>
                }
                className="mb-6 border border-gray-200 rounded-lg"
              >
                <p className="text-gray-500 mb-6 -mt-2 font-sansation">{section.subtitle}</p>
                <div className="space-y-6">
                  {section.content}
                </div>
              </Card>
            ))}

            {/* Action Buttons */}
            <div className="flex justify-end items-center pt-6 border-t border-gray-200 gap-2">
              {extraActions}
              <Button
                size="large"
                onClick={handleCancel}
                className="font-sansation rounded-lg"
              >
                {cancelText}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="font-sansation rounded-lg"
                disabled={submitDisabled}
              >
                {submitText}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}