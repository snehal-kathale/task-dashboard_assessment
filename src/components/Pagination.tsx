import styles from "./Pagination.module.css";

type Props = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const Pagination = ({ currentPage, totalPages, onPrev, onNext }: Props) => {
  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={onPrev}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span className={styles.info}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={styles.button}
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
