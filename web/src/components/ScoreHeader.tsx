import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

import { SceneInfoState } from '../store/questionnaireStore'
import { ScoreSummary } from '../utils/scoring'

interface UpgradeStatus {
  eligible: boolean
  missingScenes: number
  missingConstrained: number
  requirement: {
    from_level: number
    to_level: number
    min_scenes_total: number
    min_constrained_scenes: number
  }
}

interface ScoreHeaderProps {
  summary: ScoreSummary
  upgradeStatus: UpgradeStatus
  sceneInfo: SceneInfoState
}

export const ScoreHeader = ({ summary, upgradeStatus, sceneInfo }: ScoreHeaderProps) => {
  const progress = Math.min(summary.normalizedTotal, 1)
  const radarData = summary.dimensions.map((dimension) => ({
    subject: dimension.name,
    score: Number(dimension.score.toFixed(2))
  }))

  return (
    <section className="score-header glass-card">
      <div className="score-main">
        <div className="score-value">
          <span className="score-label">实时总分</span>
          <strong>{summary.totalScore.toFixed(2)}</strong>
          <span className="score-scale">满分 {summary.scoreScale}</span>
          <div className="score-progress">
            <div className="score-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
        <div className="score-chart">
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} outerRadius="80%">
              <PolarGrid strokeDasharray="4 6" stroke="rgba(255,255,255,0.25)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#a5b4fc', fontSize: 12 }} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar
                dataKey="score"
                stroke="#60a5fa"
                fill="#60a5fa"
                fillOpacity={0.35}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="score-upgrade">
        <h3>等级升级判定</h3>
        <p>
          当前从 <strong>L{upgradeStatus.requirement.from_level}</strong> 升级至{' '}
          <strong>L{upgradeStatus.requirement.to_level}</strong> 的条件：
          至少 {upgradeStatus.requirement.min_scenes_total} 个场景，其中约束性场景不少于{' '}
          {upgradeStatus.requirement.min_constrained_scenes} 个。
        </p>
        <div className="upgrade-status">
          <div className={`upgrade-badge ${upgradeStatus.eligible ? 'upgrade-badge-ok' : 'upgrade-badge-pending'}`}>
            {upgradeStatus.eligible ? '已满足升级条件' : '暂未满足升级条件'}
          </div>
          <ul className="upgrade-metrics">
            <li>
              <span>上线场景</span>
              <strong>{sceneInfo.sceneCount ?? 0}</strong>
              <small>缺口 {Math.max(upgradeStatus.missingScenes, 0)}</small>
            </li>
            <li>
              <span>约束性场景</span>
              <strong>{sceneInfo.constrainedSceneCount ?? 0}</strong>
              <small>缺口 {Math.max(upgradeStatus.missingConstrained, 0)}</small>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
