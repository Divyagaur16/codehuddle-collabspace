
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, LogOut, Users, Lock, Unlock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoom } from '@/contexts/RoomContext';
import { supabase } from '@/lib/supabase';

interface Room {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
}

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const { user, signOut } = useAuth();
  const { createRoom, joinRoom } = useRoom();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRooms() {
      if (!user) return;

      try {
        // Get rooms the user is a member of
        const { data: memberRooms, error: memberError } = await supabase
          .from('room_members')
          .select('room_id')
          .eq('user_id', user.id);

        if (memberError) throw memberError;

        if (memberRooms.length === 0) {
          setRooms([]);
          setIsLoading(false);
          return;
        }

        const roomIds = memberRooms.map(r => r.room_id);

        // Fetch room details
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .in('id', roomIds)
          .order('created_at', { ascending: false });

        if (roomError) throw roomError;

        setRooms(roomData || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRooms();
  }, [user]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName) return;
    
    setIsCreatingRoom(true);
    
    try {
      const roomId = await createRoom(roomName, roomDescription, isPublic);
      if (roomId) {
        navigate(`/room/${roomId}`);
      }
    } finally {
      setIsCreatingRoom(false);
      setIsDialogOpen(false);
      setRoomName('');
      setRoomDescription('');
      setIsPublic(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinRoomId) return;
    
    const success = await joinRoom(joinRoomId);
    if (success) {
      navigate(`/room/${joinRoomId}`);
    }
    
    setJoinRoomId('');
  };

  const handleRoomClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Helmet>
        <title>Dashboard - CodeHuddle</title>
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Code Rooms</h1>
          <p className="text-muted-foreground">Create, join or select an existing room to start coding</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new code room</DialogTitle>
                <DialogDescription>
                  Create a space for you and your team to collaborate on code in real-time.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateRoom} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input 
                    id="room-name" 
                    placeholder="My Awesome Project"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="room-description">Description (Optional)</Label>
                  <Textarea 
                    id="room-description" 
                    placeholder="Describe what this room is for"
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="room-public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <Label htmlFor="room-public">Make room public</Label>
                </div>
                
                <Button type="submit" className="w-full" disabled={isCreatingRoom}>
                  {isCreatingRoom ? 'Creating...' : 'Create Room'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          
          <form onSubmit={handleJoinRoom} className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter room ID to join"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button type="submit" variant="outline" disabled={!joinRoomId}>
              Join Room
            </Button>
          </form>
          
          <Button variant="outline" size="icon" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {rooms.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No rooms yet</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first room to start coding with others or join an existing room
          </p>
          <Button className="mt-6" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Room
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-6 hover:border-primary transition-colors cursor-pointer"
              onClick={() => handleRoomClick(room.id)}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg truncate">{room.name}</h3>
                {room.is_public ? (
                  <Unlock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              {room.description && (
                <p className="text-muted-foreground mt-2 text-sm line-clamp-2">
                  {room.description}
                </p>
              )}
              <div className="mt-4 text-xs text-muted-foreground">
                Created {new Date(room.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
