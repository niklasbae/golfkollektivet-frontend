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

  export type ForeignHole = {
    holeNumber: number;
    par: number;
    hcp: number;
    strokes: number;
  };
  
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
    holes: ForeignHole[];
  };

  export type UploadScoreFormProps = {
    isForeignClub: boolean;
    showForeignExtras: boolean;
    foreignNote: string;
    status: string;
    scoreSums: {
      frontSum: number;
      backSum: number | null;
      totalSum: number;
    } | null;
    foreignScoreSums: {
      frontSum: number;
      backSum: number | null;
      totalSum: number;
    };
    fieldLabels: Record<string, string>;
    inputStyle: (key: string) => React.CSSProperties;
    safeFormData: ScoreFormData;
    formData: ScoreFormData | null;
    foreignFormData: ForeignScoreFormData;
    clubs: Club[];
    courses: Course[];
    tees: Tee[];
    clubSelectValue: { label: string; value: string } | null;
    courseSelectValue: { label: string; value: string } | null;
    teeSelectValue: { label: string; value: string } | null;
    setClubSelectValue: React.Dispatch<React.SetStateAction<{ label: string; value: string } | null>>;
    setCourseSelectValue: React.Dispatch<React.SetStateAction<{ label: string; value: string } | null>>;
    setTeeSelectValue: React.Dispatch<React.SetStateAction<{ label: string; value: string } | null>>;
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
  };