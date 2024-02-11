/* Loading circle used to show the user that content is loading */

// Import the style
import style from "./loadingCircle.module.css";

const LoadingCircle = () => {
  return (
    <div className={style.loadingCircle}>
      <div className={style.circle}></div>
    </div>
  );
};

export default LoadingCircle;
