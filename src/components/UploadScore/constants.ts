// constants.ts

import { ScoreFormData, ForeignScoreFormData } from './types';

export const defaultScoreFormData: ScoreFormData = {
  username: '',
  password: '',
  clubName: '',
  courseName: '',
  teeName: '',
  teeGender: 'Male',
  markerName: '',
  scoreDate: '',
  scoreTime: '',
  holeScores: Array(18).fill(0),
};

export const defaultForeignFormData: ForeignScoreFormData = {
  username: '',
  password: '',
  country: '',
  manualClubName: '',
  manualCourseName: '',
  manualTeeName: '',
  scoreDate: '',
  scoreTime: '',
  markerName: '',
  par: 72,
  courseRating: 0,
  slope: 0,
  holes: Array.from({ length: 18 }, (_, i) => ({
    holeNumber: i + 1,
    par: 4,
    hcp: i + 1,
    strokes: 0,
  })),
};

export const fieldLabels: Record<string, string> = {
  username: 'GolfBox-brukernavn',
  password: 'GolfBox-passord',
  clubName: 'Klubb',
  courseName: 'Bane',
  teeName: 'Tee',
  teeGender: 'Tee kjønn',
  markerName: 'Markørnavn',
  scoreDate: 'Dato',
  scoreTime: 'Tidspunkt',
  manualClubName: 'Klubbnavn',
  manualCourseName: 'Banenavn',
  manualTeeName: 'Tee-navn',
  par: 'Par (total)',
  courseRating: 'Course rating',
  slope: 'Slope',
  country: 'Land',
};