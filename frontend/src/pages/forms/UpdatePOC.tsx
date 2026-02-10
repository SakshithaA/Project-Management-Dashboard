import { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Typography, 
  InputNumber, 
  message,
  Row,
  Col,
  Divider,
  Tag,
  AutoComplete,
  DatePicker
} from 'antd';
import { 
  SaveOutlined,
  ExperimentOutlined,
  CodeOutlined,
  CalendarOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import FormTemplate from '../../components/FormTemplate';
import dayjs, { Dayjs } from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function UpdatePOC() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [poc, setPOC] = useState<any>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [availableTechnologies, setAvailableTechnologies] = useState<string[]>([
    'React', 'Node.js', 'TypeScript', 'Python', 'Django', 'FastAPI',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'MongoDB',
    'PostgreSQL', 'Redis', 'GraphQL', 'Vue.js', 'Angular', 'Flutter',
    'React Native', 'TensorFlow', 'PyTorch', 'OpenAI API', 'Socket.io',
    'Firebase', 'gRPC', 'Microservices'
  ]);

  const statusOptions = [
    { label: 'Planning', value: 'planning' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Testing', value: 'testing' },
    { label: 'Completed', value: 'completed' },
    { label: 'On Hold', value: 'on-hold' }
  ];

  useEffect(() => {
    if (id) {
      fetchPOCData();
    }
  }, [id]);

  useEffect(() => {
    const checkFormValidity = async () => {
      try {
        await form.validateFields();
        setIsFormValid(true);
      } catch (error) {
        setIsFormValid(false);
      }
    };

    checkFormValidity();
  }, [form, technologies]);

  const fetchPOCData = async () => {
    try {
      setLoading(true);
      const pocData = await api.getStandalonePOC(id!);
      setPOC(pocData);
      setTechnologies(pocData.technologies || []);

      form.setFieldsValue({
        title: pocData.title,
        description: pocData.description,
        overview: pocData.overview,
        endGoal: pocData.endGoal,
        status: pocData.status,
        progress: pocData.progress,
        startDate: pocData.startDate ? dayjs(pocData.startDate) : null,
        endDate: pocData.endDate ? dayjs(pocData.endDate) : null,
        objective: pocData.objective || ''
      });
    } catch (error) {
      console.error('Error loading POC:', error);
      message.error('Failed to load POC data');
    } finally {
      setLoading(false);
    }
  };

  const handleTechnologyAdd = (tech: string) => {
    if (tech && !technologies.includes(tech)) {
      setTechnologies([...technologies, tech]);
    }
  };

  const handleTechnologyRemove = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleSubmit = async (values: any) => {
    try {
      setSaving(true);
      
      if (!poc) return;

      const updateData = {
        ...values,
        technologies: technologies,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null
      };

      await api.updateStandalonePOC(poc.id, updateData);
      
      message.success('POC updated successfully!');
      
      setTimeout(() => {
        navigate(`/poc/${poc.id}`);
      }, 1500);
      
    } catch (error) {
      message.error('Failed to update POC');
      console.error('Error updating POC:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/poc/${poc?.id}`);
  };

  // Form sections for FormTemplate component
  const formSections = [
    {
      key: 'poc-details',
      title: 'POC Details',
      icon: <ExperimentOutlined />,
      content: (
        <>
          <Form.Item
            label={<span className="font-semibold">POC Title</span>}
            name="title"
            rules={[
              { required: true, message: 'Please enter POC title' },
              { max: 100, message: 'Title cannot exceed 100 characters' }
            ]}
          >
            <Input 
              placeholder="Enter POC title" 
              size="large"
              className="rounded-lg border-gray-300"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">Description</span>}
            name="description"
            rules={[
              { required: true, message: 'Please provide a description' },
              { max: 200, message: 'Description cannot exceed 200 characters' }
            ]}
          >
            <TextArea 
              placeholder="Brief description of the POC"
              rows={2}
              maxLength={200}
              showCount
              className="rounded-lg border-gray-300"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">Overview</span>}
            name="overview"
            rules={[
              { required: true, message: 'Please provide an overview' },
              { max: 500, message: 'Overview cannot exceed 500 characters' }
            ]}
          >
            <TextArea 
              placeholder="Detailed technical overview of the POC"
              rows={3}
              maxLength={500}
              showCount
              className="rounded-lg border-gray-300"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">End Goal</span>}
            name="endGoal"
            rules={[
              { required: true, message: 'Please specify the end goal' },
              { max: 200, message: 'End goal cannot exceed 200 characters' }
            ]}
          >
            <TextArea 
              placeholder="What success looks like and key deliverables"
              rows={2}
              maxLength={200}
              showCount
              className="rounded-lg border-gray-300"
            />
          </Form.Item>
        </>
      )
    },
    {
      key: 'technologies',
      title: 'Technologies',
      icon: <CodeOutlined />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Technologies *
            </label>
            <AutoComplete
              options={availableTechnologies.map(tech => ({ value: tech }))}
              onSelect={handleTechnologyAdd}
              onSearch={(value) => {
                if (value && !availableTechnologies.includes(value)) {
                  setAvailableTechnologies([...availableTechnologies, value]);
                }
              }}
              placeholder="Type and press Enter to add technology"
              className="w-full"
            >
              <Input
                size="large"
                className="rounded-lg border-gray-300"
                onPressEnter={(e: any) => {
                  const value = e.target.value.trim();
                  if (value) {
                    handleTechnologyAdd(value);
                    e.target.value = "";
                  }
                }}
              />
            </AutoComplete>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Type technology name and press Enter to add
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Selected Technologies ({technologies.length})
            </div>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[60px]">
              {technologies.length > 0 ? (
                technologies.map((tech, index) => (
                  <Tag
                    key={index}
                    color="blue"
                    closable
                    onClose={() => handleTechnologyRemove(tech)}
                    className="px-3 py-1 text-sm font-medium"
                  >
                    {tech}
                  </Tag>
                ))
              ) : (
                <div className="text-gray-400 text-sm italic">
                  No technologies added yet
                </div>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'planning',
      title: 'Planning & Status',
      icon: <CalendarOutlined />,
      content: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label={<span className="font-semibold">Status</span>}
              name="status"
              rules={[{ required: true, message: 'Please select POC status' }]}
            >
              <Select 
                placeholder="Select status" 
                size="large"
                className="rounded-lg border-gray-300"
              >
                {statusOptions.map(status => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">Progress (%)</span>}
              name="progress"
              rules={[
                { required: true, message: 'Please enter progress' },
                { type: 'number', min: 0, max: 100, message: 'Progress must be between 0 and 100' }
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="50"
                size="large"
                className="w-full rounded-lg border-gray-300"
                addonAfter="%"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label={<span className="font-semibold">Start Date</span>}
              name="startDate"
              rules={[{ required: true, message: 'Please select start date' }]}
            >
              <DatePicker 
                placeholder="Select start date" 
                format="YYYY-MM-DD"
                size="large"
                className="w-full rounded-lg border-gray-300"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold">End Date</span>}
              name="endDate"
              rules={[{ required: true, message: 'Please select end date' }]}
            >
              <DatePicker 
                placeholder="Select end date" 
                format="YYYY-MM-DD"
                size="large"
                className="w-full rounded-lg border-gray-300"
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="font-semibold">Objective (Optional)</span>}
            name="objective"
            rules={[{ max: 500, message: 'Objective cannot exceed 500 characters' }]}
          >
            <TextArea 
              placeholder="Additional objectives or notes"
              rows={2}
              maxLength={500}
              showCount
              className="rounded-lg border-gray-300"
            />
          </Form.Item>
        </>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">Loading POC data...</div>
      </div>
    );
  }

  if (!poc) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">POC not found</h2>
          <Button onClick={() => navigate('/pocs')}>Back to POCs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(`/poc/${poc.id}`)}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            Back to POC
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <ExperimentOutlined className="text-2xl text-blue-600" />
              </div>
              <div>
                <Title level={2} className="text-gray-900 mb-2">
                  Update POC: {poc.title}
                </Title>
                <p className="text-gray-600">
                  Modify POC details and specifications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <FormTemplate
          form={form}
          onFinish={handleSubmit}
          onCancel={handleCancel}
          loading={saving}
          sections={formSections}
          submitButtonText="Update POC"
          submitButtonIcon={<SaveOutlined />}
          isSubmitDisabled={!isFormValid}
        />
      </div>
    </div>
  );
}