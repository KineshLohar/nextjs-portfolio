'use client';

import { FadeUp } from "@/components/animations/fadeup-gsap";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { SendHorizonal } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"


const formSchema = z.object({
    fullName: z.string().min(1, "Full Name is Required!"),
    email: z.string().email("Please enter valid email!").min(1, "Email is required!"),
    message: z.string().min(1, "Message is required!")
})

export const ContactForm = () => {

    const [isMounted, setIsMounted] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
            message: ''
        }

    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/contact', values);
            // console.log("RES OF CONTACT", res);
            form.reset();
            setSuccessMessage(true);
            setTimeout(() => {
                setSuccessMessage(false);
            }, 10000)

        } catch (error) {
            console.log("ERROR SENDING CONTACT REQUEST", error);
        }
    }

    const isSubmitting = form.formState.isSubmitting

    if (!isMounted) return null;

    return (
        <>
            {
                successMessage &&
                <div className="text-green-500 px-4 md:text-center mt-8 font-medium text-xs md:-mb-8">
                    🎉 Your message has been sent successfully! I will get back to you soon.
                </div>

            }
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 items-stretch p-4 mt-8 md:mt-16 sm:w-8/12 md:w-6/12 transition-all duration-300"
                >
                    <FormField
                        name="fullName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                                    <FormLabel>Full Name</FormLabel>
                                </FadeUp>
                                <FormControl>
                                    <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                                        <Input placeholder="Your Name" {...field}
                                            disabled={isSubmitting}
                                            className="italic border-t-0 border-x-0 border-b-2 rounded-none bg-transparent 
                                        focus-visible:ring-0 dark:bg-transparent px-0"
                                        />
                                    </FadeUp>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FadeUp delay={0.7} duration={0.5} yOffset={50}>

                                    <FormLabel>Email</FormLabel>
                                </FadeUp>

                                <FormControl>
                                    <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                                        <Input placeholder="johncena@gmail.com" {...field}
                                            disabled={isSubmitting}
                                            className=" italic text-white border-t-0 border-x-0 border-b-2 rounded-none bg-transparent 
                                        focus-visible:ring-0  dark:bg-transparent px-0"
                                        />
                                    </FadeUp>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="message"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FadeUp delay={0.7} duration={0.5} yOffset={50}>

                                    <FormLabel>Message</FormLabel>
                                </FadeUp>
                                <FormControl>
                                    <FadeUp delay={0.7} duration={0.5} yOffset={50}>

                                        <Textarea
                                            placeholder="Describe your message..."
                                            disabled={isSubmitting}
                                            {...field}
                                            className="italic resize-none text-white border-t-0 border-x-0 border-b-2 rounded-none bg-transparent 
                                        focus-visible:ring-0  dark:bg-transparent px-0"
                                        />
                                    </FadeUp>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full flex items-center justify-end">
                        <FadeUp delay={0.7} duration={0.5} yOffset={50}>
                            <Button type="submit" disabled={isSubmitting}
                                className="capitalize bg-transparent hover:bg-transparent text-white rounded-none relative group text-xs md:text-sm border hover:text-neutral-950 border-zinc-400 px-6 py-2 font-bold tracking-wider cursor-pointer overflow-hidden"
                            >
                                <div className="absolute -z-10 inset-0 -translate-x-full group-hover:translate-x-0 group-hover:bg-zinc-300 transition-all duration-300" />
                                <span className="z-10 group-hover:text-neutral-950 flex gap-2 items-center"><SendHorizonal className="w-4 h-4" />{isSubmitting ? 'Just a Moment...' : "Let's Connect!"}</span>
                            </Button>
                        </FadeUp>
                    </div>

                </form>
            </Form>
        </>
    )
}