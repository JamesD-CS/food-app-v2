import React, {useEffect, useState, useContext} from 'react';
import { useLocation } from 'react-router';
import cookies from 'js-cookie';
import { Category, Menu_item } from './app_types';
import { CartContext } from "./cart_context.tsx";
import NavBar from './nav_bar.tsx';
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component


const apiUrl = import.meta.env.VITE_API_URL;

interface MenuTableProps {
    categories:Category[];
    menu_items:Menu_item[];
}

const RestDetails: React.FC = () => {
    let restaurant_info = useLocation();
    let rest_name:string = restaurant_info.state.name;
    let rest_id:string = restaurant_info.state.id;


    const token = cookies.get('token');
    const user_name= cookies.get('user_name');
    const email= cookies.get('email');
    const [menu_items, setMenuItems]= useState<Menu_item[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const  cartContext = useContext(CartContext);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const MenuTable: React.FC<MenuTableProps> = ({ categories, menu_items }) => {
      // Group menu items by their category
      const groupedItems = categories.map((category) => {
        const items = menu_items.filter((item) => item.category.id === category.id);
        return { category, items };
      });
    
      return (
        <table>
          <thead>
            <tr>
              {/* Example header row. Adjust columns as needed */}
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "left" }}>Description</th>
              <th style={{ textAlign: "left" }}>Price</th>
              <th style={{ textAlign: "left" }}>Available</th>
            </tr>
          </thead>
          <tbody>
            {groupedItems.map(({ category, items }) => (
              // Use React fragments to group <tr> elements without introducing extra DOM nodes
              <React.Fragment key={category.id}>
                {/* Category heading row */}
                <tr>
                  <th colSpan={4} style={{ textAlign: "left" }}>
                    {category.name}
                  </th>
                </tr>
                {/* Rows for items within this category */}
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.price}</td>
                    <td>{item.is_available ? "Yes" : "No"}</td>
                    <td><button type="button" onClick={() => addToCart(item)}>Add</button></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      );
    };

    const addToCart =(item:Menu_item) => {
      cartContext?.addToCart(item);
      setIsModalOpen(true);
    
    };
    
    const showCart = () => {
      console.log("cart item count",cartContext?.getItemCount())
      console.log(cartContext?.getCartItems())
    };

    const clearCart = () => {
      cartContext?.clearCart();
    }


    useEffect(() => {
        setMenuItems([]);
        cartContext?.setStoreId(rest_id);
        const requestOptions = {
          method: 'GET',
          headers: { 
              'Content-Type': 'application/json',
              'Accept':'*/*'
          },
          
        };
        console.log('fetching items');
        //fetch categories
        fetch(apiUrl + '/restaurants/' + rest_id + '/categories', requestOptions).then((response) => {
          if(!response.ok) throw new Error(response.status.toString() );
          else return response.json();
        })
        .then((category_response) => {
          console.log("Categories:", category_response.categories);
          setCategories(category_response.categories);
        })
        .catch((error) => {
          console.log('error: ' + error);
        });
        let token:string | undefined = cookies.get('token');
        console.log('cookie is', token);
        /*Fetch menu items */
        fetch(apiUrl + '/restaurants/' + rest_id + '/menu_items', requestOptions).then((response) => {
            if(!response.ok) throw new Error(response.status.toString() );
            else return response.json();
          })
          .then((menu_item_response) => {
            console.log("Menu Items:", menu_item_response.menu_items);
            setMenuItems(menu_item_response.menu_items);
          })
          .catch((error) => {
            console.log('error: ' + error);
          });
        
      }, []);

    return(
      
        <>
        <NavBar />
        <br />

        <button type="button" onClick={() => showCart()}>Show Cart</button>
        <br />
        <button type="button" onClick={() => clearCart()}>Clear Cart</button>

        <FadeOutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          showDuration={500}  // Wait 2s before starting fade
          fadeDuration={200}   // 0.5s fade-out transition
        >
          <p>Item Added!</p>
      </FadeOutModal>
        <h2>
        {rest_name}
        <br />
        Restaurant Id:{rest_id}
        </h2>
        Cart items: {cartContext?.getItemCount()}
        <br />
        Is logged in?: {cartContext?.getIsLoggedIn().toString()}
        <br />

        <MenuTable categories ={categories} menu_items={menu_items}/>
        </>

    )

}

export default RestDetails