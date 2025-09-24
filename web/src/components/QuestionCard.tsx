import { useMemo, useState } from 'react'
import clsx from 'clsx'

import { QuestionItem, QuestionResponse } from '../types/questionnaire'
import { ItemScoreDetail } from '../utils/scoring'

interface QuestionCardProps {
  item: QuestionItem
  response?: QuestionResponse
  scoreDetail?: ItemScoreDetail
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

const formatScore = (value: number) => {
  if (Number.isNaN(value)) {
    return '0'
  }
  return Math.round(value * 100) % 100 === 0 ? value.toFixed(0) : value.toFixed(1)
}

export const QuestionCard = ({
  item,
  response,
  scoreDetail,
  onSelectSingle,
  onToggleMulti,
  onRemarkChange,
  onFollowUpChange
}: QuestionCardProps) => {
  const [expandedRemarks, setExpandedRemarks] = useState<Record<string, boolean>>({})

  const maxScore = item.scoring.max_score
  const currentScore = scoreDetail?.rawScore ?? 0
  const weightedContribution = scoreDetail?.weightedScore ?? 0
  const weightShare = scoreDetail?.weightShare ?? 0

  const optionSelection = useMemo(() => {
    if (!response) {
      return new Set<string>()
    }
    if (response.type === 'single') {
      return response.optionKey ? new Set([response.optionKey]) : new Set<string>()
    }
    return new Set(response.optionKeys)
  }, [response])

  const handleToggleRemark = (optionKey: string) => {
    setExpandedRemarks((prev) => ({
      ...prev,
      [optionKey]: !prev[optionKey]
    }))
  }

  const renderOption = (optionKey: string, label: string, remarkPlaceholder?: string) => {
    const selected = optionSelection.has(optionKey)
    const remarkValue = response?.remarks?.[optionKey] ?? ''
    const open = expandedRemarks[optionKey] || Boolean(remarkValue)
    return (
      <div key={optionKey} className={clsx('option-row', selected && 'option-row-active')}>
        <label className="option-main">
          {item.type === 'single' ? (
            <input
              type="radio"
              name={`question-${item.id}`}
              checked={selected}
              onChange={() => onSelectSingle(item.id, optionKey)}
            />
          ) : (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleMulti(item.id, optionKey, item.maxSelections)}
            />
          )}
          <span className="option-label">{label}</span>
        </label>
        {(selected || remarkValue) && (
          <button
            type="button"
            className="remark-toggle"
            onClick={() => handleToggleRemark(optionKey)}
          >
            {open ? '收起备注' : '添加备注'}
          </button>
        )}
        {open && (selected || remarkValue) ? (
          <textarea
            className="form-textarea option-remark"
            placeholder={remarkPlaceholder ?? '填写备注信息'}
            value={remarkValue}
            onChange={(event) => onRemarkChange(item.id, item.type, optionKey, event.target.value)}
          />
        ) : null}
      </div>
    )
  }

  return (
    <article className="question-card glass-card">
      <header className="question-header">
        <div>
          <span className="question-code">{item.code}</span>
          <h3>{item.title}</h3>
          {item.description ? <p className="question-desc">{item.description}</p> : null}
        </div>
        <div className="question-score">
          <span>当前得分</span>
          <strong>{formatScore(currentScore)} / {formatScore(maxScore)}</strong>
          <span className="question-score-meta">
            实际贡献 {(weightedContribution * 100).toFixed(2)}% · 潜在贡献 {(weightShare * 100).toFixed(2)}%
          </span>
        </div>
      </header>
      <div className="question-body">
        {item.maxSelections ? (
          <p className="question-hint">最多可选择 {item.maxSelections} 项</p>
        ) : null}
        <div className="option-list">
          {item.options.map((option) => renderOption(option.key, option.label, option.remarkPlaceholder))}
        </div>
        {item.followUps && item.followUps.length > 0 ? (
          <div className="followup-grid">
            {item.followUps.map((followUp) => {
              const value = response?.followUps?.[followUp.id]
              if (followUp.type === 'boolean') {
                const checked = Boolean(value)
                return (
                  <label key={followUp.id} className="form-field">
                    <span className="form-label">{followUp.label}</span>
                    <div className="toggle-field">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          onFollowUpChange(item.id, item.type, followUp.id, event.target.checked)
                        }
                      />
                      <span>{checked ? '是' : '否'}</span>
                    </div>
                  </label>
                )
              }
              const valueString = value === undefined || value === null ? '' : String(value)
              return (
                <label key={followUp.id} className="form-field">
                  <span className="form-label">{followUp.label}</span>
                  {followUp.type === 'number' ? (
                    <input
                      className="form-input"
                      type="number"
                      value={valueString}
                      placeholder={followUp.placeholder}
                      onChange={(event) => {
                        const raw = event.target.value
                        onFollowUpChange(
                          item.id,
                          item.type,
                          followUp.id,
                          raw === '' ? '' : Number(raw)
                        )
                      }}
                    />
                  ) : (
                    <input
                      className="form-input"
                      type="text"
                      value={valueString}
                      placeholder={followUp.placeholder}
                      onChange={(event) =>
                        onFollowUpChange(item.id, item.type, followUp.id, event.target.value)
                      }
                    />
                  )}
                </label>
              )
            })}
          </div>
        ) : null}
      </div>
    </article>
  )
}
