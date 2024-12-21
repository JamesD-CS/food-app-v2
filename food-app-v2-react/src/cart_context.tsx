import { createContext, useContext } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Item, Order } from './app_types';

export type CartContextType = {
    cartItems:Order[] | null
    addToCart: (item: Item) => void;
    removeItem:(item_id:number)=> void;
    updateQuantity:(item_id:number, ammount:number)=>void;
    clearCart:() => void;
    getItemCount:() => number;
    getCartItems:() => Order[];
    getCartTotal:() => number;
    getIsLoggedIn:() => boolean;
    setIsLoggedIn:(isloggedin:boolean) => void;

  }
 
export const CartContext = createContext<CartContextType | null>({
  cartItems: null,
  addToCart: (item:Item) => null,
  removeItem:(item_id:number) => null,
  updateQuantity:(item_id:number, ammount:number)=>null,
  clearCart:() => null,
  getItemCount:() => 0,
  getCartItems:  () => [],
  getCartTotal: () => 0,
  getIsLoggedIn:() => false,
  setIsLoggedIn:(isloggedin:boolean) => false
});

//export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const[cartItems, setCartItems] = useLocalStorage('cart_items', [] as Order[]);
    const[isLoggedIn, setLoggedIn] = useLocalStorage('is_logged_in', false);
  
    const isItemInCart = (searchId:number):boolean => {
      return cartItems.some(order => order.item_id === searchId);
    }

    const addToCart = (item:Item) => {
      
      if (isItemInCart(item.item_id)) {

        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.item_id === item.item_id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        );

      } else {
        let newItem:Order = {item_id: item.item_id, item_name:item.item_name, 
          quantity:1, price:item.price};
        setCartItems([...cartItems, newItem]);
      }
      
    };

    const removeItem =(item_id:number)=>{
      console.log('in cart context remove item');
      let n:number = 0;
      while (n < cartItems.length){
        if(cartItems[n].item_id === item_id){
          cartItems.splice(n, 1);
          setCartItems(cartItems);
          break;
        }
        n++;
      }
    };

    const updateQuantity=(item_id:number, ammount:number) => {
      console.log('in cartcontext update quantity');
      let change:number= 0;
      if (ammount > 0){
        change = 1;
      }else if (ammount < 0){
        change = -1;
      }
      if (isItemInCart(item_id)) {
        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.item_id === item_id
              ? { ...cartItem, quantity: cartItem.quantity + change }
              : cartItem
          )
        );

      }
    };
  
    const clearCart = () => {
      let cartItems = [] as Order[];
      setCartItems(cartItems);
    };

    const getItemCount = ():number =>{
      let count:number = 0;
      cartItems.forEach(function(item:Order){
        count = count + item.quantity;
      });
      return count;
    }

    const getCartItems = ():Order[]=>{
      return cartItems;
    }
  
    const getCartTotal = ():number => {
      let total:number = 0;
      cartItems.forEach(function(item:Order){
        total = total + item.quantity * item.price;
      });
      return total;
    };

    const getIsLoggedIn = ():boolean =>{
      return isLoggedIn;
    };

    const setIsLoggedIn = (isloggedin:boolean) =>{
      setLoggedIn(isloggedin);
    }
  
    return (
      <CartContext.Provider
        value={{
          cartItems,
          addToCart,
          removeItem,
          updateQuantity,
          clearCart,
          getItemCount,
          getCartItems,
          getCartTotal,
          getIsLoggedIn,
          setIsLoggedIn
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };