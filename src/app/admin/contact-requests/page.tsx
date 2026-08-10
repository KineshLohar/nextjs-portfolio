import { ActionDropdownList } from "@/components/action-dropdown-list";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getContactRequests } from "@/lib/data/contact-requests";

export default async function ContactRequests() {
    const response = await getContactRequests();

    if (!response.success) {
        return (
            <div className="flex min-h-[400px] items-center justify-center p-4">
                <p className="text-sm text-red-500">
                    {response.error}
                </p>
            </div>
        );
    }

    const contactRequests = response.data;

    return (
        <div className="w-full min-h-screen flex flex-col gap-4 bg-gray p-4 bg-white border-b dark:bg-zinc-900/70 text-black dark:text-white">
            <h1 className="text-2xl font-bold mb-4">
                Latest Contact Requests
            </h1>

            {contactRequests.length === 0 ? (
                <div>
                    No contact requests found.
                </div>
            ) : (
                <Table className="overflow-auto">
                    <TableHeader>
                        <TableRow>
                            {[
                                "Full Name",
                                "Email",
                                "Description",
                                "Action",
                            ].map((item) => (
                                <TableCell key={item}>
                                    {item}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {contactRequests.map((request) => (
                            <TableRow key={request._id}>
                                <TableCell className="py-4">
                                    {request.fullName}
                                </TableCell>

                                <TableCell className="py-4">
                                    {request.email}
                                </TableCell>

                                <TableCell className="py-4">
                                    {request.message}
                                </TableCell>

                                <TableCell className="py-4">
                                    <ActionDropdownList
                                        dataKey="contactData"
                                        data={JSON.stringify(
                                            request
                                        )}
                                        deleteModal="deleteContact"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}