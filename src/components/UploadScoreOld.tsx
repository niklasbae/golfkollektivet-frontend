import { useEffect, useState } from 'react';
import {
  StylesConfig,
  GroupBase,
  CSSObjectWithLabel,
} from 'react-select';
import { Club, Course, Tee, ScoreFormData } from './../components/types';
import { DomesticCourseFields } from '../components/DomesticCourseFields';
import { ForeignCourseFields } from '../components/ForeignCourseFields';
import { ForeignScoreFormData } from '../components/types';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return isMobile;
};

type SelectStyleFn = (key: keyof ScoreFormData) => StylesConfig<any, false, GroupBase<any>>;

const HoleDetailsGrid = ({
  holes,
  updateHoleData,
}: {
  holes: {
    holeNumber: number;
    par: number;
    hcp: number;
    strokes: number;
  }[];
  updateHoleData: (index: number, field: 'par' | 'hcp' | 'strokes', value: number) => void;
}) => {
  const isMobile = useIsMobile();

  const front9 = holes.slice(0, 9);
  const back9 = holes.slice(9, 18);

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const scoreSum = (slice: typeof holes) => sum(slice.map((h) => h.strokes));
  const parTotal = sum(holes.map((h) => h.par));
  const scoreTotal = sum(holes.map((h) => h.strokes));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '0rem' }}>
      <div>
        {isMobile
          ? renderVerticalGrid(front9, updateHoleData, 0, scoreSum(front9))
          : renderHorizontalGrid(front9, updateHoleData, 0, scoreSum(front9))}
      </div>
      <div>
        {isMobile
          ? renderVerticalGrid(back9, updateHoleData, 9, scoreSum(back9))
          : renderHorizontalGrid(back9, updateHoleData, 9, scoreSum(back9))}
      </div>
      <div>
        <h5>📊 Totalt</h5>
        <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '600px' }}>
          <tbody>
            <tr>
              <td style={cellStyle}>Par</td>
              <td style={cellStyle}>{parTotal}</td>
            </tr>
            <tr>
              <td style={cellStyle}>Score</td>
              <td style={cellStyle}>{scoreTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};


const renderHorizontalGrid = (
  holes: {
    holeNumber: number;
    par: number;
    hcp: number;
    strokes: number;
  }[],
  updateHoleData: (index: number, field: 'par' | 'hcp' | 'strokes', value: number) => void,
  offset: number,
  scoreSum: number
  ) => (
  <div className="hole-table">
    <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '600px' }}>
      <thead>
        <tr>
          <th style={cellStyle}>Hull</th>
          {holes.map((h: any) => (
            <th key={h.holeNumber} style={cellStyle}>{h.holeNumber}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(['par', 'hcp', 'strokes'] as const).map((field) => (
          <tr key={field}>
            <td style={cellStyle}>
              {field === 'par' ? 'Par' : field === 'hcp' ? 'HCP' : 'Score'}
            </td>
            {holes.map((h: any, i: number) => (
              <td key={h.holeNumber} style={cellStyle}>
                <input
                  type="number"
                  value={h[field]}
                  onChange={(e) =>
                    updateHoleData(i + offset, field, parseInt(e.target.value) || 0)
                  }
                  style={{
                    width: '50px',
                    padding: '0.3rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    textAlign: 'center',
                  }}
                />
              </td>
            ))}
          </tr>
        ))}
        <tr>
          <td style={{ ...cellStyle, fontWeight: 600 }}>Sum</td>
          <td colSpan={holes.length} style={{ ...cellStyle, textAlign: 'left' }}>
            Score: {scoreSum}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const renderVerticalGrid = (
  holes: {
    holeNumber: number;
    par: number;
    hcp: number;
    strokes: number;
  }[],
  updateHoleData: (index: number, field: 'par' | 'hcp' | 'strokes', value: number) => void,
  offset: number,
  scoreSum: number
) => (
  <table className="vertical-table">
    <thead>
      <tr>
        <th>Hull</th>
        <th>Par</th>
        <th>HCP</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {holes.map((h: any, i: number) => (
        <tr key={h.holeNumber}>
          <td><strong>{h.holeNumber}</strong></td>
          <td>
            <input
              type="number"
              value={h.par}
              onChange={(e) => updateHoleData(i + offset, 'par', parseInt(e.target.value) || 0)}
            />
          </td>
          <td>
            <input
              type="number"
              value={h.hcp}
              onChange={(e) => updateHoleData(i + offset, 'hcp', parseInt(e.target.value) || 0)}
            />
          </td>
          <td>
            <input
              type="number"
              value={h.strokes}
              onChange={(e) => updateHoleData(i + offset, 'strokes', parseInt(e.target.value) || 0)}
            />
          </td>
        </tr>
      ))}
      <tr>
        <td colSpan={3}><strong>Sum</strong></td>
        <td><strong>{scoreSum}</strong></td>
      </tr>
    </tbody>
    <style>{`
      .vertical-table {
        width: 100%;
        border-collapse: collapse;
      }
      .vertical-table th,
      .vertical-table td {
        padding: 0.5rem;
        border: 1px solid #ccc;
        text-align: center;
      }
      .vertical-table input {
        width: 50px;
        padding: 0.3rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        text-align: center;
      }
    `}</style>
  </table>
);

const cellStyle: React.CSSProperties = {
  padding: '0.5rem',
  textAlign: 'center',
  border: '1px solid #ddd',
  fontSize: '0.9rem',
  fontWeight: 500,
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


const fieldLabels: Record<string, string> = {
  username: 'Brukernavn',
  password: 'Passord',
  clubName: 'Golfklubb',
  courseName: 'Bane',
  teeName: 'Tee',
  markerName: 'Markør',
  scoreDate: 'Dato (dd.MM.yyyy)',
  scoreTime: 'Tidspunkt (HH:mm)',
};


const UploadScoreOld = () => {
  const [markerSearch, setMarkerSearch] = useState('');
  const [markerOptions, setMarkerOptions] = useState<{ guid: string; name: string; display: string; club: string }[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<{
    guid: string;
    name: string;
    display: string;
    club: string;
  } | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [formData, setFormData] = useState<ScoreFormData | null>(null);
  const [foreignFormData, setForeignFormData] = useState<ForeignScoreFormData>({
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
    courseRating: 73,
    slope: 138,
    holes: Array(18).fill(null).map((_, i) => ({
      holeNumber: i + 1,
      par: 4,
      hcp: i + 1,
      strokes: 0,
    })),
  });
  

  const updateForeignField = (field: keyof ForeignScoreFormData, value: any) => {
    setForeignFormData(prev => ({ ...prev, [field]: value }));
  };
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState<(keyof ScoreFormData)[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [tees, setTees] = useState<Tee[]>([]);
  const [clubSelectValue, setClubSelectValue] = useState<{ label: string; value: string } | null>(null);
  const [courseSelectValue, setCourseSelectValue] = useState<{ label: string; value: string } | null>(null);
  const [teeSelectValue, setTeeSelectValue] = useState<{ label: string; value: string } | null>(null);
  const [isForeignClub, setIsForeignClub] = useState(false);
  //const activeFormData = isForeignClub ? foreignFormData : safeFormData;
  //const activeUpdateField = isForeignClub ? updateForeignField : updateField;
  const showExtras = isForeignClub && foreignFormData.scoreDate !== '';
  const safeFormData: ScoreFormData = formData || {
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
  const activeHoleScores = isForeignClub ? foreignFormData.holes.map(h => h.strokes) : safeFormData.holeScores;
  const [country, setCountry] = useState('');
  const [foreignNote, setForeignNote] = useState<string>('');
  const [foreignMissingFields, setForeignMissingFields] = useState<(keyof ForeignScoreFormData)[]>([]);
  const [showForeignExtras, setShowForeignExtras] = useState(false);
  const isMobile = useIsMobile();


  const selectStyles: SelectStyleFn = (key) => ({
    control: (base: CSSObjectWithLabel) => ({
      ...base,
      borderColor: missingFields.includes(key) ? 'red' : base.borderColor,
      backgroundColor: missingFields.includes(key) ? '#ffe6e6' : 'white',
      paddingLeft: '0.5rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: missingFields.includes(key) ? 'red' : base.borderColor,
      },
    }),
    valueContainer: (base: CSSObjectWithLabel) => ({
      ...base,
      paddingLeft: '0.25rem',
    }),
    input: (base: CSSObjectWithLabel) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    placeholder: (base: CSSObjectWithLabel) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
  });

  useEffect(() => {
    fetch('https://golfkollektivet-backend.onrender.com/api/Golfbox/clubs')
      .then(res => res.json())
      .then(data => setClubs(data));
  }, []);

  useEffect(() => {
    const pingHealth = async () => {
      try {
        await fetch('https://golfkollektivet-backend.onrender.com/health');
        console.log('✅ Backend is alive');
      } catch (err) {
        console.warn('⚠️ Backend health check failed:', err);
      }
    };

    pingHealth();
    const interval = setInterval(pingHealth, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!formData) return;

    if (formData.clubName && (!clubSelectValue || clubSelectValue.value !== formData.clubName)) {
      setClubSelectValue({ label: formData.clubName, value: formData.clubName });
    }
    if (formData.courseName && (!courseSelectValue || courseSelectValue.value !== formData.courseName)) {
      setCourseSelectValue({ label: formData.courseName, value: formData.courseName });
    }
    if (formData.teeName && (!teeSelectValue || teeSelectValue.value !== formData.teeName)) {
      setTeeSelectValue({ label: formData.teeName, value: formData.teeName });
    }
  }, [formData]);

  useEffect(() => {
    if (clubSelectValue && formData && formData.clubName !== clubSelectValue.value) {
      updateField('clubName', clubSelectValue.value);
    }
  }, [clubSelectValue]);

  useEffect(() => {
    if (courseSelectValue && formData && formData.courseName !== courseSelectValue.value) {
      updateField('courseName', courseSelectValue.value);
    }
  }, [courseSelectValue]);

  useEffect(() => {
    if (teeSelectValue && formData && formData.teeName !== teeSelectValue.value) {
      updateField('teeName', teeSelectValue.value);
    }
  }, [teeSelectValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setStatus(`📷 Bilde valgt: ${file.name}`);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
  
    setStatus('Sender bildet til AI...');
    setLoading(true);
    const formDataPayload = new FormData();
    formDataPayload.append('image', image);
  
    try {
      const endpoint = isForeignClub
        ? 'https://golfkollektivet-backend.onrender.com/api/scorecard/parse-hole-data'
        : 'https://golfkollektivet-backend.onrender.com/api/scorecard/parse';
  
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formDataPayload,
      });
  
      const data = await res.json();
  
      if (isForeignClub) {
      var calculatedPar = 0;
        // ✅ Update foreignFormData directly
        setForeignFormData((prev) => {
          const updatedHoles = Array(18).fill(null).map((_, i) => {
            const h = data.structuredHoles?.[i] || {};
            return {
              holeNumber: h.holeNumber || i + 1,
              par: h.par ?? prev.holes[i]?.par ?? 4,
              hcp: h.hcp ?? prev.holes[i]?.hcp ?? i + 1,
              strokes: h.score ?? prev.holes[i]?.strokes ?? 0,
            };
          });
        
          calculatedPar = updatedHoles.reduce((sum, hole) => sum + hole.par, 0);
        
          return {
            ...prev,
            scoreDate: data.scoreDate || '',
            scoreTime: data.scoreTime || '',
            holes: updatedHoles,
            par: calculatedPar,
          };
        });

      setShowForeignExtras(true);
  

        setForeignFormData(prev => ({
          ...prev,
          par: calculatedPar || prev.par,
          courseRating: 73,
          slope: 138,
        }));

        if (markerSearch.length >= 2) {
          const markerRes = await fetch(`https://golfkollektivet-backend.onrender.com/api/Golfbox/search-marker?input=${encodeURIComponent(markerSearch)}`);
          const markerData = await markerRes.json();
          setMarkerOptions(markerData);
        
          if (markerData.length === 1) {
            const marker = markerData[0];
            setSelectedMarker(marker);
            if (isForeignClub) {
              setForeignFormData(prev => ({ ...prev, markerName: marker.display }));
            } else {
              updateField('markerName', marker.display);
            }
          }
        }
        // Crop image
      const cropY = data.cropY ?? 300;
      const imgForSize = new Image();
      imgForSize.src = URL.createObjectURL(image);

      imgForSize.onload = async () => {
        const fullWidth = imgForSize.width;
        const fullHeight = imgForSize.height;
        const croppedUrl = await cropImage(image, [0, cropY, fullWidth, fullHeight - cropY]);
        setProcessedImageUrl(croppedUrl);
      };

      setStatus(' Fyll inn Cr og Slope manuelt');
      return;
    }
  
    if (res.ok) {
      const parsedData: ScoreFormData = {
        username: '',
        password: '',
        clubName: '',
        courseName: '',
        teeName: '',
        teeGender: data.teeGender || 'Male',
        markerName: '',
        scoreDate: data.scoreDate || '',
        scoreTime: data.scoreTime || '',
        holeScores: data.holes || [],
      };

      setFormData(parsedData);

      if (markerSearch.length >= 2) {
        const markerRes = await fetch(`https://golfkollektivet-backend.onrender.com/api/Golfbox/search-marker?input=${encodeURIComponent(markerSearch)}`);
        const markerData = await markerRes.json();
        setMarkerOptions(markerData);
      
        if (markerData.length === 1) {
          const marker = markerData[0];
          setSelectedMarker(marker);
          if (isForeignClub) {
            setForeignFormData(prev => ({ ...prev, markerName: marker.display }));
          } else {
            updateField('markerName', marker.display);
          }
        }
      }

      const cropY = data.cropY ?? 300;
      const imgForSize = new Image();
      imgForSize.src = URL.createObjectURL(image);

      imgForSize.onload = async () => {
        const fullWidth = imgForSize.width;
        const fullHeight = imgForSize.height;
        const croppedUrl = await cropImage(image, [0, cropY, fullWidth, fullHeight - cropY]);
        setProcessedImageUrl(croppedUrl);
      };
  
        const required: (keyof ScoreFormData)[] = ['username', 'password', 'clubName', 'courseName', 'teeName', 'markerName'];
        const missing = required.filter((key) => !parsedData[key]);
        setMissingFields(missing);
  
        if (missing.length > 0) {
          setStatus('⚠️ Noen felter mangler og må fylles ut.');
        } else {
          setStatus('✅ Data tolket! Se gjennom og rediger nedenfor.');
        }
      } else {
        setStatus('❌ Klarte ikke å tolke bildet.');
      }
    } catch (error) {
      setStatus('❌ Feil ved opplasting');
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (field: keyof ScoreFormData, value: any) => {
    if (!formData) return;
  
    if (isForeignClub) return;
  
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setMissingFields((prev) => prev.filter((f) => f !== field));
  
    if (field === 'clubName') {
      const club = clubs.find(c => c.clubName === value);
      if (club) {
        const res = await fetch(`https://golfkollektivet-backend.onrender.com/api/Golfbox/clubs/${club.clubGuid}/courses`);
        const data = await res.json();
        setCourses(data);
        setTees([]);
        updated.courseName = data[0]?.courseName || '';
        updated.teeName = data[0]?.tees?.[1]?.teeName || data[0]?.tees?.[0]?.teeName || '';
        setTees(data[0]?.tees || []);
        setCourseSelectValue({ label: updated.courseName, value: updated.courseName });
        setTeeSelectValue({ label: updated.teeName, value: updated.teeName });
        setMissingFields((prev) => prev.filter(f => f !== 'courseName' && f !== 'teeName'));
      }
    } else if (field === 'courseName') {
      const course = courses.find(c => c.courseName === value);
      if (course) {
        setTees(course.tees);
        updated.teeName = course.tees[1]?.teeName || course.tees[0]?.teeName || '';
        setTeeSelectValue({ label: updated.teeName, value: updated.teeName });
        setMissingFields((prev) => prev.filter(f => f !== 'teeName'));
      }
    }
  };
  
  const updateHoleScore = (index: number, value: number) => {
    const updatedScores = [...safeFormData.holeScores];
    updatedScores[index] = value;
    setFormData({ ...safeFormData, holeScores: updatedScores });
  };

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
      
      const payload = {
        ...rest,
        country,
        markerGuid: selectedMarker?.guid || '',
      };
      
    
      setLoading(true);
    try {
      
      const res = await fetch('https://golfkollektivet-backend.onrender.com/api/Golfbox/submit-foreign-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify(payload)
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
    'markerName',
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
      })
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

  const resetForm = () => {
    setFormData(null);
    setSubmitted(false);
    setStatus('');
    setImage(null);
    setProcessedImageUrl(null);
    setMissingFields([]);
    setCourses([]);
    setTees([]);
    setClubSelectValue(null);
    setCourseSelectValue(null);
    setTeeSelectValue(null);
    setForeignFormData({
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
      courseRating: 73,
      slope: 138,
      holes: Array(18).fill(null).map((_, i) => ({
        holeNumber: i + 1,
        par: 4,
        hcp: i + 1,
        strokes: 0,
      })),
    });
    setForeignMissingFields([]);
    setCountry('');
    setForeignNote('');
  };

  const inputStyle = (key: keyof ScoreFormData | keyof ForeignScoreFormData | 'country') => ({
    padding: '0.5rem',
    borderRadius: '8px',
    border: `1px solid ${
      key !== 'country' && missingFields.includes(key as keyof ScoreFormData) ? 'red' : '#ccc'
    }`,
    backgroundColor: key !== 'country' && missingFields.includes(key as keyof ScoreFormData) ? '#ffe6e6' : 'white',
  });

  const foreignScoreSums = {
    frontSum: foreignFormData.holes.slice(0, 9).reduce((sum, h) => sum + h.strokes, 0),
    backSum: foreignFormData.holes.length > 9 ? foreignFormData.holes.slice(9).reduce((sum, h) => sum + h.strokes, 0) : null,
    totalSum: foreignFormData.holes.reduce((sum, h) => sum + h.strokes, 0),
  };

  const getScoreSums = () => {
    if (!formData) return null;
    const front9 = formData.holeScores.slice(0, 9);
    const back9 = formData.holeScores.slice(9);
    const sum = (scores: number[]) => scores.reduce((acc, val) => acc + val, 0);
    return {
      frontSum: sum(front9),
      backSum: back9.length ? sum(back9) : null,
      totalSum: sum(formData.holeScores),
    };
  };

  const scoreSums = getScoreSums();

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2>Last opp scorekort 📸</h2>
      <p>Ta et screenshot av runden din i Golf Gamebook og last det opp her.</p>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="checkbox"
          checked={isForeignClub}
          onChange={() => setIsForeignClub(!isForeignClub)}
        />
        Internasjonal klubb (utenfor GolfBox)
      </label>

      {isForeignClub && (
        <ForeignCourseFields
          formData={foreignFormData}
          updateField={updateForeignField}
          country={country}
          setCountry={setCountry}
          inputStyle={inputStyle}
          missingFields={foreignMissingFields}
        />
      )}

      {/* Marker Search */}
      <div className="form-grid" style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          Søk etter markør (navn eller medlemsnummer):
          <input
            type="text"
            value={markerSearch}
            onChange={(e) => setMarkerSearch(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
            }}
          />
        </label>

      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: 'white',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: '#000A24',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {loading ? 'Sender...' : 'Send til AI'}
        </button>

        
      </div>
      {isForeignClub && foreignNote && (
          <p style={{ backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            📌 {foreignNote}
          </p>
        )}

      {status && <p style={{ marginTop: '0.5rem' }}>{status}</p>}

      {isForeignClub && showExtras && (
          <div className="form-grid" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, gap: '0.25rem' }}>
              Par:
              <input
                type="number"
                value={foreignFormData.par}
                onChange={(e) => updateForeignField('par', parseInt(e.target.value) || 0)}
                style={inputStyle('par')}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, gap: '0.25rem' }}>
              Course Rating (CR):
              <input
                type="number"
                value={foreignFormData.courseRating}
                onChange={(e) =>
                  updateForeignField('courseRating', parseFloat(e.target.value.replace(',', '.')) || 0)
                }
                style={inputStyle('courseRating')}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, gap: '0.25rem' }}>
              Slope:
              <input
                type="number"
                value={foreignFormData.slope}
                onChange={(e) => updateForeignField('slope', parseInt(e.target.value) || 0)}
                style={inputStyle('slope')}
              />
            </label>
          </div>
        )}

      {(formData !== null || showForeignExtras) && (
        <div style={{ marginTop: '2rem' }}>
          <h3>📜 Rediger scoredata</h3>

          <div className="form-grid">
            {isForeignClub ? (
              <>
                {(['username', 'password', 'scoreDate', 'scoreTime'] as (keyof ForeignScoreFormData)[]).map((key) => {
                  const value = foreignFormData[key];
                  if (typeof value !== 'string' && typeof value !== 'number') return null;

                  return (
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        fontWeight: 500,
                        gap: '0.25rem',
                      }} key={key}>
                      {fieldLabels[key]}:
                      <input
                        type={key === 'password' ? 'password' : 'text'}
                        value={value}
                        onChange={(e) => updateForeignField(key, e.target.value)}
                        style={inputStyle(key)}
                      />
                    </label>
                  );
                })}

                {(selectedMarker || markerOptions.length > 0 || isForeignClub) && (
                  <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, gap: '0.25rem' }}>
                    Markør:
                    <select
                      value={selectedMarker?.guid || ''}
                      onChange={(e) => {
                        const selected = markerOptions.find(m => m.guid === e.target.value);
                        setSelectedMarker(selected || null);
                        if (isForeignClub) {
                          updateForeignField('markerName', selected?.display || '');
                        } else {
                          updateField('markerName', selected?.display || '');
                        }
                      }}
                      style={inputStyle('markerName')}
                    >
                      <option value="">Velg markør</option>
                      {markerOptions.map((marker) => (
                        <option key={marker.guid} value={marker.guid}>
                          {marker.display}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </>
            ) : (
              <>
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontWeight: 500,
                    fontSize: '1rem',
                    gap: '0.25rem',
                  }}>
                    {fieldLabels.username}:
                    <input
                      type="text"
                      value={safeFormData.username}
                      onChange={(e) => updateField('username', e.target.value)}
                      style={inputStyle('username')}
                    />
                  </label>

                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '1rem',
                    fontWeight: 500,
                    gap: '0.25rem',
                  }}>
                    {fieldLabels.password}:
                    <input
                      type="password"
                      value={safeFormData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      style={inputStyle('password')}
                    />
                  </label>

                  <DomesticCourseFields
                    formData={safeFormData}
                    updateField={updateField}
                    clubs={clubs}
                    courses={courses}
                    tees={tees}
                    clubSelectValue={clubSelectValue}
                    courseSelectValue={courseSelectValue}
                    teeSelectValue={teeSelectValue}
                    setClubSelectValue={setClubSelectValue}
                    setCourseSelectValue={setCourseSelectValue}
                    setTeeSelectValue={setTeeSelectValue}
                    missingFields={missingFields}
                    inputStyle={selectStyles}
                    fieldLabels={fieldLabels}
                  />

                  {formData && markerOptions.length > 0 && (
                    <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, fontSize: '1rem', gap: '0.25rem' }}>
                      {fieldLabels.markerName}:
                      <select
                        value={selectedMarker?.guid || ''}
                        onChange={(e) => {
                          const selected = markerOptions.find(m => m.guid === e.target.value);
                          setSelectedMarker(selected || null);
                          updateField('markerName', selected?.display || ''); // this updates the text field that gets sent
                        }}
                        style={inputStyle('markerName')}
                      >
                        <option value="">Velg markør</option>
                        {markerOptions.map((marker) => (
                          <option key={marker.guid} value={marker.guid}>
                            {marker.display}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontWeight: 500,
                    fontSize: '1rem',
                    gap: '0.25rem',
                  }}>
                    {fieldLabels.scoreDate}:
                    <input
                      type="text"
                      value={safeFormData.scoreDate}
                      onChange={(e) => updateField('scoreDate', e.target.value)}
                      style={inputStyle('scoreDate')}
                    />
                  </label>

                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontWeight: 500,
                    fontSize: '1rem',
                    gap: '0.25rem',
                  }}>
                    {fieldLabels.scoreTime}:
                    <input
                      type="text"
                      value={safeFormData.scoreTime}
                      onChange={(e) => updateField('scoreTime', e.target.value)}
                      style={inputStyle('scoreTime')}
                    />
                  </label>
              </>
            )}
          </div>

          {isForeignClub ? (
            <>
              <h4 style={{ marginTop: '2rem' }}>Hullscorer</h4>
              <div className="scorecard-mobile-grid">
            <div className="scorecard-mobile-table">
              <HoleDetailsGrid
                holes={foreignFormData.holes}
                updateHoleData={(index, field, value) => {
                  const updated = [...foreignFormData.holes];
                  updated[index][field] = value;
                  setForeignFormData({ ...foreignFormData, holes: updated });
                }}
              />
            </div>
            
            {processedImageUrl && isMobile && (
              <div className="scorecard-mobile-image">
                <img
                  src={processedImageUrl}
                  alt="Opplastet scorekort"
                />
              </div>
            )}
          </div>

          <style>{`
            .scorecard-mobile-grid {
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }

            .scorecard-mobile-image img {
              width: 100%;
              height: auto;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }

            @media (max-width: 767px) {
              .scorecard-mobile-grid {
                display: grid;
                grid-template-columns: 0.45fr 0.55fr; /* Adjust as needed */
                gap: 1rem;
                align-items: start;
              }

              .scorecard-mobile-table {
                max-width: 100%;
              }

              .scorecard-mobile-table .vertical-table {
                width: 100%;
                table-layout: fixed;
              }

              .scorecard-mobile-table .vertical-table input {
                width: 100%;
              }

              .scorecard-mobile-image img {
                width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                object-fit: contain;
              }
            }
          
            @media (max-width: 767px) {
              .vertical-table th,
              .vertical-table td {
                font-size: 0.5rem;
                padding: 0.4rem;
              }

              .vertical-table input {
                font-size: 0.5rem;
                padding: 0.25rem;
              }

              .scorecard-mobile-image img {
                max-width: 100%;
              }
            }
          `}</style>
            </>
          ) : (
            <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, marginTop: '2rem' }}>
              Hullscorer:
              <div className="hole-grid">
                {activeHoleScores.map((score: number, i: number) => (
                  <input
                    key={i}
                    type="number"
                    value={score}
                    onChange={(e) => updateHoleScore(i, parseInt(e.target.value) || 0)}
                    style={{
                      padding: '0.4rem',
                      borderRadius: '6px',
                      border: '1px solid #ccc',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  />
                ))}
              </div>
            </label>
          )}

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              marginTop: '2rem',
            }}
          >
            <div style={{ flex: '1 1 110px', minWidth: '110px' }}>
              {scoreSums && (
                <div style={{ fontWeight: 'bold' }}>
                  <p>Front 9: {(isForeignClub ? foreignScoreSums.frontSum : scoreSums?.frontSum) ?? '-'}</p>
                  {(isForeignClub ? foreignScoreSums.backSum : scoreSums?.backSum) !== null && (
                    <p>Back 9: {(isForeignClub ? foreignScoreSums.backSum : scoreSums?.backSum)}</p>
                  )}
                  <p>Total: {(isForeignClub ? foreignScoreSums.totalSum : scoreSums?.totalSum) ?? '-'}</p>
                </div>
              )}

              <button
                onClick={submitToGolfbox}
                disabled={loading}
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  padding: '0.75rem 0.75rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                {loading ? 'Sender...' : 'Send til GolfBox'}
              </button>
            </div>

            {processedImageUrl && !isMobile && (
              <div style={{ flex: '1 1 190px', minWidth: '190px' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>📷 Originalt bilde</h4>
                <img
                  src={processedImageUrl}
                  alt="Opplastet scorekort"
                  className="scorecard-image"
                />
              </div>
            )}
            <style>{`
              .form-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1.25rem;
              }

              @media (min-width: 768px) {
                .form-grid {
                  grid-template-columns: repeat(2, 1fr);
                }
              }

              .hole-grid {
                display: grid;
                grid-template-columns: repeat(9, 1fr);
                gap: 0.5rem;
                max-width: 100%;
              }

              .scorecard-image {
                width: 100%;
                max-width: 190px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }

              @media (min-width: 768px) {
                .scorecard-image {
                  max-width: 300px;
                }
              }

              @media (min-width: 1024px) {
                .scorecard-image {
                  max-width: 400px;
                }
              }
            `}</style>
          </div>

          {submitted && (
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                ✅ Score er sendt! Du kan nå lukke siden eller laste opp en ny runde.
              </p>
              <button
                onClick={resetForm}
                style={{
                  marginTop: '1rem',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ccc',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Last opp ny runde 🔄
              </button>
            </div>
          )}

          <style>{`
            .form-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 1.25rem;
            }

            @media (min-width: 768px) {
              .form-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }

            .hole-grid {
              display: grid;
              grid-template-columns: repeat(9, 1fr);
              gap: 0.5rem;
              max-width: 100%;
            }
          `}</style>

        </div>
        
      )}
    </div>
  );
};

export default UploadScoreOld;