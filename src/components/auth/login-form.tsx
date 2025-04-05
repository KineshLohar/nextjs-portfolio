'use client'

import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/hooks/use-profile-hook'


const formSchema = z.object({
    email: z.string().email("Enter valid email").min(1, { message: "Email is required!" }),
    password: z.string().min(1, {
        message: "Password is required"
    })
})

export const LoginForm = () => {

    const router = useRouter();
    const { setAuth } = useProfile();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ''
        }
    })

    const isSubmitting = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/login", values)
            if (response.status === 200) {
                setAuth(response?.data?.token, response?.data?.user)
                router.push('/admin/work-experience')
            }

        } catch (error) {
            console.log("ERROR LOGIN ", error);

        }
    }

    if (!isMounted) return null

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='space-y-8 px-6 w-full '>
                    <FormField
                        name='email'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter your email'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name='password'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='********'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex w-full items-center justify-end'>
                        <Button
                            type='submit'
                            disabled={isSubmitting}
                            className='cursor-pointer '
                        >
                            Login
                        </Button>
                    </div>

                </div>
            </form>
        </Form>
    )
}