import { QuestionResponse, QuestionnaireConfig } from '../types/questionnaire'
import { ItemScoreDetail } from '../utils/scoring'
import { QuestionCard } from './QuestionCard'

interface QuestionnaireViewProps {
  config: QuestionnaireConfig
  responses: Record<number, QuestionResponse>
  itemScores: Map<number, ItemScoreDetail>
  onSelectSingle: (itemId: number, optionKey: string) => void
  onToggleMulti: (itemId: number, optionKey: string, maxSelections?: number) => void
  onRemarkChange: (itemId: number, type: 'single' | 'multi', optionKey: string, value: string) => void
  onFollowUpChange: (
    itemId: number,
    type: 'single' | 'multi',
    followUpId: string,
    value: string | number | boolean
  ) => void
}

export const QuestionnaireView = ({
  config,
  responses,
  itemScores,
  onSelectSingle,
  onToggleMulti,
  onRemarkChange,
  onFollowUpChange
}: QuestionnaireViewProps) => {
  return (
    <section className="questionnaire">
      {config.dimensions.map((dimension, index) => (
        <div key={dimension.name} className="dimension-block">
          <header className="dimension-block-header">
            <div>
              <span className="dimension-index">0{index + 1}</span>
              <h2>{dimension.name}</h2>
            </div>
            <div className="dimension-meta">
              <span>一级权重：{(dimension.weight * 100).toFixed(1)}%</span>
            </div>
          </header>
          {dimension.subdimensions.map((subdimension) => (
            <section key={subdimension.name} className="subdimension-block">
              <header className="subdimension-header">
                <h3>{subdimension.name}</h3>
                <span>二级权重：{(subdimension.weight * 100).toFixed(1)}%</span>
              </header>
              <div className="question-grid">
                {subdimension.items.map((item) => (
                  <QuestionCard
                    key={item.id}
                    item={item}
                    response={responses[item.id]}
                    scoreDetail={itemScores.get(item.id)}
                    onSelectSingle={onSelectSingle}
                    onToggleMulti={onToggleMulti}
                    onRemarkChange={onRemarkChange}
                    onFollowUpChange={onFollowUpChange}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ))}
    </section>
  )
}
