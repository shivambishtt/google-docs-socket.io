import React from "react";
import { io, Socket } from "socket.io-client";
import { Editor } from "@tinymce/tinymce-react";

function App() {
  const socket: Socket = io("http://localhost:8080");
  const apiKey = import.meta.env.VITE_EDITOR_API_KEY
  return (
    <div>
      < Editor
        apiKey={apiKey}
        init={{
          plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        }}
     
      />
    </div>
  )
}

export default App




