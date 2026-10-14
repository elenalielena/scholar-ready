import type { DocumentItem } from '../../types/models'

export const seedDocuments: DocumentItem[] = [
  {
    id: 'doc-transcript',
    name: 'Academic transcript',
    category: 'academic',
    description: 'A current record of your academic results.',
    guidance: 'Request a recent transcript through the fictional Registry service.',
  },
  {
    id: 'doc-statement',
    name: 'Personal statement',
    category: 'written',
    description: 'A short statement explaining your goals and experience.',
    guidance: 'Draft a focused statement for the scholarship requirements.',
  },
  {
    id: 'doc-reference',
    name: 'Reference letter',
    category: 'reference',
    description: 'A supporting letter from someone familiar with your work.',
    guidance: 'Ask a suitable referee early and confirm the submission deadline.',
  },
  {
    id: 'doc-cv',
    name: 'CV',
    category: 'written',
    description: 'A concise summary of your education, activities and experience.',
    guidance: 'Keep your CV clear, current and tailored to the scholarship.',
  },
  {
    id: 'doc-activity',
    name: 'Activity or volunteering certificate',
    category: 'activity_evidence',
    description: 'Evidence of an activity, leadership role or volunteering service.',
    guidance: 'Request a certificate or confirmation from the relevant fictional organiser.',
  },
  {
    id: 'doc-financial',
    name: 'Financial need declaration form',
    category: 'financial',
    description: 'A self-declaration form for financial need.',
    guidance: 'Complete the declaration without entering income or family details.',
  },
  {
    id: 'doc-id',
    name: 'Identity document copy (status tracked only, no number entered)',
    category: 'identity',
    description: 'A copy of an identity document required by the scholarship.',
    guidance: 'Track whether the copy is ready; do not enter an identity number here.',
  },
  {
    id: 'doc-portfolio',
    name: 'Creative portfolio',
    category: 'activity_evidence',
    description: 'A selection of creative work relevant to the application.',
    guidance: 'Prepare a small, clearly labelled selection of representative work.',
  },
  {
    id: 'doc-language',
    name: 'Language proficiency evidence',
    category: 'language',
    description: 'Evidence supporting the languages listed in your profile.',
    guidance: 'Use a suitable certificate or other generic evidence of proficiency.',
  },
]
