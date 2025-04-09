//HoleDetailsGrid.tsx

import { useEffect, useState } from 'react';
import styles from '../../styles/UploadScore.module.css';
import { Hole, UpdateHoleDataFn } from './types'

type Props = {
  holes: Hole[];
  updateHoleData: UpdateHoleDataFn
};

const HoleDetailsGrid = ({ holes, updateHoleData }: Props) => {
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
  
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const scoreSum = (slice: Hole[]) => sum(slice.map((h) => h.strokes));

  return (
    <div className={styles.holeDetailsWrapper}>
      <div>
        {isMobile
          ? renderVerticalGrid(front9, updateHoleData, 0, scoreSum(front9))
          : renderHorizontalGrid(front9, updateHoleData, 0, scoreSum(front9))}
      </div>
      {hasBack9 && (
        <div>
          {isMobile
            ? renderVerticalGrid(back9, updateHoleData, 9, scoreSum(back9))
            : renderHorizontalGrid(back9, updateHoleData, 9, scoreSum(back9))}
        </div>
      )}
    </div>
  );
};

const renderHorizontalGrid = (
  holes: Hole[],
  updateHoleData: Props['updateHoleData'],
  offset: number,
  scoreSum: number
) => (
  <div className="hole-table">
    <table className={styles.holeTable}>
      <thead>
        <tr>
          <th>Hull</th>
          {holes.map((h) => (
            <th key={h.holeNumber}>{h.holeNumber}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(['par', 'hcp', 'strokes'] as const).map((field) => (
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
          </tr>
        ))}
        <tr>
          <td style={{ fontWeight: 600 }}>Sum</td>
          <td colSpan={holes.length}>Score: {scoreSum}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const renderVerticalGrid = (
  holes: Hole[],
  updateHoleData: Props['updateHoleData'],
  offset: number,
  scoreSum: number
) => (
  <table className={styles.verticalTable}>
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
          <td>
            <strong>{h.holeNumber}</strong>
          </td>
          <td>
            <input
              type="number"
              value={h.par}
              onChange={(e) => updateHoleData(i + offset, 'par', parseInt(e.target.value) || 0)}
              className={styles.inputCell}
            />
          </td>
          <td>
            <input
              type="number"
              value={h.hcp}
              onChange={(e) => updateHoleData(i + offset, 'hcp', parseInt(e.target.value) || 0)}
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
        <td colSpan={3}>
          <strong>Sum</strong>
        </td>
        <td>
          <strong>{scoreSum}</strong>
        </td>
      </tr>
    </tbody>
  </table>
);

export default HoleDetailsGrid;