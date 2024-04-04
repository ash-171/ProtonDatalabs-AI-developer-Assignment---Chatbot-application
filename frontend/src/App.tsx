import React, { useState } from "react";
import { Button, TextField, Typography, Container, Box, Grid } from "@mui/material";
import { Alert } from "@mui/material";
import "./App.css";

export default function App() {
  const [result, setResult] = useState("");
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState(null);
  const [alertMessage, setAlertMessage] = useState<{ message: string; severity: "success" | "info" | "warning" | "error" } | null>(null);

  const handleQuestionChange = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setFile(selectedFile);

    // Check the file extension
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (![".docx", ".txt", ".csv"].includes("." + fileExtension)) {
      setAlertMessage({
        message: "Unsupported file type! Please upload a .docx, .txt, or .csv file.",
        severity: "error",
      });
    } else {
      setAlertMessage({
        message: "File uploaded successfully!",
        severity: "success",
      });
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }
    if (question) {
      formData.append("question", question);
    }

    fetch("http://backend:8000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setResult(data.result);
      })
      .catch((error) => {
        console.error("Error", error);
      });
  };

  return (
    <Container component="main">
      <Box sx={{ textAlign: "center", marginBottom: 4, marginTop:"5vh"}}>
        <Typography component="h1" variant="h4" sx={{fontFamily:"Segoe UI Symbol"}}>
          ProtonDatalabs AI developer Assignment - Chatbot application
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={5}
            id="question"
            label="Question"
            name="question"
            value={question}
            onChange={handleQuestionChange}
            placeholder="Ask your question here"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label">
            Upload File (docx, txt, csv)
            <input
              type="file"
              accept=".csv, .docx, .txt"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </Button>
          {alertMessage && (
            <Alert severity={alertMessage.severity} sx={{ marginTop: 2 }}>
              {alertMessage.message}
            </Alert>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!file || !question}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Box border={1} borderRadius={2} p={2}>
            <Typography variant="body1">
              Result: {result}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
