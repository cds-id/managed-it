import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { SprintWithDetails } from '../../services/report/types'
import { Language, REPORT_LANGUAGE, REPORT_TRANSLATIONS } from '../../config/language'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import 'dayjs/locale/en'
import { SprintTask, Task, TaskStatus } from '@prisma/client'
import { COMPANY_CONFIG } from '../../config/company'

dayjs.locale(REPORT_LANGUAGE.toLowerCase())

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: '100%',
    marginBottom: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  signature: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: 200,
    height: 100,
    textAlign: 'center',
  },
})

interface BASTTemplateProps {
  sprint: SprintWithDetails
  currentDate: Date
  documentNumber: string
  language: Language
}

export const BASTTemplate = ({ sprint, currentDate, documentNumber, language }: BASTTemplateProps) => {
  const completedTasks = sprint.sprintTasks.filter((st) => st.task.status === TaskStatus.DONE)
  const completionPercentage = Math.round((completedTasks.length / sprint.sprintTasks.length) * 100)

  const t = REPORT_TRANSLATIONS[language]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.documentTitle}</Text>
          <Text>{t.documentNumber}: {documentNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text>
            {t.datePrefix} {dayjs(currentDate).format(t.dateFormat)}
            {t.dateSeparator} {dayjs(currentDate).format('D MMMM YYYY')}, {t.signatoryText}
          </Text>
        </View>

        <View style={styles.section}>
          <Text>1. {t.firstParty}: {sprint.client.name}</Text>
          <Text>   {t.asFirstParty}</Text>
        </View>

        <View style={styles.section}>
          <Text>2. {t.secondParty}: {COMPANY_CONFIG.name}</Text>
          <Text>   {t.asSecondParty}</Text>
        </View>

        <View style={styles.section}>
          <Text>
            {t.secondParty} {t.completionText} &quot;{sprint.name}&quot; {t.withDetails}:
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>{t.tableHeaders.no}</Text>
            <Text style={styles.tableCell}>{t.tableHeaders.workDescription}</Text>
            <Text style={styles.tableCell}>{t.tableHeaders.status}</Text>
          </View>
          {sprint.sprintTasks.map((sprintTask, index) => (
            <View key={sprintTask.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>{sprintTask.task.title}</Text>
              <Text style={styles.tableCell}>{t.status[sprintTask.task.status as keyof typeof t.status]}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text>{t.completionProgress}: {completionPercentage}%</Text>
          <Text>{t.sprintPeriod}: {dayjs(sprint.startDate).format('D MMMM YYYY')} - {
            sprint.endDate
              ? dayjs(sprint.endDate).format('D MMMM YYYY')
              : t.ongoing
          }</Text>
        </View>

        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>{t.signature.firstParty}</Text>
            <Text>{sprint.client.name}</Text>
            <Text style={{ marginTop: 50 }}>(_________________)</Text>
          </View>

          <View style={styles.signatureBox}>
            <Text>{t.signature.secondParty}</Text>
            <Text>{COMPANY_CONFIG.name}</Text>
            <Text style={{ marginTop: 50 }}>(_________________)</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}
