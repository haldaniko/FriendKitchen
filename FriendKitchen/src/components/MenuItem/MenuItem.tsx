import React from 'react';
import styles from './MenuItem.module.scss';

import { type Product } from '../../api/menuApi';

interface MenuItemProps {
    item: Product;
    isEditing: boolean;
    editFormData: Product | null;
    availableCategories: string[];
    onEditClick: (item: Product) => void;
    onEditChange: (field: keyof Product, value: string | number) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (id: number | string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
    item,
    isEditing,
    editFormData,
    availableCategories,
    onEditClick,
    onEditChange,
    onSave,
    onCancel,
    onDelete
}) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(false);

    const handleDeleteClick = () => {
        setIsConfirmingDelete(true);
    };

    const handleConfirmDelete = () => {
        onDelete(item.id);
        setIsConfirmingDelete(false);
    };

    const handleCancelDelete = () => {
        setIsConfirmingDelete(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSave();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <li className={styles.menuItem}>
            {isEditing ? (
                // INLINE EDITING MODE
                <div className={styles.editContainer}>
                    <div className={styles.editField}>
                        <span className={styles.label}>Название</span>
                        <input
                            className={styles.inputEdit}
                            value={editFormData?.name || ''}
                            onChange={(e) => onEditChange('name', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Название"
                            autoFocus
                        />
                    </div>
                    <div className={styles.editField}>
                        <span className={styles.label}>Вес (г)</span>
                        <input
                            className={styles.inputEdit}
                            type="number"
                            value={editFormData?.weight !== undefined ? editFormData.weight : ''}
                            onChange={(e) => onEditChange('weight', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Вес"
                        />
                    </div>
                    <div className={styles.editField}>
                        <span className={styles.label}>Цена (€)</span>
                        <input
                            className={styles.inputEdit}
                            type="number"
                            step="0.01"
                            value={editFormData?.price !== undefined ? editFormData.price : ''}
                            onChange={(e) => onEditChange('price', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Цена"
                        />
                    </div>
                    <div className={styles.editField}>
                        <span className={styles.label}>Категория</span>
                        <select
                            className={styles.inputEdit}
                            value={editFormData?.category || ''}
                            onChange={(e) => onEditChange('category', e.target.value)}
                            onKeyDown={handleKeyDown}
                        >
                            {availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.editActions}>
                        <button onClick={onSave} className={`${styles.actionButton} ${styles.ok}`}>OK</button>
                        <button onClick={onCancel} className={`${styles.actionButton} ${styles.cancel}`}>X</button>
                    </div>
                </div>
            ) : (
                <>
                    <span>
                        <strong>{item.name}</strong>
                        {item.weight && item.weight > 0 ? ` (${item.weight}г)` : ''}
                        — {(() => {
                            const p = Number(item.price);
                            return isNaN(p) ? 'N/A' : p.toFixed(2);
                        })()}€
                    </span>
                    <div className={styles.actions}>
                        {isConfirmingDelete ? (
                            <div className={styles.confirmDelete}>
                                <span className={styles.confirmText}>Уверены?</span>
                                <button
                                    className={`${styles.actionButton} ${styles.ok}`}
                                    onClick={handleConfirmDelete}
                                >
                                    Да
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.cancel}`}
                                    onClick={handleCancelDelete}
                                >
                                    Нет
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    className={`${styles.actionButton} ${styles.edit}`}
                                    onClick={() => onEditClick(item)}
                                >
                                    Ред.
                                </button>
                                <button
                                    className={`${styles.actionButton} ${styles.delete}`}
                                    onClick={handleDeleteClick}
                                >
                                    Удалить
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </li>
    );
};

export default MenuItem;
