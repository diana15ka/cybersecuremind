"use client";

import { useState } from "react";
import axios from "axios";

export default function WellbeingChat() {

  const [message, setMessage] = useState("");

  const [response, setResponse] = useState("");

  const sendMessage = async () => {

    const res = await axios.post(

      "http://127.0.0.1:8000/api/wellbeing-chat",

      {
        message
      }
    );

    setResponse(res.data.response);
  };

  return (

    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">

      <h2 className="text-white font-bold mb-4">
        AI Cyber Wellbeing Assistant
      </h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white"
      />

      <button
        onClick={sendMessage}
        className="mt-4 bg-cyan-500 text-black px-4 py-2 rounded-xl"
      >
        Ask AI Assistant
      </button>

      <div className="mt-6 text-zinc-300 whitespace-pre-wrap">
        {response}
      </div>

    </div>
  );
}