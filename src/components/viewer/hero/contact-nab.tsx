'use client'

import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react";

export const ContactNavButton = () => {

    const scrollToSection = (id: string) => {
            const element = document.getElementById(id)
            element?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <Button
            onClick={() => scrollToSection('contact')}
            className="uppercase flex items-center tracking-wider border-none bg-transparent text-zinc-300 hover:text-white hover:bg-transparent cursor-pointer"
        >
            Contact <ExternalLink className="ml-1 w-4 h-4" />
        </Button>
    )
}