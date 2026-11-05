"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Emptybox from "./Emptybox";
import { renderGenerativeUi } from "./GenerativeUi";
import { TripPlan } from "./types";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Message = {
  role: string;
  content: string;
  ui?: string;
};

type ChatBoxProps = {
  onTripReady: (trip: TripPlan) => void;
};

const limitMessage = (resetAt?: number) => {
  const when = resetAt
    ? new Date(resetAt).toLocaleString([], {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : "tomorrow";
  return `You've used today's free trip. Your next trip unlocks at ${when}.`;
};

const ChatBox = ({ onTripReady }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const saveTrip = useMutation(api.trips.saveTrip);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const onSend = async (text?: string) => {
    const content = (text ?? userInput).trim();
    if (!content || loading || limitReached) return;

    const newMsg: Message = { role: "user", content };

    setMessages((prev) => [...prev, newMsg]);
    setUserInput("");
    setLoading(true);

    try {
      const history = [...messages, newMsg].map(({ role, content }) => ({
        role,
        content,
      }));
      const result = await axios.post("/api/arcjet/aimodel", {
        messages: history,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result?.data?.resp,
          ui: result?.data?.ui,
        },
      ]);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        setLimitReached(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: limitMessage(error.response?.data?.resetAt),
          },
        ]);
      } else {
        console.error("Request failed:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Something went wrong. Please try again.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateTrip = async () => {
    if (generating) return;
    setGenerating(true);

    try {
      const history = messages.map(({ role, content }) => ({ role, content }));
      const result = await axios.post("/api/arcjet/generate-trip", {
        messages: history,
      });

      const tripData = result.data as TripPlan;

      onTripReady(tripData);

      if (user?.id) {
        await saveTrip({
          userId: user.id,
          destination: (tripData as any)?.destination || "Custom Trip",
          tripData: tripData,
        });
      }

      setMessages((prev) => [
        ...prev.map((msg) => ({ ...msg, ui: undefined })),
        {
          role: "assistant",
          content:
            "Your trip is ready and saved! Check the itinerary on the right.",
        },
      ]);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        setLimitReached(true);
        setMessages((prev) => [
          ...prev.map((msg) => ({ ...msg, ui: undefined })),
          {
            role: "assistant",
            content: limitMessage(error.response?.data?.resetAt),
          },
        ]);
        return;
      }

      console.error("Trip generation failed:", error);
      const errDetail =
        error.response?.data?.error || "Could not build the trip. Please try again.";

      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0 && updated[lastIdx].role === "assistant") {
          updated[lastIdx] = {
            ...updated[lastIdx],
            content: `Error: ${errDetail}`,
            ui: "Final",
          };
        }
        return updated;
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-5rem)] flex flex-col w-full max-w-full overflow-hidden">
      {messages.length === 0 ? (
        <Emptybox onSelectOption={(prompt) => onSend(prompt)} />
      ) : (
        <section className="flex flex-col gap-4 sm:gap-6 flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 pb-48 sm:pb-52 [scrollbar-none] [&::-webkit-scrollbar]:hidden">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            const isLast = index === messages.length - 1;

            return (
              <div key={index} className="flex flex-col gap-2 sm:gap-3">
                <div
                  className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-lg text-sm sm:text-lg px-3.5 sm:px-4 py-2 rounded-2xl ${
                      isUser
                        ? "bg-amber-600 text-white rounded-br-sm"
                        : "bg-zinc-800 text-gray-100 border border-zinc-700 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>

                {!isUser && isLast && !loading && (
                  <div className="max-w-[90%] sm:max-w-lg">
                    {renderGenerativeUi(msg.ui, (t) => onSend(t), {
                      onGenerate: generateTrip,
                      generating,
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 text-gray-400 border border-zinc-700 text-sm sm:text-lg px-4 py-2 rounded-2xl rounded-bl-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </section>
      )}

      <section className="absolute bottom-0 inset-x-0 px-2 sm:px-4 pb-2 bg-gradient-to-t from-black via-black to-transparent pt-4">
        <div className="relative mx-auto w-full max-w-xl border border-zinc-700 rounded-xl bg-black shadow-2xl">
          <Textarea
            className="w-full h-28 sm:h-40 bg-black text-sm sm:text-lg border-0 focus-visible:ring-0 p-3 sm:p-4 resize-none pr-12"
            disabled={limitReached}
            placeholder={
              limitReached
                ? "Daily trip limit reached"
                : "Create a trip from Paris to New York"
            }
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <Button
            size={"icon"}
            variant="outline"
            className="absolute bottom-3 right-3 bg-zinc-900 border-zinc-700 hover:bg-amber-600 hover:text-white transition-colors"
            onClick={() => onSend()}
            disabled={loading || limitReached}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ChatBox;