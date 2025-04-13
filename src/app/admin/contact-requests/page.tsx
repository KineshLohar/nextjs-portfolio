import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ContactRequest from '@/models/ContactRequestModel'
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ContactRequestType } from "@/types/types";
import connectDB from "@/db/connectDB";

connectDB()

export default async function ContactRequests() {

    const cookiesStore = await cookies();
    const token = cookiesStore.get('token');

    if (!token) return redirect('/login');

    const contactRequests: ContactRequestType[] = await ContactRequest.find().sort({ createdAt: -1 })

    return (
        <div className="w-full min-h-screen flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Latest Contact Requests</h1>
            {
                contactRequests.length === 0 ?
                    <div>No contact requests found.</div>
                    :
                    <Table className=" overflow-auto">
                        <TableHeader>
                            <TableRow>
                                {['Full Name', 'Email', 'Description'].map((item, i) => (
                                    <TableCell key={i}>{item}</TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="">
                            {contactRequests?.map((req) => (
                                <TableRow key={req._id}>
                                    <TableCell className="py-4">{req.fullName}</TableCell>
                                    <TableCell className="py-4">{req.email}</TableCell>
                                    <TableCell className="py-4">{req.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            }
        </div>
    )
}