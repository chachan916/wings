import React, { useEffect, useState } from 'react';
import './styles.css';
import ProductManagement from './ProductManagement';
import UsersManagement from './UsersManagement';
import Dashboard from './Dashboard';
import Login from './Login';

function App() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Load data from localStorage when the app mounts
    useEffect(() => {
        const loginStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loginStatus === 'true');
        if (loginStatus === 'true') {
            fetchProducts(); // Fetch products only when logged in
        }
    }, []);

    // Fetch products from the backend API
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5300/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Handle section navigation
    const showSection = (sectionId) => {
        setActiveSection(sectionId);
    };

    // Add a new product
    const addProduct = async (newProduct) => {
        try {
            const response = await fetch('http://localhost:5300/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (!response.ok) throw new Error('Failed to add product');
            const addedProduct = await response.json();
            setProducts((prevProducts) => [...prevProducts, addedProduct]);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    // Update an existing product
    const updateProduct = async (id, updatedProduct) => {
        try {
            const response = await fetch(`http://localhost:5300/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct),
            });
            if (!response.ok) throw new Error('Failed to update product');
            const data = await response.json();
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === id ? { ...product, ...data } : product
                )
            );
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    // Delete a product
    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:5300/products/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete product');
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Handle login logic
    const handleLogin = async (credentials) => {
        try {
            const response = await fetch('http://localhost:5300/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) throw new Error('Invalid login credentials');
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
            fetchProducts(); // Fetch products after login
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    // Handle logout logic
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    };

    return (
        <div>
            <header>
                <h1>WELCOME TO WINGS CAFE INVENTORY SYSTEM</h1>
            </header>

            {!isLoggedIn ? (
                <Login onLogin={handleLogin} />
            ) : (
                <>
                    <nav>
                        <button onClick={() => showSection('dashboard')}>Dashboard</button>
                        <button onClick={() => showSection('products')}>Products</button>
                        <button onClick={handleLogout}>Logout</button>
                    </nav>

                    {activeSection === 'dashboard' && <Dashboard />}
                    {activeSection === 'products' && (
                        <ProductManagement
                            products={products}
                            addProduct={addProduct}
                            updateProduct={updateProduct}
                            deleteProduct={deleteProduct}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default App;
