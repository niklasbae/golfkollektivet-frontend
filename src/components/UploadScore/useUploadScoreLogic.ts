import { useState, useEffect } from 'react';
import {
  Club,
  Course,
  Tee,
  ScoreFormData,
  ForeignScoreFormData,
} from './types';
import {
  defaultScoreFormData,
  defaultForeignFormData,
  fieldLabels,
} from './constants';


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

// -----------------------------
// 🔧 Helpers
// -----------------------------
const calculateScoreSums = (scores: number[]) => {
  const frontSum = scores.slice(0, 9).reduce((a, b) => a + b, 0);
  const backSum = scores.length > 9 ? scores.slice(9).reduce((a, b) => a + b, 0) : null;
  const totalSum = scores.reduce((a, b) => a + b, 0);

  return {
    frontSum,
    backSum: scores.length > 9 ? backSum : null,
    totalSum,
    };
};

const calculateForeignScoreSums = (holes: ForeignScoreFormData['holes']) => ({
  frontSum: holes.slice(0, 9).reduce((sum, h) => sum + h.strokes, 0),
  backSum: holes.length > 9
    ? holes.slice(9).reduce((sum, h) => sum + h.strokes, 0)
    : null,
  totalSum: holes.reduce((sum, h) => sum + h.strokes, 0),
  parSum: holes.reduce((sum, h) => sum + h.par, 0),
});

const getInputStyle = (isMissing: boolean): React.CSSProperties => ({
  padding: '0.5rem',
  borderRadius: '8px',
  border: `1px solid ${isMissing ? 'red' : '#ccc'}`,
  backgroundColor: isMissing ? '#ffe6e6' : 'white',
});

// -----------------------------
// 🧠 Main Hook
// -----------------------------
export const useUploadScoreLogic = () => {
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState<ScoreFormData>(defaultScoreFormData);
  const [foreignFormData, setForeignFormData] = useState<ForeignScoreFormData>(defaultForeignFormData);
  const [isForeignClub, setIsForeignClub] = useState(false);

  const [status, setStatus] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showForeignExtras, setShowForeignExtras] = useState(false);
  const [foreignNote, setForeignNote] = useState('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clubs, setClubs] = useState<Club[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tees, setTees] = useState<Tee[]>([]);

  const [missingFields, setMissingFields] = useState<(keyof ScoreFormData)[]>([]);
  const [foreignMissingFields, setForeignMissingFields] = useState<(keyof ForeignScoreFormData)[]>([]);

  const [clubSelectValue, setClubSelectValue] = useState<{ label: string; value: string } | null>(null);
  const [courseSelectValue, setCourseSelectValue] = useState<{ label: string; value: string } | null>(null);
  const [teeSelectValue, setTeeSelectValue] = useState<{ label: string; value: string } | null>(null);

  const [country, setCountry] = useState<string>('');

  const [markerSearch, setMarkerSearch] = useState('');
  const [markerOptions, setMarkerOptions] = useState<{ guid: string; name: string; display: string; club: string }[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<null | { guid: string; name: string; display: string; club: string }>(null);

  const [image, setImage] = useState<File | null>(null);

  const inputStyle = (key: string): React.CSSProperties => {
    const isMissing = isForeignClub
      ? foreignMissingFields.includes(key as keyof ForeignScoreFormData)
      : missingFields.includes(key as keyof ScoreFormData);

    return getInputStyle(isMissing);
  };

  const updateDomesticField = (field: keyof ScoreFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setMissingFields((prev) => prev.filter((f) => f !== field));
  };

  const updateForeignField = (field: keyof ForeignScoreFormData, value: any) => {
    setForeignFormData((prev) => ({ ...prev, [field]: value }));
    setForeignMissingFields((prev) => prev.filter((f) => f !== field));
  };

  const updateDomesticHoleScore = (index: number, value: number) => {
    const updated = [...formData.holeScores];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, holeScores: updated }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file); // ✅ This is the key missing line
      setStatus(`📷 Bilde valgt: ${file.name}`);
    }
  };

  const cropImage = async (file: File, crop: [number, number, number, number]): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
  
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          img.src = reader.result;
        }
      };
  
      img.onload = () => {
        const [x, y, width, height] = crop;
  
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
  
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context not found');
  
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        const croppedDataUrl = canvas.toDataURL('image/png');
        resolve(croppedDataUrl);
      };
  
      img.onerror = reject;
      reader.onerror = reject;
  
      reader.readAsDataURL(file);
    });
  };

  const handleParseImage = async () => {

    if (!markerSearch || markerSearch.trim().length === 0) {
      setStatus('❌ Ingen markør angitt.');
      return;
    }

    if (!image) {
      setStatus('❌ Last opp et bilde først.');
      return;
    }

    console.log("Parse image triggered");
    
    console.log(markerSearch.length)
    if (markerSearch.length >= 2) {
      const markerRes = await fetch(
        `https://golfkollektivet-backend.onrender.com/api/Golfbox/search-marker?input=${encodeURIComponent(markerSearch)}`
      );
      const markerData = await markerRes.json();

      if (markerData.length === 0) {
        setStatus('❌ Fant ingen markør. Prøv igjen med et annet navn eller medlemsnummer.');
        return;
      }

      setMarkerOptions(markerData);
  
      if (markerData.length === 1) {
        const marker = markerData[0];
        setSelectedMarker(marker);
      
        if (isForeignClub) {
          updateForeignField('markerName', marker.display);
        } else {
          updateDomesticField('markerName', marker.display);
        }
      }
    }

    setLoading(true);
    setStatus('Sender bildet til AI...');

    const formDataPayload = new FormData();
    formDataPayload.append('image', image);

    const endpoint = isForeignClub
      ? 'https://golfkollektivet-backend.onrender.com/api/scorecard/parse-hole-data'
      : 'https://golfkollektivet-backend.onrender.com/api/scorecard/parse';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formDataPayload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Serverfeil');
      }
      
    // --- 🏌️‍♂️ FOREIGN CLUB FLOW ---
    if (isForeignClub) {
      let calculatedPar = 0;
      const updatedHoles = Array(18).fill(null).map((_, i) => {
        const h = data.structuredHoles?.[i] || {};
        return {
          holeNumber: h.holeNumber || i + 1,
          par: h.par ?? 4,
          hcp: h.hcp ?? i + 1,
          strokes: h.score ?? 0,
        };
      });

      calculatedPar = updatedHoles.reduce((sum, hole) => sum + hole.par, 0);

      const updatedFormData: ForeignScoreFormData = {
        ...foreignFormData,
        scoreDate: data.scoreDate || '',
        scoreTime: data.scoreTime || '',
        holes: updatedHoles,
        par: calculatedPar,
        courseRating: 73,
        slope: 138,
      };

      setForeignFormData(updatedFormData);
      setShowForeignExtras(true);

      const requiredFields: (keyof ForeignScoreFormData)[] = [
        'username',
        'password',
        'manualClubName',
        'manualCourseName',
        'manualTeeName',
        'scoreDate',
        'scoreTime',
      ];

      const missing = requiredFields.filter((key) => !updatedFormData[key]);
      setForeignMissingFields(missing);

      if (missing.length > 0) {
        setStatus('⚠️ Noen felter mangler og må fylles ut.');
      } else {
        setStatus('✅ Score tolket. Fyll ut CR og Slope.');
      }

    } else {
      // --- 🇳🇴 DOMESTIC CLUB FLOW ---
      setFormData({
        ...formData,
        scoreDate: data.scoreDate || '',
        scoreTime: data.scoreTime || '',
        holeScores: data.holes || Array(18).fill(0)
      });

      const requiredFields: (keyof ScoreFormData)[] = ['username', 'password', 'clubName', 'courseName', 'teeName'];
      const missing = requiredFields.filter((key) => !formData[key]);
      setMissingFields(missing);

      if (missing.length > 0) {
        setStatus('⚠️ Noen felter mangler og må fylles ut.');
      } else {
        setStatus('✅ Data tolket! Se gjennom og rediger nedenfor.');
      }
    }

    const cropY = data.cropY ?? 300;
    const cropBottom = 200; // number of pixels to crop from the bottom
    
    const imgForSize = new Image();
    imgForSize.src = URL.createObjectURL(image);
    
    imgForSize.onload = async () => {
      const fullWidth = imgForSize.width;
      const fullHeight = imgForSize.height;
    
      const newHeight = fullHeight - cropY - cropBottom;
    
      const croppedUrl = await cropImage(image, [0, cropY, fullWidth, newHeight]);
      setProcessedImageUrl(croppedUrl);
    };

    setShowForm(true);
  } catch (err: any) {
    setStatus(`❌ Feil: ${err.message || 'Ukjent feil'}`);
  } finally {
    setLoading(false);
  }
};

  const resetAllFormState = () => {
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
    setSelectedMarker(null);
  };

  const scoreSums = calculateScoreSums(formData.holeScores);
  const foreignScoreSums = calculateForeignScoreSums(foreignFormData.holes);

  const submitToGolfbox = async () => {
    if (isForeignClub) {
      const requiredFields: (keyof ForeignScoreFormData)[] = [
        'username',
        'password',
        'manualCourseName',
        'manualTeeName',
        'scoreDate',
        'scoreTime',
      ];
  
      const missing = requiredFields.filter((key) => !foreignFormData[key]);
      setForeignMissingFields(missing);
  
      for (const field of requiredFields) {
        if (!foreignFormData[field]) {
          setStatus(`❌ Mangler verdi for: ${fieldLabels[field] || field}`);
          return;
        }
      }
  
      const hasValidHoles = foreignFormData.holes.some(h => h.strokes > 0);
      if (!hasValidHoles) {
        setStatus('❌ Hullscorer mangler.');
        return;
      }
  
      const {
        markerName: _ignoreMarkerName,
        ...rest
      } = foreignFormData;
  
      // 🛠️ Filter out back 9 if strokes are all 0
      const trimmedHoles = rest.holes.length === 18 &&
      rest.holes.slice(9).every(h => h.strokes === 0)
      ? rest.holes.slice(0, 9)
      : rest.holes;

      const payload = {
        ...rest,
        holes: trimmedHoles,
        country,
        markerGuid: selectedMarker?.guid || '',
      };
  
      setLoading(true);
      try {
        const res = await fetch('https://golfkollektivet-backend.onrender.com/api/Golfbox/submit-foreign-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
  
        if (res.ok) {
          setSubmitted(true);
          setStatus('✅ Internasjonal score sendt til GolfBox!');
        } else {
          setStatus('❌ Klarte ikke å sende score.');
        }
      } catch (err) {
        setStatus('❌ Feil ved sending til GolfBox.');
      } finally {
        setLoading(false);
      }
  
      return;
    }
  
    if (!formData) return;
  
    const requiredFields: (keyof ScoreFormData)[] = [
      'username',
      'password',
      'clubName',
      'courseName',
      'teeName',
      'scoreDate',
      'scoreTime',
    ];
  
    for (const field of requiredFields) {
      if (!formData[field]) {
        setStatus(`❌ Mangler verdi for: ${fieldLabels[field] || field}`);
        return;
      }
    }
  
    if (!Array.isArray(formData.holeScores) || formData.holeScores.length < 9) {
      setStatus('❌ Hullscorer må ha minst 9 verdier.');
      return;
    }
  
    setLoading(true);
    try {
      const { markerName, ...rest } = formData;
      const res = await fetch('https://golfkollektivet-backend.onrender.com/api/golfbox/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rest,
          markerGuid: selectedMarker?.guid || '',
        }),
      });
  
      if (res.ok) {
        setSubmitted(true);
        setStatus('✅ Score sendt til GolfBox!');
      } else {
        setStatus('❌ Klarte ikke å sende score.');
      }
    } catch (err) {
      setStatus('❌ Feil ved sending til GolfBox.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch clubs after UI has settled (deferred)
  useEffect(() => {
    const fetchClubs = () => {
      fetch('https://golfkollektivet-backend.onrender.com/api/Golfbox/clubs')
        .then(res => res.json())
        .then(data => {
          setClubs(data);
          console.log('✅ Clubs loaded');
        })
        .catch(err => {
          console.error('❌ Failed to fetch clubs:', err);
        });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchClubs);
    } else {
      // Fallback if browser doesn't support requestIdleCallback
      setTimeout(fetchClubs, 300);
    }
  }, []);
  

  useEffect(() => {
    const fetchCoursesAndTees = async () => {
      if (!clubSelectValue || !clubSelectValue.value) return;
  
      const selectedClub = clubs.find(c => c.clubName === clubSelectValue.value);
      if (!selectedClub) return;
  
      try {
        const res = await fetch(`https://golfkollektivet-backend.onrender.com/api/Golfbox/clubs/${selectedClub.clubGuid}/courses`);
        const data = await res.json();
  
        setCourses(data);
        const defaultCourse = data[0];
        const defaultTee = defaultCourse?.tees?.[1] || defaultCourse?.tees?.[0];
  
        setCourseSelectValue(defaultCourse ? { label: defaultCourse.courseName, value: defaultCourse.courseName } : null);
        setTeeSelectValue(defaultTee ? { label: defaultTee.teeName, value: defaultTee.teeName } : null);
        setTees(defaultCourse?.tees || []);
  
        // Update formData with default values
        updateDomesticField('courseName', defaultCourse?.courseName || '');
        updateDomesticField('teeName', defaultTee?.teeName || '');
      } catch (err) {
        console.error('❌ Failed to fetch courses/tees:', err);
      }
    };
  
    fetchCoursesAndTees();
  }, [clubSelectValue]);

  useEffect(() => {
    if (!courseSelectValue || !courses.length) return;
  
    const selectedCourse = courses.find(c => c.courseName === courseSelectValue.value);
    if (!selectedCourse) return;
  
    const defaultTee = selectedCourse.tees[1] || selectedCourse.tees[0];
    setTees(selectedCourse.tees);
    setTeeSelectValue(defaultTee ? { label: defaultTee.teeName, value: defaultTee.teeName } : null);
  
    updateDomesticField('teeName', defaultTee?.teeName || '');
  }, [courseSelectValue]);

  useEffect(() => {
    if (teeSelectValue?.value) {
      updateDomesticField('teeName', teeSelectValue.value);
    }
  }, [teeSelectValue]);

  useEffect(() => {
    const pingHealth = async () => {
      try {
        await fetch('https://golfkollektivet-backend.onrender.com/health');
        console.log('✅ Backend is alive');
      } catch (err) {
        console.warn('⚠️ Backend health check failed:', err);
      }
    };
  
    const timeout = setTimeout(pingHealth, 1000); // Delay to let UI load
    const interval = setInterval(pingHealth, 10 * 60 * 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

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
    updateField: updateDomesticField,
    updateForeignField,
    updateHoleScore: updateDomesticHoleScore,
    submitToGolfbox,
    submitted,
    resetForm: resetAllFormState,
    processedImageUrl,
    isMobile,
    handleImageUpload,
    handleParseImage,
    markerSearch,
    setMarkerSearch,
    markerOptions,
    selectedMarker,
    setSelectedMarker,
    image,
    setImage
  };
};