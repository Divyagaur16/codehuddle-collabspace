
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xzxprtckbvthfhwcruxn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6eHBydGNrYnZ0aGZod2NydXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NTkzNzUsImV4cCI6MjA1NjQzNTM3NX0.z-dwgVthTrBOmF-TvsvSfGzZMl2YqZAGU4lgIP2r-50';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for authentication and rooms
export const createRoom = async (name: string, description: string, isPublic: boolean) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('You must be logged in to create a room');
  }
  
  const { data, error } = await supabase
    .from('rooms')
    .insert({
      name,
      description,
      owner_id: user.user.id,
      is_public: isPublic
    })
    .select()
    .single();
    
  if (error) throw error;
  
  // Automatically add the creator as a member with 'owner' role
  const { error: memberError } = await supabase
    .from('room_members')
    .insert({
      room_id: data.id,
      user_id: user.user.id,
      role: 'owner'
    });
    
  if (memberError) throw memberError;
  
  return data;
};

export const joinRoom = async (roomId: string) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('You must be logged in to join a room');
  }
  
  // Check if the room exists
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();
    
  if (roomError) throw new Error('Room not found');
  
  // Check if user is already a member
  const { data: existingMember } = await supabase
    .from('room_members')
    .select('*')
    .eq('room_id', roomId)
    .eq('user_id', user.user.id)
    .maybeSingle();
    
  if (existingMember) {
    return room; // User is already a member, just return the room
  }
  
  // Add user as a member
  const { error: memberError } = await supabase
    .from('room_members')
    .insert({
      room_id: roomId,
      user_id: user.user.id,
      role: 'member'
    });
    
  if (memberError) throw memberError;
  
  return room;
};

export const getUserRooms = async () => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('You must be logged in to see your rooms');
  }
  
  // Get rooms where user is a member
  const { data, error } = await supabase
    .from('room_members')
    .select(`
      room:rooms (
        id,
        name,
        description,
        owner_id,
        created_at,
        is_public
      )
    `)
    .eq('user_id', user.user.id);
    
  if (error) throw error;
  
  // Extract the rooms from the response
  return data.map(item => item.room);
};

export const getRoomDetails = async (roomId: string) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('You must be logged in to view room details');
  }
  
  // Get the room
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();
    
  if (roomError) throw roomError;
  
  // Get the room members
  const { data: members, error: membersError } = await supabase
    .from('room_members')
    .select(`
      id,
      role,
      joined_at,
      user:user_id (
        email,
        id
      )
    `)
    .eq('room_id', roomId);
    
  if (membersError) throw membersError;
  
  // Get the code files
  const { data: codeFiles, error: filesError } = await supabase
    .from('code_files')
    .select('*')
    .eq('room_id', roomId);
    
  if (filesError) throw filesError;
  
  return {
    ...room,
    members,
    codeFiles
  };
};

// Functions for real-time chat
export const subscribeToMessages = (roomId: string, callback: (message: any) => void) => {
  return supabase
    .channel(`room_${roomId}_messages`)
    .on('postgres_changes', 
      {
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `room_id=eq.${roomId}`
      }, 
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
};

export const sendMessage = async (roomId: string, content: string) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('You must be logged in to send messages');
  }
  
  const { error } = await supabase
    .from('messages')
    .insert({
      room_id: roomId,
      user_id: user.user.id,
      content
    });
    
  if (error) throw error;
};

export const getMessages = async (roomId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      content,
      created_at,
      user_id,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  
  return data;
};

// Functions for code files
export const createCodeFile = async (roomId: string, name: string, content: string, language: string) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('You must be logged in to create code files');
  }
  
  const { data, error } = await supabase
    .from('code_files')
    .insert({
      room_id: roomId,
      name,
      content,
      language,
      created_by: user.user.id
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return data;
};

export const updateCodeFile = async (fileId: string, content: string) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('You must be logged in to update code files');
  }
  
  const { data, error } = await supabase
    .from('code_files')
    .update({
      content,
      updated_at: new Date()
    })
    .eq('id', fileId)
    .select()
    .single();
    
  if (error) throw error;
  
  return data;
};

export const subscribeToCodeChanges = (roomId: string, callback: (codeFile: any) => void) => {
  return supabase
    .channel(`room_${roomId}_code`)
    .on('postgres_changes', 
      {
        event: 'UPDATE', 
        schema: 'public', 
        table: 'code_files',
        filter: `room_id=eq.${roomId}`
      }, 
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
};
