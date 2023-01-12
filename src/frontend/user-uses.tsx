import React, { useRef } from 'react'
import styles from './user-uses.module.css'
import { useUserByID, useItems } from '../datamodel/subscriptions'
import { randomItem } from '../datamodel/item'
import Link from 'next/link'

export default function UserUses({reflect}:any) {

  const [, , userID] = location.pathname.split('/')
  const user = useUserByID(reflect, userID)
  const inputElement = useRef<HTMLInputElement>(null);

  const items = useItems(reflect)

  function handleCreateItem(){
    const thing : any = randomItem();
    thing.item.name = inputElement?.current?.value;
    thing.item.createdBy = userID;
    reflect.mutate.createItem(thing);
    if (inputElement && inputElement.current) {
      inputElement.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <div className={'pl-8 text-2xl'}><Link href="/uses">Uses</Link> › {user && user.username}</div>
      {items && userID &&
        <UserItems
          userID={userID}
          items={items}
        />
      }
      <AddItem
        inputElement={inputElement}
        handleCreateItem={handleCreateItem}
      />
    </div>
  )
}

function UserItems({userID, items}: any){
  const filteredItems = timedSort(filterItemsByUser())
  function filterItemsByUser(){
    return items.filter((item: any) => {
      return item[1].createdBy === userID
    })
  }

  function timedSort(items: any[]){
    if (items.length === 0) {
      return []
    }
    const start = Date.now()
    const result = sortItems(items)
    console.log(`Sorting items took ${Date.now() - start}ms`)
    return result
  }

  function sortItems(items: any[]) {
    return items.sort((a: any, b: any) => {
      const aDate = new Date(a[1].createdAt)
      const bDate = new Date(b[1].createdAt)
      return bDate.getTime() - aDate.getTime()
    })
  }

  if (filteredItems.length === 0) {
    return (
      <div className={'pt-2 pl-8'}>
        No items yet
      </div>
    )
  }

  return (
    <div className={'pt-2'}>
      {filteredItems.map((item: any) => {
        return (
          <div key={item[0]} className={'pl-8'}>
            {item[1].name}
          </div>
        )
      })
      }
    </div>
  )
}

function AddItem({inputElement, handleCreateItem}: any){
  return(
    <div className={styles.addItem}>
      <input
        placeholder={"item name"}
        ref={inputElement}
        type="text"
        className={styles.input}
      ></input>
      <button
        className={styles.button}
        onClick={() => handleCreateItem()}
      >+</button>
    </div>
  )
}