import React from 'react';
import styles from '../../styles/UploadScore.module.css';
import { Club, Course, Tee, ScoreFormData } from './types';

type Props = {
  formData: ScoreFormData;
  updateField: (field: keyof ScoreFormData, value: any) => void;
  clubs: Club[];
  courses: Course[];
  tees: Tee[];
  clubSelectValue: { label: string; value: string } | null;
  courseSelectValue: { label: string; value: string } | null;
  teeSelectValue: { label: string; value: string } | null;
  setClubSelectValue: (val: { label: string; value: string } | null) => void;
  setCourseSelectValue: (val: { label: string; value: string } | null) => void;
  setTeeSelectValue: (val: { label: string; value: string } | null) => void;
  missingFields: (keyof ScoreFormData)[];
  inputStyle: (key: string) => React.CSSProperties;
  fieldLabels: Record<string, string>;
};

export const DomesticCourseFields: React.FC<Props> = ({
  clubs,
  courses,
  tees,
  clubSelectValue,
  courseSelectValue,
  teeSelectValue,
  setClubSelectValue,
  setCourseSelectValue,
  setTeeSelectValue,
  updateField,
  inputStyle,
  fieldLabels,
}) => {
  return (
    <>
      <label className={styles.label}>
        {fieldLabels.clubName}:
        <select
          value={clubSelectValue?.value || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              setClubSelectValue({ label: val, value: val });
              updateField('clubName', val);
            } else {
              setClubSelectValue(null);
              updateField('clubName', '');
            }
          }}
          style={{
            ...inputStyle('clubName'),
            padding: '0.5rem',
            borderRadius: '8px',
            textAlign: 'left',
            textAlignLast: 'left',
          }}
        >
          <option value="">Velg klubb</option>
          {[...clubs].sort((a, b) => a.clubName.localeCompare(b.clubName)).map((club) => (
            <option key={club.clubGuid} value={club.clubName}>
              {club.clubName}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        {fieldLabels.courseName}:
        <select
          value={courseSelectValue?.value || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              setCourseSelectValue({ label: val, value: val });
              updateField('courseName', val);
            } else {
              setCourseSelectValue(null);
              updateField('courseName', '');
            }
          }}
          style={{
            ...inputStyle('courseName'),
            padding: '0.5rem',
            borderRadius: '8px',
            textAlign: 'left',
            textAlignLast: 'left',
          }}
        >
          <option value="">Velg bane</option>
          {courses.map((course) => (
            <option key={course.courseGuid} value={course.courseName}>
              {course.courseName}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.label}>
        {fieldLabels.teeName}:
        <select
          value={teeSelectValue?.value || ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              setTeeSelectValue({ label: val, value: val });
              updateField('teeName', val);
            } else {
              setTeeSelectValue(null);
              updateField('teeName', '');
            }
          }}
          style={{
            ...inputStyle('teeName'),
            padding: '0.5rem',
            borderRadius: '8px',
            textAlign: 'left',
            textAlignLast: 'left',
          }}
        >
          <option value="">Velg tee</option>
          {tees.map((tee, idx) => (
            <option key={`${tee.teeName}-${idx}`} value={tee.teeName}>
              {tee.teeName}
            </option>
          ))}
        </select>
      </label>
    </>
  );
};

export default DomesticCourseFields;