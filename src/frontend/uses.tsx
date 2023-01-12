import React, { useRef, useState, useEffect } from 'react'
import styles from './uses.module.css'
import { useItemByID, useItems, useUserIDs, useUserByID } from "../datamodel/subscriptions";
import { randomItem, itemPrefix } from "../datamodel/item";
import { randomUser } from "../datamodel/user";
import Link from 'next/link';

type UsesProps = {
  reflect: any
}

export default function Uses({ reflect } : UsesProps) {
  const inputElement = useRef<HTMLInputElement>(null);
  const userInputElement = useRef<HTMLInputElement>(null);
  const items = timedSort(useItems(reflect))
  const userIDs = useUserIDs(reflect)

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

  function handleCreateUser(){
    const thing : any = randomUser();
    thing.user.email = userInputElement?.current?.value;
    reflect.mutate.createUser(thing);
    if (userInputElement && userInputElement.current) {
      userInputElement.current.value = "";
    }
  }

  function handleUpdateUser({id, user}:any){
    reflect.mutate.updateUser({id, user})
  }

  return (
    <div className={styles.container}>
      <div className="text-3xl">Uses</div>
      <div className={styles.subHeader}>Objects have memories</div>
      <div className={styles.itemsList}>
        <div className={"text-xl"}>
          Items
        </div>
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
        <div className={"pt-4"}>
          <div className={"text-xl"}>
            Users
          </div>
          {userIDs && userIDs.map((userID : any) => {
            return (
              <div key={userID}>
                <Email
                  reflect={reflect}
                  userID={userID}
                  handleUpdateUser={handleUpdateUser}
                />
              </div>
            )
          })
          }
        </div>
      </div>
      <AddUser
        userInputElement={userInputElement}
        handleCreateUser={handleCreateUser}
      />
      <AddItem
        inputElement={inputElement}
        handleCreateItem={handleCreateItem}
      />
    </div>
  )
}

function Email({ reflect, userID, handleUpdateUser}: any) {
  const user = useUserByID(reflect, userID);
  const [showEdit, setShowEdit] = useState<boolean>(false)
  const [showEditUser, setShowEditUser] = useState<boolean>(false)

  return(
    <div
      onMouseOver={() => setShowEdit(true)}
      onMouseLeave={() => setShowEdit(false)}
    >
      <Link href={`/uses/${userID}`}>
        <span className={"pr-2"}>{`${user && user.username}`}</span>
      </Link>
      {showEdit &&
        <button
          className={"pl-1"}
          onClick={() => setShowEditUser(true)}
        >
          edit
        </button>
      }
      {user && showEditUser &&
        <EditUser
          user={user}
          handleSetShowEditUser={setShowEditUser}
          handleUpdateUser={handleUpdateUser}
          userID={userID}
          reflect={reflect}
          handleSetShowEdit={setShowEdit}
        />
      }
    </div>
  )
}

function EditUser({user, handleSetShowEditUser, handleUpdateUser, userID, reflect, handleSetShowEdit} : any){
  const [email, setEmail] = useState<string>(user.email)
  const [username, setUsername] = useState<string>(user.username)


  useEffect(() => {
    const modifiedUser = {
      createdAt: user.createdAt,
      email: email,
      username: username
    }
    handleUpdateUser({id: userID, user: modifiedUser})

  }, [username, email])

  return(
    <div
      className={'flex flex-col w-fit'}
      onMouseEnter={handleSetShowEdit(false)}
    >
      <div className={'flex justify-between'}>
        <div></div>
        <button onClick={() => handleSetShowEditUser(false)}>&times;</button>
      </div>
      <div>
        <div className={'pb-2'}>
          <input
            className={'py-1 px-2 text-black'}
            placeholder={'email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
          />
        </div>
        <div className={'pb-2'}>
          <input
            className={'py-1 px-2 text-black'}
            placeholder={'username'}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div className={'pb-2'}>
          <input
            className={'py-1 px-2 text-black'}
            value={userID}
            disabled
          />
        </div>
        <button className={'pr-2 hover:text-red-400'} onClick={() => reflect.mutate.deleteUser(userID) }>destroy user</button>

      </div>
    </div>
  )


}

function AddUser({userInputElement, handleCreateUser}: any){
  return(
    <div className={styles.addUser}>
      <input
        placeholder={"user email"}
        ref={userInputElement}
        type="text"
        className={styles.input}
      ></input>
      <button
        className={styles.button}
        onClick={() => handleCreateUser()}
      >+</button>
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
      {/* <button className={"ml-4"} onClick={() => reflect.mutate.deleteItem(itemID)}>
        Delete
      </button> */}
    </div>
  )
}

