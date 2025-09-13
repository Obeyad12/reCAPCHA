import React, { useEffect, useRef } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES = "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive.file";

function GoogleDocButton({ notesJson, buttonText = "Publish Google Doc", style }) {
  const tokenClient = useRef(null);
  const accessToken = useRef(null);

  useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://docs.googleapis.com/$discovery/rest?version=v1"],
      });
    }
    gapi.load("client", start);

    // Wait for GIS script to load
    const interval = setInterval(() => {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        tokenClient.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            accessToken.current = tokenResponse.access_token;
            gapi.client.setToken({ access_token: accessToken.current });
          },
        });
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Helper to create a Google Doc with rich formatting from notesJson
  const createDoc = async () => {
    if (!accessToken.current) {
      if (tokenClient.current) {
        tokenClient.current.requestAccessToken();
      } else {
        alert("Google Identity Services not loaded yet. Please try again.");
      }
      return;
    }

    // Create a new Google Doc
    const response = await gapi.client.docs.documents.create({ title: "Generated Notes" });
    const documentId = response.result.documentId;

    // Always insert at the end of the document
    let currentIndex = 1;
    let requests = [];

    notesJson.forEach((section, idx) => {
      // Insert section header
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: section.section + "\n",
        },
      });
      // Heading style for section header
      requests.push({
        updateParagraphStyle: {
          range: { startIndex: currentIndex, endIndex: currentIndex + section.section.length },
          paragraphStyle: { namedStyleType: "HEADING_2" },
          fields: "namedStyleType",
        },
      });
      currentIndex += section.section.length + 1; // +1 for newline

      // Insert section content (with **bold** support)
      // We'll insert the content as plain text, then apply bold styling
      let content = section.content + "\n\n";
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: content,
        },
      });

      // Find all **bold** ranges and add updateTextStyle requests
      let boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      let plainContent = content;
      let offset = 0;
      while ((match = boldRegex.exec(content)) !== null) {
        const boldText = match[1];
        const start = currentIndex + match.index - offset;
        const end = start + boldText.length;
        // Remove the ** from the text in the doc
        requests.push({
          deleteContentRange: {
            range: {
              startIndex: start,
              endIndex: start + 2,
            },
          },
        });
        requests.push({
          deleteContentRange: {
            range: {
              startIndex: end,
              endIndex: end + 2,
            },
          },
        });
        // Apply bold style
        requests.push({
          updateTextStyle: {
            range: { startIndex: start, endIndex: end },
            textStyle: { bold: true },
            fields: "bold",
          },
        });
        offset += 4; // Each ** is 2 chars, so 4 total
      }
      // Remove all ** for index calculation
      plainContent = content.replace(/\*\*(.*?)\*\*/g, "$1");
      currentIndex += plainContent.length;
    });

    await gapi.client.docs.documents.batchUpdate({
      documentId,
      requests,
    });
    window.open(`https://docs.google.com/document/d/${documentId}/edit`, "_blank");
  };

  return (
    <button className="action-card" onClick={createDoc} style={style}>
      {buttonText}
    </button>
  );
}

export default GoogleDocButton;