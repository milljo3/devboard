"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {ApplicationStatus} from "../../node_modules/prisma/prisma-client"

interface StatusSelectorProps {
    defaultStatus: ApplicationStatus;
    onSelect: (selected: ApplicationStatus) => void;
}

export function StatusSelector({defaultStatus, onSelect}: StatusSelectorProps) {
    return (
        <Select onValueChange={onSelect} defaultValue={defaultStatus}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={defaultStatus}/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value={ApplicationStatus.APPLIED}>{ApplicationStatus.APPLIED}</SelectItem>
                    <SelectItem value={ApplicationStatus.INTERVIEWING}>{ApplicationStatus.INTERVIEWING}</SelectItem>
                    <SelectItem value={ApplicationStatus.ACCEPTED}>{ApplicationStatus.ACCEPTED}</SelectItem>
                    <SelectItem value={ApplicationStatus.REJECTED}>{ApplicationStatus.REJECTED}</SelectItem>
                    <SelectItem value={ApplicationStatus.PENDING}>{ApplicationStatus.PENDING}</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
