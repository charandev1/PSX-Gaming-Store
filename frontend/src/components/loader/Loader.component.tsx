import styles from './Loader.styles.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}>
        <span className="sr-only">loading animation</span>
      </div>
    </div>
  );
};

export default Loader;
