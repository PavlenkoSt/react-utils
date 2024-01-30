import { ReactNode, createContext, useCallback, useContext } from "react";

interface EventBus {
  subscribe: (event: string, callback: (data: any) => void) => () => void;
  publish: (event: string, data?: any) => void;
}

export const EventBusContext = createContext<EventBus | null>(null);

export const EventBusProvider = ({ children }: { children: ReactNode }) => {
  const listeners: { [event: string]: ((data: any) => void)[] } = {};

  const subscribe = (
    event: string,
    callback: (data: any) => void
  ): (() => void) => {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event].push(callback);

    return () => {
      listeners[event] = listeners[event].filter(
        (listener) => listener !== callback
      );
    };
  };

  const publish = (event: string, data?: any): void => {
    if (listeners[event]) {
      listeners[event].forEach((callback) => callback(data));
    }
  };

  const eventBus: EventBus = {
    subscribe,
    publish,
  };

  return (
    <EventBusContext.Provider value={eventBus}>
      {children}
    </EventBusContext.Provider>
  );
};

export const useEventBus = (): EventBus => {
  const eventBus = useContext(EventBusContext);

  if (!eventBus) {
    throw new Error("useEventBus must be used within an EventBusProvider");
  }

  const subscribe = useCallback(
    (event: string, callback: (data: any) => void) =>
      eventBus.subscribe(event, callback),
    [eventBus]
  );

  const publish = useCallback(
    (event: string, data?: any) => eventBus.publish(event, data),
    [eventBus]
  );

  return {
    subscribe,
    publish,
  };
};
