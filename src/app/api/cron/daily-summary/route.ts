import { NextRequest, NextResponse } from "next/server"
import { sendDailySummary } from "../../../jobs/dailySummaryJob"

export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await sendDailySummary()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cron job failed:", error)
    return NextResponse.json({ error: "Failed to send daily summary" }, { status: 500 })
  }
}
