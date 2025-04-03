import UploadScoreForm from "./UploadScoreForm";
import InitialUploadStep from "./InitialUploadStep";
import { useUploadScoreLogic } from "./useUploadScoreLogic";

const UploadScore = () => {
  const {
    isForeignClub,
    setIsForeignClub,
    showForm,
    loading,
    handleImageUpload,
    handleParseImage,
    ...formProps
  } = useUploadScoreLogic();

  return (
    <>
      {!showForm ? (
        <InitialUploadStep
          isForeignClub={isForeignClub}
          setIsForeignClub={setIsForeignClub}
          handleImageUpload={handleImageUpload}
          handleParseImage={handleParseImage}
          loading={loading}
        />
      ) : (
        <UploadScoreForm
          isForeignClub={isForeignClub}
          {...formProps}
        />
      )}
    </>
  );
};

export default UploadScore;