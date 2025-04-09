
import { WorkExperienceTypes } from "@/types/types"
import { format } from "date-fns"
import { ActionDropdownList } from "../action-dropdown-list"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"


export default function WorkExpTable({ experienceList }: { experienceList: WorkExperienceTypes[] }) {

    return (
        <div className="w-full h-full">
            <Table className=" overflow-auto">
                <TableHeader>
                    <TableRow>
                        {['Role', 'Company', 'Start Date', 'Currently Working', 'End Date', 'Actions'].map((item, i) => (
                            <TableCell key={i}>{item}</TableCell>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className="">
                    {experienceList?.map((exp) => (
                        <TableRow key={exp._id}>
                            <TableCell className="py-4">{exp.role}</TableCell>
                            <TableCell className="py-4">{exp.company}</TableCell>
                            <TableCell className="py-4">{format(new Date(exp.startDate), 'dd MMM yyyy')}</TableCell>
                            <TableCell className="py-4">{exp.currentlyWorking ? <span className="bg-green-500 p-2 px-4 rounded-lg">Working</span> : <span>Past</span>}</TableCell>
                            <TableCell className="py-4">{!exp.currentlyWorking ? format(new Date(exp.endDate), 'dd MMM yyyy') : "N/A"}</TableCell>
                            <TableCell className="py-4">
                                <ActionDropdownList
                                    dataKey="workExperienceData"
                                    data={JSON.stringify(exp)}
                                    viewModal="viewWorkExp"
                                    editModal="editWorkExp"
                                    deleteModal="deleteWorkExp"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}