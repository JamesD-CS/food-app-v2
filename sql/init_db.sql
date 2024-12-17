CREATE TABLE IF NOT EXISTS test (
  test_id SERIAL PRIMARY KEY,
  test_data varchar(250) 
);

INSERT INTO test (test_data)
VALUES ('test data');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE SET NULL,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE status AS ENUM ('Pending', 'Processing', 'Delivered', 'Cancelled');
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    delivery_address_id INTEGER NOT NULL REFERENCES addresses(id),
    order_status status,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER NOT NULL REFERENCES menu_items(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivery_personnel (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    vehicle_info VARCHAR(255),
    availability_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delivery_assignments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_personnel_id INTEGER NOT NULL REFERENCES delivery_personnel(id) ON DELETE CASCADE,
    assignment_status VARCHAR(50),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Users
INSERT INTO users (name, email, phone_number, password_hash) VALUES
('Alice Smith', 'alice@example.com', '555-1234', 'hashed_password1'),
('Bob Johnson', 'bob@example.com', '555-5678', 'hashed_password2'),
('Charlie Davis', 'charlie@example.com', '555-8765', 'hashed_password3'),
('Diana Evans', 'diana@example.com', '555-4321', 'hashed_password4'),
('Ethan Harris', 'ethan@example.com', '555-6789', 'hashed_password5');

-- Insert Restaurants
INSERT INTO restaurants (name, description, phone_number, email) VALUES
('Pizza Palace', 'The best pizza in town.', '555-1111', 'contact@pizzapalace.com'),
('Sushi Central', 'Fresh sushi and sashimi.', '555-2222', 'contact@sushicentral.com');

-- Insert Addresses for Users
INSERT INTO addresses (user_id, street, city, state, country, postal_code, latitude, longitude) VALUES
(1, '123 Main St', 'Anytown', 'Anystate', 'Country', '12345', 40.7128, -74.0060),
(2, '456 Oak Ave', 'Anytown', 'Anystate', 'Country', '12345', 40.7138, -74.0070),
(3, '789 Pine Rd', 'Anytown', 'Anystate', 'Country', '12345', 40.7148, -74.0080),
(4, '321 Maple St', 'Anytown', 'Anystate', 'Country', '12345', 40.7158, -74.0090),
(5, '654 Elm St', 'Anytown', 'Anystate', 'Country', '12345', 40.7168, -74.0100);

-- Insert Addresses for Restaurants
INSERT INTO addresses (restaurant_id, street, city, state, country, postal_code, latitude, longitude) VALUES
(1, '500 Food Plaza', 'Anytown', 'Anystate', 'Country', '12345', 40.7178, -74.0110),
(2, '600 Dine Blvd', 'Anytown', 'Anystate', 'Country', '12345', 40.7188, -74.0120);

-- Insert Categories
INSERT INTO categories (restaurant_id, name) VALUES
(1, 'Pizzas'),
(1, 'Sides'),
(2, 'Sushi Rolls'),
(2, 'Beverages');

-- Insert Menu Items
INSERT INTO menu_items (restaurant_id, category_id, name, description, price) VALUES
(1, 1, 'Margherita Pizza', 'Classic pizza with fresh mozzarella and basil.', 9.99),
(1, 1, 'Pepperoni Pizza', 'Pepperoni pizza with extra cheese.', 10.99),
(1, 2, 'Garlic Bread', 'Toasted garlic bread with herbs.', 3.99),
(2, 3, 'California Roll', 'Crab meat, avocado, and cucumber.', 5.99),
(2, 3, 'Spicy Tuna Roll', 'Tuna with spicy mayo sauce.', 6.99);

-- Insert Orders
INSERT INTO orders (user_id, restaurant_id, delivery_address_id, order_status, total_amount, payment_status) VALUES
(1, 1, 1, 'Delivered', 14.98, 'Paid'),
(2, 1, 2, 'Delivered', 10.99, 'Paid'),
(3, 2, 3, 'Delivered', 12.98, 'Paid'),
(4, 2, 4, 'Delivered', 6.99, 'Paid'),
(5, 1, 5, 'Delivered', 13.98, 'Paid');

-- Insert Order Items
INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 9.99, 9.99),
(1, 3, 1, 3.99, 3.99),
(2, 2, 1, 10.99, 10.99),
(3, 4, 2, 5.99, 11.98),
(4, 5, 1, 6.99, 6.99),
(5, 1, 1, 9.99, 9.99),
(5, 3, 1, 3.99, 3.99);

-- Insert Payments
INSERT INTO payments (order_id, user_id, amount, payment_method, payment_status) VALUES
(1, 1, 14.98, 'Credit Card', 'Completed'),
(2, 2, 10.99, 'Credit Card', 'Completed'),
(3, 3, 12.98, 'Credit Card', 'Completed'),
(4, 4, 6.99, 'Credit Card', 'Completed'),
(5, 5, 13.98, 'Credit Card', 'Completed');

-- Insert Delivery Personnel
INSERT INTO delivery_personnel (name, phone_number, email, vehicle_info, availability_status) VALUES
('Frank Miller', '555-3333', 'frank@example.com', 'Car - ABC123', 'Available'),
('Grace Lee', '555-4444', 'grace@example.com', 'Bike - XYZ789', 'Available');

-- Insert Delivery Assignments
INSERT INTO delivery_assignments (order_id, delivery_personnel_id, assignment_status) VALUES
(1, 1, 'Completed'),
(2, 1, 'Completed'),
(3, 2, 'Completed'),
(4, 2, 'Completed'),
(5, 1, 'Completed');

-- Insert Reviews
INSERT INTO reviews (user_id, restaurant_id, order_id, rating, comments) VALUES
(1, 1, 1, 5, 'Excellent pizza and fast delivery!'),
(2, 1, 2, 4, 'Great taste but could be hotter.'),
(3, 2, 3, 5, 'Fresh sushi, will order again.'),
(4, 2, 4, 4, 'Good rolls, but delivery took a bit longer.'),
(5, 1, 5, 5, 'My favorite pizza place!');

