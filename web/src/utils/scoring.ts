import { Dimension, QuestionItem, QuestionResponse, QuestionnaireConfig } from '../types/questionnaire'

export interface ItemScoreDetail {
  itemId: number
  code?: string
  title: string
  dimension: string
  subdimension: string
  rawScore: number
  maxScore: number
  normalized: number
  weightShare: number
  weightedScore: number
  answered: boolean
}

export interface DimensionScoreDetail {
  name: string
  weight: number
  weightShare: number
  contribution: number
  maxContribution: number
  score: number
  answeredCount: number
  totalCount: number
}

export interface ScoreSummary {
  totalScore: number
  normalizedTotal: number
  scoreScale: number
  totalWeight: number
  items: ItemScoreDetail[]
  dimensions: DimensionScoreDetail[]
}

const isSingleResponse = (
  response: QuestionResponse | undefined
): response is Extract<QuestionResponse, { type: 'single' }> => response?.type === 'single'

const isMultiResponse = (
  response: QuestionResponse | undefined
): response is Extract<QuestionResponse, { type: 'multi' }> => response?.type === 'multi'

const computeSingleScore = (item: QuestionItem, response?: QuestionResponse): { raw: number; answered: boolean } => {
  if (!isSingleResponse(response)) {
    return { raw: 0, answered: false }
  }
  const scoring = item.scoring
  const selectedKey = response.optionKey
  if (!selectedKey) {
    return { raw: 0, answered: false }
  }
  if ('map' in scoring && Array.isArray(scoring.map)) {
    const idx = item.options.findIndex((opt) => opt.key === selectedKey)
    if (idx >= 0) {
      const raw = scoring.map[idx] ?? 0
      return { raw, answered: true }
    }
    return { raw: 0, answered: true }
  }
  if ('map_label_to_score' in scoring && scoring.map_label_to_score) {
    const option = item.options.find((opt) => opt.key === selectedKey)
    const label = option?.label ?? selectedKey
    const raw = scoring.map_label_to_score[label] ?? scoring.map_label_to_score[selectedKey] ?? 0
    return { raw, answered: true }
  }
  return { raw: 0, answered: true }
}

const computeMultiScore = (item: QuestionItem, response?: QuestionResponse): { raw: number; answered: boolean } => {
  if (!isMultiResponse(response)) {
    return { raw: 0, answered: false }
  }
  const scoring = item.scoring
  if (!('per_option' in scoring)) {
    return { raw: 0, answered: response.optionKeys.length > 0 }
  }
  const count = response.optionKeys.length
  const raw = Math.min(count * scoring.per_option, scoring.max_score)
  return { raw, answered: count > 0 }
}

const computeItemWeightedScore = (
  dimension: Dimension,
  subdimensionWeight: number,
  item: QuestionItem,
  response: QuestionResponse | undefined
) => {
  const maxScore = item.scoring.max_score
  const itemWeightShare = dimension.weight * subdimensionWeight * item.weight
  let raw = 0
  let answered = false
  if (item.type === 'single') {
    const result = computeSingleScore(item, response)
    raw = result.raw
    answered = result.answered
  } else {
    const result = computeMultiScore(item, response)
    raw = result.raw
    answered = result.answered
  }
  const normalized = maxScore === 0 ? 0 : raw / maxScore
  const weightedScore = normalized * itemWeightShare
  return {
    rawScore: raw,
    maxScore,
    normalized,
    weightedScore,
    weightShare: itemWeightShare,
    answered
  }
}

export const computeScoreSummary = (
  responses: Record<number, QuestionResponse>,
  config: QuestionnaireConfig
): ScoreSummary => {
  const items: ItemScoreDetail[] = []
  const dimensions: DimensionScoreDetail[] = []

  let totalContribution = 0
  let totalWeight = 0

  for (const dimension of config.dimensions) {
    let dimensionContribution = 0
    let dimensionWeight = 0
    let answeredCount = 0
    let totalCount = 0

    for (const subdimension of dimension.subdimensions) {
      for (const item of subdimension.items) {
        totalCount += 1
        const response = responses[item.id]
        const { rawScore, maxScore, normalized, weightedScore, weightShare, answered } =
          computeItemWeightedScore(dimension, subdimension.weight, item, response)

        const detail: ItemScoreDetail = {
          itemId: item.id,
          code: item.code,
          title: item.title,
          dimension: dimension.name,
          subdimension: subdimension.name,
          rawScore,
          maxScore,
          normalized,
          weightShare,
          weightedScore,
          answered
        }
        items.push(detail)
        dimensionContribution += weightedScore
        dimensionWeight += weightShare
        totalContribution += weightedScore
        totalWeight += weightShare
        if (answered) {
          answeredCount += 1
        }
      }
    }

    const scoreScale = config.metadata.score_scale
    const dimensionNormalized = dimensionWeight === 0 ? 0 : dimensionContribution / dimensionWeight
    const dimensionScore = dimensionNormalized * scoreScale
    dimensions.push({
      name: dimension.name,
      weight: dimension.weight,
      weightShare: dimensionWeight,
      contribution: dimensionContribution,
      maxContribution: dimensionWeight,
      score: parseFloat(dimensionScore.toFixed(2)),
      answeredCount,
      totalCount
    })
  }

  const normalizedTotal = totalWeight === 0 ? 0 : totalContribution / totalWeight
  const totalScore = normalizedTotal * config.metadata.score_scale

  return {
    totalScore: parseFloat(totalScore.toFixed(2)),
    normalizedTotal,
    scoreScale: config.metadata.score_scale,
    totalWeight,
    items,
    dimensions
  }
}

export const checkUpgradeEligibility = (
  sceneCount: number | null,
  constrainedSceneCount: number | null,
  config: QuestionnaireConfig
) => {
  const rules = config.upgrade_rules
  const totalScenes = sceneCount ?? 0
  const constrainedScenes = constrainedSceneCount ?? 0
  const missingScenes = Math.max(rules.min_scenes_total - totalScenes, 0)
  const missingConstrained = Math.max(rules.min_constrained_scenes - constrainedScenes, 0)
  const eligible = missingScenes <= 0 && missingConstrained <= 0

  return {
    eligible,
    missingScenes,
    missingConstrained,
    requirement: rules
  }
}
