import React, {useEffect, useState, useContext} from 'react';
import { useLocation } from 'react-router';
import cookies from 'js-cookie';
import { Category, Menu_item } from './app_types';
import { CartContext } from "./cart_context.tsx";
import FadeOutModal from './FadeOutModal'; // <-- Import the FadeOutModal component
import { CartViewModal } from './cart_modal.tsx';

const apiUrl = import.meta.env.VITE_API_URL;

interface MenuCardProps {
  categories: Category[];
  menu_items:Menu_item[];
  addtoCart: (item:Menu_item)=>void;
}

const MenuCardGrid: React.FC<MenuCardProps> = ({categories, menu_items, addtoCart}) =>{

  const groupedItems = categories.map((category) => {
    const items = menu_items.filter((item) => item.category?.id === category.id);
    return { category, items };
  });

  return(
    <>

    {groupedItems.map(({ category, items }) => (
              // Use React fragments to group <tr> elements without introducing extra DOM nodes
              <React.Fragment key={category.id}>
                {/* Category heading row */}
                
                <div className="cart-item-header">{category.name}</div>
              <div className="menu-item-grid">

                {/* Rows for items within this category */}
                {items.map((item) => (
                  <div className="cart-item-card" key={item.id}>
                    <div className="cart-item-header">{item.name}</div>
                    <div className="cart-item-details">{item.description}</div>
                    <div className="cart-item-details">{item.price}</div>
                    <div className="cart-item-details">{item.is_available ? "Yes" : "No"}</div>
                    <div className="cart-item-details"><button type="button" className = "button" onClick={() => addtoCart(item)}>Add</button></div>
                  </div>
                ))}
              </div>

              </React.Fragment>
            ))}
    </>
  )

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
    const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);
    
    const addToCart =(item:Menu_item) => {
      cartContext?.addToCart(item);
      setIsModalOpen(true);
    
    };
    
    const clearCart = () => {
      cartContext?.clearCart();
    }

    const closeModal = () => {
      setIsModalOpen(false)
    }

    const closeCartModal = () =>{
      setIsCartModalOpen(false)
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
         <CartViewModal
                  isOpen={isCartModalOpen}
                  onClose={closeCartModal}
                  
                >
              </CartViewModal>

        <br />
        <button onClick={() =>{setIsCartModalOpen(true)}}>Show Cart </button>
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
        <br />
        <MenuCardGrid categories={categories} menu_items={menu_items} addtoCart={addToCart}/>
        </>

    )

}

export default RestDetails