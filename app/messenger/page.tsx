"use client"
import {
  CornerDownLeft,
  Mic,
  Paperclip,
  Share,
} from "lucide-react"
import { v4 as uuid } from "uuid"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { Card, CardContent } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import PubNub from "pubnub"
import { useRef } from "react"

export default function Messenger() {
  const [users, setUsers] = useState([])
  const [connections, setConnectedUsers] = useState([])
  const [messages, setMessages] = useState({})
  const [newMessage, setNewMessage] = useState("")
  const pubnub = useRef(null)
  const [selectedUser, setSelectedUser] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [userId, setUserId] = useState(uuid())
  const [recommendations, setRecommendations] = useState({})

  useEffect(() => {
    (async () => {
      const users = await fetch("/api/fetchUsersConnections")
      const data = await users.json()
      setUsers(data.data.connectedUsers || [])
      setConnectedUsers(data.data.connections || [])
    })()

    // Initialize PubNub
    pubnub.current = new PubNub({
      publishKey: process.env.NEXT_PUBLIC_PUBNUB_PUBLISH_KEY,
      subscribeKey: process.env.NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY,
      userId: userId,
    })

  }, [])

  useEffect(() => {
    // Listen for new messages
    if (connections.length > 0 && pubnub.current?.listenerManager?.listeners?.length === 0) {
      pubnub.current.addListener({
        message: (message) => {
          if (message.message.sender !== userId) {
            setRecommendations(prev => ({
              ...prev,
              [message.channel]: message.message.recommendations || []
            }))
          }

          setMessages((prevMessages) => ({
            ...prevMessages,
            [message.channel]: [
              ...(prevMessages[message.channel] || []),
              {
                text: message.message.text,
                sender: message.message.sender,
                timestamp: message.message.timestamp,
                isRead: message.channel === connections[selectedUser].id || message.message.sender === userId,
              }
            ],
          }))
        },
      })
    }

    return () => {
      pubnub.current.removeListener("message")
    }
  }, [connections, selectedUser])

  useEffect(() => {
    if (connections.length > 0) {

      // Subscribe to the selected user's chat channel
      pubnub.current.subscribe({
        channels: connections.map((connection) => connection.id),
      })

      return () => {
        // Unsubscribe from the selected user's chat channel
        pubnub.current.unsubscribe({
          channels: connections.map((connection) => connection.id),
        })
      }
    }
  }, [connections, selectedUser])

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      const channel = connections[selectedUser].id

      const result = await fetch("/api/fetchChatRecommendations", {
        method: "POST",
        body: JSON.stringify({ message: newMessage }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await result.json()

      const publishPayload = {
        channel,
        message: {
          text: newMessage,
          sender: userId,
          timestamp: new Date().toISOString(),
          recommendations: data.recommendations,
        },
      }

      await pubnub.current.publish(publishPayload)
      setNewMessage("")
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]

    // Create a new FormData instance
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Make an API call to upload the file to the server
      const response = await fetch("/api/uploadFile", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const fileUrl = data.url

        // Send the file URL as a message
        const message = {
          text: fileUrl,
          sender: "User", // Replace with actual user information
          timestamp: new Date().toISOString(),
        }

        // Publish the message to the chat channel
        pubnub.current.publish({
          channel: connections[selectedUser].id,
          message: message,
        })
      } else {
        console.error("File upload failed")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  const handleSpeechToText = () => {
    // Check if the Web Speech API is supported
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.log("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          alert(
            "Microphone access is not allowed. Please grant permission to use speech recognition."
          );
        }
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
      };

      // Check if microphone permission is granted
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          recognition.start();
        })
        .catch((error) => {
          console.error("Microphone access denied:", error);
          alert(
            "Microphone access is required for speech recognition. Please grant permission in your browser settings."
          );
        });
    } else {
      console.error("Web Speech API is not supported");
      alert("Speech recognition is not supported in your browser.");
    }
  };

  const handleShareClick = () => {
    // Generate a unique invite link
    const uniqueLink = `http://192.168.141.4:3000/messenger/invite/${uuid()}`;
    setInviteLink(uniqueLink);
    setIsModalOpen(true);
  };

  const handleCopyLink = () => {
    // Copy the invite link to the clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        alert("Invite link copied to clipboard!");
      });
    } else {
      // Fallback method using a temporary textarea element
      const tempTextarea = document.createElement("textarea");
      tempTextarea.value = inviteLink;
      document.body.appendChild(tempTextarea);
      tempTextarea.select();
      document.execCommand("copy");
      document.body.removeChild(tempTextarea);
      alert("Invite link copied to clipboard!");
    }
  };

  return (
    <div className="mt-[-32px]">
      <div className="flex flex-col h-full">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Messenger</h1>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
            onClick={handleShareClick}
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </header>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <p className="mb-4">Share this unique invite link with others:</p>
            <div className="flex items-center">
              <Input
                value={inviteLink}
                readOnly
                className="flex-1 mr-2"
              />
              <Button onClick={handleCopyLink}>Copy Link</Button>
            </div>
          </DialogContent>
        </Dialog>
        <main className="grid flex-1 h-[calc(100vh-60px)]  gap-4 overflow-auto px-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="w-full overflow-auto h-[calc(100vh-90px)]">
            <CardContent className="p-6">
              <div>
                {
                  users.map((user: any, index) => (
                    <>
                      <div key={index} className="flex items-center space-x-4 cursor-pointer hover:bg-gray" onClick={() => {
                        pubnub.current.unsubscribe({
                          channels: [connections[selectedUser]?.id],
                        })
                        setMessages((prevMessages) => ({
                          ...prevMessages,
                          [connections[index]?.id]: messages?.[connections[index]?.id]?.map((message) => ({
                            ...message,
                            isRead: true,
                          })),
                        })
                        )
                        setSelectedUser(index)
                      }}>
                        <Avatar>
                          <AvatarImage src={user.profileImage} alt="Sophia Davis" />
                          <AvatarFallback>SD</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 w-full">
                          <div className="flex items-center justify-between w-full">
                            <h3 className="text-sm font-medium">
                              {user?.name}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground">{
                            messages?.[connections?.[index]?.id]?.[messages?.[connections?.[index]?.id]?.length - 1]?.text
                          }</p>
                        </div>
                        {messages?.[connections?.[index]?.id]?.filter((message) => !message.isRead)?.length > 0 && <Badge variant="success" className="bg-[green]">
                          {
                            messages?.[connections?.[index]?.id]?.filter((message) => !message.isRead).length
                          }
                        </Badge>}
                      </div>
                      <Separator className="my-2" />
                    </>
                  ))
                }
              </div>
            </CardContent>
          </Card>
          <div className="relative flex h-full flex-col rounded-xl bg-muted/50 pt-4 lg:col-span-2">
            <div className="flex items-center gap-4 p-4 bg-neutral-950 text-primary" style={{ marginTop: "-15px", borderRadius: "10px 10px 0px 0px" }}>
              <Avatar>
                <AvatarImage src={users[selectedUser]?.profileImage} />
                <AvatarFallback>{
                  users[selectedUser]?.name.split(" ").map((name) => name[0]).join("")
                }</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-white">{users[selectedUser]?.name}</h3>
                <Badge variant="success" className="bg-[green]">
                  Online
                </Badge>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4" style={{
              maxHeight: "calc(100vh - 295px)"
            }}>
              {messages?.[connections?.[selectedUser]?.id]?.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.sender !== userId
                    ? "justify-start"
                    : "justify-end"
                    }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 ${message.sender !== userId
                      ? "bg-blue-800 text-white dark:text-gray-100"
                      : "bg-neutral-800 dark:bg-neutral-800 text-white dark:text-gray-100"
                      }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-[#ccc] mt-1" style={{
                      fontSize: "10px"
                    }}>
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 p-4 flex-wrap">
              {
                recommendations[connections?.[selectedUser]?.id]?.map?.((recommendation, index) => (
                  <Badge
                    key={index}
                    variant='outline'
                    className="flex items-center gap-4 p-4 bg-teal-500 dark:bg-teal-800 text-foreground w-fit cursor-pointer p-2"
                    onClick={() => {
                      setNewMessage(recommendation)
                      setRecommendations([])
                    }}
                  >
                    {
                      recommendation
                    }
                  </Badge>
                ))
              }
            </div>
            <form
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
              x-chunk="dashboard-03-chunk-1"
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage()
              }}
            // onKeyDown={(event) => {
            //   if (event.key === 'Enter' && !event.shiftKey) {
            //     event.preventDefault()
            //     sendMessage()
            //   }
            // }}
            >
              <Textarea
                id="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <div className="flex items-center p-3 pt-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <label htmlFor="fileInput" className="cursor-pointer">
                        <Paperclip className="size-4" />
                        <span className="sr-only">Attach file</span>
                        <input
                          type="file"
                          accept="*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="fileInput"
                        />
                      </label>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach File</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleSpeechToText}>
                      <Mic className="size-4" />
                      <span className="sr-only">Use Microphone</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Use Microphone</TooltipContent>
                </Tooltip>
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>

          </div>
        </main>
      </div >
    </div >
  )
}
