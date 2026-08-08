
import FadeUpBatcher from "@/components/animations/fadeup-batcher";
import ScrollToTop from "@/components/scroll-to-top";
import { Footer } from "@/components/viewer/footer";
import { Navbar } from "@/components/viewer/Navbar/navbar";
import { Suspense } from "react";
export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full relative">
            <Suspense>
                <FadeUpBatcher />
            </Suspense>
            <ScrollToTop />
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}