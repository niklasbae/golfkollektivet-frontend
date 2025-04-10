import React from "react";
import styles from '../../styles/UploadScore.module.css';
import { ForeignCourseFields } from './ForeignCourseFields';
import { ForeignScoreFormData } from './types';

type Props = {
  isForeignClub: boolean;
  setIsForeignClub: (value: boolean) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleParseImage: () => void;
  loading: boolean;
  foreignFormData: ForeignScoreFormData;
  updateForeignField: (field: keyof ForeignScoreFormData, value: any) => void;
  country: string;
  setCountry: (value: string) => void;
  inputStyle: (key: string) => React.CSSProperties;
  missingFields: (keyof ForeignScoreFormData)[];
  markerSearch: string;
  setMarkerSearch: (val: string) => void;
  image: File | null;
  status: string;
};

const InitialUploadStep = ({
  isForeignClub,
  setIsForeignClub,
  handleImageUpload,
  handleParseImage,
  loading,
  foreignFormData,
  updateForeignField,
  country,
  setCountry,
  inputStyle,
  missingFields,
  markerSearch,
  setMarkerSearch,
  status,
}: Props) => {
  return (
    <div className={styles.initialUploadWrapper}>
      <h2>Last opp scorekort</h2>
      <p>Ta et screenshot av runden din i Golf Gamebook og last det opp her.</p>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={isForeignClub}
          onChange={() => setIsForeignClub(!isForeignClub)}
        />
        Internasjonal klubb (utenfor GolfBox)
      </label>

      {isForeignClub && (
        <ForeignCourseFields
          formData={foreignFormData}
          updateField={updateForeignField}
          country={country}
          setCountry={setCountry}
          inputStyle={inputStyle}
          missingFields={missingFields}
        />
      )}

      <div className={styles.formGrid} style={{ marginBottom: '0.75rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Søk etter markør (navn eller medlemsnummer):
          <input
            type="text"
            value={markerSearch}
            onChange={(e) => setMarkerSearch(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
            }}
          />
        </label>
      </div>
      {status && <p className={styles.statusText}>{status}</p>}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className={styles.fileInput}
      />

      <button onClick={handleParseImage} disabled={loading} className={styles.primaryButton}>
        {loading ? "Laster opp..." : "Send til AI"}
      </button>
    </div>
  );
};

export default InitialUploadStep;