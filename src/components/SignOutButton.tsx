"use client"

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {signOut} from "@/lib/auth-client";
import {toast} from "sonner";
import {useState} from "react";
import {useSession} from "@/lib/auth-client";

const SignOutButton = () => {
    const {data: session} = useSession();
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleClick = async () => {
        await signOut({
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message)
                },
                onSuccess: () => {
                    toast.success("You've logged out. See you soon!");
                    router.push("/auth/login");
                }
            }
        });
    }

    if (!session) {
        return (
            <></>
        )
    }

    return (
        <Button
            onClick={handleClick}
            size="sm"
            variant="destructive"
            disabled={isPending}
            style={{cursor: 'pointer'}}
        >
            Sign Out
        </Button>
    );
};

export default SignOutButton;