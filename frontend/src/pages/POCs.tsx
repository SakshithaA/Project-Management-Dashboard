import { Card, Button, Typography } from "antd";
import { 
  ExperimentOutlined,
  CodeOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  RocketOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

export interface POC {
  id: number;
  title: string;
  overview: string;
  technologies: string[];
  postedDate: string;
}

interface POCCardProps {
  searchText?: string;
}


export const pocs: POC[] = [];

/*export const pocs: POC[] = [
  {
    id: 1,
    title: "Microservices Architecture with gRPC",
    overview: "Create a proof of concept to explore new technologies and validate ideas for distributed systems communication using gRPC protocol",
    technologies: ["React", "Node.js", "PostgreSQL", "gRPC", "Docker", "Kubernetes"],
    postedDate: "2 days ago"
  },
  {
    id: 2,
    title: "AI-Powered Code Review System",
    overview: "Implement AI-based code analysis for automated reviews and bug detection",
    technologies: ["Python", "FastAPI", "OpenAI API", "Docker", "GitHub Actions"],
    postedDate: "1 week ago"
  },
  {
    id: 3,
    title: "Real-time Dashboard with WebSockets",
    overview: "Build real-time monitoring dashboard using WebSocket protocol for live data streaming",
    technologies: ["Vue.js", "Node.js", "Socket.io", "Redis", "MongoDB"],
    postedDate: "3 days ago"
  },
  {
    id: 4,
    title: "Serverless API Optimization",
    overview: "Optimize serverless functions for better performance and cost efficiency",
    technologies: ["AWS Lambda", "TypeScript", "API Gateway", "DynamoDB"],
    postedDate: "Just now"
  },
  {
    id: 5,
    title: "Mobile App Analytics Pipeline",
    overview: "Build analytics pipeline for mobile application data processing and visualization",
    technologies: ["Flutter", "Firebase", "BigQuery", "Python", "Data Studio"],
    postedDate: "2 weeks ago"
  },
  {
    id: 6,
    title: "Blockchain Integration Test",
    overview: "Test integration with blockchain networks for secure transactions",
    technologies: ["Solidity", "Web3.js", "Ethereum", "Node.js", "Truffle"],
    postedDate: "5 days ago"
  },
  {
    id: 7,
    title: "Machine Learning Model Deployment",
    overview: "Deploy ML models with scalable infrastructure and monitoring",
    technologies: ["Python", "TensorFlow", "Docker", "Kubernetes", "Grafana"],
    postedDate: "4 days ago"
  },
  {
    id: 8,
    title: "Progressive Web App (PWA) Implementation",
    overview: "Convert existing web app to PWA for offline capabilities and mobile experience",
    technologies: ["React", "Service Workers", "IndexedDB", "Web App Manifest"],
    postedDate: "1 week ago"
  }
];*/

const getTechColor = (tech: string) => {
  const techLower = tech.toLowerCase();
  if (techLower.includes('react') || techLower.includes('vue') || techLower.includes('angular') || techLower.includes('flutter')) {
    return 'bg-blue-50 text-blue-600 border-blue-200';
  }
  if (techLower.includes('node') || techLower.includes('express') || techLower.includes('nestjs')) {
    return 'bg-green-50 text-green-600 border-green-200';
  }
  if (techLower.includes('python') || techLower.includes('fastapi') || techLower.includes('django') || techLower.includes('tensorflow')) {
    return 'bg-yellow-50 text-yellow-600 border-yellow-200';
  }
  if (techLower.includes('aws') || techLower.includes('azure') || techLower.includes('gcp') || techLower.includes('firebase')) {
    return 'bg-orange-50 text-orange-600 border-orange-200';
  }
  if (techLower.includes('docker') || techLower.includes('kubernetes') || techLower.includes('grpc')) {
    return 'bg-indigo-50 text-indigo-600 border-indigo-200';
  }
  if (techLower.includes('postgres') || techLower.includes('mysql') || techLower.includes('mongodb') || techLower.includes('redis')) {
    return 'bg-purple-50 text-purple-600 border-purple-200';
  }
  return 'bg-gray-50 text-gray-600 border-gray-200';
};

export default function POCCardsWithData({ 
  searchText = "" 
}: POCCardProps) {
  const filteredPOCs = pocs.filter(poc => {
    const searchMatch = searchText === "" || 
      poc.title.toLowerCase().includes(searchText.toLowerCase()) ||
      poc.overview.toLowerCase().includes(searchText.toLowerCase()) ||
      poc.technologies.some(tech => tech.toLowerCase().includes(searchText.toLowerCase()));
    return searchMatch;
  });

  return (
    <div className="mt-8 mx-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title level={2} className="text-gray-900 mb-2">
            Proof of Concepts
          </Title>
          <Text className="text-gray-500 text-base">
            Explore and track experimental projects and technology validations
          </Text>
        </div>
        {/* Show Create POC button only when there are POCs */}
        {filteredPOCs.length > 0 && (
          <Button type="primary" icon={<PlusOutlined />}>
            Create POC
          </Button>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-8"></div>

      {/* Empty State */}
      {filteredPOCs.length === 0 ? (
        <Card 
          className="border-0 shadow-none bg-transparent min-h-[300px] flex flex-col justify-between"
        >
          {/* Top content */}
          <div className="text-center pt-12">
            <div className="mb-2">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <ExperimentOutlined className="text-4xl text-gray-400" />
              </div>
              <Title level={3} className="text-gray-900 mb-4">
                No POCs yet
              </Title>
              <Text className="text-gray-500 text-base block mb-8 max-w-md mx-auto">
                Start by creating a proof of concept to explore new technologies and validate ideas
              </Text>
              <Button 
                type="primary" 
                size="large"
                icon={<PlusOutlined />}
                className="h-12 px-8 text-base"
              >
                Add New POC
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPOCs.map((poc) => (
            <Card
              key={poc.id}
              className="rounded-lg border border-gray-200 hover:shadow-md transition-shadow hover:border-blue-300"
              bodyStyle={{ padding: '20px' }}
            >
              {/* POC Title */}
              <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-900 mb-3">
                  {poc.title}
                </h4>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {poc.overview}
                </p>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CodeOutlined className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Technologies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {poc.technologies.slice(0, 4).map((tech, index) => (
                    <span 
                      key={index} 
                      className={`text-xs px-3 py-1.5 rounded border ${getTechColor(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                  {poc.technologies.length > 4 && (
                    <span className="text-xs px-2 py-1.5 rounded border bg-gray-50 text-gray-600 border-gray-200">
                      +{poc.technologies.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Posted Date */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center text-gray-500 text-sm">
                  <ClockCircleOutlined className="mr-2 text-gray-400" />
                  <span>Posted {poc.postedDate}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}