
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';

type ChatAsideProps = {
    chatHistory: ChatMessage[];
    isTyping: boolean;
    onSendMessage: (message: string, isSensationAnalysis: boolean) => void;
};

const TypingIndicator: React.FC = () => (
    <div className="p-3 rounded-lg max-w-xs break-words chat-bubble-bot mr-auto typing-indicator">
        <span></span><span></span><span></span>
    </div>
);

const ChatAside: React.FC<ChatAsideProps> = ({ chatHistory, isTyping, onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [chatHistory, isTyping]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue, false);
            setInputValue('');
        }
    };

    const handleAnalyzeSensation = () => {
        const sensation = prompt("✨ Describe la sensación que estás experimentando (ej: 'pinchazo en la lumbar al bajar en la sentadilla'):");
        if (sensation && sensation.trim() !== "") {
            onSendMessage(`He sentido: "${sensation}"`, true);
        }
    };

    return (
        <aside className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
                <div className="bg-slate-800 p-4 rounded-t-xl text-white text-center flex items-center justify-center gap-3">
                    <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 9.03221C18 11.2413 16.2413 13.0322 14 13.0322C11.7587 13.0322 10 11.2413 10 9.03221C10 6.82316 11.7587 5.03221 14 5.03221C16.2413 5.03221 18 6.82316 18 9.03221Z" stroke="currentColor" strokeWidth="1.5"></path>
                        <path d="M14 13.0322C14 14.3368 14.5268 15.5268 15.4645 16.4645C16.4021 17.4021 17.5922 17.9289 18.8968 17.9289" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        <path d="M10 9.03221C10 11.2413 8.24132 13.0322 6 13.0322C3.75868 13.0322 2 11.2413 2 9.03221C2 6.82316 3.75868 5.03221 6 5.03221C8.24132 5.03221 10 6.82316 10 9.03221Z" stroke="currentColor" strokeWidth="1.5"></path>
                        <path d="M6 13.0322C6 14.3368 5.47321 15.5268 4.53553 16.4645C3.59785 17.4021 2.40785 17.9289 1.10321 17.9289" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        <path d="M12.7279 20.4687C12.2858 21.3148 11.3321 21.6074 10.486 21.1653L5.42435 18.4289" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                    </svg>
                    <h3 className="text-xl font-bold">Coach Virtual con Gemini</h3>
                </div>
                <div ref={chatWindowRef} className="flex-1 p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
                    {chatHistory.map((msg, index) => (
                        <div key={index} className={`p-3 rounded-lg max-w-xs break-words ${msg.role === 'user' ? 'chat-bubble-user ml-auto' : 'chat-bubble-bot mr-auto'}`}>
                            {msg.parts[0].text}
                        </div>
                    ))}
                    {isTyping && <TypingIndicator />}
                </div>
                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Habla con tu coach..."
                            className="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button onClick={handleAnalyzeSensation} className="bg-yellow-500 text-white px-4 py-2 hover:bg-yellow-600" title="Analizar Sensación con IA">
                            <i className="fas fa-magic-sparkles"></i>
                        </button>
                        <button onClick={handleSend} className="bg-emerald-500 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-600">
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ChatAside;
