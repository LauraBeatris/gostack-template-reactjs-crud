import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export const fetchFoods = async () => {
  try {
    const { data } = await api.get('foods');

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const createFood = async food => {
  try {
    const { data } = await api.post('foods', food);

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const editFood = async editingFood => {
  try {
    const { data } = await api.put(`foods/${editingFood.id}`, editingFood);

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteFood = async foodId => {
  try {
    await api.delete(`foods/${foodId}`);
  } catch (err) {
    console.log(err);
  }
};

export default api;
