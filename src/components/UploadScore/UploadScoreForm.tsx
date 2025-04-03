import React from 'react';
import { ForeignCourseFields } from '../ForeignCourseFields';
import { DomesticCourseFields } from '../DomesticCourseFields';
import HoleDetailsGrid from './HoleDetailsGrid';
import ScoreImagePreview from './ScoreImagePreview';

import styles from '../../styles/UploadScore.module.css';
import { UploadScoreFormProps, ForeignScoreFormData } from './types';

const UploadScoreForm: React.FC<UploadScoreFormProps> = ({
  isForeignClub,
  showForeignExtras,
  foreignNote,
  status,
  scoreSums,
  foreignScoreSums,
  fieldLabels,
  inputStyle,
  safeFormData,
  formData,
  foreignFormData,
  clubs,
  courses,
  tees,
  clubSelectValue,
  courseSelectValue,
  teeSelectValue,
  setClubSelectValue,
  setCourseSelectValue,
  setTeeSelectValue,
  missingFields,
  foreignMissingFields,
  country,
  setCountry,
  updateField,
  updateForeignField,
  updateHoleScore,
  submitToGolfbox,
  submitted,
  resetForm,
  processedImageUrl,
  isMobile
}) => {
  const editableForeignKeys: (keyof ForeignScoreFormData)[] = [
    'username',
    'password',
    'markerName',
    'scoreDate',
    'scoreTime',
    'manualClubName',
    'manualCourseName',
    'manualTeeName',
  ];

  return (
    <div className={styles.formWrapper}>
      {isForeignClub && (
        <ForeignCourseFields
          formData={foreignFormData}
          updateField={updateForeignField}
          country={country}
          setCountry={setCountry}
          inputStyle={inputStyle}
          missingFields={foreignMissingFields}
        />
      )}

      {foreignNote && <p className={styles.noteBox}>📌 {foreignNote}</p>}
      {status && <p className={styles.statusText}>{status}</p>}

      {showForeignExtras && isForeignClub && (
        <div className={styles.formGrid}>
          {(['par', 'courseRating', 'slope'] as const).map((field) => (
            <label key={field} className={styles.label}>
              {fieldLabels[field]}:
              <input
                type="number"
                value={foreignFormData[field]}
                onChange={(e) =>
                  updateForeignField(field, parseFloat(e.target.value.replace(',', '.')) || 0)
                }
                style={inputStyle(field)}
              />
            </label>
          ))}
        </div>
      )}

      {(formData || showForeignExtras) && (
        <div className={styles.editorSection}>
          <h3>📜 Rediger scoredata</h3>

          <div className={styles.formGrid}>
            {isForeignClub ? (
              editableForeignKeys.map((key) => (
                <label key={key} className={styles.label}>
                  {fieldLabels[key]}:
                  <input
                    type={key === 'password' ? 'password' : 'text'}
                    value={foreignFormData[key] as string}
                    onChange={(e) => updateForeignField(key, e.target.value)}
                    style={inputStyle(key)}
                  />
                </label>
              ))
            ) : (
              <>
                <label className={styles.label}>
                  {fieldLabels.username}:
                  <input
                    type="text"
                    value={safeFormData.username}
                    onChange={(e) => updateField('username', e.target.value)}
                    style={inputStyle('username')}
                  />
                </label>

                <label className={styles.label}>
                  {fieldLabels.password}:
                  <input
                    type="password"
                    value={safeFormData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    style={inputStyle('password')}
                  />
                </label>

                <DomesticCourseFields
                  formData={safeFormData}
                  updateField={updateField}
                  clubs={clubs}
                  courses={courses}
                  tees={tees}
                  clubSelectValue={clubSelectValue}
                  courseSelectValue={courseSelectValue}
                  teeSelectValue={teeSelectValue}
                  setClubSelectValue={setClubSelectValue}
                  setCourseSelectValue={setCourseSelectValue}
                  setTeeSelectValue={setTeeSelectValue}
                  missingFields={missingFields}
                  inputStyle={inputStyle}
                  fieldLabels={fieldLabels}
                />

                <label className={styles.label}>
                  {fieldLabels.markerName}:
                  <input
                    type="text"
                    value={safeFormData.markerName}
                    onChange={(e) => updateField('markerName', e.target.value)}
                    style={inputStyle('markerName')}
                  />
                </label>

                <label className={styles.label}>
                  {fieldLabels.scoreDate}:
                  <input
                    type="text"
                    value={safeFormData.scoreDate}
                    onChange={(e) => updateField('scoreDate', e.target.value)}
                    style={inputStyle('scoreDate')}
                  />
                </label>

                <label className={styles.label}>
                  {fieldLabels.scoreTime}:
                  <input
                    type="text"
                    value={safeFormData.scoreTime}
                    onChange={(e) => updateField('scoreTime', e.target.value)}
                    style={inputStyle('scoreTime')}
                  />
                </label>
              </>
            )}
          </div>

          {isForeignClub ? (
            <div className={styles.holeDetailsWrapper}>
              <HoleDetailsGrid
                holes={foreignFormData.holes}
                updateHoleData={(index, field, value) => {
                  const updated = [...foreignFormData.holes];
                  updated[index][field] = value;
                  updateForeignField('holes', updated);
                }}
              />
              {processedImageUrl && isMobile && (
                <ScoreImagePreview processedImageUrl={processedImageUrl} isMobile={isMobile} />
              )}
            </div>
          ) : (
            <div className={styles.holeGrid}>
              {safeFormData.holeScores.map((score, i) => (
                <input
                  key={i}
                  type="number"
                  value={score}
                  onChange={(e) => updateHoleScore(i, parseInt(e.target.value) || 0)}
                />
              ))}
            </div>
          )}

          <div className={styles.submitSection}>
            <div>
              <p><strong>Front 9:</strong> {isForeignClub ? foreignScoreSums.frontSum : scoreSums?.frontSum}</p>
              {((isForeignClub && foreignScoreSums.backSum !== null) || (!isForeignClub && scoreSums?.backSum !== null)) && (
                <p><strong>Back 9:</strong> {isForeignClub ? foreignScoreSums.backSum : scoreSums?.backSum}</p>
              )}
              <p><strong>Total:</strong> {isForeignClub ? foreignScoreSums.totalSum : scoreSums?.totalSum}</p>
              <button onClick={submitToGolfbox} className={styles.submitButton}>
                Send til GolfBox
              </button>
            </div>

            {processedImageUrl && !isMobile && (
              <ScoreImagePreview processedImageUrl={processedImageUrl} isMobile={isMobile} />
            )}
          </div>

          {submitted && (
            <div className={styles.successBox}>
              <p>✅ Score er sendt! Du kan nå lukke siden eller laste opp en ny runde.</p>
              <button onClick={resetForm}>Last opp ny runde 🔄</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadScoreForm;