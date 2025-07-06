import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {applicationUpdateSchema} from "@/lib/validation/applicationSchema";

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

    let body: unknown;
    try {
        body = await req.json();
    }
    catch (err) {
        return NextResponse.json({ error: err}, { status: 400 });
    }

    const parseResults = applicationUpdateSchema.safeParse(body);

    if (!parseResults.success) {
        return NextResponse.json({ error: "Invalid fields"}, { status: 400 });
    }

    const updateData = parseResults.data;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    try {
        const existingApp = await prisma.application.findUnique({ where: { id } });

        if (!existingApp || existingApp.userId !== session.user.id) {
            return NextResponse.json({ error: "Application not found or forbidden" }, { status: 403 });
        }

        const updatedApp = await prisma.application.update({
            where: { id },
            data: updateData,
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
