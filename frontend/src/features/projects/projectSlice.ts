import { createSlice } from "@reduxjs/toolkit";

export interface Project {
  id: number;
  name: string;
  type: string;
  status: string;
}

interface ProjectState {
  projects: Project[];
}

const initialState: ProjectState = {
  projects: [
    { id: 1, name: "FullStack", type: "fullstack", status: "in progress" },
    { id: 2, name: "Data Pipeline", type: "data engineering", status: "completed" },
    { id: 3, name: "Mobile App", type: "mobile", status: "in progress" },
    { id: 4, name: "Cloud Migration", type: "cloud", status: "in progress" },
    { id: 5, name: "DevOps Setup", type: "devops", status: "not started" },
  ],
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
});

export default projectSlice.reducer;
