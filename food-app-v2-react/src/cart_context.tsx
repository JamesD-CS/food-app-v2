import { createContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Item, Order, Menu_item, Address, Restaurant } from './app_types';

export interface CartContextType  {
    storeId: string | null;
    cartItems:Menu_item[] | null;
    userId:string | null;
    addressId: string | null;
    address : Address | null;
    restaurants : Restaurant[] | null;
    addToCart: (item: Menu_item) => void;
    removeItem:(item_id:number)=> void;
    updateQuantity:(item_id:number, ammount:number)=>number;
    getQuantity:(item_id:number) =>number | undefined;
    clearCart:() => void;
    getItemCount:() => number;
    getCartItems:() => Menu_item[];
    getCartTotal:() => number;
    getIsLoggedIn:() => boolean;
    setIsLoggedIn:(isloggedin:boolean) => void;
    setStoreId:(store_id:string) => void;
    getStoreId:() => string | null;
    setUserId:(user_id:string) => void;
    getUserId:() => string | null;
    setAddressId:(address_id:string) => void;
    getAddressId:() => string | null;
    setAddress:(address:Address) => void;
    getAddress:() => Address | null;
    setRestaurants:(restaurants:Restaurant[]) => void;
    getRestaurants:() => Restaurant[] | null;

  }
 

export const CartContext = createContext<CartContextType | null>({
  storeId: null,
  cartItems: null,
  userId: null,
  addressId: null,
  address:null,
  restaurants:null,
  addToCart: (item:Menu_item) => null,
  removeItem:(item_id:number) => null,
  updateQuantity:(item_id:number, ammount:number)=>0,
  getQuantity:(item_id:number) =>0,
  clearCart:() => null,
  getItemCount:() => 0,
  getCartItems:  () => [],
  getCartTotal: () => 0,
  getIsLoggedIn:() => false,
  setIsLoggedIn:(isloggedin:boolean) => false,
  setStoreId:(store_id:string) => null,
  getStoreId:() => null,
  setUserId:(user_id:string) => null,
  getUserId:() => null,
  setAddressId:(address_id:string) => null,
  getAddressId:() => null,
  setAddress:(address:Address) => null,
  getAddress:() => null,
  setRestaurants:(restaurants:Restaurant[]) => null,
  getRestaurants:() => null
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
    const [userId, setUserIdState] = useState<string | null>(null);
    const [addressId, setAddressIdState] = useState<string | null>(null);
    const [address, setAddressState] = useLocalStorage('address', {} as Address);
    const [restaurants, setRestaurantState] = useLocalStorage('restaurants', [] as Restaurant[]);
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
    

    const setStoreId = (store_id: string) => {
      setStoreIdState(store_id);
    };

    const getStoreId = () => {
      return storeId;
    }

    const setUserId = (user_id:string) => {
      setUserIdState(user_id);
    }

    const getUserId = () =>{
      return userId;
    }

    const setAddressId = (address_id: string) => {
      setAddressIdState(address_id);
    }

    const getAddressId = () => {
      return addressId;
    }

    const setAddress = (address:Address) => {
      setAddressState(address);
    }

    const getAddress = () =>{
      return address;
    }

    const setRestaurants = (restaurants:Restaurant[]) => {
      setRestaurantState(restaurants);
    }

    const getRestaurants = () =>{
      return restaurants;
    }

    const isItemInCart = (searchId:number):boolean => {
      return cartItems.some(order => order.id === searchId);
    }

    const addToCart = (item:Menu_item) => {
      
      if (isItemInCart(item.id!)) {

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

    const updateQuantity=(item_id:number, ammount:number):number => {
      console.log('in cartcontext update quantity item quantity before update is:', getQuantity(item_id));

      let change:number= 0;
      if (ammount > 0){
        change = 1;
      }else if (ammount < 0){
        change = -1;
      }
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem.id === item_id
          ? { ...cartItem, quantity: cartItem.quantity! + change }
          : cartItem
      );
    
      // find the updated item in the new array
      const updatedItem = updatedCartItems.find((cartItem) => cartItem.id === item_id);

      setCartItems(updatedCartItems);
      console.log(
        'in cartcontext update quantity item quantity after update is:',
        updatedItem?.quantity
      );

      return updatedItem?.quantity ?? 0;
      
    };

    const getQuantity=(item_id:number):number | undefined=> {
      if(isItemInCart(item_id)){
        let items = getCartItems()
        let search_item=items.find(item => item.id === item_id);
        return search_item?.quantity!
      }
    }
  
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
        total = total + item.quantity! * item.price!;
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
          userId,
          address,
          addressId,
          restaurants,
          addToCart,
          removeItem,
          updateQuantity,
          getQuantity,
          clearCart,
          getItemCount,
          getCartItems,
          getCartTotal,
          getIsLoggedIn,
          setIsLoggedIn,
          setStoreId,
          getStoreId,
          getUserId,
          setUserId,
          setAddressId,
          getAddressId,
          setAddress,
          getAddress,
          setRestaurants,
          getRestaurants

        }}
      >
        {children}
      </CartContext.Provider>
    );
  };