import * as Y from 'yjs';
import * as syncProtocol from 'y-protocols/sync';
 import * as awarenessProtocol from "y-protocols/awareness.js";
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import { io } from "socket.io-client";

const SYNC_MESSAGE=0;
const AWARENESS_MESSAGE=1;
const AWARENESS_REQUEST=2;

class Provider  {
  /**
   * @param {Y.Doc} ydoc
   */
  constructor (ydoc, serverUrl, roomId) {

    this.ydoc = ydoc;
    this.awareness = new awarenessProtocol.Awareness(ydoc);
    this.roomId=roomId;
    this.socket = io(serverUrl);


    this.handleLocalUpdate = (update, origin) => {
        if(origin === this) return;

        this.socket.emit("yjs-sync", {
          roomId: this.roomId,
          message: this.createUpdateMessage(update)
        });
    }

    // handle local awareness updates
    this.handleAwarenessUpdate = ({added, updated, removed}, origin) => {
      if(origin === this) return;

      const changedClients = [...added, ...updated, ...removed];

      const update = awarenessProtocol.encodeAwarenessUpdate(
        this.awareness, 
        changedClients
      );

      // console.log(update);
      // console.log(typeof update);

      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, AWARENESS_MESSAGE);
      encoding.writeVarUint8Array(encoder, update);

      this.socket.emit('yjs-sync', {
        roomId: this.roomId,
        message: encoding.toUint8Array(encoder)
      });

    }

    this.handleSyncMessage = (message) => {
      const data = new Uint8Array(message);
      const decoder = decoding.createDecoder(data);

      const messageType = decoding.readVarUint(decoder);

      if(messageType === AWARENESS_MESSAGE){
        this.handleAwarenessMessage(decoder);
        return;
      }
      if(messageType === AWARENESS_REQUEST){
        this.sendAwarenessState();
        return;
      }

      if(messageType !== SYNC_MESSAGE) {
        return;
      }
     
      const encoder = encoding.createEncoder();

      encoding.writeVarUint(encoder, SYNC_MESSAGE);

      syncProtocol.readSyncMessage(
        decoder,
        encoder,
        this.ydoc,
        this
      );

      const response = encoding.toUint8Array(encoder);

      if(response.length >  1) {
        this.socket.emit('yjs-sync', {
          roomId: this.roomId,
          message: response
        });
      }

    }

    // apply remote awareness updates
    this.handleAwarenessMessage = (decoder) => {
      const update = decoding.readVarUint8Array(decoder);

      awarenessProtocol.applyAwarenessUpdate(
        this.awareness,
        update,
        this
      );
    }
    
    this.sendAwarenessState = () => {
      const clientIds = Array.from(
        this.awareness.getStates().keys()
      );

      if(clientIds.length === 0) return;

      const update = awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        clientIds
      );

      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, AWARENESS_MESSAGE);
      encoding.writeVarUint8Array(encoder, update);

      this.socket.emit('yjs-sync', {
        roomId: this.roomId,
        message: encoding.toUint8Array(encoder)
      });

    }

    this.handleUnload = () => {
      awarenessProtocol.removeAwarenessStates(
        this.awareness,
        [this.awareness.clientID],
        "window unload"
      );
    };
    window.addEventListener("beforeunload", this.handleUnload);

    // Handle local yjs updates
    this.ydoc.on('update', this.handleLocalUpdate);

    // handle awareness updates
    this.awareness.on('update', this.handleAwarenessUpdate);

    // Sync state with remote users
    this.socket.on('yjs-sync', this.handleSyncMessage);


    this.socket.on('connect', () => {

      this.socket.emit('join-room', {
        roomId: this.roomId
      });

      this.sendSyncStep1();
      this.sendAwarenessRequest();
    });

  }

  

  createUpdateMessage(update) {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, SYNC_MESSAGE);
    syncProtocol.writeUpdate(encoder, update);
    return encoding.toUint8Array(encoder);
  }

  
  sendAwarenessRequest() {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, AWARENESS_REQUEST);

    this.socket.emit('yjs-sync', {
      roomId: this.roomId,
      message: encoding.toUint8Array(encoder)
    })

  }

  sendSyncStep1() {
    // Creates an encoder instance that manages an internal Uint8Array buffer
    const encoder = encoding.createEncoder();

    /**
   * Encodes the SYNC_MESSAGE message type as a variable-length unsigned integer.
   *
   * writeVarUint() writes an unsigned integer using a variable-length encoding,
   * which allows small numbers to be represented using fewer bytes.
   *
   * SYNC_MESSAGE is a message-type identifier (tag). It tells the receiver
   * that this message contains Yjs synchronization data.
   */
    encoding.writeVarUint(encoder, SYNC_MESSAGE);


    syncProtocol.writeSyncStep1(
      encoder,
      this.ydoc
    );

    this.socket.emit('yjs-sync', {
      roomId: this.roomId,
      message: encoding.toUint8Array(encoder)
    });

  }

  destroy() {

    awarenessProtocol.removeAwarenessStates(
      this.awareness,
      [this.awareness.clientID],
      "destroy"
    );

    window.removeEventListener("beforeunload", this.handleUnload);

    this.ydoc.off('update', this.handleLocalUpdate);
    this.awareness.off('update', this.handleAwarenessUpdate);

    this.socket.off('yjs-sync', this.handleSyncMessage);

    this.awareness.destroy();
    this.socket.disconnect();
  }

}

export default Provider;