
import { Skill } from "@/types/types"
import { ActionDropdownList } from "../action-dropdown-list"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table"


export default function SkillsTable({ skillsList }: { skillsList: Skill[] }) {

    return (
        <div className="w-full h-full">
            <Table className=" overflow-auto">
                <TableHeader>
                    <TableRow>
                        {['Skill', 'Level', 'Type', 'Actions'].map((item, i) => (
                            <TableCell key={i}>{item}</TableCell>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className="">
                    {skillsList?.map((skill) => (
                        <TableRow key={skill._id}>
                            <TableCell className="py-4">{skill.skill}</TableCell>
                            <TableCell className="py-4">{skill.level}</TableCell>
                            <TableCell className="py-4">{skill.type}</TableCell>
                            <TableCell className="py-4">
                                <ActionDropdownList
                                    dataKey="skillData"
                                    data={JSON.stringify(skill)}
                                    editModal="editSkill"
                                    deleteModal="deleteSkill"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}