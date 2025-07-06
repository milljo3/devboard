import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const body = await req.json();

    const { company, companyUrl, position, applicationUrl, status } = body;

    if (!company || !position || !status) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const existingApp = await prisma.application.findUnique({ where: { id } });

        if (!existingApp || existingApp.userId !== session.user.id) {
            return NextResponse.json({ error: "Application not found or forbidden" }, { status: 403 });
        }

        const updatedApp = await prisma.application.update({
            where: { id },
            data: { company, companyUrl, position, applicationUrl, status },
        });

        return NextResponse.json(updatedApp);
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
        return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    try {
        const existingApp = await prisma.application.findUnique({ where: { id } });

        if (!existingApp || existingApp.userId !== session.user.id) {
            return NextResponse.json({ error: "Application not found or forbidden" }, { status: 403 });
        }

        await prisma.application.delete({ where: { id } });

        return NextResponse.json({ success: true });
    }
    catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
    }
}
