import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { DailySummaryEmail } from "../../components/emails/DailySummaryEmail"
import { TaskSummary } from "./types"

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  async sendDailySummary(to: string, summary: TaskSummary) {
    try {
      // Await the render result
      const emailHtml = await render(DailySummaryEmail({ summary, date: new Date() }))

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject: `Daily Task Summary - ${new Date().toLocaleDateString()}`,
        html: emailHtml, // Now emailHtml is a string
      })
    } catch (error) {
      console.error("Failed to send daily summary email:", error)
      throw error
    }
  }
}
