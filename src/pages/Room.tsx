
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Copy, Send, User, GitHub } from 'lucide-react';
import { toast } from 'sonner';

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [codeContent, setCodeContent] = useState('// Start coding here...');
  const [language, setLanguage] = useState('javascript');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId || !user) return;

    async function fetchRoomData() {
      try {
        // Check if user is a member of the room
        const { data: membership, error: membershipError } = await supabase
          .from('room_members')
          .select('*')
          .eq('room_id', roomId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (membershipError) throw membershipError;

        if (!membership) {
          toast.error('You are not a member of this room');
          navigate('/dashboard');
          return;
        }

        // Fetch room details
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (roomError) throw roomError;

        setRoom(roomData);

        // Fetch room members
        const { data: membersData, error: membersError } = await supabase
          .from('room_members')
          .select(`
            *,
            profiles:user_id (
              id,
              username,
              avatar_url
            )
          `)
          .eq('room_id', roomId);

        if (membersError) throw membersError;

        setMembers(membersData || []);

        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select(`
            *,
            profiles:user_id (
              id,
              username,
              avatar_url
            )
          `)
          .eq('room_id', roomId)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        setMessages(messagesData || []);

        // Fetch code file
        const { data: codeFiles, error: codeError } = await supabase
          .from('code_files')
          .select('*')
          .eq('room_id', roomId)
          .eq('name', 'main')
          .maybeSingle();

        if (codeError && codeError.code !== 'PGRST116') throw codeError;

        if (codeFiles) {
          setCodeContent(codeFiles.content);
          setLanguage(codeFiles.language);
        } else {
          // Create default code file if it doesn't exist
          await supabase
            .from('code_files')
            .insert({
              room_id: roomId,
              name: 'main',
              content: '// Start coding here...',
              language: 'javascript',
              created_by: user.id
            });
        }

        // Subscribe to new messages
        const messagesChannel = supabase
          .channel('messages-channel')
          .on('postgres_changes', 
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `room_id=eq.${roomId}`
            }, 
            payload => {
              fetchNewMessage(payload.new.id);
            }
          )
          .subscribe();

        // Subscribe to code changes
        const codeChannel = supabase
          .channel('code-channel')
          .on('postgres_changes', 
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'code_files',
              filter: `room_id=eq.${roomId}`
            }, 
            payload => {
              if (payload.new.name === 'main') {
                setCodeContent(payload.new.content);
                setLanguage(payload.new.language);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(messagesChannel);
          supabase.removeChannel(codeChannel);
        };
      } catch (error) {
        console.error('Error fetching room data:', error);
        toast.error('Failed to load room data');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchNewMessage(messageId: string) {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq('id', messageId)
        .single();

      if (error) {
        console.error('Error fetching new message:', error);
        return;
      }

      setMessages(prev => [...prev, data]);
    }

    fetchRoomData();
  }, [roomId, user, navigate]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !user || !roomId) return;
    
    try {
      await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          user_id: user.id,
          content: messageInput.trim()
        });
      
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleCodeChange = async (newCode: string) => {
    setCodeContent(newCode);
    
    // Debounced save to database
    if (!user || !roomId) return;
    
    try {
      await supabase
        .from('code_files')
        .update({
          content: newCode,
          updated_at: new Date().toISOString()
        })
        .eq('room_id', roomId)
        .eq('name', 'main');
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const handleCopyRoomId = () => {
    if (!roomId) return;
    
    navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard');
  };

  const handleCompileCode = async () => {
    toast.info('Compilation feature coming soon!');
  };

  const handlePublishToGitHub = async () => {
    toast.info('GitHub integration coming soon!');
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Helmet>
        <title>{room?.name || 'Room'} - CodeHuddle</title>
      </Helmet>
      
      {/* Room Header */}
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-lg">{room?.name}</h1>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>ID: {roomId}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={handleCopyRoomId}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {members.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.profiles?.avatar_url} />
                  <AvatarFallback>{member.profiles?.username?.[0] || '?'}</AvatarFallback>
                </Avatar>
              ))}
              {members.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs">
                  +{members.length - 3}
                </div>
              )}
            </div>
            
            <Button variant="outline" size="sm" onClick={handlePublishToGitHub}>
              <GitHub className="h-4 w-4 mr-2" />
              Publish to GitHub
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleCompileCode}>
              Compile & Run
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 overflow-hidden border-r">
          <div className="h-full flex flex-col">
            <div className="border-b px-3 py-2 flex items-center justify-between bg-card">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm bg-transparent border-none"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            
            <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-code-background text-code-foreground">
              <textarea 
                className="w-full h-full bg-transparent outline-none resize-none"
                value={codeContent}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
        </div>
        
        {/* Chat Panel */}
        <div className="w-80 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.profiles?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="text-xs flex items-baseline justify-between">
                    <span className="font-medium">{message.profiles?.username}</span>
                    <span className="text-muted-foreground">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="border-t p-3 bg-card">
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
      </div>
    </div>
  );
}
