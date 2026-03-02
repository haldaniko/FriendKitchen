import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import styles from './MenuModal.module.scss';
import logo from '../../assets/IMG_9834 1.png';

// Import category icons
import SaladIcon from '../../assets/dishesCategories/Salad.svg';
import SoupIcon from '../../assets/dishesCategories/Soup.svg';
import MainDishIcon from '../../assets/dishesCategories/MainDish.svg';
import MeatFishIcon from '../../assets/dishesCategories/MeatFish.svg';
import SideIcon from '../../assets/dishesCategories/Side.svg';
import DessertIcon from '../../assets/dishesCategories/Dessert.svg';
import HotIcon from '../../assets/dishesCategories/pepperHot.svg';

const CATEGORY_ICONS: Record<string, string> = {
    'САЛАТИ': SaladIcon,
    'СУПИ': SoupIcon,
    'ОСНОВНИ ЯСТИЯ': MainDishIcon,
    'МЕСО И РИБА': MeatFishIcon,
    'ГАРНИТУРИ': SideIcon,
    'ДЕСЕРТИ': DessertIcon,
    'СТУДЕНИ ЯСТИЯ / РАЗЯДКИ': HotIcon,
};

import { type Product } from '../../api/menuApi';

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItems: Product[];
}

const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose, selectedItems }) => {
    const templateRef = useRef<HTMLDivElement>(null);

    // Lock scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const today = new Date();

    // Format: (Понедельник / dd.mm)
    const dayOfWeek = today.toLocaleDateString('bg-BG', { weekday: 'long' });
    const capitalizedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const displayDate = `(${capitalizedDay} / ${day}.${month})`;

    const groupedItems = selectedItems.reduce((acc, item) => {
        const category = item.category || 'Друго';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {} as Record<string, Product[]>);

    const handleDownload = async (format: 'png' | 'jpeg') => {
        if (!templateRef.current) return;

        try {
            const canvas = await html2canvas(templateRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true
            });

            const link = document.createElement('a');
            link.download = `menu-${today.toISOString().split('T')[0]}.${format}`;
            link.href = canvas.toDataURL(`image/${format}`, 1.0);
            link.click();
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Изглед отпред на шаблона</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.modalBody}>
                    <div ref={templateRef} className={styles.templateWrapper}>
                        <header className={styles.templateHeader}>
                            <div className={styles.headerTitleSection}>
                                <h1 className={styles.menuTitle}>Меню</h1>
                                <p className={styles.dateSubtext}>{displayDate}</p>
                            </div>
                            <div className={styles.headerLogoSection}>
                                <img src={logo} alt="Logo" className={styles.templateLogo} />
                            </div>
                        </header>

                        {Object.keys(groupedItems)
                            .sort((a, b) => {
                                const order = [
                                    'СУПИ',
                                    'САЛАТИ',
                                    'ОСНОВНИ ЯСТИЯ',
                                    'МЕСО И РИБА',
                                    'ГАРНИТУРИ',
                                    'СТУДЕНИ ЯСТИЯ / РАЗЯДКИ',
                                    'ДЕСЕРТИ'
                                ];
                                const indexA = order.indexOf(a);
                                const indexB = order.indexOf(b);
                                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                if (indexA !== -1) return -1;
                                if (indexB !== -1) return 1;
                                return a.localeCompare(b);
                            })
                            .map(category => (
                                <div key={category} className={styles.categoryGroup}>
                                    <div className={styles.categoryHeader}>
                                        {CATEGORY_ICONS[category] && (
                                            <img src={CATEGORY_ICONS[category]} alt={category} className={styles.categoryIcon} />
                                        )}
                                        <h3 className={styles.categoryName}>{category}</h3>
                                    </div>
                                    <ul className={styles.itemList}>
                                        {groupedItems[category].map(item => (
                                            <li key={item.id} className={styles.menuItem}>
                                                <span className={styles.itemName}>{item.name}</span>
                                                <span className={styles.itemDetails}></span>
                                                {item.weight && item.weight > 0 ? <span className={styles.itemWeight}>{item.weight} гр</span> : null}
                                                <span className={styles.itemPrice}>€{Number(item.price).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.downloadBtn} onClick={() => handleDownload('png')}>
                        Скачать PNG
                    </button>
                    <button className={styles.secondaryBtn} onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuModal;
