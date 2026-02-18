import React, { useEffect, useState } from 'react'

const ProductCard = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchProduct, setSearchProduct] = useState('');

    const fetchProducts = async () => {
        try {
            const data = await fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=100');
            const productsData = await data.json();

            const transformedData = [...productsData].map(({ id, title, description, images }) => {
                return {
                    id, title, description, imageLink: images[0]
                }
            })
            setProducts(transformedData);
            setFilteredProducts([...transformedData]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    const handleDelete = (id) => {
        const data = filteredProducts.filter(prod => prod.id !== id)
        setFilteredProducts(data);
    }

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchProduct(value);
        const searchedData = products.filter(product => product.title.includes(value));
        setFilteredProducts(searchedData);
    }


    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
            <div>Products</div>
            <div>
                <input value={searchProduct} onChange={(e) => handleSearch(e)} />
            </div>
            <div style={{ display: 'flex', justifyContent:'center', flexWrap: 'wrap', gap: '10px' }}>
                {filteredProducts && filteredProducts.length > 0 && filteredProducts.map(product => {
                    return <div key={product.id} style={{ display: 'flex', flexDirection: 'column', height: '500px', width: '300px', gap: '3px', border: '1px solid', padding: '5px' }}>

                        <img style={{ height: '200px', width: '200px' }} src={product.imageLink} />
                        <span style={{ padding: '5px', fontWeight: 'bold', height: '50px' }}>{product.title}</span>
                        <span style={{ padding: '5px', height: '200px', overflow: 'auto' }}>{product.description}</span>

                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </div>
                })}
            </div>
        </div>
    )
}

export default ProductCard