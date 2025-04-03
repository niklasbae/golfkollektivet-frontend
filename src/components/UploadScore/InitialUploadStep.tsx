import React from "react";
import styles from '../../styles/UploadScore.module.css';

type Props = {
  isForeignClub: boolean;
  setIsForeignClub: (value: boolean) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleParseImage: () => void;
  loading: boolean;
};

const InitialUploadStep = ({
  isForeignClub,
  setIsForeignClub,
  handleImageUpload,
  handleParseImage,
  loading,
}: Props) => {
  return (
    <div className={styles.initialUploadWrapper}>
      <h2>Last opp scorekort 📸</h2>
      <p>
        Ta et screenshot av runden din i Golf Gamebook og last det opp her.
      </p>

      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={isForeignClub}
          onChange={() => setIsForeignClub(!isForeignClub)}
        />
        Internasjonal klubb (utenfor GolfBox)
      </label>

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