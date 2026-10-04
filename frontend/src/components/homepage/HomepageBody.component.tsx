import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './HomepageBody.module.css';

import { TimerContext } from 'contexts/timer.context';
import { showToastSuccessMessage } from 'utils/toastMessage';

const HomepageBody = () => {
  const value = useContext(TimerContext);
  const [email, setEmail] = useState<string>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail('');
    showToastSuccessMessage(`Thanks! for subscribing`);
  };

  return (
    <>
      <div className={styles['deal-timer']}>
        <span className={`text-uppercase ${styles.heading}`}>gamer deals</span>

        <span className={`text-uppercase ${styles.timer}`}>ends in&nbsp;{value?.timer}</span>
      </div>
      <div className={styles['products']}>
        <div className={styles['product-container']}>
          <Link to="/products">
            <img
              loading="lazy"
              src="https://media.gamestop.com/i/gamestop/ps5_acc.jpeg"
              alt="playstation controller and accessories"
            />
          </Link>
          <span className="fw-500">PS5 Consoles</span>
        </div>
        <div className={styles['product-container']}>
          <Link to="/products">
            <img
              loading="lazy"
              src="https://media.gamestop.com/i/gamestop/ps5_console.jpeg"
              alt="playstation console"
            />
          </Link>
          <span className="fw-500">PS5 Accessories</span>
        </div>
        <div className={styles['product-container']}>
          <Link to="/products">
            <img
              loading="lazy"
              src="https://media.gamestop.com/i/gamestop/ps5_game_1.jpeg"
              alt="Playstation video game"
            />
          </Link>
          <span className="fw-500">PS5 Games</span>
        </div>
        <div className={styles['product-container']}>
          <Link to="/products">
            <img loading="lazy" src="https://media.gamestop.com/i/gamestop/ps4_acc_2.jpeg" alt="other accessories" />
          </Link>
          <span className="fw-500">Other Accessories</span>
        </div>
      </div>
      <div className={styles['cta-email-subscription']}>
        <img
          loading="lazy"
          className={styles['email-subscription-decoration-img']}
          src="/assets/bowser.png"
          alt={`super mario character - bowser, with his arms crossed`}
        />
        <div className={styles['cta-text-content']}>
          <h3>Subscribe to store updates</h3>
          <p>You will be the first to know about all discounts and new games!</p>
          <form className={styles['form']} onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className={styles['subscribe-button']}>Subscribe</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default HomepageBody;
