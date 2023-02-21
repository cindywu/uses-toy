import React, { useRef } from 'react';
import { Replicache } from 'replicache';
import { useSubscribe } from 'replicache-react';
import { nanoid } from 'nanoid';
import Pusher from 'pusher-js';

const rep = process.browser
  ? new Replicache({
    name: 'chat-user-id',
    licenseKey: process.env.NEXT_PUBLIC_REPLICACHE_LICENSE_KEY,
    pushURL: '/api/rep-push',
    pullURL: '/api/rep-pull',
    mutators: {
      async createMessage(tx, {id, from, content, order}) {
        await tx.put(`message/${id}`, {
          from,
          content,
          order
        });
      },
    },
  })
  : null;

if (rep) {
  listen(rep);
}

export default function Home(){
  return <Chat rep={rep}/>
}

function Chat({ rep }) {
  const messages = useSubscribe(
    rep,
    async tx => {
      const list = await tx.scan({prefix: 'message/'}).entries().toArray();
      list.sort(([, {order: a}], [, {order: b}]) => a - b);
      return list;
    },
    [],
  );

  const usernameRef = useRef();
  const contentRef = useRef();

  const onSubmit = e => {
    e.preventDefault();
    const last = messages.length && messages[messages.length - 1][1];
    const order = (last?.order ?? 0) + 1;
    const data = {
      id: nanoid(),
      from: usernameRef.current.value,
      content: contentRef.current.value,
      order,
    }
    console.log({data})
    rep.mutate.createMessage(data);
    contentRef.current.value = '';
  };

  return (
    <div className={'p-4'} style={styles.container}>
    <form style={styles.form} onSubmit={onSubmit}>
      <input className={'border-2'} ref={usernameRef} style={styles.username} required />
      says:
      <input className={'border-2'} ref={contentRef} style={styles.content} required />
      <input className={'bg-blue-600 px-4 text-white hover:bg-blue-700'} type="submit" />
    </form>
    <MessageList messages={messages} />
    </div>
  )
}

function MessageList({messages}) {
  return messages.map(([k, v]) => {
    return (
      <div key={k}>
        <b>{v.from}: </b>
        {v.content}
      </div>
    )
  })
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0,
    marginBottom: '1em',
  },
  username: {
    flex: 0,
    marginRight: '1em',
  },
  content: {
    flex: 1,
    maxWidth: '30em',
    margin: '0 1em',
  },
};

function listen(rep) {
  console.log('listening');
  // Listen for pokes, and pull whenever we get one.
  Pusher.logToConsole = true;
  const pusher = new Pusher(process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_CLUSTER,
  });
  const channel = pusher.subscribe('default');
  channel.bind('poke', () => {
    console.log('got poked');
    rep.pull();
  });
}
