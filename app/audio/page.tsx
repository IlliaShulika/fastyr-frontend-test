"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Play, Trash2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface Recording {
  id: number;
  audio: string;
  timestamp: string;
}

const AudioPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const audioBufferSource = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const savedRecordings = localStorage.getItem("audioRecordings");
    if (savedRecordings) {
      setRecordings(JSON.parse(savedRecordings));
    }

    audioContext.current = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const newRecording = {
            id: Date.now(),
            audio: base64Audio,
            timestamp: new Date().toISOString(),
          };

          const updatedRecordings = [...recordings, newRecording];
          setRecordings(updatedRecordings);
          localStorage.setItem(
            "audioRecordings",
            JSON.stringify(updatedRecordings)
          );
        };

        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const playRecording = async (recordingId: number, base64Audio: string) => {
    if (currentlyPlaying === recordingId) {
      stopPlayback();
      return;
    }

    stopPlayback();
    setCurrentlyPlaying(recordingId);

    try {
      const response = await fetch(base64Audio);
      const audioData = await response.arrayBuffer();

      if (!audioContext.current) {
        throw new Error("Audio context not initialized");
      }

      const audioBuffer = await audioContext.current.decodeAudioData(audioData);

      audioBufferSource.current = audioContext.current.createBufferSource();
      audioBufferSource.current.buffer = audioBuffer;
      audioBufferSource.current.connect(audioContext.current.destination);

      audioBufferSource.current.onended = () => {
        setCurrentlyPlaying(null);
      };

      audioBufferSource.current.start();
    } catch (error) {
      console.error("Error playing audio:", error);
      setCurrentlyPlaying(null);
    }
  };

  const stopPlayback = () => {
    if (audioBufferSource.current) {
      try {
        audioBufferSource.current.stop();
      } catch (error) {}
      audioBufferSource.current = null;
    }
    setCurrentlyPlaying(null);
  };

  const deleteRecording = (id: number) => {
    const updatedRecordings = recordings.filter(
      (recording) => recording.id !== id
    );
    setRecordings(updatedRecordings);
    localStorage.setItem("audioRecordings", JSON.stringify(updatedRecordings));

    if (currentlyPlaying === id) {
      stopPlayback();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Audio Recorder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4" /> Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Start Recording
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    {new Date(recording.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playRecording(recording.id, recording.audio)}
                  >
                    <Play className="w-4 h-4" />
                    {currentlyPlaying === recording.id ? "Stop" : "Play"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteRecording(recording.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioPage;
