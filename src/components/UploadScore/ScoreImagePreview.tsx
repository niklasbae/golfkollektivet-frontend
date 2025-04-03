import styles from '../../styles/UploadScore.module.css';

type Props = {
  processedImageUrl: string | null;
  isMobile: boolean;
};

const ScoreImagePreview = ({ processedImageUrl, isMobile }: Props) => {
  if (!processedImageUrl) return null;

  return isMobile ? (
    <div className={styles.scorecardMobileImage}>
      <img src={processedImageUrl} alt="Opplastet scorekort" />
    </div>
  ) : (
    <div className={styles.scorecardDesktopImage}>
      <h4 className={styles.previewTitle}>📷 Originalt bilde</h4>
      <img src={processedImageUrl} alt="Opplastet scorekort" className={styles.scorecardImage} />
    </div>
  );
};

export default ScoreImagePreview;