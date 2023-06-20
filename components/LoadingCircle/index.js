import style from "./LoadingCircle.module.css";

const LoadingCircle = () => {
  return (
    <div className={style.loadingCircle}>
      <div className={style.circle}></div>
    </div>
  );
};

export default LoadingCircle;
