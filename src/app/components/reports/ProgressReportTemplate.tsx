import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { SprintWithDetails } from "../../services/report/types"
import { Language, REPORT_TRANSLATIONS } from "../../config/language"
import { COMPANY_CONFIG } from "../../config/company"
import dayjs from "dayjs"
import "dayjs/locale/id"
import "dayjs/locale/en"

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  companyInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    marginBottom: 20,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  summaryBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 100,
  },
  widthAuto: {
    width: "auto",
  },
  width20: { width: "20%" },
  width30: { width: "30%" },
  width50: { width: "50%" },
})

interface ProgressReportTemplateProps {
  sprint: SprintWithDetails
  currentDate: Date
  documentNumber: string
  language: Language
}

export function ProgressReportTemplate({
  sprint,
  currentDate,
  documentNumber,
  language,
}: ProgressReportTemplateProps) {
  const t = REPORT_TRANSLATIONS[language]
  const completedTasks = sprint.sprintTasks.filter((st) => st.task.status === "DONE")
  const inProgressTasks = sprint.sprintTasks.filter((st) => st.task.status === "IN_PROGRESS")
  const pendingTasks = sprint.sprintTasks.filter((st) => st.task.status === "TODO")
  const completionPercentage = Math.round((completedTasks.length / sprint.sprintTasks.length) * 100)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sprint Progress Report</Text>
          <Text style={styles.subtitle}>
            Document No: {documentNumber} | Date: {dayjs(currentDate).format("DD MMMM YYYY")}
          </Text>
        </View>

        {/* Company & Client Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Company:</Text>
            <Text>{COMPANY_CONFIG.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Client:</Text>
            <Text>{sprint.client.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sprint:</Text>
            <Text>{sprint.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Period:</Text>
            <Text>
              {dayjs(sprint.startDate).format("DD MMM YYYY")} -
              {sprint.endDate ? dayjs(sprint.endDate).format("DD MMM YYYY") : "Ongoing"}
            </Text>
          </View>
        </View>

        {/* Progress Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.sectionTitle}>Progress Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total Tasks:</Text>
            <Text>{sprint.sprintTasks.length}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Completed:</Text>
            <Text>
              {completedTasks.length} tasks ({completionPercentage}%)
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>In Progress:</Text>
            <Text>{inProgressTasks.length} tasks</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pending:</Text>
            <Text>{pendingTasks.length} tasks</Text>
          </View>
        </View>

        {/* Detailed Task List */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Task Details</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.width20]}>Status</Text>
              <Text style={[styles.tableCell, styles.width50]}>Task</Text>
              <Text style={[styles.tableCell, styles.width30]}>Deadline</Text>
            </View>
            {sprint.sprintTasks.map(({ task }) => (
              <View key={task.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.width20]}>{task.status}</Text>
                <Text style={[styles.tableCell, styles.width50]}>{task.title}</Text>
                <Text style={[styles.tableCell, styles.width30]}>
                  {task.deadline ? dayjs(task.deadline).format("DD MMM YYYY") : "-"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            Generated by {COMPANY_CONFIG.name}
          </Text>
          <Text style={{ textAlign: "center", fontSize: 10 }}>
            {dayjs(currentDate).format("DD MMMM YYYY HH:mm")}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
