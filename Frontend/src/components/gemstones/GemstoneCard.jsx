import { Link } from "react-router-dom";
import { FaBalanceScale } from "react-icons/fa";
import { formatPkr, formatUsd } from "../../lib/currency";

const GemstoneCard = ({ item }) => {

  return (
    <Link
      to={`/product/gemstone/${item.slug}`}
      state={{ item }}
      className="catalog-product-card group"
    >
      <div className="catalog-product-card__image">
        <div className="catalog-product-card__control catalog-product-card__control--compare">
          <FaBalanceScale />
        </div>

        <div className="catalog-product-card__frame">
          <img
            src={item.image || item.images?.[0]}
            alt={item.name}
            className="catalog-product-card__product-image"
          />
        </div>
      </div>

      <div className="catalog-product-card__details">
        <h3>{item.name}{item.weight ? ` - ${item.weight} crt` : ""}</h3>
        <p className="catalog-product-card__item-id">Item ID: {item._id?.slice(-6)}</p>
        <p className="catalog-product-card__price">{formatUsd(item.price)}</p>
        <p className="catalog-product-card__pkr-price">{formatPkr(item.price)}</p>
        <span className="catalog-product-card__cta">View Details</span>
      </div>

    </Link>
  );
};

export default GemstoneCard;
