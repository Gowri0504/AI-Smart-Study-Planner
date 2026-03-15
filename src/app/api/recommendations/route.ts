import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@backend/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  // Mock AI recommended resources based on query
  // In a real app, this would ping OpenAI/Gemini to get structured links
  const recommendations = [
    {
      id: 1,
      title: `${query} in 100 Seconds`,
      type: "video",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " tutorial")}`,
      source: "YouTube",
      duration: "10 mins"
    },
    {
      id: 2,
      title: `Complete Guide to ${query}`,
      type: "article",
      url: `https://www.google.com/search?q=${encodeURIComponent(query + " documentation or guide")}`,
      source: "GeeksForGeeks / MDN",
      duration: "15 mins read"
    },
    {
      id: 3,
      title: `Practice Problems for ${query}`,
      type: "practice",
      url: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(query)}`,
      source: "LeetCode",
      duration: "Variable"
    }
  ];

  return NextResponse.json({ recommendations });
}
