import Applications from "@/components/Applications";
import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

const Page = async () => {
    const headersList = await headers()

    const session = await auth.api.getSession({
        headers: headersList
    });

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="flex items-center justify-center h-max mt-16 overflow-y-auto pb-4">
            <Applications username={session.user.name} />
        </div>
    );
};

export default Page;