import "@/styles/globals.css";
import { NextAuthProvider } from "./providers";

export const metadata = {
    title: "Vote App",
    description: "Aplikasi voting by Muhammad Haykal",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="text-white bg-slate-900">
                <main>
                    <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                        <NextAuthProvider>{children}</NextAuthProvider>
                    </div>
                </main>
            </body>
        </html>
    );
}
