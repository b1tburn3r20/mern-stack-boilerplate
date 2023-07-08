import { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import "./Chat.css"; // Import the CSS file with the provided styles

const API_KEY = "";

function App() {
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "Hola, como estas? I am your new spanish teacher. Lets talk!",
            sender: "ChatGPT"
        }
    ]);

    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
        };

        const newMessages = [...messages, newMessage];

        setMessages(newMessages);

        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        setTyping(true);
        await processMessageToChatGPT(newMessages);
    };

    async function processMessageToChatGPT(chatMessages) {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = '';
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message };
        });

        const systemMessage = {
            role: "system",
            content: "You are a beginner Spanish teacher, you are having small talk with an English speaking Spanish student. The student will make mistakes, use incorrect grammar, or even spell things wrong. Be sure to comment on how to fix any errors the student makes. Using the correct tones is not neccessary on the students part. Respond to all questions and comments with simple Spanish along with English translations of your response. Your responses should always include a follow up question to keep the conversation going. Make it casual and keep a focus on relaxed small talk. Always try to engage in interests of the student by asking questions and comments about the students interests"
        };

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        };

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data);
            console.log(data.choices[0].message.content);
            setMessages(
                [...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]
            );
            setTyping(false);
        });
    }

    return (
        <div className='App'>
            <div className='chat-backdrop'>
                <MainContainer>
                    <ChatContainer className="chat-container">
                        <MessageList
                            className="chat-history !important"
                            scrollBehavior='smooth'
                            typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}
                        >
                            {
                                messages.map((message, i) => {
                                    const messageClassName = message.sender === 'user' ? 'user-message' : 'assistant-message';
                                    return <Message key={i} model={message} className={messageClassName} />;
                                })
                            }
                        </MessageList>
                        <MessageInput
                            className="chat-input"
                            placeholder='Empezar a chatear (Start chatting...)'
                            style={{ '::placeholder': { color: '#d0d0db', important: 'true' } }}
                            onSend={handleSend}
                            attachButton={false}
                            sendButton={false}
                        >

                            <MessageInput.Button className="chat-send-button">
                                Send
                            </MessageInput.Button>
                        </MessageInput>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
}

export default App;
