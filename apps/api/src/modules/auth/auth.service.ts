import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload = { email: user.email, sub: user.id, tenantId: user.tenantId, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    const hash = await bcrypt.hash(registerDto.password, 10);
    
    const tenant = await this.prisma.tenant.create({
      data: {
        name: registerDto.companyName,
        document: registerDto.companyCnpj,
        users: {
          create: {
            email: registerDto.email,
            passwordHash: hash,
            fullName: registerDto.fullName,
            role: 'super_admin',
          }
        },
        departments: {
          create: [
            { name: 'Contábil' },
            { name: 'Fiscal' },
            { name: 'Pessoal' },
            { name: 'Legalização' }
          ]
        }
      },
      include: {
        users: true
      }
    });

    const user = (tenant as any).users?.[0];
    const { passwordHash, ...result } = user;
    return result;
  }

  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user.userId || user.sub, tenantId: user.tenantId, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
