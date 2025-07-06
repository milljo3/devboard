"use client"

import {useEffect, useState} from "react";
import {Application} from "@/types/applications";
import {ApplicationCard} from "@/components/ApplicationCard";
import SearchApplicationForm from "@/components/SearchApplicationForm";
import ApplicationsPagination from "@/components/ApplicationsPagination";
import {ApplicationDialog} from "@/components/ApplicationDialog";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";
import ApplicationsTitles from "@/components/ApplicationsTitles";

const PAGE_SIZE = 8;

const Applications = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isPending, setIsPending] = useState(false);

    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const router = useRouter();

    const fetchApplications = async () => {
        setIsPending(true);
        try {
            const response = await fetch(`/api/applications?page=${page}`);
            const data = await response.json();
            setApplications(data.applications);
            setTotalCount(data.totalCount);
            return data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
        finally {
            setIsPending(false);
        }
    }

    useEffect(() => {
        const load = async () => {
            const data = await fetchApplications();

            const totalPages = Math.ceil((data?.totalCount || 0) / PAGE_SIZE);

            if (data && page > totalPages && totalPages > 0) {
                router.push(`?page=${totalPages}`);
            }
        };
        load();
    }, [page])

    const handleAddApplication = () => {
        router.push("?page=1");
        fetchApplications();
    }

    const handleEditApplication = async (application?: Application) => {
        if (!application) return;

        const previousApplications = [...applications];
        const index = previousApplications.findIndex(app => app.id === application.id);

        if (index === -1) return;

        const newApplications = [...previousApplications];
        newApplications[index] = application;
        setApplications(newApplications);

        try {
            const res = await fetch(`/api/applications/${application.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(application),
            });

            if (!res.ok) throw new Error();

            toast.success("Application updated successfully.");

            await fetchApplications();
        }
        catch (error) {
            console.error(error);
            toast.error("Error adding application");
            setApplications(previousApplications);
        }
    }

    const handleDeleteApplication = async (applicationId: string) => {
        try {
            const res = await fetch(`/api/applications/${applicationId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error();

            toast.success("Application deleted successfully.");

            const data = await fetchApplications();

            const totalPages = Math.ceil((data?.totalCount || 0) / PAGE_SIZE);

            if (data && data.applications.length === 0 && page > 1) {
                router.push(`?page=${totalPages}`);
            }
        }
        catch (error) {
            console.error(error);
            toast.error("Error deleting application");
        }
    };


    const handleSearch = () => {

    }

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <div className="w-full flex flex-col items-center gap-4 mt-4">
            <div className="flex gap-4">
                <ApplicationDialog onSave={handleAddApplication} mode="add"/>
                <SearchApplicationForm onSearch={handleSearch} isPending={isPending} />
            </div>
            {isPending ? (
                <div>Loading...</div>
            ) : (
                <>

                    <div className="grid grid-cols-1 gap-2 place-items-center md:w-2/3 w-full">
                        <ApplicationsTitles />
                        {applications.map((application: Application) => (
                            <ApplicationCard
                                application={application}
                                key={application.id}
                                onDelete={handleDeleteApplication}
                                onEdit={handleEditApplication}
                            />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <ApplicationsPagination
                            currentPage={page}
                            totalPages={totalPages}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Applications;