import { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Card, 
  Typography, 
  message,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  ArrowLeftOutlined, 
  SaveOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { api, type POC } from '../../services/api';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function UpdatePOC() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [poc, setPOC] = useState<POC | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchPOCData = async () => {
      try {
        if (location.state?.poc) {
          // If POC data was passed in state
          setPOC(location.state.poc);
          form.setFieldsValue(location.state.poc);
        } else if (id) {
          // Otherwise fetch from API
          const pocs = await api.getPOCs();
          const pocData = pocs.find(p => p.id === parseInt(id));
          if (pocData) {
            setPOC(pocData);
            form.setFieldsValue(pocData);
          }
        }
      } catch (error) {
        console.error('Error loading POC:', error);
        message.error('Failed to load POC data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPOCData();
  }, [id, location.state, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      if (!poc) return;

      const updateData = {
        ...values,
        technologies: values.technologies || [],
        status: values.status || 'planning'
      };

      // In a real app, you would call an API endpoint here
      // For demo: Simulate update by updating localStorage
      const existingPOCs = JSON.parse(localStorage.getItem('pocs') || '[]');
      const updatedPOCs = existingPOCs.map((p: POC) => 
        p.id === poc.id ? { ...p, ...updateData } : p
      );
      localStorage.setItem('pocs', JSON.stringify(updatedPOCs));
      
      message.success('POC updated successfully!');
      
      // Redirect back to POC details page
      setTimeout(() => {
        navigate(`/poc/${poc.id}`);
      }, 1500);
      
    } catch (error) {
      message.error('Failed to update POC');
      console.error('Error updating POC:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/poc/${poc?.id}`);
  };

  // Technology options
  const technologyOptions = [
    'React', 'Node.js', 'TypeScript', 'Python', 'Django', 'FastAPI',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'MongoDB',
    'PostgreSQL', 'Redis', 'GraphQL', 'Vue.js', 'Angular', 'Flutter',
    'React Native', 'TensorFlow', 'PyTorch', 'OpenAI API', 'Socket.io',
    'Firebase', 'gRPC', 'Microservices'
  ];

  // Status options
  const statusOptions = [
    { label: 'Planning', value: 'planning' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Testing', value: 'testing' },
    { label: 'Completed', value: 'completed' }
  ];

  if (initialLoading) {
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

        {/* Form */}
        <Card className="border border-gray-200">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={poc}
          >
            {/* Title Field */}
            <Form.Item
              name="title"
              label="POC Title"
              rules={[
                { required: true, message: 'Please enter POC title' },
                { max: 100, message: 'Title cannot exceed 100 characters' }
              ]}
            >
              <Input 
                placeholder="Enter POC title" 
                size="large"
              />
            </Form.Item>

            {/* Overview Field */}
            <Form.Item
              name="overview"
              label="Overview"
              rules={[
                { required: true, message: 'Please provide an overview' },
                { max: 500, message: 'Overview cannot exceed 500 characters' }
              ]}
            >
              <TextArea 
                placeholder="Describe what this POC aims to achieve..."
                rows={4}
                maxLength={500}
                showCount
              />
            </Form.Item>

            {/* Technologies Field */}
            <Form.Item
              name="technologies"
              label="Technologies"
              rules={[{ required: true, message: 'Please select at least one technology' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select technologies"
                size="large"
                allowClear
              >
                {technologyOptions.map(tech => (
                  <Option key={tech} value={tech}>{tech}</Option>
                ))}
              </Select>
            </Form.Item>

            {/* Status Field */}
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select POC status' }]}
            >
              <Select placeholder="Select status" size="large">
                {statusOptions.map(status => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Additional Details */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="objectives"
                  label="Objectives (Optional)"
                >
                  <TextArea 
                    placeholder="List specific objectives..."
                    rows={3}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="expectedOutcome"
                  label="Expected Outcome (Optional)"
                >
                  <TextArea 
                    placeholder="Describe expected results..."
                    rows={3}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            {/* Form Actions */}
            <div className="flex gap-4 justify-end">
              <Button 
                type="default" 
                size="large"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update POC
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}