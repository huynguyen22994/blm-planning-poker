import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { socket } from "./lib/socket";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";

const queryClient = new QueryClient();

const App = () => {
  const { toast } = useToast();

  useEffect(() => {
    /** HTTP PING */
    const ping = async () => {
      try {
        const result = await api.get("/api/ping");
        console.log(result);
      } catch (error) {
        console.error("ping error", error);
      }
    };
    ping();
    const intervalId = setInterval(ping, 2 * 60 * 1000);

    /** SOCKET EVENTS */
    socket.on("connect", () => {
      console.log("connected:", socket.id);
    });

    socket.emit("ping", { hello: "world" });

    socket.on("pong", (data) => {
      console.log("pong:", data);
    });

    socket.on("user-joined", (data) => {
      const { player } = data ?? {};
      toast({
        open: true,
        title: "Hello",
        description: `${player?.name} joined`,
      });
    });

    return () => {
      socket.off("pong");
      clearInterval(intervalId);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;
