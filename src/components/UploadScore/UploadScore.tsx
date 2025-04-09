import React from "react";
import UploadScoreForm from "./UploadScoreForm";
import InitialUploadStep from "./InitialUploadStep";
import { useUploadScoreLogic } from "./useUploadScoreLogic";

/**
 * UploadScore handles the conditional rendering between:
 * - InitialUploadStep (image + foreign club toggle)
 * - UploadScoreForm (form editing + score details)
 */
const UploadScore: React.FC = () => {
  const {
    isForeignClub,
    setIsForeignClub,
    showForm,
    loading,
    handleImageUpload,
    handleParseImage,
    foreignFormData,
    updateForeignField,
    country,
    setCountry,
    markerSearch,
    setMarkerSearch,
    markerOptions,
    selectedMarker,
    setSelectedMarker,
    image,
    status,
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
          foreignFormData={foreignFormData}
          updateForeignField={updateForeignField}
          country={country}
          setCountry={setCountry}
          inputStyle={formProps.inputStyle}
          missingFields={formProps.foreignMissingFields}
          markerSearch={markerSearch}
          setMarkerSearch={setMarkerSearch}
          image={image}
          status={status}
        />
      ) : (
        <UploadScoreForm
          isForeignClub={isForeignClub}
          foreignFormData={foreignFormData}
          updateForeignField={updateForeignField}
          country={country}
          setCountry={setCountry}
          markerOptions={markerOptions}
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          status={status}
          {...formProps}
        />
      )}
    </>
  );
};

export default UploadScore;