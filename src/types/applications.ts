import {ApplicationStatus} from "../../node_modules/prisma/prisma-client"

export interface Application {
    id: string;
    company: string;
    companyUrl?: string;
    position: string;
    applicationUrl?: string;
    status: ApplicationStatus;
    appliedAt?: string;
    updatedAt?: string;
}