import axiosInstance from '../api/axiosInstance';

// =========================
// GET All Stages
// =========================
export const getAllStages = async () => {
  const response = await axiosInstance.get('/stages');
  return response.data;
};

// =========================
// GET All Stage Groups
// =========================
export const getAllStageGroups = async () => {
  const response = await axiosInstance.get('/stage-groups');
  return response.data;
};
