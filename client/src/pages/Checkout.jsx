import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, shippingAddress, saveShippingAddress, paymentMethod, savePaymentMethod, clearCart } = useContext(CartContext);
    const { showToast } = useToast();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const [firstName, setFirstName] = useState(shippingAddress.firstName || '');
    const [lastName, setLastName] = useState(shippingAddress.lastName || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [country, setCountry] = useState(shippingAddress.country || 'Pakistan');
    const [state, setState] = useState(shippingAddress.state || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [phoneNumber, setPhoneNumber] = useState(shippingAddress.phoneNumber || '');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod || 'EasyPaisa');
    const [transactionId, setTransactionId] = useState('');
    const [customCities, setCustomCities] = useState([]);

    // Comprehensive list of Pakistani cities (sorted alphabetically, no duplicates)
    const pakistaniCities = [
        'Abbottabad', 'Ahmadpur East', 'Attock', 'Bahawalpur', 'Bannu', 'Bhakkar', 'Bhalwal', 'Burewala',
        'Chakdara', 'Chakwal', 'Chaman', 'Chiniot', 'Chishtian', 'Dadu', 'Daharki', 'Daska',
        'Dera Ghazi Khan', 'Dera Ismail Khan', 'Faisalabad', 'Ghotki', 'Gojra', 'Gujranwala', 'Gujrat',
        'Hafizabad', 'Hangu', 'Hasilpur', 'Hassan Abdal', 'Hyderabad', 'Islamabad', 'Jacobabad',
        'Jaranwala', 'Jhang', 'Jhelum', 'Kamalia', 'Kamoke', 'Kandhkot', 'Karachi', 'Karak',
        'Kasur', 'Kashmore', 'Khanewal', 'Khanpur', 'Khairpur', 'Kharian', 'Khuzdar', 'Kohat',
        'Kot Addu', 'Kot Diji', 'Kotri', 'Lahore', 'Lakki Marwat', 'Larkana', 'Lodhran',
        'Mandi Bahauddin', 'Mardan', 'Mian Channu', 'Mianwali', 'Mingaora', 'Mirpur Khas',
        'Mirpur Mathelo', 'Mithi', 'Muzaffargarh', 'Muzaffarabad', 'Multan', 'Muridke',
        'Narowal', 'Naushahro Feroze', 'Nawabshah', 'Nowshera', 'Okara', 'Pakpattan',
        'Peshawar', 'Qambar Shahdadkot', 'Quetta', 'Rahim Yar Khan', 'Rawalpindi', 'Rohri',
        'Sahiwal', 'Sanghar', 'Sargodha', 'Shahdadkot', 'Shahdadpur', 'Shahkot', 'Sheikhupura',
        'Shikarpur', 'Sialkot', 'Sukkur', 'Swabi', 'Tando Adam', 'Tando Allahyar',
        'Tando Muhammad Khan', 'Tank', 'Thatta', 'Tharparkar', 'Umerkot', 'Vihari', 'Zafarwal'
    ];

    useEffect(() => {
        if (!userInfo) {
            navigate('/login?redirect=checkout');
        }
        if (cartItems.length === 0) {
            navigate('/cart');
        }
    }, [userInfo, cartItems, navigate]);

    // Calculate Prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10); // Free shipping over Rs 100
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    const submitHandler = async (e) => {
        e.preventDefault();
        saveShippingAddress({ 
            firstName, 
            lastName, 
            address, 
            country, 
            state, 
            city, 
            postalCode, 
            phoneNumber 
        });
        savePaymentMethod(selectedPaymentMethod);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const orderData = {
                orderItems: cartItems,
                shippingAddress: { 
                    firstName, 
                    lastName, 
                    address, 
                    country, 
                    state, 
                    city, 
                    postalCode, 
                    phoneNumber 
                },
                paymentMethod: selectedPaymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            };

            const { data } = await axios.post('/api/orders', orderData, config);

            // If manual payment, we might want to update payment result immediately or let admin do it
            // For now, we just create the order.

            // If transaction ID is provided (for manual payments), we could update it separately
            // But the backend route /:id/pay expects an update. 
            // For simplicity in this manual flow, we'll just create the order and show success.

            if (transactionId) {
                // Optional: Call pay endpoint if we want to record the transaction ID immediately
                // But usually manual verification happens later.
            }

            showToast('Order Placed Successfully!');
            clearCart();
            navigate('/'); // Or navigate to order details page if we had one
        } catch (error) {
            showToast(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="container checkout-container">
            <h1 className="checkout-title">Checkout</h1>

            <div className="checkout-layout">
                {/* Left Column: Forms */}
                <div className="checkout-form-section">
                    <h2 className="checkout-section-title">Shipping Address</h2>
                    <form id="checkout-form" onSubmit={submitHandler}>
                        <div className="checkout-form-grid">
                            <div className="form-group">
                                <label className="form-label">First Name <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter first name"
                                    value={firstName}
                                    required
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name <span style={{ color: 'red' }}>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter last name"
                                    value={lastName}
                                    required
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Street Address <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter street address"
                                value={address}
                                required
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="checkout-form-grid">
                            <div className="form-group">
                                <label className="form-label">Country <span style={{ color: 'red' }}>*</span></label>
                                <select
                                    className="form-control"
                                    value={country}
                                    required
                                    onChange={(e) => setCountry(e.target.value)}
                                >
                                    <option value="Pakistan">Pakistan</option>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="UK">UK</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Australia">Australia</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">State/Province</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter state/province"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="checkout-form-grid">
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        list="pakistani-cities"
                                        placeholder="Select or enter city"
                                        value={city}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setCity(value);
                                            // If user enters a custom city that's not in the list, add it
                                            if (value && !pakistaniCities.includes(value) && !customCities.includes(value)) {
                                                setCustomCities([...customCities, value]);
                                            }
                                        }}
                                    />
                                    <datalist id="pakistani-cities">
                                        {pakistaniCities.map((cityName, index) => (
                                            <option key={index} value={cityName} />
                                        ))}
                                        {customCities.map((cityName, index) => (
                                            <option key={`custom-${index}`} value={cityName} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Zip/Postal Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter zip/postal code"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Enter phone number"
                                value={phoneNumber}
                                required
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>

                        <h2 className="checkout-section-title" style={{ marginTop: '2rem' }}>Payment Method</h2>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="EasyPaisa"
                                    checked={selectedPaymentMethod === 'EasyPaisa'}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                />
                                EasyPaisa
                            </label>
                            {selectedPaymentMethod === 'EasyPaisa' && (
                                <div className="payment-method-details">
                                    <p><strong>Account Title:</strong> CLOTHI Store</p>
                                    <p><strong>Account Number:</strong> 0300-1234567</p>
                                    <p style={{ marginTop: '5px', color: '#666' }}>Please send <strong>Rs {totalPrice}</strong> to this number.</p>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="BankTransfer"
                                    checked={selectedPaymentMethod === 'BankTransfer'}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                />
                                Bank Transfer
                            </label>
                            {selectedPaymentMethod === 'BankTransfer' && (
                                <div className="payment-method-details">
                                    <p><strong>Bank Name:</strong> HBL</p>
                                    <p><strong>Account Number:</strong> 1234-5678-9012-3456</p>
                                    <p style={{ marginTop: '5px', color: '#666' }}>Please transfer <strong>Rs {totalPrice}</strong> to this account.</p>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={selectedPaymentMethod === 'COD'}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                />
                                Cash on Delivery
                            </label>
                        </div>

                        {(selectedPaymentMethod === 'EasyPaisa' || selectedPaymentMethod === 'BankTransfer') && (
                            <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                <label className="form-label">Transaction ID / Reference No.</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Trx ID"
                                    required
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                />
                            </div>
                        )}
                    </form>
                </div>

                {/* Right Column: Order Summary */}
                <div>
                    <div className="checkout-order-summary">
                        <h2 className="checkout-section-title" style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Items</span>
                            <span>Rs {itemsPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Shipping</span>
                            <span>Rs {shippingPrice}</span>
                        </div>
                        <div style={{ borderTop: '1px solid #eee', margin: '1rem 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span>Rs {totalPrice}</span>
                        </div>

                        <div className="checkout-items-list">
                            {cartItems.map((item, index) => (
                                <div key={index} className="checkout-item">
                                    <img src={item.image} alt={item.name} className="checkout-item-image" />
                                    <div className="checkout-item-name">{item.name}</div>
                                    <div className="checkout-item-details">{item.qty} x Rs {item.price}</div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="btn btn-primary btn-block"
                            style={{ marginTop: '1.5rem' }}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
