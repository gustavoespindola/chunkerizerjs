import { NextRequest, NextResponse } from "next/server";
import { SentenceSplitter } from "@llamaindex/edge";

interface RequestBody {
	text?: string;
	chunkSize?: number;
	chunkOverlap?: number;
	splitLongSentences?: boolean;
	chunkingTokenizerFn?: (text: string) => string[];
	paragraphSeparator?: string;
}

// export const runtime = "edge";
// export const runtime = "node";

export async function POST(req: NextRequest) {
	const body = (await req.json()) as RequestBody;

	if (!body ?? !body.text ?? !body.chunkSize ?? !body.chunkOverlap) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	if (body.chunkSize < 1 || body.chunkOverlap < 0) {
		return NextResponse.json(
			{ error: "Invalid chunk size or overlap" },
			{ status: 400 }
		);
	}

	const {
		text,
		chunkSize = 512,
		chunkOverlap = 0,
		splitLongSentences,
		chunkingTokenizerFn,
		paragraphSeparator,
	} = body;

	const splitter = new SentenceSplitter({
		chunkSize,
		chunkOverlap,
		splitLongSentences,
		chunkingTokenizerFn,
		paragraphSeparator,
	});

	const textSplits = splitter.splitText(text) as string[];

	return NextResponse.json({ textSplits }, { status: 200 });
}
