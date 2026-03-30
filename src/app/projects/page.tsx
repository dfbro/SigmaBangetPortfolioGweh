
import { listProjects } from "@/lib/server-storage"
import { ProjectsClient } from "./ProjectsClient"

export const revalidate = 300

export default async function ProjectsPage() {
  const projects = await listProjects().catch(() => [])

  return <ProjectsClient initialProjects={projects} />
}
