import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { code } = params;

    const session = await getServerSession(authOptions);
    const result = await prisma.participant.findFirst({
        where: {
            code: code,
            email: session?.user?.email,
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
        message: "berhasil mengambil data participant.",
        data: result,
    });
}

export async function POST(req, { params }) {
    const { code } = params;
    const body = await req.json();

    const session = await getServerSession(authOptions);
    const result = await prisma.participant.create({
        data: {
            candidate: body.candidate,
            email: session?.user?.email,
            code: code,
        },
    });
    console.log("🚀  result:", result);

    if (!session) {
        return NextResponse.json({
            code: 401,
            message: "Kamu harus login terlebih dahulu.",
        });
    }

    return NextResponse.json({
        status: true,
        message: "berhasil membuat participant.",
        data: result,
    });
}
