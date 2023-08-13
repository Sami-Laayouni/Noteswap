import style from "./loadingCircle.module.css";

const LoadingCircle = () => {
  return (
    <div className={style.loadingCircle}>
      <div className={style.circle}></div>
    </div>
  );
};

export default LoadingCircle;
