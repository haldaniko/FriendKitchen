import React, { useState } from 'react';
import styles from './DishForm.module.scss';
import { API_BASE } from '../../config/api';

interface DishFormProps {
    onDishAdded: () => void;
    availableCategories: string[];
}

const DishForm: React.FC<DishFormProps> = ({ onDishAdded, availableCategories }) => {
    const [dishName, setDishName] = useState('');
    const [dishPrice, setDishPrice] = useState('');
    const [dishWeight, setDishWeight] = useState('');
    const [dishCategory, setDishCategory] = useState('');

    const handleAddDish = async () => {
        if (!dishName || !dishPrice || !dishCategory) {
            alert('Заполните обязательные поля (Название, Цена, Категория)!');
            return;
        }

        const weight = dishWeight !== '' ? Number(dishWeight) : undefined;
        if (weight !== undefined && weight < 0) {
            alert('Вес не может быть отрицательным!');
            return;
        }

        const price = Number(dishPrice);
        if (isNaN(price) || price < 0) {
            alert('Цена должна быть положительным числом!');
            return;
        }

        try {
            const itemData = {
                name: dishName,
                price: price,
                weight: weight,
                category: dishCategory
            };

            await fetch(`${API_BASE}/menu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData),
            });

            // Notify parent to refresh list
            onDishAdded();

            // Clear form
            setDishName('');
            setDishPrice('');
            setDishWeight('');
            setDishCategory('');
        } catch (error) {
            console.error('Error adding dish:', error);
            alert('Ошибка при добавлении блюда');
        }
    };
    ;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddDish();
        }
    };

    return (
        <div className={`card ${styles.formCard}`}>
            <h2 className={styles.title}>Добавить позицию в меню</h2>
            <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="Название"
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <input
                    type="number"
                    placeholder="Вес"
                    min="0"
                    value={dishWeight}
                    onChange={(e) => setDishWeight(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <input
                    type="number"
                    placeholder="Цена"
                    min="0"
                    step="0.01"
                    value={dishPrice}
                    onChange={(e) => setDishPrice(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <select
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value)}
                    onKeyDown={handleKeyDown}
                >
                    <option value="" disabled>Выберите категорию</option>
                    {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <button onClick={handleAddDish} className={styles.addButton}>Добавить</button>
        </div>
    );
};

export default DishForm;
