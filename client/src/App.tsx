import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Editor } from "@tinymce/tinymce-react";

const socket: Socket = io("http://localhost:8080");
const apiKey = import.meta.env.VITE_EDITOR_API_KEY

function App() {
  const [userTyping, setUserTyping] = useState<string>() // what user is actually typing
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({})

  const handleEditorChange = (content: string) => {
    setUserTyping(content)
  }

  useEffect(() => {
    if (socket) {
      socket.emit("userTyping", userTyping) // client typing data sent to server

      socket.on("updateTypingUsers", (typingData) => {  //receiving the data from the server of updated type
        setTypingUsers(typingData)
      })
    }

    return () => {
      socket.off("updateTypingUsers")
    }
  }, [userTyping])

  return (
    <div>
      < Editor
        apiKey={apiKey}
        onEditorChange={handleEditorChange}
        init={{
          plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        }} />
    </div>
  )
}

export default App




