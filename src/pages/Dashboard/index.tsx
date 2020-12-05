import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import {
  createFood,
  deleteFood,
  editFood,
  fetchFoods,
} from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  async function loadFoods(): Promise<void> {
    const foodsResponse = await fetchFoods();

    setFoods(foodsResponse ?? []);
  }

  useEffect(() => {
    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    const newFood = await createFood(food);

    setFoods(prev => [...prev, newFood ?? {}]);
  }

  async function handleUpdateFood(
    updateFoodData: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    const updatedFood = await editFood({
      ...editingFood,
      ...updateFoodData,
    });

    setFoods(prev =>
      prev.map(food =>
        food.id === updatedFood.id
          ? {
              ...food,
              ...updatedFood,
            }
          : food,
      ),
    );
  }

  async function handleDeleteFood(id: number): Promise<void> {
    await deleteFood(id);

    setFoods(prev => prev.filter(food => food.id !== id));
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    toggleEditModal();
    setEditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
