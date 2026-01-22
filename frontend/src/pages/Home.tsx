import { Input, Tag } from "antd";
import StatsCards from "../components/StatsCards";
import Navbar from "../components/Navbar";
import ProjectCards from "../components/projectcard";

const { Search } = Input;

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="bg-white rounded-xl p-6 mt-0 shadow-sm">
        <Navbar />
      </div>
      
      {/* Stats Cards */}
      <StatsCards />

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 mt-6 shadow-sm border border-gray-100 mx-5">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <Search
            placeholder="Search projects by name, client, or description..."
            className="w-full"
            size="large"
            allowClear
          />
        </div>

        <div className="mb-6 pb-2 border-b border-gray-100">
          <p className="font-semibold text-gray-800 mb-3">Project Type</p>
          <div className="flex flex-wrap gap-2">
            {["fullstack", "data engineering", "devops", "cloud", "mobile", "frontend", "backend"].map(
              (type) => (
                <Tag 
                  key={type} 
                  className="cursor-pointer px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-gray-700"
                >
                  {type}
                </Tag>
              )
            )}
          </div>
        </div>

        <div>
          <p className="font-semibold text-gray-800 mb-3">Status</p>
          <div className="flex flex-wrap gap-2">
            {["not started", "in progress", "on hold", "completed", "cancelled"].map(
              (status) => (
                <Tag 
                  key={status} 
                  className="cursor-pointer px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-gray-700"
                >
                  {status}
                </Tag>
              )
            )}
          </div>
        </div>
      </div>
      {/* Project Cards */}
      <ProjectCards />
    </div>
  );
}