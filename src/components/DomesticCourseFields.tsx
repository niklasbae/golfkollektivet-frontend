import Select from 'react-select';
import { Club, Course, Tee, ScoreFormData } from './types';

type Props = {
  formData: ScoreFormData;
  updateField: (field: keyof ScoreFormData, value: any) => void;
  clubs: Club[];
  courses: Course[];
  tees: Tee[];
  clubSelectValue: { label: string; value: string } | null;
  courseSelectValue: { label: string; value: string } | null;
  teeSelectValue: { label: string; value: string } | null;
  setClubSelectValue: (val: any) => void;
  setCourseSelectValue: (val: any) => void;
  setTeeSelectValue: (val: any) => void;
  missingFields: (keyof ScoreFormData)[];
  inputStyle: (key: keyof ScoreFormData) => any;
  fieldLabels: Record<string, string>;
};

export const DomesticCourseFields = ({
  clubs,
  courses,
  tees,
  clubSelectValue,
  courseSelectValue,
  teeSelectValue,
  setClubSelectValue,
  setCourseSelectValue,
  setTeeSelectValue,
  inputStyle,
  fieldLabels,
}: Props) => {
  const clubOptions = clubs.map(c => ({ label: c.clubName, value: c.clubName }));
  const courseOptions = courses.map(c => ({ label: c.courseName, value: c.courseName }));
  const teeOptions = tees.map(t => ({ label: t.teeName, value: t.teeName }));

  return (
    <>
        <label>
          {fieldLabels.clubName}:
          <Select
            options={clubOptions}
            value={clubSelectValue}
            onChange={val => setClubSelectValue(val)}
            styles={inputStyle('clubName')}
          />
        </label>

        <label>
          {fieldLabels.courseName}:
          <Select
            options={courseOptions}
            value={courseSelectValue}
            onChange={val => setCourseSelectValue(val)}
            styles={inputStyle('courseName')}
          />
        </label>

        <label>
          {fieldLabels.teeName}:
          <Select
            options={teeOptions}
            value={teeSelectValue}
            onChange={val => setTeeSelectValue(val)}
            styles={inputStyle('teeName')}
          />
        </label>
      </>
  );
};