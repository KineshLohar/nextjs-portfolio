import { ActionDropdownList } from "@/components/action-dropdown-list";
import { OpenModalButton } from "@/components/open-modal-button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import connectDB from "@/db/connectDB";
import EduCert from "@/models/EduCertModel";
import { EduCertType } from "@/types/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

connectDB()

export default async function EducationCertifications() {

    const cookiesStore = await cookies();
    const token = cookiesStore.get('token');

    if (!token) return redirect('/login');

    const eduAndCertList: EduCertType[] = await EduCert.find();

    return (
        <div className="w-full h-full flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <div className="flex w-full items-center justify-end">
                <OpenModalButton modelType='addEduOrCert' label="Add Edu or Cert" />
            </div>
            <div className="h-full w-full min-h-screen">
                {
                    !eduAndCertList || eduAndCertList?.length < 1
                        ?
                        <div className="w-full text-center">No Data Found</div>
                        :

                        <Table className=" overflow-auto">
                            <TableHeader>
                                <TableRow>
                                    {['Title', 'Description', 'Type', 'Actions'].map((item, i) => (
                                        <TableCell key={i}>{item}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="">
                                {eduAndCertList?.map((item: EduCertType) => (
                                    <TableRow key={item._id}>
                                        <TableCell className="py-4 max-w-60 whitespace-normal break-words">{item.title}</TableCell>
                                        <TableCell className="py-4 whitespace-pre-line break-words min-w-40 max-w-xs">{item.description}</TableCell>
                                        <TableCell className="py-4">{item.type}</TableCell>
                                        <TableCell className="py-4">
                                            <ActionDropdownList
                                                dataKey="eduAndCertData"
                                                data={JSON.stringify(item)}
                                                editModal="editEduOrCert"
                                                deleteModal="deleteEduOrCert"
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