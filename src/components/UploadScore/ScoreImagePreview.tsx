// UploadScore/ScoreImagePreview.tsx

import React from 'react';
import styles from '../../styles/UploadScore.module.css';

type Props = {
  processedImageUrl: string | null;
  isMobile: boolean;
};

const ScoreImagePreview: React.FC<Props> = ({ processedImageUrl, isMobile }) => {
  if (!processedImageUrl) return null;

  const image = (
    <img
      src={processedImageUrl}
      alt="Opplastet scorekort"
      className={isMobile ? undefined : styles.scorecardImage}
    />
  );

  return isMobile ? (
    <div className={styles.scorecardMobileImage}>{image}</div>
  ) : (
    <div className={styles.scorecardDesktopImage}>
      <h4 className={styles.previewTitle}>📷 Originalt bilde</h4>
      {image}
    </div>
  );
};

export default ScoreImagePreview;