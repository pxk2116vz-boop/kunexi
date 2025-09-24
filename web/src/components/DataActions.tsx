import { ChangeEvent, useRef } from 'react'

interface DataActionsProps {
  onExport: () => void
  onImport: (file: File) => void
  onReset: () => void
}

export const DataActions = ({ onExport, onImport, onReset }: DataActionsProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImport(file)
    }
    event.target.value = ''
  }

  return (
    <section className="panel glass-card data-actions">
      <header className="panel-header">
        <h2>数据管理</h2>
        <p className="panel-subtitle">导出答卷或导入历史数据，支持一键重置</p>
      </header>
      <div className="panel-body action-buttons">
        <button type="button" className="btn" onClick={onExport}>
          导出 JSON
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => fileInputRef.current?.click()}
        >
          导入 JSON
        </button>
        <button type="button" className="btn btn-danger" onClick={onReset}>
          清空答卷
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden-input"
          onChange={handleFileChange}
        />
      </div>
    </section>
  )
}
