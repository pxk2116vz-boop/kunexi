import { DimensionScoreDetail } from '../utils/scoring'

interface DimensionSummaryProps {
  dimensions: DimensionScoreDetail[]
  scoreScale: number
}

export const DimensionSummary = ({ dimensions, scoreScale }: DimensionSummaryProps) => {
  return (
    <section className="panel glass-card">
      <header className="panel-header">
        <h2>维度得分概览</h2>
        <p className="panel-subtitle">实时掌握各模块完成度与得分贡献</p>
      </header>
      <div className="panel-body dimension-list">
        {dimensions.map((dimension) => {
          const progress = scoreScale === 0 ? 0 : Math.min(dimension.score / scoreScale, 1)
          const answeredRatio =
            dimension.totalCount === 0 ? 0 : dimension.answeredCount / dimension.totalCount
          return (
            <div key={dimension.name} className="dimension-item">
              <div className="dimension-header">
                <span>{dimension.name}</span>
                <span className="dimension-score">{dimension.score.toFixed(1)} 分</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }} />
              </div>
              <div className="dimension-meta">
                <span>答题进度：{Math.round(answeredRatio * 100)}%</span>
                <span>权重占比：{(dimension.weightShare * 100).toFixed(1)}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
