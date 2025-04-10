import React from 'react';
import styles from '../../styles/UploadScore.module.css';
import { MarkerOption } from './types';

type Props<T extends Record<string, any>> = {
  data: T;
  update: (field: keyof T, value: string) => void;
  fields: (keyof T)[];
  fieldLabels: Record<string, string>;
  inputStyle: (key: string) => React.CSSProperties;
  markerOptions?: MarkerOption[];
  selectedMarker?: MarkerOption | null;
  setSelectedMarker?: (marker: MarkerOption | null) => void;
};

function SharedUserFields<T extends Record<string, any>>({
  data,
  update,
  fields,
  fieldLabels,
  inputStyle,
  markerOptions = [],
  selectedMarker,
  setSelectedMarker,
}: Props<T>) {
  return (
    <>
      {fields.map((field) => {
        const label = fieldLabels[field as string] || String(field);

        if (field === 'markerName' && markerOptions.length > 0) {
          return (
            <label key={String(field)} htmlFor={String(field)} className={styles.label}>
              {label}:
              <select
                id={String(field)}
                value={selectedMarker?.display || ''}
                onChange={(e) => {
                  const selected = markerOptions.find(opt => opt.display === e.target.value);
                  update(field, selected?.display || '');
                  setSelectedMarker?.(selected || null);
                }}
                style={{
                  ...inputStyle(String(field)),
                  padding: '0.5rem',
                  borderRadius: '8px',
                  textAlign: 'left',
                  textAlignLast: 'left',
                }}
              >
                <option value="">Velg markør</option>
                {markerOptions
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((marker) => (
                    <option key={marker.guid} value={marker.display}>
                      {marker.name}, {marker.club}
                    </option>
                  ))}
              </select>
            </label>
          );
        }

        return (
          <label key={String(field)} htmlFor={String(field)} className={styles.label}>
            {label}:
            <input
              id={String(field)}
              type={field === 'password' ? 'password' : 'text'}
              value={data[field] ?? ''}
              onChange={(e) => update(field, e.target.value)}
              style={inputStyle(String(field))}
            />
          </label>
        );
      })}
    </>
  );
}

export default SharedUserFields;