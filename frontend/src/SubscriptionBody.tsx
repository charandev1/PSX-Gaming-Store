import { showToastSuccessMessage } from './toastMessage';
import styles from './SubscriptionBody.module.css';

const SubscriptionBody = () => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    showToastSuccessMessage('Thanks for subscribing!');
  };

  return (
    <div className={styles['cta-email-subscription']}>
      <div className={styles['image-wrapper']}>
        <img
          loading="lazy"
          className={styles['email-subscription-decoration-img']}
          src="./assets/bowser.png"
          alt={`super mario character - bowser, with his arms crossed`}
        />
      </div>
      <div className={styles['cta-text-content']}>
        <h3>Subscribe to store updates</h3>
        <p>You will be the first to know about all discounts and new games!</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your E-mail"
            required
          />

          <button
            type="submit"
            className={styles['subscribe-button']}
          >
            Subscribe
          </button>
        </form>
      </div>

    </div>
  );
};

export default SubscriptionBody;
