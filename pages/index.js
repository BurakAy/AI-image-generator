import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [descriptionInput, setDescriptionInput] = useState("");
  const [result, setResult] = useState();
  const [flagged, setFlagged] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      await moderateInput();
      if (flagged) {
        return;
      } else {
        setFlagged(false);
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ description: descriptionInput }),
        });
        const data = await response.json();
        if (response.status !== 200) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }
        setResult(data.result);
        setDescriptionInput("");
      }
    } catch (error) {
      console.error(error);
      setDescriptionInput("");
    }
  }

  const moderateInput = async () => {
    try {
      const response = await fetch("/api/moderate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: descriptionInput }),
      });
      const data = await response.json();
      setFlagged(data.flagged);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>AI Image Generator</title>
      </Head>

      <main className={styles.main}>
        <h3>Generate an image with AI</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="description"
            placeholder="Enter an image description"
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
          />
          <input type="submit" value="Generate image" />
          <span className={styles.information}>
            Generated images are 1024px x 1024px
          </span>
        </form>
        {result && (
          <div className={styles.result}>
            <img src={result} />
          </div>
        )}
      </main>
    </div>
  );
}
