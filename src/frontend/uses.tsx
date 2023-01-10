import React, { useRef } from 'react'
import styles from './uses.module.css'
import { useItemByID, useItems } from "../datamodel/subscriptions";
import { randomItem, itemPrefix } from "../datamodel/item";

type UsesProps = {
  reflect: any
}

export default function Uses({ reflect } : UsesProps) {
  const inputElement = useRef<HTMLInputElement>(null);
  const items = timedSort(useItems(reflect))

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

  function handleCreateItem(){
    const thing : any = randomItem();
    thing.item.name = inputElement?.current?.value;
    reflect.mutate.createItem(thing);
    if (inputElement && inputElement.current) {
      inputElement.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <div className="text-3xl">Uses</div>
      <div className={styles.subHeader}>Objects have memories</div>
      <div className={styles.itemsList}>
        {items && items.map((item : any) => {
          return (
            <div key={item[0]}>
              <Item
                reflect={reflect}
                itemID={item[0].substring(itemPrefix.length)}
              />
            </div>
          )
        })
        }
      </div>
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
    </div>
  )
}

type ItemProps = {
  reflect: any
  itemID: string
}

function Item({ reflect, itemID }: ItemProps) {
  const item = useItemByID(reflect, itemID);
  return (
    item &&
    <div>
      {item.name}
      {/* <button className={"ml-4"} onClick={() => reflect.mutate.deleteItem(itemID)}>Delete</button> */}
    </div>
  )
}

