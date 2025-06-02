import { useEffect, useRef } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const MESSAGES_QUERY_KEY = ["messages"];

export function useWebSocketMessages(url: string) {
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (message) => {
      queryClient.setQueryData<string[]>(MESSAGES_QUERY_KEY, (old = []) => [
        ...old,
        message.data,
      ]);
    };

    socket.onerror = (err) => console.error("WebSocket error", err);
    socket.onclose = () => {
      console.log("WebSocket closed");
      socketRef.current = null;
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [url, queryClient]);

  const messagesQuery = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: () => [],
    initialData: [],
    staleTime: Infinity,
  });

  return { ...messagesQuery, socket: socketRef.current };
}
