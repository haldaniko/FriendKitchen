import { Link } from 'react-router-dom';
import styles from './Header.module.scss';
import kitchen from '../../assets/kitchen.svg'

const getHomeHref = () => {
    if (window.location.pathname === '/kitchen' || window.location.pathname.startsWith('/kitchen/')) {
        return '/kitchen/';
    }

    return '/';
};

const Header = () => {
    return (
        <header className={styles.header}>
            <a href={getHomeHref()} className={styles.logoContainer}>
                <div className={styles.logoWrapper}>
                    <img src={kitchen} alt="Logo" />
                </div>
                <h1 className={styles.title}>Кухня на Дружбата</h1>
            </a>

            <nav className={styles.nav}>
                <Link to="/editing" className={styles.editBtn}>
                    Редактирование
                </Link>
            </nav>
        </header>
    );
};

export default Header;
