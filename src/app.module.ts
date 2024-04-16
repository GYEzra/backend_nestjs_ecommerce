import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './models/users/users.module';
import { RolesModule } from './models/roles/roles.module';
import { PermissionsModule } from './models/permissions/permissions.module';

const modelModule = [AuthModule, UsersModule, RolesModule, PermissionsModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ...modelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
