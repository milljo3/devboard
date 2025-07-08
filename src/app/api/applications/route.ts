import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {auth} from "@/lib/auth";
import {applicationCreateSchema} from "@/lib/validation/applicationSchema";

const PAGE_SIZE = 12;

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

    let body: unknown
    try {
        body = await req.json();
    }
    catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }

    const parseResult = applicationCreateSchema.safeParse(body);

    if (!parseResult.success) {
        return NextResponse.json({ error: parseResult.error.flatten() }, { status: 400 });
    }

    const { company, companyUrl, position, applicationUrl, status } = parseResult.data;

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