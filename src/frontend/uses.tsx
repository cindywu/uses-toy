import React from 'react'
import styles from './uses.module.css'
import { useItemIDs } from "../datamodel/subscriptions";

type UsesProps = {
  reflect: any
}

export default function Uses({ reflect } : UsesProps) {

  const itemIDs = useItemIDs(reflect);
  console.log('itemIDs', itemIDs)
  return (
    <div className={styles.container}>
      <div className={styles.header}>Uses</div>
      <div className={styles.subHeader}>Objects have memories</div>
      <div className={styles.itemsList}>
        {itemIDs && itemIDs.map((id) => {
          return (
            <div key={id}>
              {id}
            </div>
          )
        })
        }
      </div>
    </div>
  )
}
