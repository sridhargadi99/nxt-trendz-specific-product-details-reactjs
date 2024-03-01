// Write your code here
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const productItemDetailsStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: {},
    activeStatus: productItemDetailsStatus.success,
    productItemListDetails: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  convertSnakeCaseTOCamelCase = object => ({
    id: object.id,
    imageUrl: object.image_url,
    brand: object.brand,
    title: object.title,
    totalReviews: object.total_reviews,
    rating: object.rating,
    availability: object.availability,
    description: object.description,
    price: object.price,
  })

  getProductDetails = async () => {
    this.setState({
      activeStatus: productItemDetailsStatus.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const productUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(productUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = this.convertSnakeCaseTOCamelCase(data)
      const updatedList = data.similar_products.map(eachProduct =>
        this.convertSnakeCaseTOCamelCase(eachProduct),
      )

      this.setState({
        activeStatus: productItemDetailsStatus.success,
        productItemDetails: updatedData,
        productItemListDetails: updatedList,
      })
    } else if (data.status_code === 404) {
      this.setState({activeStatus: productItemDetailsStatus.failure})
    }
  }

  decreaseByOne = () => {
    const {quantity} = this.state
    if (quantity === 1) {
      this.setState({quantity})
    } else {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  increaseByOne = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  clickContinueButton = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoading = () => (
    <div className="loader-style" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderSuccessView = () => {
    const {productItemDetails, productItemListDetails, quantity} = this.state
    const {
      imageUrl,
      brand,
      title,
      totalReviews,
      rating,
      availability,
      description,
      price,
    } = productItemDetails
    return (
      <div className="product-item-container">
        <Header />
        <div className="product-view-container">
          <div className="container1">
            <img
              className="product-view-image-style"
              src={imageUrl}
              alt="product"
            />
          </div>
          <div className="container2">
            <h1 className="product-view-heading-style">{title}</h1>
            <p className="product-view-price-style">Rs {price}/-</p>
            <div className="product-view-rating-review-container">
              <button type="button" className="rating-button-style">
                <p className="rating-content-style">{rating}</p>
                <img
                  className="star-image-style"
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </button>
              <p className="review-content-style">{totalReviews} Reviews</p>
            </div>
            <p className="description-style">{description}</p>
            <div className="content-value-container">
              <p className="content-style">Available: </p>
              <p className="value-style">{availability}</p>
            </div>
            <div className="content-value-container">
              <p className="content-style">Brand: </p>
              <p className="value-style">{brand}</p>
            </div>
            <hr className="hr-rule" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-button-style"
                onClick={this.decreaseByOne}
                data-testid="minus"
                aria-label="Save"
              >
                <BsDashSquare className="sort-by-icon" />
              </button>
              <p className="quantity-style">{quantity}</p>
              <button
                type="button"
                className="quantity-button-style"
                onClick={this.increaseByOne}
                data-testid="plus"
                aria-label="Save"
              >
                <BsPlusSquare className="sort-by-icon" />
              </button>
            </div>
            <button type="button" className="cart-button-style">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading-style">Similar Products</h1>
          <ul className="similar-product-list-container">
            {productItemListDetails.map(eachProduct => (
              <SimilarProductItem
                eachProduct={eachProduct}
                key={eachProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <Header />
      <div className="product-not-found-container">
        <div className="product-not-found-sub-container">
          <img
            className="product-not-found-image-style"
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
            alt="failure view"
          />
          <h1 className="product-not-found-heading-style">Product Not Found</h1>
          <button
            type="button"
            className="product-not-found-button-style"
            onClick={this.clickContinueButton}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )

  render() {
    const {activeStatus} = this.state
    switch (activeStatus) {
      case productItemDetailsStatus.inProgress:
        return this.renderLoading()
      case productItemDetailsStatus.success:
        return this.renderSuccessView()
      case productItemDetailsStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
