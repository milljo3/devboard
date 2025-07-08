"use client"

import {Application} from "@/types/applications";

import Link from "next/link";
import {ApplicationDialog} from "@/components/ApplicationDialog";
import {Button} from "@/components/ui/button";
import {TrashIcon} from "lucide-react";
import {StatusSelector} from "@/components/StatusSelector";
import {ApplicationStatus} from "@prisma/client";

interface ApplicationCardProps {
    application: Application;
    onDelete: (applicationId: string) => void;
    onEdit: (updatedFields: Partial<Application>) => void;
}

export const ApplicationCard = ({ application, onDelete, onEdit }: ApplicationCardProps) => {
    const handleDelete = () => {
        onDelete(application.id);
    }

    const handleStatusChange = (status: ApplicationStatus) => {
        onEdit({
            ...application,
            status,
        });
    };

    const appliedAtString = application.appliedAt
        ? new Date(application.appliedAt).toLocaleDateString("en-US")
        : "";
    const updatedAtString = application.updatedAt
        ? new Date(application.updatedAt).toLocaleDateString("en-US")
        : "";

    return (
        <div
            className="w-full border rounded-md shadow-sm flex flex-col items-center justify-center relative"
        >
            <div className="flex gap-1 justify-between w-full px-2">
                <ApplicationDialog mode={"edit"} onEdit={onEdit} />
                <Button
                    size={"icon"}
                    variant="destructive"
                    className="w-5 h-5"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this application?')) {
                            handleDelete();
                        }
                    }}
                >
                    <TrashIcon />
                </Button>
            </div>
            <div
                className="
                    grid
                    w-full
                    items-center
                    px-4
                    pt-1
                    gap-2
                    text-sm
                    grid-cols-[3fr_3fr_2fr]
                    md:grid-cols-[2fr_2fr_1fr_1fr_1fr]
                    justify-center
                  "
            >
                <div>
                    {application.companyUrl ? (
                        <Link
                            href={application.companyUrl}
                            className="truncate whitespace-normal break-words hover:underline"
                        >
                            {application.company}
                        </Link>
                    ) : (
                        <div className="truncate whitespace-normal break-words">
                            {application.company}
                        </div>
                    )}
                </div>
                <div>
                    {application.applicationUrl ? (
                        <Link
                            href={application.applicationUrl}
                            className="truncate whitespace-normal break-words hover:underline"
                        >
                            {application.position}
                        </Link>
                    ) : (
                        <div className="truncate whitespace-normal break-words">
                            {application.position}
                        </div>
                    )}
                </div>

                <p className="hidden md:block truncate">{appliedAtString}</p>
                <p className="hidden md:block truncate">{updatedAtString}</p>
                <StatusSelector defaultStatus={application.status} onSelect={handleStatusChange} />
            </div>
        </div>
    );
};


