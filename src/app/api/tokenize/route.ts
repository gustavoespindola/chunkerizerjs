import { NextRequest, NextResponse } from "next/server";
import { globalsHelper } from "@llamaindex/edge";

interface RequestBody {
	text?: string;
}

// export const runtime = "edge";
// export const runtime = "node";

export async function POST(req: NextRequest) {
	const body = (await req.json()) as RequestBody;

	if (!body ?? !body.text) {
		return NextResponse.json({ error: "Invalid request" }, { status: 400 });
	}

	const tokenize = globalsHelper.tokenizer()(body.text);
	return NextResponse.json({ tokens: tokenize.length }, { status: 200 });
}
