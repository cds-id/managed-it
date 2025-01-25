import { Task } from "@prisma/client"
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Img,
} from "@react-email/components"

interface TaskWithClient extends Task {
  client: {
    name: string
  }
}

interface TaskSummary {
  dueToday: TaskWithClient[]
  overdue: TaskWithClient[]
  inProgress: TaskWithClient[]
  completedToday: TaskWithClient[]
  upcomingDeadlines: TaskWithClient[]
}

interface DailySummaryEmailProps {
  summary: TaskSummary
  date: Date
}

export const DailySummaryEmail = ({ summary, date }: DailySummaryEmailProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Html>
      <Head />
      <Preview>Daily Task Summary - {formatDate(date)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img
              src={process.env.COMPANY_LOGO_URL || "/logo.png"}
              width="48"
              height="48"
              alt="Company Logo"
              style={logo}
            />
            <Text style={title}>Daily Task Summary</Text>
            <Text style={dateStyle}>{formatDate(date)}</Text>
          </Section>

          {/* Due Today Section */}
          <Section style={section}>
            <Text style={sectionTitle}>Due Today</Text>
            {summary.dueToday.length > 0 ? (
              summary.dueToday.map((task) => (
                <Text key={task.id} style={taskItem}>
                  {task.title} - {task.client.name}
                </Text>
              ))
            ) : (
              <Text style={emptyState}>No tasks due today</Text>
            )}
          </Section>

          {/* Overdue Section */}
          {summary.overdue.length > 0 && (
            <Section style={{ ...section, borderColor: "#dc2626" }}>
              <Text style={{ ...sectionTitle, color: "#dc2626" }}>Overdue Tasks</Text>
              {summary.overdue.map((task) => (
                <Text key={task.id} style={taskItem}>
                  {task.title} - {task.client.name} (Due: {formatDate(task.deadline!)})
                </Text>
              ))}
            </Section>
          )}

          {/* In Progress Section */}
          <Section style={section}>
            <Text style={sectionTitle}>In Progress</Text>
            {summary.inProgress.length > 0 ? (
              summary.inProgress.map((task) => (
                <Text key={task.id} style={taskItem}>
                  {task.title} - {task.client.name}
                </Text>
              ))
            ) : (
              <Text style={emptyState}>No tasks in progress</Text>
            )}
          </Section>

          {/* Completed Today Section */}
          <Section style={section}>
            <Text style={sectionTitle}>Completed Today</Text>
            {summary.completedToday.length > 0 ? (
              summary.completedToday.map((task) => (
                <Text key={task.id} style={taskItem}>
                  {task.title} - {task.client.name}
                </Text>
              ))
            ) : (
              <Text style={emptyState}>No tasks completed today</Text>
            )}
          </Section>

          {/* Upcoming Deadlines */}
          <Section style={section}>
            <Text style={sectionTitle}>Upcoming Deadlines (Next 7 Days)</Text>
            {summary.upcomingDeadlines.length > 0 ? (
              summary.upcomingDeadlines.map((task) => (
                <Text key={task.id} style={taskItem}>
                  {task.title} - Due: {formatDate(task.deadline!)}
                </Text>
              ))
            ) : (
              <Text style={emptyState}>No upcoming deadlines</Text>
            )}
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            View detailed report on the{" "}
            <Link href={process.env.APP_URL + "/dashboard"} style={link}>
              dashboard
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: "#f8fafc",
  fontFamily: "system-ui, -apple-system, sans-serif",
  padding: "12px",
}

const container = {
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px 24px",
  borderRadius: "8px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
}

const headerSection = {
  textAlign: "center" as const,
  marginBottom: "32px",
}

const logo = {
  display: "block",
  margin: "0 auto 16px",
}

const title = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#1e293b",
  margin: "0 0 8px",
  lineHeight: "1.2",
}

const dateStyle = {
  fontSize: "16px",
  color: "#64748b",
  margin: "0",
}

const section = {
  padding: "20px",
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  marginBottom: "24px",
}

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#334155",
  marginBottom: "16px",
  lineHeight: "1.4",
}

const taskItem = {
  margin: "12px 0",
  fontSize: "15px",
  color: "#475569",
  lineHeight: "1.5",
}

const emptyState = {
  color: "#94a3b8",
  fontSize: "15px",
  fontStyle: "italic",
}

const hr = {
  margin: "32px 0",
  borderColor: "#e2e8f0",
  borderStyle: "solid",
}

const footer = {
  textAlign: "center" as const,
  fontSize: "14px",
  color: "#64748b",
}

const link = {
  color: "#3b82f6",
  textDecoration: "underline",
}
