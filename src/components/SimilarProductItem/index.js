// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  const {imageUrl, title, brand, price, rating} = eachProduct

  return (
    <li className="similar-product-list-style">
      <img
        className="similar-product-image-style"
        src={imageUrl}
        alt={`similar product ${title}`}
      />
      <h1 className="similar-product-name-style">{title}</h1>
      <p className="similar-product-by-style">by {brand}</p>
      <div className="price-rating-container">
        <p className="price-style">RS {price}/-</p>
        <button type="button" className="rating-star-container">
          <p className="rating-style">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            className="star-image-style"
            alt="star"
          />
        </button>
      </div>
    </li>
  )
}

export default SimilarProductItem
