"use client"

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {sendVerificationEmail} from "@/lib/auth-client";

const SendVerificationEmailForm = () => {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = String(formData.get("email"));
        if (!email) {
            return toast.error("Please enter a valid email");
        }

        await sendVerificationEmail({
            email,
            callbackURL: "/auth/verify",
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("Verification email successfully sent.");
                    router.push("/auth/verify/success");
                }
            }
        })
    }


    return (
        <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" />
            </div>
            <Button type="submit" disabled={isPending}>
                Resend Verification Email
            </Button>
        </form>
    );
};

export default SendVerificationEmailForm;