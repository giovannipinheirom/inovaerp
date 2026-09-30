import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ChangeStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Status é obrigatório' })
  status!: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
