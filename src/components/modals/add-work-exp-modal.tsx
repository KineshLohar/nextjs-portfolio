import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const formSchema = z.object({
    role: z.string().min(1, { message: "Role is Required" }),
    company: z.string().min(1, { message: "Company is Required" }),
    location: z.string(),
    techs: z.string().min(1, { message: "Techs are required!" }),
    descriptions: z.array(
        z.object({
            text: z.string().min(1, { message: "Description is required" })
        })
    ),
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
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "descriptions"
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("VALUES", values);
        try {
            const response = await axios.post('/api/admin/work-exp', values)
            if (response.status === 201) {
                onClose();
                form.reset()
                setTimeout(() => {
                    router.refresh();
                }, 0);
            }
        } catch (error) {
            console.log("ERROR SUBMITING WORK EXPERIENCE ", error);
        }
    }

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
                                    <div className="space-y-2 mt-2">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex items-center gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`descriptions.${index}.text`}
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Enter a description"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                >
                                                    X
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="w-full mt-2"
                                            onClick={() => append({ text: "" })}
                                        >
                                            Add Description
                                        </Button>
                                    </div>

                                    <FormMessage />
                                </div>
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