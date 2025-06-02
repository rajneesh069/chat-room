import { useState } from "react";
import { useWebSocketMessages } from "../hooks/useWebSocketMessages";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoadingSpinner } from "./loading-spinner";

export function Chat() {
  const {
    data: messages,
    isLoading,
    socket,
  } = useWebSocketMessages("ws://localhost:8080");
  const [message, setMessage] = useState<string>("");
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          socket?.send(message.trim());
          setMessage("");
        }}
        id="send-message-input"
        className="flex flex-col gap-3"
      >
        <Input
          value={message}
          onChange={(e) => setMessage(String(e.target.value))}
          className="border border-black"
          placeholder="Write Message..."
          autoFocus={true}
        />
        <Button variant={"default"} type="submit">
          Send Message
        </Button>
      </form>
      <section id="messages" className="flex flex-col gap-2 items-center">
        <h1 className="text-blue-400"></h1>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          messages.map((msg: string, idx) => (
            <h3 key={idx} className="text-xl">
              {msg}
            </h3>
          ))
        )}
      </section>
    </div>
  );
}
