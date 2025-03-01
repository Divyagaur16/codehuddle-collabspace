
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Copy, 
  Github, 
  Lock, 
  Unlock, 
  MoreHorizontal,
  UserPlus,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type RoomControlsProps = {
  roomId: string;
  roomName: string;
};

const RoomControls = ({ roomId, roomName }: RoomControlsProps) => {
  const [isPublic, setIsPublic] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [members, setMembers] = useState([
    { id: '1', name: 'You', email: 'you@example.com', role: 'owner', online: true },
    { id: '2', name: 'Alex Johnson', email: 'alex@example.com', role: 'editor', online: true },
    { id: '3', name: 'Taylor Smith', email: 'taylor@example.com', role: 'editor', online: true },
  ]);
  
  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://codehuddle.io/room/${roomId}`);
    toast.success('Invite link copied to clipboard');
  };
  
  const handleTogglePublic = () => {
    setIsPublic(!isPublic);
    toast.success(`Room is now ${!isPublic ? 'public' : 'private'}`);
  };
  
  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteEmail) return;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Simulate invite
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  };
  
  const handlePublishToGithub = () => {
    toast.success('Code published to GitHub successfully');
  };
  
  const handleLeaveRoom = () => {
    // Simulate leaving room
    toast.success('You left the room');
  };
  
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg border-border bg-card">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">{roomName}</h2>
            <Badge variant={isPublic ? "outline" : "secondary"} className="ml-2">
              {isPublic ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
              {isPublic ? 'Public' : 'Private'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Room ID: {roomId}</p>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Button size="sm" variant="outline" onClick={handleCopyInviteLink} className="flex-1 md:flex-initial">
            <Copy className="h-4 w-4 mr-2" />
            Copy invite link
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1 md:flex-initial">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite people
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite people to {roomName}</DialogTitle>
                <DialogDescription>
                  Send invitations to collaborate in this room. Free accounts can have up to 6 members.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <form onSubmit={handleInviteMember} className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    type="email"
                    className="flex-1"
                  />
                  <Button type="submit" size="sm">
                    Invite
                  </Button>
                </form>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="room-public"
                    checked={isPublic}
                    onCheckedChange={handleTogglePublic}
                  />
                  <Label htmlFor="room-public">Make room public</Label>
                </div>
                
                <div className="border rounded-md">
                  <div className="px-4 py-3 border-b">
                    <h3 className="text-sm font-medium">Current members ({members.length}/6)</h3>
                  </div>
                  <div className="divide-y">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.id}`} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium flex items-center">
                              {member.name}
                              {member.online && (
                                <span className="ml-2 h-2 w-2 rounded-full bg-green-500"></span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{member.role}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="px-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Room Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handlePublishToGithub}>
                <Github className="h-4 w-4 mr-2" />
                Publish to GitHub
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePublic}>
                {isPublic ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Make Private
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Make Public
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Room Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLeaveRoom} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Leave Room
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default RoomControls;
