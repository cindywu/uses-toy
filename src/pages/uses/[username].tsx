import { useEffect, useState } from "react";
import { Reflect } from "@rocicorp/reflect";
import { M, clientMutators } from "../../datamodel/mutators";
import { randUserInfo } from "../../datamodel/client-state";
import { nanoid } from "nanoid";
import { consoleLogSink, OptionalLoggerImpl } from "@rocicorp/logger";
import { DataDogBrowserLogSink } from "../../frontend/data-dog-browser-log-sink";
import { workerWsURI } from "../../util/host";
import UserUses from '../../frontend/user-uses';

export default function Home() {
  const [reflect, setReflectClient] = useState<Reflect<M> | null>(null);
  const [_, setOnline] = useState(false);
  const [clientUserID, setClientUserID] = useState<string | null>(null);

  const LOCAL_STORAGE_KEY = 'uses.userID'

  const logSink = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
    ? new DataDogBrowserLogSink()
    : consoleLogSink;
  const logger = new OptionalLoggerImpl(logSink);

  useEffect(() => {
    const roomID = `ICR1j0`;

    (async () => {
      logger.info?.(`Connecting to worker at ${workerWsURI}`);
      const userID = clientUserID ? clientUserID : nanoid();
      const r = new Reflect<M>({
        socketOrigin: workerWsURI,
        onOnlineChange: setOnline,
        userID,
        roomID,
        auth: JSON.stringify({
          userID,
          roomID,
        }),
        logSinks: [logSink],
        mutators: clientMutators,
      });

      const defaultUserInfo = randUserInfo();
      await r.mutate.initClientState({
        id: await r.clientID,
        defaultUserInfo,
      });
      await r.mutate.initShapes();

      setReflectClient(r);
    })();
  }, []);

  useEffect(() => {
    const userID = localStorage.getItem(LOCAL_STORAGE_KEY)
    if ( userID != null) setClientUserID(userID)
  },[])


  if (!reflect) {
    return null;
  }

  return (
    // <div
    //   style={{
    //     position: "absolute",
    //     display: "flex",
    //     flexDirection: "column",
    //     left: 0,
    //     top: 0,
    //     width: "100%",
    //     height: "100%",
    //     background: "rgb(229,229,229)",
    //   }}
    // >
    //   <Nav reflect={reflect} online={online} />
    //   <Designer reflect={reflect} logger={logger} />
    // </div>
    <UserUses
      reflect={reflect}
    />
  );
}
