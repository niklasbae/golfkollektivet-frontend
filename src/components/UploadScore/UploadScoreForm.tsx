import React from 'react';
import { ForeignCourseFields } from './ForeignCourseFields';
import { DomesticCourseFields } from './DomesticCourseFields';
import HoleDetailsGrid from './HoleDetailsGrid';
import ScoreImagePreview from './ScoreImagePreview';
import SharedUserFields from './SharedUserFields';
import ScoreTotals from './ScoreTotals';
import DomesticHoleGrid from './DomesticHoleGrid';
import styles from '../../styles/UploadScore.module.css';
import { UploadScoreFormProps } from './types';

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
  isMobile,
  markerOptions,
  selectedMarker,
  setSelectedMarker
}) => {
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
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={foreignFormData[field] === 0 ? '' : foreignFormData[field]?.toString() ?? ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(',', '.');
                  const numeric = field === 'courseRating' ? parseFloat(raw) : parseInt(raw);
                  updateForeignField(field, isNaN(numeric) ? 0 : numeric);
                }}
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
          <SharedUserFields
            data={isForeignClub ? foreignFormData : safeFormData}
            update={isForeignClub ? updateForeignField : updateField}
            fields={['username', 'password', 'markerName', 'scoreDate', 'scoreTime']}
            fieldLabels={fieldLabels}
            inputStyle={inputStyle}
            markerOptions={markerOptions}
            selectedMarker={selectedMarker}
            setSelectedMarker={setSelectedMarker}
          />

            {!isForeignClub && (
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
            <DomesticHoleGrid
              scores={safeFormData.holeScores}
              updateScore={updateHoleScore}
            />
          )}

          <ScoreTotals
            isForeignClub={isForeignClub}
            foreignScoreSums={foreignScoreSums}
            scoreSums={scoreSums}
            submitToGolfbox={submitToGolfbox}
          />

          {processedImageUrl && !isMobile && (
            <ScoreImagePreview processedImageUrl={processedImageUrl} isMobile={isMobile} />
          )}

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