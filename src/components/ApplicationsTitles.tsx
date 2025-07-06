"use client"

import {useRouter, useSearchParams} from "next/navigation";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const sortableColumns = [
    { label: "Company", key: "company" },
    { label: "Position", key: "position" },
    { label: "Created", key: "appliedAt" },
    { label: "Updated", key: "updatedAt" },
    { label: "Status", key: "status" },
];

const ApplicationsTitles = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSortField = searchParams.get("sortField") || "updatedAt";
    const currentSortOrder = searchParams.get("sortOrder") || "desc";

    const handleSortClick = (field: string) => {
        const isSameField = currentSortField === field;
        const newOrder = isSameField && currentSortOrder === "asc" ? "desc" : "asc";

        const params = new URLSearchParams(searchParams.toString());
        params.set("sortField", field);
        params.set("sortOrder", newOrder);
        params.set("page", "1"); // reset to page 1 when changing sort

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="
          grid
          w-full
          px-4
          py-2
          text-sm
          font-medium
          border-b
          text-muted-foreground
          grid-cols-[3fr_3fr_2fr]
          md:grid-cols-[2fr_2fr_1fr_1fr_1fr]
          justify-center
        ">
            {sortableColumns.map(({ label, key }) => {
                const isActive = currentSortField === key;
                const isAsc = currentSortOrder === "asc";

                const showIcon = isActive;
                const Icon = isAsc ? ArrowUp : ArrowDown;

                const isHiddenMobile =
                    key === "appliedAt" || key === "updatedAt";

                return (
                    <div
                        key={key}
                        className={cn(
                            "flex items-center gap-1",
                            isHiddenMobile ? "hidden md:flex" : "flex"
                        )}
                    >
                        <button
                            onClick={() => handleSortClick(key)}
                            className={"cursor-pointer flex items-center justify-center"}
                        >
                            {label}
                            {showIcon && <Icon className="w-5 h-5" />}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default ApplicationsTitles;