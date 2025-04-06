'use client'

import { WorkExperienceTypes } from "@/types/types"
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow } from "../ui/table"
import { format } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Ellipsis, Eye, FilePenLine, Trash } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"


export default function WorkExpTable({ experienceList }: { experienceList: string }) {

    const { onOpen } = useModal();

    const experiences: WorkExperienceTypes[] = JSON.parse(experienceList);

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
                    {experiences?.map((exp) => (
                        <TableRow key={exp._id}>
                            <TableCell className="py-4">{exp.role}</TableCell>
                            <TableCell className="py-4">{exp.company}</TableCell>
                            <TableCell className="py-4">{format(new Date(exp.startDate), 'dd MMM yyyy')}</TableCell>
                            <TableCell className="py-4">{exp.currentlyWorking ? <span className="bg-green-500 p-2 px-4 rounded-lg">Working</span> : <span>Past</span>}</TableCell>
                            <TableCell className="py-4">{!exp.currentlyWorking ? format(new Date(exp.endDate), 'dd MMM yyyy') : "N/A"}</TableCell>
                            <TableCell className="py-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button type="button" variant='ghost' className=" cursor-pointer hover:bg-zinc-300/30 dark:hover:bg-zinc-300/30">
                                            <Ellipsis />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => onOpen("viewWorkExp", { WorkExperienceData: exp})} className="cursor-pointer">
                                            <Eye /> View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onOpen("editWorkExp", { WorkExperienceData: exp})} className="cursor-pointer">
                                            <FilePenLine /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onOpen("deleteWorkExp", { WorkExperienceData: exp})} className="text-rose-400 cursor-pointer">
                                            <Trash className="text-rose-400" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}