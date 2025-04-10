import React from 'react';
import styles from '../../styles/UploadScore.module.css';
import { ScoreSums } from './types';

type Props = {
  isForeignClub: boolean;
  scoreSums: ScoreSums | null;
  foreignScoreSums: ScoreSums;
  submitToGolfbox: () => void;
};

const ScoreTotals: React.FC<Props> = ({
  isForeignClub,
  scoreSums,
  foreignScoreSums,
  submitToGolfbox,
}) => {
  const current = isForeignClub ? foreignScoreSums : scoreSums;

  if (!current) return null;

  return (
    <div>
      <p><strong>Total:</strong> {current.totalSum}</p>
      <button onClick={submitToGolfbox} className={styles.submitButton}>
        Send til GolfBox
      </button>
    </div>
  );
};

export default ScoreTotals;