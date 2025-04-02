'use client'

import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'


const formSchema = z.object({
    email: z.string().email("Enter valid email").min(1, { message: "Email is required!" }),
    password: z.string().min(1, {
        message: "Password is required"
    })
})

export const LoginForm = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    },[])

    

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ''
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {

    }

    if(!isMounted) return null

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='space-y-8 px-6 w-full'>
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
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='cursor-pointer '>
                        Login
                    </Button>
                </div>
            </form>
        </Form>
    )
}