import { IsString, IsNotEmpty } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  roomName: string;
}

export class VerifyRoomDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}

export class VerifyPlayerDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
