'use client'

import { Marquee } from "@/lib/marquee";
import { SocialsCard } from "./socials-card";



export default function SocialsMaarquee() {

    return (
        <Marquee pauseOnHover className="h-[300px] flex items-center">
            <SocialsCard label="Instagram" />
            <SocialsCard label="Github" />
            <SocialsCard label="X" />
            <SocialsCard label="Linkedin" />
            <SocialsCard label="Instagram" />
            <SocialsCard label="Github" />
            <SocialsCard label="X" />
            <SocialsCard label="Linkedin" />
            <SocialsCard label="Instagram" />
            <SocialsCard label="Github" />
            <SocialsCard label="X" />
            <SocialsCard label="Linkedin" />
        </Marquee>
    )
}