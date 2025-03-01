
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
};

export type Room = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  members: RoomMember[];
  isPublic: boolean;
};

export type RoomMember = {
  id: string;
  userId: string;
  roomId: string;
  user: User;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
};

export type Message = {
  id: string;
  userId: string;
  roomId: string;
  content: string;
  createdAt: Date;
  user: User;
};

export type Language = 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'java' 
  | 'c' 
  | 'cpp' 
  | 'csharp'
  | 'go'
  | 'ruby'
  | 'rust'
  | 'php'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown';

export type CodeFile = {
  id: string;
  roomId: string;
  name: string;
  content: string;
  language: Language;
  updatedAt: Date;
  createdBy: string;
};

export type Subscription = {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  startDate: Date;
  endDate: Date;
  maxMembers: number;
};

export type CompilationResult = {
  output: string;
  error: string | null;
  duration: number;
};

export type PublishResult = {
  success: boolean;
  url?: string;
  error?: string;
};
