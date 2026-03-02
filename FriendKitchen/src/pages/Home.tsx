import { useState, useEffect } from 'react'
import styles from './Home/Home.module.scss';
import DishCard from '../components/DishCard/DishCard';
import MenuModal from '../components/MenuModal/MenuModal';
import { menuApi, type Product } from '../api/menuApi';

const Home = () => {
    const [menuItems, setMenuItems] = useState<Product[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set())
    const [isModalOpen, setIsModalOpen] = useState(false);

    const CATEGORY_ORDER = [
        'СУПИ',
        'САЛАТИ',
        'ОСНОВНИ ЯСТИЯ',
        'МЕСО И РИБА',
        'ГАРНИТУРИ',
        'СТУДЕНИ ЯСТИЯ / РАЗЯДКИ',
        'ДЕСЕРТИ'
    ];


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

    const toggleSelection = (id: number | string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const selectedItems = menuItems.filter(item => selectedIds.has(item.id));

    // Grouping logic for the main view
    const groupedItems = menuItems.reduce((acc, item) => {
        const category = item.category || 'Другое';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {} as Record<string, Product[]>);

    const categories = Object.keys(groupedItems).sort((a, b) => {
        const indexA = CATEGORY_ORDER.indexOf(a);
        const indexB = CATEGORY_ORDER.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className={styles.homeContainer}>
            <div className={styles.controls}>
                <button
                    className={styles.templateBtn}
                    onClick={() => setIsModalOpen(true)}
                    disabled={selectedIds.size === 0}
                >
                    Сформировать шаблон ({selectedIds.size})
                </button>
            </div>

            {categories.map(category => (
                <section key={category} className={styles.categorySection}>
                    <h3 className={styles.categoryTitle}>{category}</h3>
                    <div className={styles.dishGrid}>
                        {groupedItems[category].map(item => (
                            <DishCard
                                key={item.id}
                                item={item}
                                isSelected={selectedIds.has(item.id)}
                                onToggle={toggleSelection}
                            />
                        ))}
                    </div>
                </section>
            ))}

            <MenuModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedItems={selectedItems}
            />
        </div>
    );
};

export default Home;
