// UploadScore/ScoreImagePreview.tsx

import React from 'react';
import styles from '../../styles/UploadScore.module.css';

type Props = {
  processedImageUrl: string | null;
  isMobile: boolean;
  showDouble?: boolean;
};

const ScoreImagePreview: React.FC<Props> = ({ processedImageUrl, isMobile, showDouble = false }) => {
  if (!processedImageUrl) return null;

  const image = (
    <img
      src={processedImageUrl}
      alt="Opplastet scorekort"
      className={isMobile ? undefined : styles.scorecardImage}
    />
  );

  return isMobile ? (
    <div>
      <div className={styles.scorecardMobileImage}>{image}</div>
      {showDouble && <div className={styles.scorecardMobileImageSecondImage}>{image}</div>}
      </div>
    
  ) : (
    <div className={styles.scorecardDesktopImage}>
      {image}
    </div>
  );
};

export default ScoreImagePreview;