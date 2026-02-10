import { useState, useEffect } from "react";
import { Card, Button, Typography, Input, Empty, Spin } from "antd";
import { 
  ExperimentOutlined,
  CodeOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

const { Title, Text } = Typography;
const { Search } = Input;

export default function POCCards() {
  const [pocs, setPocs] = useState<any[]>([]);
  const [filteredPOCs, setFilteredPOCs] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchPOCs();
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredPOCs(pocs);
    } else {
      const filtered = pocs.filter(poc => 
        poc.title.toLowerCase().includes(searchText.toLowerCase()) ||
        poc.description.toLowerCase().includes(searchText.toLowerCase()) ||
        poc.technologies?.some((tech: string) => 
          tech.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredPOCs(filtered);
    }
  }, [searchText, pocs]);

  const fetchPOCs = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch both member POCs and standalone POCs
      const [standalonePOCs, teamMembers] = await Promise.all([
        api.getStandalonePOCs(),
        api.getTeamMembers()
      ]);

      // Combine both types of POCs
      const allPOCs = [...standalonePOCs.data];
      
      // For each team member, fetch their POCs
      for (const member of teamMembers.data) {
        try {
          const memberPOCs = await api.getMemberPOCs(member.id);
          const pocsWithMemberInfo = memberPOCs.data.map((poc: any) => ({
            ...poc,
            type: 'member',
            creatorName: member.name
          }));
          allPOCs.push(...pocsWithMemberInfo);
        } catch (err) {
          // Skip if member doesn't have POCs or error
          console.debug(`No POCs for member ${member.name}`);
        }
      }

      setPocs(allPOCs);
      setFilteredPOCs(allPOCs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load POCs');
      console.error('Error fetching POCs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTechColor = (tech: string) => {
    const techLower = tech.toLowerCase();
    if (techLower.includes('react') || techLower.includes('vue') || techLower.includes('angular') || techLower.includes('flutter')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (techLower.includes('node') || techLower.includes('express') || techLower.includes('nestjs')) {
      return 'bg-green-50 text-green-700 border-green-200';
    }
    if (techLower.includes('python') || techLower.includes('fastapi') || techLower.includes('django') || techLower.includes('tensorflow')) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
    if (techLower.includes('aws') || techLower.includes('azure') || techLower.includes('gcp') || techLower.includes('firebase')) {
      return 'bg-orange-50 text-orange-700 border-orange-200';
    }
    if (techLower.includes('docker') || techLower.includes('kubernetes') || techLower.includes('grpc')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    if (techLower.includes('postgres') || techLower.includes('mysql') || techLower.includes('mongodb') || techLower.includes('redis')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-9 bg-gray-50">
        <div className="mx-10">
          <LoadingSkeleton type="card" count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-9 bg-gray-50">
        <div className="mx-10 text-center py-12">
          <Title level={3} className="text-red-600 mb-4">Error Loading POCs</Title>
          <Text className="text-gray-700">{error}</Text>
          <Button 
            onClick={fetchPOCs} 
            className="mt-4"
            type="primary"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-9 bg-gray-50">
      <div className="mx-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Title level={2} className="text-gray-900 mb-2">
              Proof of Concepts
            </Title>
            <Text className="text-gray-700 text-base font-medium">
              Explore and track experimental projects and technology validations
            </Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            onClick={() => navigate('/addpoc')}
          >
            Add New POC
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <Search
            placeholder="Search POCs by title, description, or technology..."
            prefix={<SearchOutlined className="text-gray-500" />}
            allowClear
            size="large"
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            className="w-full max-w-2xl"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mb-8"></div>

        {/* Empty State */}
        {filteredPOCs.length === 0 ? (
          <Card 
            className="border-0 shadow-none bg-transparent min-h-[300px] flex flex-col justify-center"
          >
            <div className="text-center">
              <div className="mb-2">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6 shadow-sm">
                  <ExperimentOutlined className="text-4xl text-gray-500" />
                </div>
                <Title level={3} className="text-gray-900 mb-4">
                  {searchText ? 'No matching POCs found' : 'No POCs yet'}
                </Title>
                <Text className="text-gray-700 text-base block mb-8 max-w-md mx-auto font-medium">
                  {searchText ? 'Try a different search term' : 'Start by creating a proof of concept to explore new technologies and validate ideas'}
                </Text>
                {!searchText && (
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<PlusOutlined />}
                    className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 border-blue-600"
                    onClick={() => navigate('/addpoc')}
                  >
                    Add New POC
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPOCs.map((poc) => (
              <Card
                key={poc.id}
                className="rounded-lg border border-gray-300 hover:shadow-md transition-all duration-300 hover:border-blue-400 cursor-pointer shadow-sm"
                bodyStyle={{ padding: '20px' }}
                onClick={() => navigate(`/poc/${poc.id}`)}
              >
                {/* POC Title */}
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">
                    {poc.title}
                  </h4>
                  <p className="text-gray-700 text-sm line-clamp-2 font-medium">
                    {poc.description || poc.overview}
                  </p>
                  {poc.creatorName && (
                    <p className="text-gray-600 text-xs mt-1">
                      By: {poc.creatorName}
                    </p>
                  )}
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CodeOutlined className="text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">Technologies</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {poc.technologies?.slice(0, 4).map((tech: string, index: number) => (
                      <span 
                        key={index} 
                        className={`text-xs px-3 py-1.5 rounded border font-medium ${getTechColor(tech)}`}
                      >
                        {tech}
                      </span>
                    ))}
                    {poc.technologies?.length > 4 && (
                      <span className="text-xs px-2 py-1.5 rounded border bg-gray-50 text-gray-700 border-gray-200 font-medium">
                        +{poc.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Status and Date */}
                <div className="pt-4 border-t border-gray-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600 text-sm">
                      <ClockCircleOutlined className="mr-2 text-gray-500" />
                      <span className="font-medium">
                        {poc.createdAt ? new Date(poc.createdAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                    {poc.status && (
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${
                        poc.status === 'completed' ? 'bg-green-100 text-green-700' :
                        poc.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        poc.status === 'testing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {poc.status.replace('-', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredPOCs.length > 0 && (
          <div className="mt-6 text-center">
            <Text className="text-gray-600 text-sm font-medium">
              Showing {filteredPOCs.length} of {pocs.length} POCs
              {searchText && ` matching "${searchText}"`}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}