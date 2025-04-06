import { useModal } from "@/hooks/use-modal-store"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formSchema = z.object({
    role: z.string().min(1, { message: "Role is Required" }),
    company: z.string().min(1, { message: "Company is Required" }),
    location: z.string(),
    techs: z.string().min(1, { message: "Techs are required!" }),
    descriptions: z.string().array(),
    startDate: z.date({
        required_error: "Start date is required",
    }),
    currentlyWorking: z.boolean(),
    endDate: z.date()
}).superRefine((data, ctx) => {
    if (data.endDate <= data.startDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after the start date",
            path: ["endDate"]
        });
    }
});

export const AddWorkExpModal = () => {

    const { isOpen, type, onClose } = useModal();
    const router = useRouter();
    const isModalOpen = isOpen && type === 'addWorkExp';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: '',
            company: '',
            location: '',
            techs: '',
            descriptions: [],
            currentlyWorking: false,
            startDate: new Date(),
            endDate: new Date(),
        }
    })

    const [descriptionInput, setDescriptionInput] = useState("");

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("VALUES", values);
        try {
            const response = await axios.post('/api/admin/work-exp', values)
            if (response.status === 201) {
                onClose();
                form.reset()
                router.refresh();
            }
        } catch (error) {
            console.log("ERROR SUBMITING WORK EXPERIENCE ", error);
        }
    }

    const handleAddDescription = () => {
        if (descriptionInput.trim() !== "") {
            form.setValue("descriptions", [...form.getValues("descriptions"), descriptionInput]);
            setDescriptionInput(""); // Clear input field after adding
        }
    };

    const handleClose = () => {
        form.reset()
        onClose()
    }

    const isSubmitting = form.formState.isSubmitting;

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose} >
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-h-[80vh] overflow-y-auto">
                <DialogHeader className="mb-4">
                    <DialogTitle>
                        Add Work Experience
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='space-y-4'>
                                <FormField
                                    name='role'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Role
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Software Developer"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name='company'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Company
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Microsoft"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="currentlyWorking"
                                    render={({ field }) => (
                                        <FormItem className="flex w-full items-center ">
                                            <FormControl>
                                                <Checkbox
                                                    className="ml-auto"
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="">
                                                <FormLabel>
                                                    Currently Working
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name='location'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Location <span className=" opacity-70 text-xs">(optional)</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Mumbai or Remote"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name='techs'
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Techs
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="React, Node, Express"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <FormLabel>
                                        Descriptions
                                    </FormLabel>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <Input
                                            value={descriptionInput}
                                            onChange={(e) => setDescriptionInput(e.target.value)}
                                            placeholder="Enter a description"
                                        />
                                        <Button
                                            type="button"
                                            className=" cursor-pointer"
                                            onClick={handleAddDescription}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </div>

                                {form.getValues("descriptions").length > 0 && <div className="mt-4">
                                    <ul className="list-disc ml-4">
                                        {form.getValues("descriptions").map((desc, index) => (
                                            <li key={index} className="text-sm text-muted-foreground">
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>
                                </div>}
                                <div className="grid grid-cols-2 gap-6 items-start w-full">
                                    <FormField
                                        name='startDate'
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Start Date
                                                </FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    " pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick Start date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        {/* <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        /> */}
                                                        <DatePicker
                                                            selected={field.value}
                                                            onChange={field.onChange}
                                                            dateFormat="yyyy/MM/dd"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name='endDate'
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Location <span className=" opacity-70 text-xs">(optional)</span>
                                                </FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    " pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick End date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        {/* <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        /> */}
                                                        <DatePicker
                                                            selected={field.value}
                                                            onChange={field.onChange}
                                                            dateFormat="yyyy/MM/dd"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="mt-4">
                                <Button disabled={isSubmitting} type="submit" className=" cursor-pointer">Submit</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}