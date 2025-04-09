import React from 'react';
import { ForeignScoreFormData } from './types';
import styles from '../../styles/UploadScore.module.css';

type Props = {
  formData: ForeignScoreFormData;
  updateField: (field: keyof ForeignScoreFormData, value: any) => void;
  country: string;
  setCountry: (value: string) => void;
  inputStyle: (key: string) => React.CSSProperties;
  missingFields: (keyof ForeignScoreFormData)[];
};

export const ForeignCourseFields: React.FC<Props> = ({
  formData,
  updateField,
  country,
  setCountry,
  inputStyle,
}) => {
  return (
    <div className={styles.foreignFormGrid}>
      <label htmlFor="manualClubName" className={styles.label}>
        Klubb:
        <input
          id="manualClubName"
          type="text"
          value={formData.manualClubName}
          onChange={(e) => updateField('manualClubName', e.target.value)}
          style={inputStyle('manualClubName')}
        />
      </label>

      <label htmlFor="manualCourseName" className={styles.label}>
        Bane:
        <input
          id="manualCourseName"
          type="text"
          value={formData.manualCourseName}
          onChange={(e) => updateField('manualCourseName', e.target.value)}
          style={inputStyle('manualCourseName')}
        />
      </label>

      <label htmlFor="manualTeeName" className={styles.label}>
        Tee:
        <input
          id="manualTeeName"
          type="text"
          value={formData.manualTeeName}
          onChange={(e) => updateField('manualTeeName', e.target.value)}
          style={inputStyle('manualTeeName')}
        />
      </label>

      <label htmlFor="country" className={styles.label}>
        Land:
        <input
          id="country"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={inputStyle('country')}
        />
      </label>
    </div>
  );
};