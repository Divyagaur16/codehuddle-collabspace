
import { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface Room {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  is_public: boolean;
}

interface RoomContextType {
  createRoom: (name: string, description: string, isPublic: boolean) => Promise<string | null>;
  joinRoom: (roomId: string) => Promise<boolean>;
  leaveRoom: (roomId: string) => Promise<boolean>;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const createRoom = async (name: string, description: string, isPublic: boolean): Promise<string | null> => {
    try {
      if (!user) {
        toast.error('You must be signed in to create a room');
        return null;
      }

      const { data, error } = await supabase
        .from('rooms')
        .insert({
          name,
          description,
          owner_id: user.id,
          is_public: isPublic
        })
        .select()
        .single();

      if (error) throw error;

      // Add the owner as a member of the room
      await supabase
        .from('room_members')
        .insert({
          room_id: data.id,
          user_id: user.id,
          role: 'owner'
        });

      toast.success('Room created successfully!');
      return data.id;
    } catch (error: any) {
      toast.error(error.message || 'Error creating room');
      return null;
    }
  };

  const joinRoom = async (roomId: string): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be signed in to join a room');
        return false;
      }

      // Check if room exists and user has access
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (roomError) throw roomError;

      // Check if user is already a member
      const { data: membership, error: membershipError } = await supabase
        .from('room_members')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (membershipError && membershipError.code !== 'PGRST116') throw membershipError;

      if (membership) {
        toast.info('You are already a member of this room');
        return true;
      }

      // Add user as a member
      const { error } = await supabase
        .from('room_members')
        .insert({
          room_id: roomId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      toast.success('Joined room successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Error joining room');
      return false;
    }
  };

  const leaveRoom = async (roomId: string): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be signed in to leave a room');
        return false;
      }

      // Check if user is the owner
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .eq('owner_id', user.id)
        .maybeSingle();

      if (roomError && roomError.code !== 'PGRST116') throw roomError;

      if (room) {
        toast.error('As the owner, you cannot leave the room. You can delete it instead.');
        return false;
      }

      // Remove user from members
      const { error } = await supabase
        .from('room_members')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Left room successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Error leaving room');
      return false;
    }
  };

  const value = {
    createRoom,
    joinRoom,
    leaveRoom,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}
