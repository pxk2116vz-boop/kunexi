import { useMemo } from 'react'

import { BasicInfoSection } from './components/BasicInfoSection'
import { DataActions } from './components/DataActions'
import { DimensionSummary } from './components/DimensionSummary'
import { QuestionnaireView } from './components/QuestionnaireView'
import { SceneSection } from './components/SceneSection'
import { ScoreHeader } from './components/ScoreHeader'
import { basicFields, effectOptions, questionnaireConfig, sceneFields } from './config/questionnaire'
import { useQuestionnaireStore } from './store/questionnaireStore'
import {
  ItemScoreDetail,
  checkUpgradeEligibility,
  computeScoreSummary
} from './utils/scoring'

import './App.css'

const App = () => {
  const basicInfo = useQuestionnaireStore((state) => state.basicInfo)
  const responses = useQuestionnaireStore((state) => state.responses)
  const sceneInfo = useQuestionnaireStore((state) => state.sceneInfo)

  const setBasicInfo = useQuestionnaireStore((state) => state.setBasicInfo)
  const setSingleResponse = useQuestionnaireStore((state) => state.setSingleResponse)
  const toggleMultiOption = useQuestionnaireStore((state) => state.toggleMultiOption)
  const setRemark = useQuestionnaireStore((state) => state.setRemark)
  const setFollowUp = useQuestionnaireStore((state) => state.setFollowUp)
  const setSceneNumeric = useQuestionnaireStore((state) => state.setSceneNumeric)
  const toggleEffect = useQuestionnaireStore((state) => state.toggleEffect)
  const setSceneText = useQuestionnaireStore((state) => state.setSceneText)
  const reset = useQuestionnaireStore((state) => state.reset)
  const getSnapshot = useQuestionnaireStore((state) => state.getSnapshot)
  const importSnapshot = useQuestionnaireStore((state) => state.importSnapshot)

  const summary = useMemo(
    () => computeScoreSummary(responses, questionnaireConfig),
    [responses]
  )

  const itemScoreMap = useMemo(() => {
    const map = new Map<number, ItemScoreDetail>()
    for (const item of summary.items) {
      map.set(item.itemId, item)
    }
    return map
  }, [summary])

  const upgradeStatus = useMemo(
    () =>
      checkUpgradeEligibility(
        sceneInfo.sceneCount,
        sceneInfo.constrainedSceneCount,
        questionnaireConfig
      ),
    [sceneInfo.constrainedSceneCount, sceneInfo.sceneCount]
  )

  const handleExport = () => {
    const snapshot = getSnapshot()
    const content = JSON.stringify(snapshot, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19)
    anchor.download = `questionnaire-${stamp}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        importSnapshot(parsed)
      } catch (error) {
        console.error('Failed to import questionnaire data', error)
        window.alert('导入失败，请确认文件格式正确。')
      }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (window.confirm('确定要清空当前答卷与备注吗？')) {
      reset()
    }
  }

  return (
    <div className="app-shell">
      <div className="app-background" />
      <main className="app-layout">
        <div className="app-sidebar">
          <ScoreHeader summary={summary} upgradeStatus={upgradeStatus} sceneInfo={sceneInfo} />
          <DimensionSummary dimensions={summary.dimensions} scoreScale={summary.scoreScale} />
          <DataActions onExport={handleExport} onImport={handleImport} onReset={handleReset} />
        </div>
        <div className="app-content">
          <BasicInfoSection fields={basicFields} values={basicInfo} onChange={setBasicInfo} />
          <QuestionnaireView
            config={questionnaireConfig}
            responses={responses}
            itemScores={itemScoreMap}
            onSelectSingle={(itemId, optionKey) => setSingleResponse(itemId, optionKey)}
            onToggleMulti={(itemId, optionKey, max) => toggleMultiOption(itemId, optionKey, max)}
            onRemarkChange={(itemId, type, optionKey, value) => setRemark(itemId, type, optionKey, value)}
            onFollowUpChange={(itemId, type, followUpId, value) =>
              setFollowUp(itemId, type, followUpId, value)
            }
          />
          <SceneSection
            fields={sceneFields}
            effects={effectOptions}
            sceneInfo={sceneInfo}
            onNumericChange={(fieldId, value) => setSceneNumeric(fieldId, value)}
            onToggleEffect={(effectKey) => toggleEffect(effectKey)}
            onTextChange={(key, value) => setSceneText(key, value)}
          />
        </div>
      </main>
    </div>
  )
}

export default App
