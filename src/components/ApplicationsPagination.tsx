"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import {useRouter, useSearchParams} from "next/navigation";

interface Props {
    currentPage: number;
    totalPages: number;
}

const ApplicationsPagination = ({ currentPage, totalPages }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        }
        else {
            if (currentPage > 2) pages.push(1, "...");
            for (
                let i = Math.max(1, currentPage - 1);
                i <= Math.min(totalPages, currentPage + 1);
                i++
            ) {
                pages.push(i);
            }
            if (currentPage < totalPages - 1) pages.push("...", totalPages);
        }

        return pages;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    {currentPage !== 1 && (
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                goToPage(Math.max(1, currentPage - 1));
                            }}
                        />
                    )}
                </PaginationItem>
                {getPageNumbers().map((page, idx) =>
                    typeof page === "number" ? (
                        <PaginationItem key={idx}>
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    goToPage(page);
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={idx}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )
                )}
                <PaginationItem>
                    {currentPage === totalPages - 1 && (
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                goToPage(Math.min(totalPages, currentPage + 1));
                            }}
                        />
                    )}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default ApplicationsPagination;
