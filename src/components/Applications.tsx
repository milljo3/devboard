"use client"

import {Application} from "@/types/applications";
import {ApplicationCard} from "@/components/ApplicationCard";
import ApplicationsPagination from "@/components/ApplicationsPagination";
import {ApplicationDialog} from "@/components/ApplicationDialog";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";
import ApplicationsTitles from "@/components/ApplicationsTitles";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

const PAGE_SIZE = 8;

const Applications = () => {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const sortField = searchParams.get("sortField") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const router = useRouter();
    const queryClient = useQueryClient();

    const queryKey = ["applications", {page, sortField, sortOrder}];

    const {data, isLoading,} = useQuery({
        queryKey,
        queryFn: async () => {
            const res = await fetch(`/api/applications?page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`);
            if (!res.ok) throw new Error("Failed to fetch applications.");
            return res.json();
        },
    });

    const totalPages = Math.ceil((data?.totalCount || 0) / PAGE_SIZE);

    if (data?.applications.length === 0 && page > 1 && totalPages > 0) {
        router.push(`?page=${totalPages}`);
    }

    const editMutation = useMutation({
        mutationFn: async (application: Partial<Application>) => {
            const res = await fetch(`/api/applications/${application.id}`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(application),
            });
            if (!res.ok) throw new Error("Failed to update application.");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Application updated successfully.");
            queryClient.invalidateQueries({queryKey: ["applications"]});
        },
        onError: () => {
            toast.error("Failed to update application.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (applicationId: string) => {
            const res = await fetch(`/api/applications/${applicationId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete application.");
        },
        onSuccess: () => {
            toast.success("Application deleted successfully.");
            queryClient.invalidateQueries({queryKey: ["applications"]});
        },
        onError: () => {
            toast.error("Failed to delete application.");
        }
    })

    const handleAddApplication = () => {
        router.push("?page=1");
        queryClient.invalidateQueries({queryKey: ["applications"]});
    }

    const handleEditApplication = async (updatedFields: Partial<Application>) => {
        editMutation.mutate(updatedFields);
    }

    const handleDeleteApplication = async (applicationId: string) => {
        deleteMutation.mutate(applicationId)
    };


    return (
        <div className="w-full flex flex-col items-center gap-4 mt-4">
            <div className="flex gap-4">
                <ApplicationDialog onAdd={handleAddApplication} mode="add"/>
            </div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>

                    <div className="grid grid-cols-1 gap-2 place-items-center md:w-2/3 w-full">
                        <ApplicationsTitles />
                        {data?.applications.map((application: Application) => (
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