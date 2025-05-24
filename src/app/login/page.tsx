
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
            <Card className="w-[350px]  dark:bg-zinc-700/30">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    )
}