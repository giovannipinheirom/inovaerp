import { IsString, IsNotEmpty, IsOptional, IsEnum, Matches } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'CNPJ/CPF é obrigatório' })
  @Matches(/^\d{11,14}$/, { message: 'Documento inválido' })
  document!: string;

  @IsOptional()
  @IsString()
  taxRegime?: string;

  @IsOptional()
  @IsString()
  tradeName?: string;

  @IsOptional()
  @IsString()
  ibgeCode?: string;
}
