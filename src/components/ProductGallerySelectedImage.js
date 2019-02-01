import React, { Component } from 'react'

export default class ProductGallerySelectedImage extends Component {

    state = {
        fadeIn: false
    }

    fadeIn = () => {
        if (!this.state.fadeIn) {
            this.setState({
                fadeIn: true
            })
        }
    }

    render() {

        const { imagesLoaded, imagePath, selectedImage } = this.props;

        return (
            <div className="product-image-selected loader-container">

                <div className={`product__image loader-container ${(selectedImage && imagesLoaded.includes(selectedImage)) ? "loaded" : "loading"}`} >
                    {(selectedImage) &&
                        <img
                            key={imagePath + selectedImage}
                            src={imagePath + selectedImage}
                            className={(this.state.fadeIn) ? "fadeIn" : ""}
                            alt="Podgląd zdjęcia"
                            onLoad={() => this.fadeIn()}
                        />
                    }
                </div>


            </div>
        )
    }
}