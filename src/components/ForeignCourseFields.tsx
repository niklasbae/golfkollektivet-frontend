import { ForeignScoreFormData } from './types';

type Props = {
  formData: ForeignScoreFormData;
  updateField: (field: keyof ForeignScoreFormData, value: any) => void;
  country: string;
  setCountry: (val: string) => void;
  inputStyle: (key: keyof ForeignScoreFormData | 'country') => any;
  missingFields: (keyof ForeignScoreFormData)[];
};

const ForeignCourseFields = ({
  formData,
  updateField,
  country,
  setCountry,
  inputStyle,
}: Props) => (
  <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
    {([
      { label: 'Klubb', key: 'manualClubName' },
      { label: 'Bane', key: 'manualCourseName' },
      { label: 'Tee', key: 'manualTeeName' },
    ] as { label: string; key: keyof ForeignScoreFormData }[]).map(({ label, key }) => (
      <label
        key={key}
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontWeight: 500,
          fontSize: '1rem',
          gap: '0.25rem',
        }}
      >
        {label}:
        <input
          type="text"
          value={
            typeof formData[key] === 'string' || typeof formData[key] === 'number'
              ? formData[key]
              : ''
          }
          onChange={(e) => updateField(key, e.target.value)}
          style={inputStyle(key)}
        />
      </label>
    ))}

    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        fontWeight: 500,
        fontSize: '1rem',
        gap: '0.25rem',
      }}
    >
      Land:
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={inputStyle('country')}
      />
    </label>

    <style>{`
      .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }

      @media (min-width: 768px) {
        .form-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `}</style>
  </div>
);

export { ForeignCourseFields };