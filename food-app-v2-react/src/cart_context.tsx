import { createContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Item, Order, Menu_item } from './app_types';

export interface CartContextType  {
    storeId: string | null;
    cartItems:Menu_item[] | null;
    addToCart: (item: Menu_item) => void;
    removeItem:(item_id:number)=> void;
    updateQuantity:(item_id:number, ammount:number)=>void;
    clearCart:() => void;
    getItemCount:() => number;
    getCartItems:() => Menu_item[];
    getCartTotal:() => number;
    getIsLoggedIn:() => boolean;
    setIsLoggedIn:(isloggedin:boolean) => void;
    setStoreId:(id:string) => void;

  }
 

export const CartContext = createContext<CartContextType | null>({
  storeId: null,
  cartItems: null,
  addToCart: (item:Menu_item) => null,
  removeItem:(item_id:number) => null,
  updateQuantity:(item_id:number, ammount:number)=>null,
  clearCart:() => null,
  getItemCount:() => 0,
  getCartItems:  () => [],
  getCartTotal: () => 0,
  getIsLoggedIn:() => false,
  setIsLoggedIn:(isloggedin:boolean) => false,
  setStoreId:(id:string) => null
});

interface CartProviderProps {
  children: React.ReactNode;
}

//export const CartProvider:React.FC<CartProviderProps> = ({ children }: { children: React.ReactNode }) => {
  export const CartProvider: React.FC<CartProviderProps> = ({
    children,
  }) => {
    //const [storeId, setStoreId] = useLocalStorage('store_id', null);
    const [storeId, setStoreIdState] = useState<string | null>(null);
    const[cartItems, setCartItems] = useLocalStorage('cart_items', [] as Menu_item[]);
    const[isLoggedIn, setLoggedIn] = useLocalStorage('is_logged_in', false);

    // Optional: Persist cart to localStorage for each store
  useEffect(() => {
    const savedCart = localStorage.getItem(`store-cart-${storeId}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [storeId]);

  useEffect(() => {
    localStorage.setItem(`store-cart-${storeId}`, JSON.stringify(cartItems));
  }, [cartItems, storeId]);
  

  const setStoreId = (id: string) => {
    setStoreIdState(id);
  };

    const isItemInCart = (searchId:number):boolean => {
      return cartItems.some(order => order.id === searchId);
    }

    const addToCart = (item:Menu_item) => {
      
      if (isItemInCart(item.id)) {

        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity! + 1 }
              : cartItem
          )
        );

      } else {
        let newItem:Menu_item = {id: item.id, name:item.name, 
          quantity:1, price:item.price, description:item.description, is_available:item.is_available, category:item.category};
        setCartItems([...cartItems, newItem]);

      }
    };

    const removeItem =(item_id:number)=>{
      console.log('in cart context remove item');
      let n:number = 0;
      while (n < cartItems.length){
        if(cartItems[n].id === item_id){
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
            cartItem.id === item_id
              ? { ...cartItem, quantity: cartItem.quantity! + change }
              : cartItem
          )
        );

      }
    };
  
    const clearCart = () => {
      let cartItems = [] as Menu_item[];
      setCartItems(cartItems);
    };

    const getItemCount = ():number =>{
      let count:number = 0;
      cartItems.forEach(function(item:Menu_item){
        count = count + item.quantity!;
      });
      return count;
    }

    const getCartItems = ():Menu_item[]=>{
      return cartItems;
    }
  
    const getCartTotal = ():number => {
      let total:number = 0;
      cartItems.forEach(function(item:Menu_item){
        total = total + item.quantity! * item.price;
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
          storeId,
          cartItems,
          addToCart,
          removeItem,
          updateQuantity,
          clearCart,
          getItemCount,
          getCartItems,
          getCartTotal,
          getIsLoggedIn,
          setIsLoggedIn,
          setStoreId
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };