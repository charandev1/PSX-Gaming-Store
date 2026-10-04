import styles from './CategoryBody.module.css';
import { Link } from 'react-router-dom';
const Category = () => {
 return(
    <>
    <div className={styles['deal-timer']}>
        <span className={`text-uppercase ${styles.heading}`}>gamer deals</span>

        {/* <span className={`text-uppercase ${styles.timer}`}>ends in&nbsp;{value?.timer}</span> */}
      </div>
      <div className={styles['products']}>
        <div className={styles['product-container']}>
          <Link to="/products/category/consoles">
            <img
              loading="lazy"
              src="https://media.gamestop.com/i/gamestop/ps5_acc.jpeg"
              alt="playstation controller and accessories"
            /></Link>
          <span className="fw-500">PS5 Consoles</span>
        </div>
        <div className={styles['product-container']}>
         <Link to="/products/category/accessories"> <img
              loading="lazy"
              src="https://media.gamestop.com/i/gamestop/ps5_console.jpeg"
              alt="playstation console"
            /></Link>
           
          <span className="fw-500">PS5 Accessories</span>
        </div>
        <div className={styles['product-container']}>
           <Link to="/products/category/game"> <img
              loading="lazy"
              src="https://media.gamestop.com/i/gamestop/ps5_game_1.jpeg"
              alt="Playstation video game"
            /></Link> 
          <span className="fw-500">PS5 Games</span>
        </div>
        <div className={styles['product-container']}>
            <Link to="/products"> <img loading="lazy" src="https://media.gamestop.com/i/gamestop/ps4_acc_2.jpeg" alt="other accessories" /></Link>
          <span className="fw-500">Other Accessories</span>
        </div>
      </div>
    </>
     
 );
};
export default Category;