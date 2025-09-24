import { BasicField } from '../types/questionnaire'

interface BasicInfoSectionProps {
  fields: BasicField[]
  values: Record<string, string>
  onChange: (fieldId: string, value: string) => void
}

export const BasicInfoSection = ({ fields, values, onChange }: BasicInfoSectionProps) => {
  return (
    <section className="panel glass-card">
      <header className="panel-header">
        <h2>一、企业基本信息</h2>
        <p className="panel-subtitle">完善企业基础信息有助于个性化诊断</p>
      </header>
      <div className="panel-body form-grid">
        {fields.map((field) => (
          <label key={field.id} className="form-field">
            <span className="form-label">{field.label}</span>
            <input
              className="form-input"
              type={field.type === 'number' ? 'number' : 'text'}
              placeholder={field.placeholder}
              value={values[field.id] ?? ''}
              onChange={(event) => onChange(field.id, event.target.value)}
            />
          </label>
        ))}
      </div>
    </section>
  )
}
