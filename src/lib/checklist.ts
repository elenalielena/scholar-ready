import type {
  DocumentItem,
  DocumentProgress,
  DocumentStatus,
  Scholarship,
} from '../types/models'

export interface ChecklistItem extends DocumentItem {
  usedByScholarshipIds: string[]
  status: DocumentStatus
  evidenceNote: string
  updatedAt: string
}

export interface ReadinessSummary {
  readyCount: number
  totalCount: number
  label: string
}

function progressFor(
  documentId: string,
  documentProgress: DocumentProgress[],
): DocumentProgress | undefined {
  return documentProgress.find((progress) => progress.documentId === documentId)
}

export function getRequiredDocumentIds(
  savedScholarships: Scholarship[],
): string[] {
  return [...new Set(savedScholarships.flatMap((scholarship) => scholarship.requiredDocumentIds))]
}

export function getChecklistItems(
  savedScholarships: Scholarship[],
  documents: DocumentItem[],
  documentProgress: DocumentProgress[],
): ChecklistItem[] {
  const requiredDocumentIds = getRequiredDocumentIds(savedScholarships)
  return requiredDocumentIds.flatMap((documentId) => {
    const document = documents.find((item) => item.id === documentId)
    if (!document) {
      return []
    }

    const progress = progressFor(documentId, documentProgress)
    return [
      {
        ...document,
        usedByScholarshipIds: savedScholarships
          .filter((scholarship) => scholarship.requiredDocumentIds.includes(documentId))
          .map((scholarship) => scholarship.id),
        status: progress?.status ?? 'not_started',
        evidenceNote: progress?.evidenceNote ?? '',
        updatedAt: progress?.updatedAt ?? '',
      },
    ]
  })
}

export function getOverallReadiness(
  savedScholarships: Scholarship[],
  documents: DocumentItem[],
  documentProgress: DocumentProgress[],
): ReadinessSummary {
  const items = getChecklistItems(savedScholarships, documents, documentProgress)
  const readyCount = items.filter((item) => item.status === 'ready').length
  return {
    readyCount,
    totalCount: items.length,
    label: `${readyCount} of ${items.length} ready`,
  }
}

export function getScholarshipReadiness(
  scholarship: Scholarship,
  documentProgress: DocumentProgress[],
): ReadinessSummary {
  const readyCount = scholarship.requiredDocumentIds.filter(
    (documentId) => progressFor(documentId, documentProgress)?.status === 'ready',
  ).length
  return {
    readyCount,
    totalCount: scholarship.requiredDocumentIds.length,
    label: `${readyCount} of ${scholarship.requiredDocumentIds.length} ready`,
  }
}
