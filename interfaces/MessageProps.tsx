export interface MessageProps {
  id: string;
  room_name: string;
  content: string;
  sender: string;
  sender_fullname: string;
  send_timestamp: string;
  receiver: string;
  receiver_fullname: string;
  read_timestamp: string;
  is_read_by_receiver: boolean;
  sender_image: any;
  receiver_image: any;
}
