import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Conteúdo do comentário é obrigatório' })
  content!: string;
}
