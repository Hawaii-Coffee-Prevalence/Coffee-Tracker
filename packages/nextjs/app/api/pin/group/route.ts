import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "Group name is required!" }, { status: 400 });
  }

  try {
    const listRes = await fetch(`https://api.pinata.cloud/groups?name=${encodeURIComponent(name)}`, {
      headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
    });

    const listData = await listRes.json();

    if (listData.groups && listData.groups.length > 0) {
      return NextResponse.json({ id: listData.groups[0].id });
    }

    const createRes = await fetch("https://api.pinata.cloud/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!createRes.ok) {
      return NextResponse.json({ error: await createRes.text() }, { status: createRes.status });
    }

    const group = await createRes.json();

    return NextResponse.json({ id: group.id });
  } catch (error) {
    console.error("Error in /api/pin/group:", error);

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
