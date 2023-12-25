import { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, Badge } from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;

const CdKeysTable = ({ query }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            if (query) {
                setLoading(true);
                try {
                    const apiUrl =  import.meta.env.VITE_APP_API_URL + '/cdkeys/search';
                    const response = await axios.post(apiUrl, { query });
                    setProducts(response.data);
                } catch (error) {
                    console.error('Error fetching products:', error);
                }
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    const checkIfOnSale = (price) => {
        const currentTime = Math.floor(Date.now() / 1000);
        return price.special_from_date && (!price.special_to_date || currentTime < price.special_to_date);
    };

    const parsePrice = (formattedPrice) => {
        if (typeof formattedPrice !== 'string') return null;
        return parseFloat(formattedPrice.replace(/[^0-9.-]+/g, ""));
    };

    const calculateSavings = (originalPriceFormatted, salePrice) => {
        const originalPrice = parsePrice(originalPriceFormatted);
        if (originalPrice && originalPrice > salePrice) {
            const savings = ((originalPrice - salePrice) / originalPrice) * 100;
            return savings.toFixed(2); // Rounds to two decimal places
        }
        return null;
    };
    const renderPrice = (price) => {
        const onSale = checkIfOnSale(price);
        const originalPriceFormatted = price.default_original_formated;
        const salePriceFormatted = price.default_formated;
        const salePrice = price.default;

        if (onSale) {
            const savings = calculateSavings(originalPriceFormatted, salePrice);
            return (
                <>
                    <Text delete>{originalPriceFormatted}</Text>{' '}
                    <Badge status="success" text={`${salePriceFormatted} ${savings ? `(-${savings}%)` : ''}`} />
                </>
            );
        }
        return salePriceFormatted;
    };

    const sortedData = products.data ? [...products.data].sort((a, b) => {
        if (a.match_level === 'full' && b.match_level !== 'full') {
          return -1; // 'full' comes before others
        } else if (b.match_level === 'full' && a.match_level !== 'full') {
          return 1; // 'full' comes before others
        }
        return 0; // No sorting needed if both have the same match_level
      }) : [];

    const columns = [
        {
            title: 'Image',
            dataIndex: 'thumbnail_url',
            key: 'thumbnail_url',
            render: thumb => (
                <img
                  src={thumb}
                  alt="Thumbnail"
                  style={{ width: '50px', height: 'auto' }}
                />
              ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
            render: url => <a href={url} target="_blank" rel="noopener noreferrer">Link</a>,
        },
        {
            title: 'DLC',
            dataIndex: 'dlc',
            key: 'dlc',
            sorter: (a, b) => a.dlc.localeCompare(b.dlc),
        },
        {
            title: 'Price (CAD)',
            dataIndex: 'price',
            key: 'priceCAD',
            render: price => renderPrice(price.CAD),
            sorter: (a, b) => a.price.CAD.default - b.price.CAD.default,
        },
        {
            title: 'Price (USD)',
            dataIndex: 'price',
            key: 'priceUSD',
            render: price => renderPrice(price.USD),
            sorter: (a, b) => a.price.USD.default - b.price.USD.default,
        },
        {
            title: 'In Stock',
            dataIndex: 'in_stock',
            key: 'in_stock',
            render: in_stock => in_stock ? 'Yes' : 'No',
            sorter: (a, b) => a.in_stock - b.in_stock,
        },
        {
            title: 'Delivery Speed',
            dataIndex: 'delivery_speed',
            key: 'delivery_speed',
        },
        {
            title: 'Platforms',
            dataIndex: 'platforms',
            key: 'platforms',
            sorter: (a, b) => a.platforms.localeCompare(b.platforms),
        },
        // ... add other columns as needed
    ];

    return (
        <>
        <p>Last updated: {products.last_updated}</p>
        <Table dataSource={sortedData} columns={columns} loading={loading} rowKey="name" />
        </>
    );
};

CdKeysTable.propTypes = {
    query: PropTypes.string.isRequired,
};

export default CdKeysTable;
