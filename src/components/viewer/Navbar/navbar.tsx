import Image from "next/image"
import Link from "next/link"
import React from "react"
import { Navbutton } from "./nav-button"
import { MobileMenu } from "./mobile-menu"

const routes = [
    {
        id: 1,
        path: '/',
        label: 'Home'
    },
    // {
    //     id: 2,
    //     path: '/work-experience',
    //     label: 'Work Exp'
    // },
    {
        id: 3,
        path: '/projects',
        label: 'Projects'
    },
    {
        id: 4,
        path: '/educations-certifications',
        label: 'Edu & Cert'
    },
    {
        id: 5,
        path: '/resume',
        label: 'Resume'
    },
    // {
    //     id: 6,
    //     path: '/contact',
    //     label: 'Contact'
    // },

]

export const Navbar = () => {
    return (
        <div className="absolute top-0 right-0 left-0 z-[999] w-full h-20 flex items-center justify-between bg-transparent px-2 sm:px-8 md:px-10 lg:px-16 transition-all duration-300">
            <Link href='/' className="relative h-16 w-20 cursor-pointer">
                <Image
                    src='/kineshlohar.png'
                    alt="Kinesh Lohar"
                    fill
                    className=" object-contain"
                />
            </Link>
            <div className="hidden ml-auto md:flex items-center justify-between gap-5 lg:gap-6 xl:gap-8 text-xs lg:text-sm 2xl:text-base uppercase transition-all duration-300">
                {
                    routes?.map((route) => (
                        <React.Fragment key={route.id}>
                           <Navbutton route={route} />
                            {/* {index !== routes?.length -1 && <span className=" text-xs text-zinc-600/70">•</span>} */}
                        </React.Fragment>
                    ))
                }
            </div>
            <div className="p-2 md:ml-4 rounded-full bg-transparent flex items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                <MobileMenu routes={routes} />
                {/* <ActionTooltip label="Contact Us" side="bottom">
                    <Link href='/contact' className="bg-gradient-to-r from-blue-500 to-pink-500 rounded-full p-[2px]">
                        <MessageSquare className=" fill-current w-9 h-9 p-1.5 bg-zinc-900  rounded-full cursor-pointer" />
                    </Link>
                </ActionTooltip> */}
            </div>

        </div>
    )
}