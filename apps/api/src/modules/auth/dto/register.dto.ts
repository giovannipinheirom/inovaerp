import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome completo é obrigatório' })
  fullName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome da empresa é obrigatório' })
  companyName!: string;

  @IsString()
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  companyCnpj!: string;
}
