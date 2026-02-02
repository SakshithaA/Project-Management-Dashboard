import { useParams } from "react-router-dom";
import ProjectDetail from "../components/project/ProjectDetails";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const projectId = parseInt(id || "1");

  return <ProjectDetail projectId={projectId} />;
}