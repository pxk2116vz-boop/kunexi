import { SceneField } from '../types/questionnaire'
import { SceneInfoState } from '../store/questionnaireStore'

interface SceneSectionProps {
  fields: SceneField[]
  effects: { key: string; label: string }[]
  sceneInfo: SceneInfoState
  onNumericChange: (fieldId: 'sceneCount' | 'constrainedSceneCount', value: number | null) => void
  onToggleEffect: (effectKey: string) => void
  onTextChange: (key: 'otherEffectNote' | 'upgradeTarget' | 'painPoints' | 'externalSupport', value: string) => void
}

const parseNumberInput = (value: string): number | null => {
  if (value === '') {
    return null
  }
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export const SceneSection = ({
  fields,
  effects,
  sceneInfo,
  onNumericChange,
  onToggleEffect,
  onTextChange
}: SceneSectionProps) => {
  return (
    <section className="panel glass-card">
      <header className="panel-header">
        <h2>三、成效与需求</h2>
        <p className="panel-subtitle">记录数字化应用场景与支持需求，辅助升级判定</p>
      </header>
      <div className="panel-body scene-grid">
        {fields.map((field) => (
          <label key={field.id} className="form-field">
            <span className="form-label">{field.label}</span>
            <input
              className="form-input"
              type="number"
              min={0}
              value={sceneInfo[field.id] ?? ''}
              placeholder={field.helper}
              onChange={(event) => onNumericChange(field.id, parseNumberInput(event.target.value))}
            />
            {field.helper ? <span className="form-helper">{field.helper}</span> : null}
          </label>
        ))}
      </div>
      <div className="panel-subsection">
        <h3>已实现的主要效益</h3>
        <div className="effect-options">
          {effects.map((effect) => {
            const checked = sceneInfo.effects.includes(effect.key)
            return (
              <label key={effect.key} className={`effect-pill ${checked ? 'effect-pill-active' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleEffect(effect.key)}
                />
                <span>{effect.label}</span>
              </label>
            )
          })}
        </div>
        {sceneInfo.effects.includes('other') ? (
          <textarea
            className="form-textarea"
            placeholder="请描述其他获得的成效"
            value={sceneInfo.otherEffectNote}
            onChange={(event) => onTextChange('otherEffectNote', event.target.value)}
          />
        ) : null}
      </div>
      <div className="panel-subsection">
        <h3>升级目标与支持诉求</h3>
        <div className="form-grid two-column">
          <label className="form-field">
            <span className="form-label">希望升级到的等级目标</span>
            <input
              className="form-input"
              placeholder="请输入计划达到的数字化等级"
              value={sceneInfo.upgradeTarget}
              onChange={(event) => onTextChange('upgradeTarget', event.target.value)}
            />
          </label>
          <label className="form-field">
            <span className="form-label">需要的外部支持</span>
            <input
              className="form-input"
              placeholder="如：资金、技术、培训、政策"
              value={sceneInfo.externalSupport}
              onChange={(event) => onTextChange('externalSupport', event.target.value)}
            />
          </label>
        </div>
        <label className="form-field">
          <span className="form-label">当前主要困难/瓶颈</span>
          <textarea
            className="form-textarea"
            placeholder="请描述推进数字化过程中遇到的困难"
            value={sceneInfo.painPoints}
            onChange={(event) => onTextChange('painPoints', event.target.value)}
          />
        </label>
      </div>
    </section>
  )
}
