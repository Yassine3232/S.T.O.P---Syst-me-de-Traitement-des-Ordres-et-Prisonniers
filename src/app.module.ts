import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { PrisonniersModule } from './prisonniers/prisonniers.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type : 'sqlite',
      database : 'db.sqlite',
      autoLoadEntities : true,
      synchronize : true
    }
  ),
    UserModule,
    PrisonniersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}