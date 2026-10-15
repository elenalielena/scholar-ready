import type {
  EligibilityRule,
  MatchGroup,
  MatchResult,
  RuleOutcome,
  RuleResult,
  StudentProfile,
} from '../types/models'

const activityLabels: Record<string, string> = {
  community_service: 'community service',
  leadership: 'leadership',
  sports: 'sports',
  arts: 'arts',
  research: 'research',
  entrepreneurship: 'entrepreneurship',
  exchange: 'exchange',
}

function listInPlainLanguage(values: string[]): string {
  const labels = values.map((value) => activityLabels[value] ?? value)
  if (labels.length <= 1) return labels[0] ?? ''
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')} and ${labels.at(-1)}`
}

function studentSentence(profile: StudentProfile, rule: EligibilityRule): { text: string; missing: boolean } {
  const value = profile[rule.field]
  switch (rule.field) {
    case 'gpa':
      return value === null
        ? { text: 'You have not provided your GPA yet.', missing: true }
        : { text: `Your GPA is ${Number(value).toFixed(2)}.`, missing: false }
    case 'yearOfStudy':
      return { text: `You are in Year ${value}.`, missing: false }
    case 'faculty':
      return { text: `Your faculty is ${value}.`, missing: false }
    case 'residency':
      return {
        text: value === 'local' ? 'You are a local student.' : 'You are a non-local student.',
        missing: false,
      }
    case 'financialNeedDeclared':
      return {
        text: value ? 'You have declared financial need.' : 'You have not declared financial need.',
        missing: false,
      }
    case 'activities': {
      const activities = Array.isArray(value) ? value : []
      return activities.length === 0
        ? { text: 'You have not listed any activities.', missing: true }
        : { text: `Your activities include ${listInPlainLanguage(activities)}.`, missing: false }
    }
    case 'languages': {
      const languages = Array.isArray(value) ? value : []
      return languages.length === 0
        ? { text: 'You have not listed any languages.', missing: true }
        : { text: `You listed ${listInPlainLanguage(languages)}.`, missing: false }
    }
    case 'firstGenerationStudent':
      if (value === null) {
        return {
          text: 'You chose not to say whether you are a first-generation university student.',
          missing: true,
        }
      }
      return {
        text: value
          ? 'You are a first-generation university student.'
          : 'You are not a first-generation university student.',
        missing: false,
      }
  }
}

function resultExplanation(profile: StudentProfile, rule: EligibilityRule): string {
  const student = studentSentence(profile, rule)
  const profileNote = student.missing ? ' Add this on your profile to check this criterion.' : ''
  return `${student.text}${profileNote} ${rule.label}`
}

function compareRuleValue(profileValue: unknown, rule: EligibilityRule): boolean {
  const ruleValues = Array.isArray(rule.value) ? rule.value : [rule.value]
  switch (rule.operator) {
    case 'in':
      return ruleValues.includes(profileValue as string | number)
    case 'gte':
      return typeof profileValue === 'number' && profileValue >= Number(rule.value)
    case 'lte':
      return typeof profileValue === 'number' && profileValue <= Number(rule.value)
    case 'equals':
      return profileValue === rule.value
    case 'includesAny':
      return (
        Array.isArray(profileValue) &&
        ruleValues.some((value) => profileValue.includes(value as never))
      )
    case 'includesAll':
      return (
        Array.isArray(profileValue) &&
        ruleValues.every((value) => profileValue.includes(value as never))
      )
  }
}

export function evaluateRule(profile: StudentProfile, rule: EligibilityRule): RuleResult {
  const profileValue = profile[rule.field]
  const missing = profileValue === null || profileValue === undefined
  const comparisonPassed = !missing && compareRuleValue(profileValue, rule)
  const outcome: RuleOutcome = missing || !comparisonPassed
    ? missing
      ? 'check'
      : 'not_met'
    : rule.requiresManualCheck
      ? 'check'
      : 'met'

  return {
    ruleId: rule.id,
    outcome,
    explanation: resultExplanation(profile, rule),
  }
}

export function evaluateMatch(
  profile: StudentProfile,
  scholarshipId: string,
  rules: EligibilityRule[],
): MatchResult {
  const results = rules
    .filter((rule) => rule.scholarshipId === scholarshipId)
    .map((rule) => evaluateRule(profile, rule))
  const metCount = results.filter((result) => result.outcome === 'met').length
  const hasFailedRule = results.some((result) => result.outcome === 'not_met')
  const hasCheckedRule = results.some((result) => result.outcome === 'check')
  const group: MatchGroup = hasFailedRule
    ? 'not_eligible'
    : hasCheckedRule
      ? 'partial'
      : 'eligible'

  return {
    scholarshipId,
    group,
    metCount,
    totalCount: results.length,
    results,
  }
}
