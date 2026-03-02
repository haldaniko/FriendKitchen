import { useState, useEffect } from 'react'
import DishForm from '../components/DishForm/DishForm';
import MenuList from '../components/MenuList/MenuList';
import { menuApi, type Product } from '../api/menuApi';

export const Editing = () => {
  const AVAILABLE_CATEGORIES = [
    'СУПИ',
    'САЛАТИ',
    'ОСНОВНИ ЯСТИЯ',
    'МЕСО И РИБА',
    'ГАРНИТУРИ',
    'СТУДЕНИ ЯСТИЯ / РАЗЯДКИ',
    'ДЕСЕРТИ'
  ];

  const [menuItems, setMenuItems] = useState<Product[]>([])


  const [editingId, setEditingId] = useState<number | string | null>(null)
  const [editFormData, setEditFormData] = useState<Product | null>(null)

  const fetchMenu = async () => {
    try {
      const data = await menuApi.getAll();
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        const data = await menuApi.getAll();
        if (!ignore) {
          setMenuItems(data);
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  // Начало редактирования (inline)
  const handleEditClick = (item: Product) => {
    setEditingId(item.id);
    setEditFormData({ ...item });
  };

  // Изменение полей при редактировании
  const handleEditChange = (field: keyof Product, value: string | number) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  // Сохранение изменений (inline) via PUT
  const handleSaveEdit = async () => {
    if (!editFormData) return;

    try {
      const { id, name, weight, price, category } = editFormData;

      await menuApi.update(id, {
        name,
        weight: (weight as any !== undefined && weight as any !== '') ? Number(weight) : undefined,
        price: Number(price),
        category
      });

      await fetchMenu();

      setEditingId(null);
      setEditFormData(null);
    } catch (error) {
      console.error('Error updating dish:', error);
      alert('Не удалось обновить блюдо. Проверьте консоль.');
    }
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  // Удаление блюда
  const handleDeleteItem = async (id: number | string) => {
    try {
      await menuApi.delete(id);

      await fetchMenu();

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  }

  return (
    <div className="contentContainer">
      <DishForm
        onDishAdded={fetchMenu}
        availableCategories={AVAILABLE_CATEGORIES}
      />

      <MenuList
        items={menuItems}
        editingId={editingId}
        editFormData={editFormData}
        availableCategories={AVAILABLE_CATEGORIES}
        onEditClick={handleEditClick}
        onEditChange={handleEditChange}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
        onDelete={handleDeleteItem}
      />
    </div>
  );
};

export default Editing;
