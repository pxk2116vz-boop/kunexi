export type QuestionType = 'single' | 'multi'

export interface QuestionOption {
  key: string
  label: string
  description?: string
  remarkPlaceholder?: string
  info?: string
}

export type FollowUpFieldType = 'text' | 'boolean' | 'number'

export interface FollowUpField {
  id: string
  label: string
  type: FollowUpFieldType
  placeholder?: string
  suffix?: string
  helperText?: string
}

export interface SingleScoringConfig {
  map?: number[]
  map_label_to_score?: Record<string, number>
  options_desc_order?: boolean
  max_score: number
}

export interface MultiScoringConfig {
  per_option: number
  max_score: number
}

export type ScoringConfig = SingleScoringConfig | MultiScoringConfig

export interface QuestionItem {
  id: number
  code?: string
  title: string
  description?: string
  type: QuestionType
  weight: number
  options: QuestionOption[]
  scoring: ScoringConfig
  maxSelections?: number
  followUps?: FollowUpField[]
  remarkLabel?: string
}

export interface Subdimension {
  name: string
  weight: number
  items: QuestionItem[]
}

export interface Dimension {
  name: string
  weight: number
  subdimensions: Subdimension[]
}

export interface QuestionnaireConfig {
  metadata: {
    score_scale: number
  }
  dimensions: Dimension[]
  upgrade_rules: {
    from_level: number
    to_level: number
    min_scenes_total: number
    min_constrained_scenes: number
  }
}

export interface BasicField {
  id: string
  label: string
  type: 'text' | 'number' | 'select'
  placeholder?: string
  options?: string[]
}

export interface SceneField {
  id: 'sceneCount' | 'constrainedSceneCount'
  label: string
  helper?: string
}

export type QuestionResponse =
  | {
      type: 'single'
      optionKey: string | null
      remarks?: Record<string, string>
      followUps?: Record<string, string | number | boolean>
    }
  | {
      type: 'multi'
      optionKeys: string[]
      remarks?: Record<string, string>
      followUps?: Record<string, string | number | boolean>
    }
