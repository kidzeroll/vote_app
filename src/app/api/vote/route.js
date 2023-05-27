import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import code from "@/lib/code";

export async function GET() {
    const session = await getServerSession(authOptions);

    const result = await prisma.votes.findMany({
        where: {
            AND: [{ deletedAt: null }, { publisher: session?.user?.email }],
        },
    });

    if (!session) {
        return NextResponse.json({
            code: 401,
            message: "Kamu harus login terlebih dahulu.",
        });
    }

    return NextResponse.json({
        status: true,
        message: "berhasil mengambil data vote.",
        data: result,
    });
}

export async function POST(req) {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    const result = await prisma.votes.create({
        data: {
            title: body.title,
            candidates: body.candidates,
            startDateTime: body.startDateTime,
            endDateTime: body.endDateTime,
            publisher: body.publisher,
            code: code(6),
            deletedAt: null,
        },
    });

    if (!session) {
        return NextResponse.json({
            code: 401,
            message: "Kamu harus login terlebih dahulu.",
        });
    }

    return NextResponse.json(result);
}
