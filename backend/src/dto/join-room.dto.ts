import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  roomName: string;

  @IsString()
  @IsOptional()
  roomId?: string;
}

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;
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
