import ScrollToTop from "@/components/scroll-to-top";
import { Footer } from "@/components/viewer/footer";
import { Navbar } from "@/components/viewer/Navbar/navbar";


export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full relative">
            <ScrollToTop />
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}