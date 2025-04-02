
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login(){
    return (
        <div className="w-full h-screen flex items-center justify-center bg-zinc-700 text-white">
            <Card className="w-[350px] bg-black text-white">
                <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    )
}