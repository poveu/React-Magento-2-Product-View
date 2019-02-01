import React, { Component } from 'react'
import ProductGallerySelectedImage from './ProductGallerySelectedImage';

export default class ProductGallery extends Component {

    state = {
        selectedImage: null,
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

    selectImage = (path) => {
        //Select clicked image to preview it
        if (this.state.imagesLoaded.includes(path)) {
            this.setState({
                selectedImage: path
            })
        }
    }

    componentDidUpdate = () => {
        //Select main photo first
        if (this.props.productData && this.state.selectedImage === null) {
            this.setState({
                selectedImage: this.props.productData.custom_attributes.find(obj => {
                    return obj.attribute_code === 'image'
                }).value
            })
        }
    }

    render() {

        const { selectedImage, imagesLoaded } = this.state;
        const { imagePath, productData } = this.props;

        return (
            <div className="col">

                <ProductGallerySelectedImage
                    imagesLoaded={imagesLoaded}
                    imagePath={imagePath}
                    selectedImage={selectedImage}
                />

                <div className="product-images-thumbnails loader-container">
                    {(productData) && productData.media_gallery_entries.map((mediaItem, i) => {
                        return (
                            <div key={i} className={`product__image loader-container ${(mediaItem.file === selectedImage) && "selected"} ${(imagesLoaded.includes(mediaItem.file)) ? "loaded" : "loading"}`} >
                                {(mediaItem.file === selectedImage || imagesLoaded.includes(selectedImage)) &&
                                    <img
                                        src={imagePath + mediaItem.file}
                                        onLoad={() => this.updateImagesLoadedList(mediaItem.file)}
                                        onClick={() => this.selectImage(mediaItem.file)}
                                        alt={`Zdjęcie nr ${i + 1}`}
                                    />
                                }

                            </div >
                        )
                    })}
                </div>

            </div>
        )
    }

}