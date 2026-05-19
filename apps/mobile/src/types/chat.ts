export interface Chat {
  id: number;
  name: string;
  tournamentName: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  avatar: string;
  avatarBg: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  fromMe: boolean;
  time: string;
  createdAt: string;
}
