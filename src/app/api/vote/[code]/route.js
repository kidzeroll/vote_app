import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { code } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({
            code: 401,
            message: "Kamu harus login terlebih dahulu.",
        });
    }

    const vote = await prisma.votes.findFirst({
        select: {
            id: true,
            publisher: true,
            title: true,
            code: true,
            startDateTime: true,
            candidates: true,
            endDateTime: true,
            createdAt: true,
            deletedAt: false,
        },
        where: {
            code: code,
            deletedAt: null,
        },
    });

    if (!vote) {
        return NextResponse.json({
            status: false,
            code: 404,
            message: "gagal mengambil detail vote.",
            data: vote,
        });
    }

    // get participant onf the vote
    const participants = await prisma.participant.findMany({
        select: {
            candidate: true,
            email: true,
            createdAt: true,
        },
        where: {
            code: code,
        },
    });

    // count vote for each kandidat
    var candidates = [];
    if (participants) {
        candidates = vote?.candidates.map((candidate) => {
            const votes =
                participants.filter((participant) => participant.candidate === candidate.name).length || 0;
            return {
                ...candidate,
                votes,
            };
        });
    }

    const clientVote = {
        id: vote.id,
        publisher: vote.publisher,
        title: vote.title,
        code: vote.code,
        candidates: candidates,
        startDateTime: String(vote.startDateTime),
        endDateTime: String(vote.endDateTime),
        createdAt: String(vote.createdAt),
        totalVotes: candidates
            ? candidates.reduce((acc, candidate) => acc + (candidate.votes ? candidate.votes : 0), 0)
            : 0,
    };

    return NextResponse.json({
        status: true,
        message: "berhasil mengambil detail vote.",
        data: clientVote,
    });
}

export async function PUT(request, { params }) {
    const { code } = params;
    const body = await request.json();

    const session = await getServerSession(authOptions);
    const result = await prisma.votes.update({
        where: {
            code: code,
        },
        data: {
            candidates: body.candidates,
            endDateTime: body.endDateTime,
            startDateTime: body.startDateTime,
            title: body.title,
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
        message: "berhasil mengedit data vote.",
        data: result,
    });
}

export async function DELETE(request, { params }) {
    const { code } = params;

    const session = await getServerSession(authOptions);
    const result = await prisma.votes.update({
        where: {
            code: code,
        },
        data: {
            deletedAt: new Date().toString(),
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
        message: "berhasil menghapus data vote.",
        data: result,
    });
}
