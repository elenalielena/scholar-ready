import type {
  EligibilityRule,
  MatchGroup,
  MatchResult,
  RuleOutcome,
  RuleResult,
  StudentProfile,
} from '../types/models'

function displayValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'not provided'
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : 'none listed'
  }
  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no'
  }
  return String(value)
}

function displayRequirement(rule: EligibilityRule): string {
  const value = displayValue(rule.value)
  switch (rule.operator) {
    case 'in':
      return `one of ${value}`
    case 'gte':
      return `${value} or above`
    case 'lte':
      return `${value} or below`
    case 'equals':
      return `equal to ${value}`
    case 'includesAny':
      return `including any of ${value}`
    case 'includesAll':
      return `including all of ${value}`
  }
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

function resultExplanation(
  profileValue: unknown,
  rule: EligibilityRule,
  outcome: RuleOutcome,
): string {
  const value = displayValue(profileValue)
  const requirement = displayRequirement(rule)
  if (outcome === 'check') {
    return `Your value is ${value}. This criterion requires ${requirement}; please check the supporting evidence.`
  }
  return `Your value is ${value}. This criterion requires ${requirement}.`
}

export function evaluateRule(profile: StudentProfile, rule: EligibilityRule): RuleResult {
  const profileValue = profile[rule.field]
  if (profileValue === null || profileValue === undefined) {
    return {
      ruleId: rule.id,
      outcome: 'check',
      explanation: resultExplanation(profileValue, rule, 'check'),
    }
  }

  const comparisonPassed = compareRuleValue(profileValue, rule)
  const outcome: RuleOutcome = !comparisonPassed
    ? 'not_met'
    : rule.requiresManualCheck
      ? 'check'
      : 'met'

  return {
    ruleId: rule.id,
    outcome,
    explanation: resultExplanation(profileValue, rule, outcome),
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
