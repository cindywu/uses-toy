import React, { useRef } from 'react'
import styles from './uses.module.css'
import { useItemIDs, useItemByID } from "../datamodel/subscriptions";
import { randomItem } from "../datamodel/item";

type UsesProps = {
  reflect: any
}

export default function Uses({ reflect } : UsesProps) {
  const itemIDs = useItemIDs(reflect);
  const inputElement = useRef<HTMLInputElement>(null);

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
      <div className={styles.header}>Uses</div>
      <div className={styles.subHeader}>Objects have memories</div>
      <div className={styles.itemsList}>
        {itemIDs && itemIDs.map((id) => {
          return (
            <div key={id}>
              <Item
                reflect={reflect}
                itemID={id}
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
    </div>
  )
}

