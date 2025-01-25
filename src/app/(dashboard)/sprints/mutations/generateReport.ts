import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"
import { renderToFile } from "@react-pdf/renderer"
import { BASTTemplate } from "src/app/components/reports/BASTTemplate"
import { ProgressReportTemplate } from "@/src/app/components/reports/ProgressReportTemplate"
import { nanoid } from "nanoid"
import path from "path"
import { mkdir } from "fs/promises"
import { Language } from "src/app/config/language"
import React from "react" // Add this import

const GenerateReportSchema = z.object({
  sprintId: z.string(),
  reportType: z.enum(["BAST", "PROGRESS"]),
  language: z.enum(["ID", "EN"]),
  customText: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(GenerateReportSchema),
  resolver.authorize(),
  async ({ sprintId, reportType, language, customText }) => {
    const sprint = await db.sprint.findFirst({
      where: { id: sprintId },
      include: {
        client: true,
        sprintTasks: {
          include: {
            task: true,
          },
        },
      },
    })

    if (!sprint) {
      throw new Error("Sprint not found")
    }

    const documentNumber = `${reportType}/${sprint.client.name
      .substring(0, 3)
      .toUpperCase()}/${nanoid(8)}`
    const reportsDir = path.join(process.cwd(), "public/reports")
    await mkdir(reportsDir, { recursive: true })

    const filename = `${reportType}_${sprint.name.replace(/\s+/g, "_")}_${language}_${
      new Date().toISOString().split("T")[0]
    }.pdf`
    const outputPath = path.join(reportsDir, filename)

    // Use React.createElement instead of JSX
    const template = React.createElement(
      reportType === "BAST" ? BASTTemplate : ProgressReportTemplate,
      {
        sprint,
        currentDate: new Date(),
        documentNumber,
        language,
      }
    )

    await renderToFile(template, outputPath)

    return {
      url: `/reports/${filename}`,
      filename,
    }
  }
)
