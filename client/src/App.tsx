import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Editor } from "@tinymce/tinymce-react";
import tinymce from "tinymce";

const socket: Socket = io("http://localhost:8080");
const apiKey = import.meta.env.VITE_EDITOR_API_KEY

function App() {
  const [userTyping, setUserTyping] = useState<string>() // what user is actually typing
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({})
  const [cursorPosition, setCursorPosition] = useState<Record<string, number>>({})

  const handleEditorChange = (content: string) => {
    setUserTyping(content)
  }

  const handleSelectionChange = () => {
    const editor = tinymce.activeEditor;
    if (editor) {
      const selection = editor.selection;
      const range = selection.getRng(); // Get current selection range
      const position = range.startOffset; // Get cursor position

      socket.emit("cursorcoordinates", {
        cursorid: socket.id,
        position
      })
    }
  };

  useEffect(() => {
    if (socket) {
      socket.emit("userTyping", userTyping); // client typing data sent to server

      socket.on("updatedUserTyping", (typingData) => {
        setTypingUsers(typingData); // Update the state with the typing data
      });

      socket.on("updatedcursordetails", (cursorData) => {
        setCursorPosition((prev) => ({
          ...prev,
          [cursorData.cursorid]: cursorData.position,
        }));
      });


      return () => {
        socket.off("updatedUserTyping");
        socket.off("updatedcursordetails");
      };
    }
  }, [userTyping]);

  return (
    <div>
      < Editor
        apiKey={apiKey}
        onEditorChange={handleEditorChange}
        onInit={(event, editor) => {
          editor.on("SelectionChange", handleSelectionChange)
        }}
        init={{
         
        }} />

      {Object.entries(typingUsers).map(([socketId, text]) => (
        <li key={socketId}>
          <b>User {socketId}:</b> {text}
        </li>
      ))}

      <h3>Cursor Positions:</h3>
      <ul>
        {Object.entries(cursorPosition).map(([socketId, position]) => (
          <li key={socketId}>
            <b>User {socketId}:</b> Cursor at {position}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App




