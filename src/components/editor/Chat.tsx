
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Message = {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
};

type ChatProps = {
  roomId: string;
};

const Chat = ({ roomId }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Simulate initial messages
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        userId: 'user-2',
        username: 'Alex',
        content: 'Hey everyone, I created this room to work on the new feature',
        timestamp: new Date(Date.now() - 120000),
        isCurrentUser: false,
      },
      {
        id: '2',
        userId: 'current-user',
        username: 'You',
        content: 'Great! I just joined. Let me check the code.',
        timestamp: new Date(Date.now() - 60000),
        isCurrentUser: true,
      },
      {
        id: '3',
        userId: 'user-3',
        username: 'Taylor',
        content: 'I think we should start by implementing the authentication flow first',
        timestamp: new Date(Date.now() - 30000),
        isCurrentUser: false,
      },
    ];
    
    setMessages(initialMessages);
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'You',
      content: messageInput.trim(),
      timestamp: new Date(),
      isCurrentUser: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
  };
  
  return (
    <div className="flex flex-col h-full border rounded-lg border-border overflow-hidden">
      <div className="border-b border-border p-3 bg-card">
        <h3 className="font-medium">Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start space-x-2 mb-4",
              message.isCurrentUser && "justify-end"
            )}
          >
            {!message.isCurrentUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.userId}`} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                message.isCurrentUser
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted"
              )}
            >
              <div className="font-medium text-xs mb-1">
                {message.username}
                <span className="ml-2 font-normal text-xs opacity-70">
                  {new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(message.timestamp)}
                </span>
              </div>
              <div>{message.content}</div>
            </div>
            
            {message.isCurrentUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=current-user`} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t border-border p-3 bg-card">
        <div className="flex items-center space-x-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!messageInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
