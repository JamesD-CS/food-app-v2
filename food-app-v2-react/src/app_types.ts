export type Item = {
    item_id: number
    item_name: string
    item_description: string
    price: number
    
  }

export type Restaurant = {
  id: number
  name:string
  description:string
  phone_number:string
  email:string

}

export type Menu_item = {
    menu_item_id:number
    quantity:number
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

export type Order = {
      item_id: number
      user_id?: number
      restaurant_id?:number
      menu_items?:Menu_item[]
      delivery_address_id?:number
      order_status?:string
      total_amount?:number
      payment_status?:string
      item_name:string
      quantity: number
      price:number
  }