export type Language = 'ID' | 'EN'

export const REPORT_LANGUAGE = (process.env.REPORT_LANGUAGE || 'ID') as Language

export const REPORT_TRANSLATIONS = {
  ID: {
    documentTitle: 'BERITA ACARA SERAH TERIMA PEKERJAAN',
    documentNumber: 'Nomor',
    datePrefix: 'Pada hari',
    dateFormat: 'dddd',
    dateSeparator: ', tanggal',
    signatoryText: 'yang bertanda tangan di bawah ini:',
    firstParty: 'PIHAK PERTAMA',
    secondParty: 'PIHAK KEDUA',
    asFirstParty: 'Selanjutnya disebut sebagai PIHAK PERTAMA',
    asSecondParty: 'Selanjutnya disebut sebagai PIHAK KEDUA',
    completionText: 'telah menyelesaikan pekerjaan',
    withDetails: 'dengan rincian sebagai berikut',
    tableHeaders: {
      no: 'No',
      workDescription: 'Deskripsi Pekerjaan',
      status: 'Status',
    },
    completionProgress: 'Progress Penyelesaian',
    sprintPeriod: 'Periode Sprint',
    ongoing: 'Sedang Berlangsung',
    signature: {
      firstParty: 'PIHAK PERTAMA',
      secondParty: 'PIHAK KEDUA',
    },
    status: {
      TODO: 'Belum Dikerjakan',
      IN_PROGRESS: 'Sedang Dikerjakan',
      DONE: 'Selesai',
    },
  },
  EN: {
    documentTitle: 'WORK HANDOVER REPORT',
    documentNumber: 'Number',
    datePrefix: 'On',
    dateFormat: 'dddd',
    dateSeparator: ', date',
    signatoryText: 'the undersigned:',
    firstParty: 'FIRST PARTY',
    secondParty: 'SECOND PARTY',
    asFirstParty: 'Hereinafter referred to as the FIRST PARTY',
    asSecondParty: 'Hereinafter referred to as the SECOND PARTY',
    completionText: 'has completed the work',
    withDetails: 'with the following details',
    tableHeaders: {
      no: 'No',
      workDescription: 'Work Description',
      status: 'Status',
    },
    completionProgress: 'Completion Progress',
    sprintPeriod: 'Sprint Period',
    ongoing: 'Ongoing',
    signature: {
      firstParty: 'FIRST PARTY',
      secondParty: 'SECOND PARTY',
    },
    status: {
      TODO: 'To Do',
      IN_PROGRESS: 'In Progress',
      DONE: 'Completed',
    },
  },
}
