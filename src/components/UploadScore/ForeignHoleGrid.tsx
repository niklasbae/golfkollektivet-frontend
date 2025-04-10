import { useEffect, useState } from 'react';
import styles from '../../styles/UploadScore.module.css';
import { Hole, UpdateHoleDataFn } from './types';

type Props = {
  holes: Hole[];
  updateHoleData: UpdateHoleDataFn;
  processedImageUrl?: string;
};

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

const ForeignHoleGrid = ({ holes, updateHoleData }: Props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const front9 = holes.slice(0, 9);
  const back9 = holes.slice(9, 18);
  const hasBack9 = back9.length > 0 && back9.some(h => h.strokes > 0);

  return (
    <div className={isMobile ? styles.foreignMobileTables : styles.holeDetailsWrapper}>
      <div className={styles.verticalTableWrapper}>
        {isMobile
          ? renderVerticalGrid(front9, updateHoleData, 0)
          : renderHorizontalGrid(front9, updateHoleData, 0)}
      </div>
      <div className={styles.verticalTableWrapper}>
        {hasBack9 &&
          (isMobile
            ? renderVerticalGrid(back9, updateHoleData, 9)
            : renderHorizontalGrid(back9, updateHoleData, 9))}
      </div>
    </div>
  );
};

const renderHorizontalGrid = (
  holes: Hole[],
  updateHoleData: Props['updateHoleData'],
  offset: number
) => {
  return (
    <div className="hole-table">
      <table className={styles.holeTable}>
        <thead>
          <tr>
            <th>Hull</th>
            {holes.map((h) => (
              <th key={h.holeNumber}>{h.holeNumber}</th>
            ))}
            <th>{offset === 0 ? 'Ut' : 'In'}</th>
          </tr>
        </thead>
        <tbody>
          {(['hcp', 'par', 'strokes'] as const).map((field) => (
            <tr key={field}>
              <td>{field === 'par' ? 'Par' : field === 'hcp' ? 'HCP' : 'Score'}</td>
              {holes.map((h, i) => (
                <td key={h.holeNumber}>
                  <input
                    type="number"
                    value={h[field]}
                    onChange={(e) =>
                      updateHoleData(i + offset, field, parseInt(e.target.value) || 0)
                    }
                    className={styles.inputCell}
                  />
                </td>
              ))}
              <td>
                {field === 'hcp' ? '' : (
                  <strong>{sum(holes.map(h => h[field]))}</strong>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderVerticalGrid = (
  holes: Hole[],
  updateHoleData: Props['updateHoleData'],
  offset: number
) => {
  const totalScore = sum(holes.map(h => h.strokes));

  return (
    <div className={styles.foreignMobileTableContainer}>
      <table className={styles.foreignMobileTable}>
        <thead>
          <tr>
            <th>Hull</th>
            <th>Par</th>
            <th>HCP</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {holes.map((h, i) => (
            <tr key={h.holeNumber}>
              <td><strong>{h.holeNumber}</strong></td>
              <td>
                <input
                  type="number"
                  value={h.par}
                  onChange={(e) =>
                    updateHoleData(i + offset, 'par', parseInt(e.target.value) || 0)
                  }
                  className={styles.inputCell}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={h.hcp}
                  onChange={(e) =>
                    updateHoleData(i + offset, 'hcp', parseInt(e.target.value) || 0)
                  }
                  className={styles.inputCell}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={h.strokes}
                  onChange={(e) =>
                    updateHoleData(i + offset, 'strokes', parseInt(e.target.value) || 0)
                  }
                  className={styles.inputCell}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3}><strong>Sum</strong></td>
            <td><strong>{totalScore}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ForeignHoleGrid;