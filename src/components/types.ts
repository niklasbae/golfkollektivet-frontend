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