// types.ts

// Shared hole structure
export type Hole = {
  holeNumber: number;
  par: number;
  hcp: number;
  strokes: number;
};

export type UpdateHoleDataFn = (
  index: number,
  field: 'par' | 'hcp' | 'strokes',
  value: number
) => void;

// GolfBox domain types
export type Club = {
  clubGuid: string;
  clubName: string;
};

export type Course = {
  courseGuid: string;
  courseName: string;
  tees: Tee[];
};

export type Tee = {
  teeGuid: string;
  teeName: string;
  teeGender: string;
};

export type SelectOption = {
  label: string;
  value: string;
};

// Domestic flow data model
export type ScoreFormData = {
  username: string;
  password: string;
  clubName: string;
  courseName: string;
  teeName: string;
  teeGender: string;
  markerName: string;
  scoreDate: string;
  scoreTime: string;
  holeScores: number[];
};

// Foreign flow data model
export type ForeignScoreFormData = {
  username: string;
  password: string;
  country: string;
  manualClubName: string;
  manualCourseName: string;
  manualTeeName: string;
  scoreDate: string;
  scoreTime: string;
  markerName: string;
  par: number;
  courseRating: number;
  slope: number;
  holes: Hole[];
};

export type ScoreSums = {
  frontSum: number;
  backSum: number | null;
  totalSum: number;
  parSum?: number;
};

// UploadScoreForm component props
export type UploadScoreFormProps = {
  isForeignClub: boolean;
  showForeignExtras: boolean;
  foreignNote: string;
  status: string;
  scoreSums: ScoreSums | null;
  foreignScoreSums: ScoreSums;
  fieldLabels: Record<string, string>;
  inputStyle: (key: string) => React.CSSProperties;
  safeFormData: ScoreFormData;
  formData: ScoreFormData | null;
  foreignFormData: ForeignScoreFormData;
  clubs: Club[];
  courses: Course[];
  tees: Tee[];
  clubSelectValue: SelectOption | null;
  courseSelectValue: SelectOption | null;
  teeSelectValue: SelectOption | null;
  setClubSelectValue: React.Dispatch<React.SetStateAction<SelectOption | null>>;
  setCourseSelectValue: React.Dispatch<React.SetStateAction<SelectOption | null>>;
  setTeeSelectValue: React.Dispatch<React.SetStateAction<SelectOption | null>>;
  missingFields: (keyof ScoreFormData)[];
  foreignMissingFields: (keyof ForeignScoreFormData)[];
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  updateField: (field: keyof ScoreFormData, value: any) => void;
  updateForeignField: (field: keyof ForeignScoreFormData, value: any) => void;
  updateHoleScore: (index: number, value: number) => void;
  submitToGolfbox: () => Promise<void>;
  submitted: boolean;
  resetForm: () => void;
  processedImageUrl: string | null;
  isMobile: boolean;
  markerOptions: { guid: string; name: string; club: string; display: string }[];
  selectedMarker: { guid: string; name: string; club: string; display: string } | null;
  setSelectedMarker: (marker: { guid: string; name: string; club: string; display: string } | null) => void;
};

export type MarkerOption = {
  guid: string;
  name: string;
  club: string;
  display: string;
};