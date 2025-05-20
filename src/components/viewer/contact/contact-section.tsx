import { ContactForm } from "./contact-form"

export const ContactSection = () => {

    return (
        <div id="contact" className="w-full py-16 flex flex-col items-stretch sm:items-center justify-center font-lato ">
            <div className="sm:w-8/12 md:w-6/12 sm:mx-auto sm:text-center px-4  transition-all duration-300">

                <h2 className="fade-up text-2xl italic md:text-4xl mb-4 font-breeserif dark:text-white bg-gradient-to-br from-zinc-50 to-neutral-200 bg-clip-text text-transparent max-w-4xl transition-all duration-300">
                    The Next Big Thing Starts Here
                </h2>
                <p className="fade-up text-neutral-700 md:mx-auto dark:text-neutral-300 text-sm md:text-base max-w-sm md:max-w-md transition-all duration-300">
                    Feel free to reach out—whether it’s for a collaboration, project, or just to chat tech.
                </p>
            </div>
            <ContactForm />
        </div>
    )
}