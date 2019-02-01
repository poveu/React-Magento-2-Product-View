import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { IMAGES_URL } from '../helpers/routes'

import * as ProductApi from '../helpers/ProductApi'
import ProductGallery from './ProductGallery'

export default class ProductDetails extends Component {

    SKU = this.props.match.params.sku

    state = {
        productData: null,
        imagesLoaded: [],
        error: null
    }

    errorHandler = error => {

        var errorMessage;

        if (error.message) {
            if (error.message === "The product that was requested doesn't exist. Verify the product and try again.") {
                errorMessage =
                    <div>
                        <h1>Nie znaleziono produktu</h1>
                        Produkt o SKU {this.SKU} nie istnieje.
                        <div class="button"><Link to={`${process.env.PUBLIC_URL}/`}>Wróć do strony głównej</Link></div>
                    </div>
            } else {
                errorMessage =
                    <div>
                        <h1>Serwer zwrócił błąd</h1>
                        {error.message}
                    </div>
            }

        } else {
            errorMessage =
                <div>
                    <h1>Błąd serwera</h1>
                    Wystąpił błąd ({error}) po stronie serwera.
                </div>
        }

        this.setState({
            error: errorMessage
        })

    }

    getProductData = async (sku) => {
        //Load product data
        await ProductApi.getProduct(sku, this.errorHandler)
            .then(productData => {
                if (productData) {
                    if (productData.message) {
                        this.errorHandler(productData)
                    } else {
                        this.setState({
                            productData
                        })
                    }
                }
            })

    }

    componentDidMount = () => {
        this.getProductData(this.SKU);
    }

    render() {
        return (
            <div className={`product-container ${(this.state.productData) ? "loaded" : "loading"}`} >

                {(this.state.error === null) ?

                    <div className="row">

                        <ProductGallery
                            productData={this.state.productData}
                            imagePath={IMAGES_URL}
                        />

                        <div className="col">
                            <div className="product__name loader-container"><h1>{(this.state.productData) && (this.state.productData.name)}</h1></div>

                            <div className="product__sku loader-container">
                                <div>
                                    {this.state.productData &&
                                        <div>
                                            <span>SKU:</span> {this.SKU}
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="product__price loader-container">
                                <div>
                                    {this.state.productData &&
                                        <div>
                                            <span>{this.state.productData.price.toFixed(2)}</span> zł
                                </div>
                                    }
                                </div>
                            </div>

                            <div className="productDescription loader-container">
                                <div dangerouslySetInnerHTML={this.state.productData && {
                                    __html: this.state.productData.custom_attributes.find(obj => {
                                        return obj.attribute_code === 'description'
                                    }).value
                                }}>
                                </div>
                            </div>

                        </div>
                    </div>

                    :
                    <div className="error">
                        {this.state.error}
                    </div>

                }
            </div>
        )
    }
}