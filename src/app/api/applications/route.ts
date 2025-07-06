import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {auth} from "@/lib/auth";

const PAGE_SIZE = 8;

export async function GET(req: NextRequest) {
    const headersList = req.headers;
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const sortField = searchParams.get("sortField") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const skip = (page - 1) * PAGE_SIZE;

    const validSortFields = ["company", "position", "appliedAt", "updatedAt", "status"];

    const [applications, totalCount] = await Promise.all([
        prisma.application.findMany({
            where: { userId: session.user.id },
            orderBy: {
                [validSortFields.includes(sortField) ? sortField : "updatedAt"]: sortOrder,
            },
            skip,
            take: PAGE_SIZE,
        }),
        prisma.application.count({
            where: {userId: session.user.id}
        }),
    ]);

    return NextResponse.json({
        applications,
        totalCount,
        pageSize: PAGE_SIZE,
    });
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { company, companyUrl, position, applicationUrl, status } = body;

    if (!company || !position || !status) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newApp = await prisma.application.create({
        data: {
            company,
            companyUrl,
            position,
            applicationUrl,
            status,
            userId: session.user.id,
        },
    });

    return NextResponse.json(newApp, { status: 201 });
}