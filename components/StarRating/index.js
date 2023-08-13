import style from "./starRating.module.css";
const StarRating = ({ rating }) => {
  const fullStars = Math.ceil(rating);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} className={style.star}>
        &#9733;
      </span>
    );
  }

  return <div className={style.starRating}>{stars}</div>;
};

export default StarRating;
