'use client'

import ScrollToTop from "@/components/scroll-to-top";
import { Footer } from "@/components/viewer/footer";
import { Navbar } from "@/components/viewer/Navbar/navbar";
import dynamic from "next/dynamic";
const FadeUpBatcher = dynamic(
    () => import("@/components/animations/fadeup-batcher"),
    { ssr : false}
);


export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full relative">
            <FadeUpBatcher />
            <ScrollToTop />
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}