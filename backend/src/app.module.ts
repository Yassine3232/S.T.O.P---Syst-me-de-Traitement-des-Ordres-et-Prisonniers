import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { PrisonniersModule } from './prisonniers/prisonniers.module';
import { CellulesModule } from './cellules/celluless.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellulesSeeder } from './cellules/cellules.seeder';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    PrisonniersModule,
    CellulesModule,
  ],
  controllers: [AppController],
  providers: [AppService, CellulesSeeder],
})
export class AppModule implements OnModuleInit {
  constructor(private cellulesSeeder: CellulesSeeder) {}

  async onModuleInit() {
    await this.cellulesSeeder.seed();
  }
}