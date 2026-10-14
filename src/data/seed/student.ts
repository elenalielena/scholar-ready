import type { StudentProfile } from '../../types/models'

export const seedStudentProfile: StudentProfile = {
  id: 'demo-student',
  displayName: 'Chloe Wong (Demo)',
  yearOfStudy: 1,
  faculty: 'Business',
  programme: 'BBA (fictional)',
  gpa: 3.1,
  residency: 'local',
  financialNeedDeclared: true,
  activities: ['community_service', 'leadership'],
  languages: ['English', 'Cantonese', 'Putonghua'],
  firstGenerationStudent: null,
  updatedAt: '2026-01-01T00:00:00.000Z',
}
