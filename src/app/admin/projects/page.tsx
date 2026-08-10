import { ActionDropdownList } from "@/components/action-dropdown-list";
import { OpenModalButton } from "@/components/open-modal-button";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getProjects } from "@/lib/data/project";

export default async function Projects() {
    const response = await getProjects();

    if (!response.success) {
        return (
            <div className="flex min-h-[400px] items-center justify-center p-4">
                <p className="text-sm text-red-500">
                    {response.error}
                </p>
            </div>
        );
    }

    const projectsList = response.data;

    return (
        <div className="w-full h-full flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold mb-4">
                    Projects
                </h1>

                <OpenModalButton
                    modelType="addProject"
                    label="Add Project"
                />
            </div>

            <div className="min-h-screen w-full">
                {projectsList.length === 0 ? (
                    <div>No Projects found.</div>
                ) : (
                    <Table className="overflow-auto">
                        <TableHeader>
                            <TableRow>
                                {[
                                    "Title",
                                    "Demo",
                                    "Repo",
                                    "Techs",
                                    "Actions",
                                ].map((item) => (
                                    <TableCell key={item}>
                                        {item}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {projectsList.map((project) => (
                                <TableRow key={project._id}>
                                    <TableCell className="py-4">
                                        {project.title}
                                    </TableCell>

                                    <TableCell className="py-4 max-w-60 truncate">
                                        {project.demoLink ?? "N/A"}
                                    </TableCell>

                                    <TableCell className="py-4">
                                        {project.repoLink ?? "N/A"}
                                    </TableCell>

                                    <TableCell className="py-4 max-w-60 break-words whitespace-normal">
                                        {project.techs
                                            .map(
                                                (tech) =>
                                                    tech.skill
                                            )
                                            .join(", ")}
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <ActionDropdownList
                                            dataKey="projectData"
                                            data={JSON.stringify(
                                                project
                                            )}
                                            editModal="editProject"
                                            deleteModal="deleteProject"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}