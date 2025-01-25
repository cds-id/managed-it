import { EmailService } from "../services/email/EmailService"
import { TaskSummaryService } from "../services/tasks/TaskSummaryService"
import db from "db"

export async function sendDailySummary() {
  const emailService = new EmailService()
  const taskSummaryService = new TaskSummaryService()

  try {
    // Get all admin users
    const adminUsers = await db.user.findMany({
      where: {
        role: "ADMIN",
      },
    })

    // Get task summary
    const summary = await taskSummaryService.getDailySummary()

    // Send email to each admin
    for (const admin of adminUsers) {
      await emailService.sendDailySummary(admin.email, summary)
    }

    console.log("Daily summary emails sent successfully")
  } catch (error) {
    console.error("Failed to send daily summary emails:", error)
  }
}
