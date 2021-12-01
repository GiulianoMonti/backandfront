import axios from "axios";

const baseUrl = "https://localhost:3001/api/persons/";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const deleteById = (id, newObject) => {
  const request = axios.delete(`${baseUrl}/${id}`, newObject);

  return request.then((response) => response.data);
};

export default {
  getAll: getAll,
  create: create,
  update: update,
  deleteById: deleteById,
};
