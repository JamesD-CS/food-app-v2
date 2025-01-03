export type Item = {
    item_id: number
    item_name: string
    item_description: string
    price: number
    quantity:number 
  }

export type Restaurant = {
  id: number
  name:string
  description:string
  phone_number:string
  email:string

}

export type Category = {
  id: string
  name:string
}

export type Menu_item = {
    id?: number
    name?: string
    description?: string
    price?: number
    is_available?: boolean
    category?: Category
    quantity?:number
}

/*
{
"restaurant_id": "integer",
"delivery_address_id": "integer",
"menu_items": [
{
"menu_item_id": "integer",
"quantity": "integer"
},
// More items 
] 
*/

export type Address = {

    id?: number,
    user_id?: number,
    street: string,
    city: string,
    state: string,
    country: string,
    postal_code: string,
    latitude?: number,
    longitude?: number

}

export type Order = {
      id?:number
      user_id?: number
      restaurant_id?:number
      menu_items?:Menu_item[]
      delivery_address_id?:number
      order_status?:string
      total_amount?:number
      payment_status?:string
      
  }