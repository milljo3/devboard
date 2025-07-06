"use client"

import {Application} from "@/types/applications";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react";
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
    const [isOpen, setIsOpen] = useState(false);

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
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full border rounded-md shadow-sm flex flex-col items-center justify-center relative"
        >
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
                    <Link
                        href={application.companyUrl ?? ""}
                        className="truncate whitespace-normal break-words"
                    >
                        {application.company}
                    </Link>
                </div>
                <div>
                    <Link
                        href={application.applicationUrl ?? ""}
                        className="truncate whitespace-normal break-words"
                    >
                        {application.position}
                    </Link>
                </div>

                <p className="hidden md:block truncate">{appliedAtString}</p>
                <p className="hidden md:block truncate">{updatedAtString}</p>
                <StatusSelector defaultStatus={application.status} onSelect={handleStatusChange} />
            </div>
            <CollapsibleContent className="px-4 py-2 text-sm text-muted-foreground">
                Extra details here.
            </CollapsibleContent>
            <CollapsibleTrigger className="text-xs px-4 py-1 text-muted-foreground underline self-center">
                {!isOpen ? "View More" : "View Less"}
            </CollapsibleTrigger>
            <div className="absolute bottom-0 right-2 flex gap-1">
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
        </Collapsible>
    );
};


