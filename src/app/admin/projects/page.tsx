import { ActionDropdownList } from "@/components/action-dropdown-list";
import { OpenModalButton } from "@/components/open-modal-button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import connectDB from "@/db/connectDB";
import ProjectModel from "@/models/ProjectsModel";
import { ProjectType } from "@/types/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

connectDB()

export default async function Projects() {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('token');

    if (!token) return redirect('/login');

    const projectsList: ProjectType[] = await ProjectModel.find();

    return (
        <div className="w-full h-full flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold mb-4">Projects</h1>
                <OpenModalButton modelType='addProject' label="Add Project" />
            </div>
            <div className="min-h-screen w-full">
                {
                    projectsList.length < 1
                        ?
                        <div>No Projects found.</div>
                        :
                        <Table className=" overflow-auto">
                            <TableHeader>
                                <TableRow>
                                    {['Title', 'Demo', 'Repo', 'Techs', 'Actions'].map((item, i) => (
                                        <TableCell key={i}>{item}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="">
                                {projectsList?.map((proj) => (
                                    <TableRow key={proj?._id}>
                                        <TableCell className="py-4">{proj?.title}</TableCell>
                                        <TableCell className="py-4">{proj?.demoLink}</TableCell>
                                        <TableCell className="py-4">{proj?.repoLink}</TableCell>
                                        <TableCell className="py-4">{proj?.techs}</TableCell>
                                        <TableCell className="py-4">
                                            <ActionDropdownList
                                                dataKey='projectData'
                                                data={JSON.stringify(proj)}
                                                editModal="editProject"
                                                deleteModal="deleteProject"

                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                }
            </div>
        </div>
    )
}