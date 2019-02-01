import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import LazyLoad from 'react-lazy-load';

import { IMAGES_URL } from '../helpers/routes'

import * as ProductApi from '../helpers/ProductApi'

const scrollOffset = 400

//https://dev.sklep.balticad.eu/rest/V1/products/?searchCriteria[pageSize]=10&searchCriteria[currentPage]=1

export default class MainScreen extends Component {

    state = {
        firstLoad: true,
        page: 1,
        pageLoading: false,
        productsData: Array(10).fill(null),
        error: null,
        imagesLoaded: []
    }

    updateImagesLoadedList = (loadedImagePath) => {
        //Add new image path to loaded list
        var newArray = this.state.imagesLoaded.slice();
        newArray.push(loadedImagePath);

        this.setState({
            imagesLoaded: newArray
        })
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

    getProductsData = async (page) => {
        //Load product data
        this.setState({
            pageLoading: true
        })
        await ProductApi.getAllProducts(page, this.errorHandler)
            .then(productsData => {
                if (productsData) {
                    if (productsData.message) {
                        this.errorHandler(productsData)
                    } else {
                        console.log(productsData)

                        if (productsData.items) {
                            var newProducts = Array(productsData.items.count)
                            productsData.items.map((productData, index) => {
                                newProducts[index] = productData
                                var imagePath = productData.custom_attributes.find(obj => {
                                    return obj.attribute_code === 'image'
                                }).value
                                newProducts[index].main_image = imagePath
                            })

                            if (this.state.page === 1) {
                                this.setState({
                                    productsData: newProducts,
                                    page: page + 1,
                                    pageLoading: false
                                })
                            } else {
                                this.setState({
                                    productsData: this.state.productsData.concat(newProducts),
                                    page: page + 1,
                                    pageLoading: false
                                })
                            }


                        }

                    }
                }
            })
    }

    componentDidMount = () => {
        this.getProductsData(this.state.page);
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount = () => {
        window.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll = () => {
        if ((window.innerHeight + window.scrollY + scrollOffset) >= document.body.offsetHeight && (!this.state.pageLoading || this.state.firstLoad === true)) {
            if (this.state.firstLoad === true)
                this.setState({ firstLoad: false }, () => this.getProductsData(this.state.page))
            else
                this.getProductsData(this.state.page)
        }

    }

    render() {
        return (
            <div className="products-list">

                <div className="container">

                    <h1>Lista produktów</h1>

                    {this.state.productsData.map((productData, index) => {
                        return (
                            <LazyLoad
                                height={180}
                                key={index}
                                debounce={false}
                                offsetVertical={0}
                                throttle={100}
                            >
                                <Link to={(productData) ? "product/" + productData.sku : "#"}>
                                    <div className={`product-list-item ${(productData) ? "loaded" : "loading"}`} ref={(el) => {
                                        if (this.product_items) {
                                            this.product_items[index] = el
                                        } else
                                            this.product_items = [el]
                                    }
                                    }>
                                        <div className={`product-list-item__image-container loader-container ${(productData && this.state.imagesLoaded.includes(productData.main_image)) ? "loaded" : "loading"}`}>
                                            <div className="product__image">
                                                {(productData
                                                    && (
                                                        this.state.imagesLoaded.length >= index
                                                        ||
                                                        (
                                                            this.product_items[index] && window.scrollY > this.product_items[index].getBoundingClientRect().top
                                                        )
                                                    )
                                                )
                                                    &&
                                                    <img
                                                        src={IMAGES_URL + productData.main_image}
                                                        alt={productData.sku}
                                                        onLoad={() => this.updateImagesLoadedList(productData.main_image)}
                                                    />
                                                }
                                            </div>
                                        </div>
                                        <div className="product-list-item__info">
                                            <div className="product__name loader-container">{(productData) && <span>{productData.name}</span>}</div>
                                            <div className="product__sku loader-container">{(productData) && (<React.Fragment><span>SKU:</span> <span>{productData.sku}</span></React.Fragment>)}</div>
                                            <div className="product__price loader-container">{(productData) && <React.Fragment><span>{productData.price.toFixed(2)}</span> zł</React.Fragment>}</div>
                                        </div>
                                    </div>
                                </Link>
                            </LazyLoad>
                        )
                    })}

                    <div className="loader"></div>

                </div>

            </div>

        )
    }
}