import { useState, useEffect } from 'react';
import { Club, Course, Tee, ScoreFormData, ForeignScoreFormData } from './types';

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
  holes: Array(18)
    .fill(null)
    .map((_, i) => ({
      holeNumber: i + 1,
      par: 4,
      hcp: i + 1,
      strokes: 0,
    })),
};

export const fieldLabels = {
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

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export const useUploadScoreLogic = () => {
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState<ScoreFormData>(defaultScoreFormData);
  const [foreignFormData, setForeignFormData] = useState<ForeignScoreFormData>(defaultForeignFormData);
  const [isForeignClub, setIsForeignClub] = useState<boolean>(false);

  const [status, setStatus] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showForeignExtras, setShowForeignExtras] = useState<boolean>(false);
  const [foreignNote, setForeignNote] = useState<string>('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [clubs] = useState<Club[]>([]);
  const [courses] = useState<Course[]>([]);
  const [tees] = useState<Tee[]>([]);

  const [missingFields, setMissingFields] = useState<(keyof ScoreFormData)[]>([]);
  const [foreignMissingFields, setForeignMissingFields] = useState<(keyof ForeignScoreFormData)[]>([]);

  const [clubSelectValue, setClubSelectValue] = useState<{ label: string; value: string } | null>(null);
  const [courseSelectValue, setCourseSelectValue] = useState<{ label: string; value: string } | null>(null);
  const [teeSelectValue, setTeeSelectValue] = useState<{ label: string; value: string } | null>(null);

  const [country, setCountry] = useState<string>('');

  const inputStyle = (key: string): React.CSSProperties => ({
    padding: '0.5rem',
    borderRadius: '8px',
    border: `1px solid ${
      !isForeignClub && missingFields.includes(key as keyof ScoreFormData) ? 'red' : '#ccc'
    }`,
    backgroundColor:
      !isForeignClub && missingFields.includes(key as keyof ScoreFormData) ? '#ffe6e6' : 'white',
  });

  const updateField = (field: keyof ScoreFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMissingFields((prev) => prev.filter((f) => f !== field));
  };

  const updateForeignField = (field: keyof ForeignScoreFormData, value: any) => {
    setForeignFormData((prev) => ({ ...prev, [field]: value }));
    setForeignMissingFields((prev) => prev.filter((f) => f !== field));
  };

  const updateHoleScore = (index: number, value: number) => {
    const updated = [...formData.holeScores];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, holeScores: updated }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image uploaded", e);
  };

  const handleParseImage = () => {
    console.log("Parse image triggered");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowForm(true);
    }, 2000);
  };

  const resetForm = () => {
    setFormData(defaultScoreFormData);
    setForeignFormData(defaultForeignFormData);
    setSubmitted(false);
    setStatus('');
    setMissingFields([]);
    setForeignMissingFields([]);
    setProcessedImageUrl(null);
    setShowForeignExtras(false);
    setForeignNote('');
    setClubSelectValue(null);
    setCourseSelectValue(null);
    setTeeSelectValue(null);
    setShowForm(false);
  };

  const scoreSums = {
    frontSum: formData.holeScores.slice(0, 9).reduce((a, b) => a + b, 0),
    backSum:
      formData.holeScores.length > 9
        ? formData.holeScores.slice(9).reduce((a, b) => a + b, 0)
        : null,
    totalSum: formData.holeScores.reduce((a, b) => a + b, 0),
  };

  const foreignScoreSums = {
    frontSum: foreignFormData.holes.slice(0, 9).reduce((sum, h) => sum + h.strokes, 0),
    backSum:
      foreignFormData.holes.length > 9
        ? foreignFormData.holes.slice(9).reduce((sum, h) => sum + h.strokes, 0)
        : null,
    totalSum: foreignFormData.holes.reduce((sum, h) => sum + h.strokes, 0),
  };

  const submitToGolfbox = async () => {
    console.log('Submitting to GolfBox...');
    setSubmitted(true);
    setStatus('✅ Score sendt!');
  };

  return {
    isForeignClub,
    setIsForeignClub,
    showForm,
    loading,
    showForeignExtras,
    foreignNote,
    status,
    scoreSums,
    foreignScoreSums,
    fieldLabels,
    inputStyle,
    safeFormData: formData,
    formData,
    foreignFormData,
    clubs,
    courses,
    tees,
    clubSelectValue,
    courseSelectValue,
    teeSelectValue,
    setClubSelectValue,
    setCourseSelectValue,
    setTeeSelectValue,
    missingFields,
    foreignMissingFields,
    country,
    setCountry,
    updateField,
    updateForeignField,
    updateHoleScore,
    submitToGolfbox,
    submitted,
    resetForm,
    processedImageUrl,
    isMobile,
    handleImageUpload,
    handleParseImage,
  };
};