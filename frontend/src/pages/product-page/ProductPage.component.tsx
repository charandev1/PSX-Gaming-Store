import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import ProductInfo from 'components/products/product-info/ProductInfo.component';
import ProductType from 'types/ProductType';
import Navbar from 'components/nav/Nav.component';

import styles from './ProductPage.styles.module.css';
import { showToastErrorMessage } from 'utils/toastMessage';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    (async function getProduct() {
      try {
        const { data, status } = await axios.get(`products/${productId}`);
        if (status === 200) {
          setProduct(data.data);
        }
      } catch (error) {
        console.log(error);
        showToastErrorMessage(`Sorry! couldn't load product details`);
      }
    })();
  }, [productId]);

  return product ? (
    <>
      <Navbar posSticky={false} />
      <div className={styles['product-container']}>
        <div className={styles['product-media-info']}>
          <img src={product.media.imageSrc[0]} className={styles['product-img']} alt={product.name} />
          <ul className={styles['product-detail-list']}>
            <li>
              <span className={styles['detail-heading']}>Brand:</span>
              {product.brand}
            </li>
            {product?.genre?.length ? (
              <li>
                <span className={styles['detail-heading']}>Genre:</span>
                {product.genre.map((genre) => (
                  <span key={genre}>{genre}&nbsp;</span>
                ))}
              </li>
            ) : null}
            <li>
              <span className={styles['detail-heading']}>Release Date:</span>14th April 2023
            </li>

            {product.media.videoSrc.length > 0 && (
              <div className={styles['additional-media']}>
                <h3>Trailer</h3>
                <iframe
                  title={product.name}
                  className={styles['product-video']}
                  width="100%"
                  src={product.media.videoSrc[0]}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </ul>
        </div>
        <div className={styles['product-info']}>
          <ProductInfo product={product} />
        </div>
      </div>
    </>
  ) : null;
};

export default ProductPage;
