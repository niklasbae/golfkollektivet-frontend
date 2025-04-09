// UploadScore/DomesticHoleGrid.tsx

import styles from '../../styles/UploadScore.module.css';

type Props = {
  scores: number[];
  updateScore: (index: number, value: number) => void;
};

const DomesticHoleGrid = ({ scores, updateScore }: Props) => {
  const front9 = scores.slice(0, 9);
  const back9 = scores.length > 9 ? scores.slice(9, 18) : [];

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  return (
    <div className={styles.holeDetailsWrapper}>
      {/* Front 9 */}
      <table className={styles.domesticHoleTable}>
        <thead>
          <tr>
            <th>Hull</th>
            {front9.map((_, i) => (
              <th key={i}>{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Score</td>
            {front9.map((score, i) => (
              <td key={i}>
                <input
                  type="number"
                  value={score}
                  onChange={(e) =>
                    updateScore(i, parseInt(e.target.value) || 0)
                  }
                  className={styles.domesticScoreInput}
                />
              </td>
            ))}
          </tr>
          <tr>
            <td style={{ fontWeight: 600 }}>Sum</td>
            <td colSpan={front9.length}>Score: {sum(front9)}</td>
          </tr>
        </tbody>
      </table>

      {/* Back 9 (only if exists) */}
      {back9.length > 0 && (
        <table className={styles.domesticHoleTable}>
          <thead>
            <tr>
              <th>Hull</th>
              {back9.map((_, i) => (
                <th key={i}>{i + 10}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Score</td>
              {back9.map((score, i) => (
                <td key={i}>
                  <input
                    type="number"
                    value={score}
                    onChange={(e) =>
                      updateScore(i + 9, parseInt(e.target.value) || 0)
                    }
                    className={styles.domesticScoreInput}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ fontWeight: 600 }}>Sum</td>
              <td colSpan={back9.length}>Score: {sum(back9)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DomesticHoleGrid;