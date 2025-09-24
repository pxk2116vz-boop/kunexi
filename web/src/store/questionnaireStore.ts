import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { QuestionResponse } from '../types/questionnaire'

export interface SceneInfoState {
  sceneCount: number | null
  constrainedSceneCount: number | null
  effects: string[]
  otherEffectNote: string
  upgradeTarget: string
  painPoints: string
  externalSupport: string
}

export interface QuestionnaireSnapshot {
  version: number
  basicInfo: Record<string, string>
  responses: Record<number, QuestionResponse>
  sceneInfo: SceneInfoState
}

interface QuestionnaireState {
  basicInfo: Record<string, string>
  responses: Record<number, QuestionResponse>
  sceneInfo: SceneInfoState
  setBasicInfo: (fieldId: string, value: string) => void
  setSingleResponse: (itemId: number, optionKey: string | null) => void
  toggleMultiOption: (itemId: number, optionKey: string, maxSelections?: number) => void
  clearResponse: (itemId: number) => void
  setRemark: (
    itemId: number,
    type: 'single' | 'multi',
    optionKey: string,
    value: string
  ) => void
  setFollowUp: (
    itemId: number,
    type: 'single' | 'multi',
    followUpId: string,
    value: string | number | boolean
  ) => void
  setSceneNumeric: (fieldId: 'sceneCount' | 'constrainedSceneCount', value: number | null) => void
  toggleEffect: (effectKey: string) => void
  setSceneText: (
    key: 'otherEffectNote' | 'upgradeTarget' | 'painPoints' | 'externalSupport',
    value: string
  ) => void
  reset: () => void
  getSnapshot: () => QuestionnaireSnapshot
  importSnapshot: (snapshot: QuestionnaireSnapshot) => void
}

const createInitialSceneInfo = (): SceneInfoState => ({
  sceneCount: null,
  constrainedSceneCount: null,
  effects: [],
  otherEffectNote: '',
  upgradeTarget: '',
  painPoints: '',
  externalSupport: ''
})

const initialState = {
  basicInfo: {} as Record<string, string>,
  responses: {} as Record<number, QuestionResponse>,
  sceneInfo: createInitialSceneInfo()
}

const ensureResponse = <T extends 'single' | 'multi'>(
  responses: Record<number, QuestionResponse>,
  itemId: number,
  type: T
): Extract<QuestionResponse, { type: T }> => {
  const existing = responses[itemId]
  if (existing && existing.type === type) {
    return existing as Extract<QuestionResponse, { type: T }>
  }
  const base =
    type === 'single'
      ? { type: 'single', optionKey: null, remarks: {}, followUps: {} }
      : { type: 'multi', optionKeys: [], remarks: {}, followUps: {} }

  return base as Extract<QuestionResponse, { type: T }>
}

export const useQuestionnaireStore = create<
  QuestionnaireState,
  [['zustand/persist', QuestionnaireState]]
>(
  persist(
    (set, get) => ({
      ...initialState,
      setBasicInfo: (fieldId, value) => {
        set((state) => ({
          basicInfo: {
            ...state.basicInfo,
            [fieldId]: value
          }
        }))
      },
      setSingleResponse: (itemId, optionKey) => {
        set((state) => {
          const current = ensureResponse(state.responses, itemId, 'single')
          const remarks = current.remarks ?? {}
          const followUps = current.followUps ?? {}
          const nextRemarks: Record<string, string> = {}
          if (optionKey && remarks[optionKey]) {
            nextRemarks[optionKey] = remarks[optionKey]
          }
          const next: QuestionResponse = {
            type: 'single',
            optionKey,
            remarks: nextRemarks,
            followUps
          }
          return {
            responses: {
              ...state.responses,
              [itemId]: next
            }
          }
        })
      },
      toggleMultiOption: (itemId, optionKey, maxSelections) => {
        set((state) => {
          const current = ensureResponse(state.responses, itemId, 'multi')
          const optionKeys = new Set<string>(current.optionKeys ?? [])
          if (optionKeys.has(optionKey)) {
            optionKeys.delete(optionKey)
          } else {
            if (!maxSelections || optionKeys.size < maxSelections) {
              optionKeys.add(optionKey)
            }
          }
          const remarks = { ...(current.remarks ?? {}) }
          if (!optionKeys.has(optionKey)) {
            delete remarks[optionKey]
          }
          const next: QuestionResponse = {
            type: 'multi',
            optionKeys: Array.from(optionKeys),
            remarks,
            followUps: { ...(current.followUps ?? {}) }
          }
          return {
            responses: {
              ...state.responses,
              [itemId]: next
            }
          }
        })
      },
      clearResponse: (itemId) => {
        set((state) => {
          if (!(itemId in state.responses)) {
            return state
          }
          const next = { ...state.responses }
          delete next[itemId]
          return { responses: next }
        })
      },
      setRemark: (itemId, type, optionKey, value) => {
        set((state) => {
          const current = ensureResponse(state.responses, itemId, type)
          const remarks = { ...(current.remarks ?? {}) }
          if (!value.trim()) {
            delete remarks[optionKey]
          } else {
            remarks[optionKey] = value
          }
          const next: QuestionResponse =
            current.type === 'single'
              ? {
                  type: 'single',
                  optionKey: (current as Extract<QuestionResponse, { type: 'single' }>).optionKey,
                  remarks,
                  followUps: { ...(current.followUps ?? {}) }
                }
              : {
                  type: 'multi',
                  optionKeys: Array.from(
                    new Set((current as Extract<QuestionResponse, { type: 'multi' }>).optionKeys ?? [])
                  ),
                  remarks,
                  followUps: { ...(current.followUps ?? {}) }
                }
          return {
            responses: {
              ...state.responses,
              [itemId]: next
            }
          }
        })
      },
      setFollowUp: (itemId, type, followUpId, value) => {
        set((state) => {
          const current = ensureResponse(state.responses, itemId, type)
          const followUps = { ...(current.followUps ?? {}) }
          followUps[followUpId] = value
          const next: QuestionResponse =
            current.type === 'single'
              ? {
                  type: 'single',
                  optionKey: (current as Extract<QuestionResponse, { type: 'single' }>).optionKey,
                  remarks: { ...(current.remarks ?? {}) },
                  followUps
                }
              : {
                  type: 'multi',
                  optionKeys: Array.from(
                    new Set((current as Extract<QuestionResponse, { type: 'multi' }>).optionKeys ?? [])
                  ),
                  remarks: { ...(current.remarks ?? {}) },
                  followUps
                }
          return {
            responses: {
              ...state.responses,
              [itemId]: next
            }
          }
        })
      },
      setSceneNumeric: (fieldId, value) => {
        set((state) => ({
          sceneInfo: {
            ...state.sceneInfo,
            [fieldId]: value
          }
        }))
      },
      toggleEffect: (effectKey) => {
        set((state) => {
          const effects = new Set(state.sceneInfo.effects)
          if (effects.has(effectKey)) {
            effects.delete(effectKey)
          } else {
            effects.add(effectKey)
          }
          return {
            sceneInfo: {
              ...state.sceneInfo,
              effects: Array.from(effects)
            }
          }
        })
      },
      setSceneText: (key, value) => {
        set((state) => ({
          sceneInfo: {
            ...state.sceneInfo,
            [key]: value
          }
        }))
      },
      reset: () => {
        set({
          basicInfo: {},
          responses: {},
          sceneInfo: createInitialSceneInfo()
        })
      },
      getSnapshot: () => {
        const state = get()
        return {
          version: 1,
          basicInfo: state.basicInfo,
          responses: state.responses,
          sceneInfo: state.sceneInfo
        }
      },
      importSnapshot: (snapshot) => {
        if (!snapshot || typeof snapshot !== 'object') {
          return
        }
        set({
          basicInfo: snapshot.basicInfo ?? {},
          responses: snapshot.responses ?? {},
          sceneInfo: {
            ...createInitialSceneInfo(),
            ...(snapshot.sceneInfo ?? {})
          }
        })
      }
    }),
    {
      name: 'kunexi-questionnaire-state',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
