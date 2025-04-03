import UploadScore from '../components/UploadScore'; // ✅ New component
import OldUploadScore from '../components/UploadScoreOld'; // 🛠 Create this file with old code

const CompareUpload = () => {
  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '500px' }}>
        <h2>🆕 Refactored UploadScore</h2>
        <UploadScore />
      </div>
      <div style={{ flex: 1, minWidth: '500px' }}>
        <h2>🕰️ Old UploadScore</h2>
        <OldUploadScore />
      </div>
    </div>
  );
};

export default CompareUpload;