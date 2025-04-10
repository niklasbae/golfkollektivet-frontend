import { useEffect, useState } from 'react';
import styles from '../../styles/UploadScore.module.css';

type Props = {
  scores: number[];
  updateScore: (index: number, value: number) => void;
};

const DomesticHoleGrid = ({ scores, updateScore }: Props) => {
  const [isMobile, setIsMobile] = useState(false);
  const front9 = scores.slice(0, 9);
  const back9 = scores.slice(9, 18);
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const renderDesktopTable = (holes: number[], offset: number, label: string) => (
    <table className={styles.domesticHoleTable}>
      <thead>
        <tr>
          <th>Hull</th>
          {holes.map((_, i) => <th key={i}>{i + 1 + offset}</th>)}
          <th>{label}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Score</td>
          {holes.map((score, i) => (
            <td key={i}>
              <input
                type="number"
                value={score}
                onChange={(e) => updateScore(i + offset, parseInt(e.target.value) || 0)}
                className={styles.domesticScoreInput}
              />
            </td>
          ))}
          <td><strong>{sum(holes)}</strong></td>
        </tr>
      </tbody>
    </table>
  );

  const renderMobileTable = (holes: number[], offset: number, label: string) => (
    <table className={styles.verticalTableMobile}>
      <thead>
        <tr>
          <th>Hull</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {holes.map((score, i) => (
          <tr key={i}>
            <td>{i + 1 + offset}</td>
            <td>
              <input
                type="number"
                value={score}
                onChange={(e) => updateScore(i + offset, parseInt(e.target.value) || 0)}
                className={styles.domesticScoreInput}
              />
            </td>
          </tr>
        ))}
        <tr>
          <td><strong>{label}</strong></td>
          <td><strong>{sum(holes)}</strong></td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div className={isMobile ? styles.domesticVerticalWrapper : styles.holeDetailsWrapper}>
      {isMobile ? (
        <div className={styles.domesticMobileTables}>
          <div className={styles.domesticTablePair}>
            {renderMobileTable(front9, 0, 'Ut')}
          </div>
          {back9.length > 0 && (
            <div className={styles.domesticTablePair}>
              {renderMobileTable(back9, 9, 'In')}
            </div>
          )}
        </div>
      ) : (
        <>
          {renderDesktopTable(front9, 0, 'Ut')}
          {back9.length > 0 && renderDesktopTable(back9, 9, 'In')}
        </>
      )}
    </div>
  );
};

export default DomesticHoleGrid;