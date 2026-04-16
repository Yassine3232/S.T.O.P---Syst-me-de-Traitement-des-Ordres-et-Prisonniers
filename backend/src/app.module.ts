import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { PrisonniersModule } from './prisonniers/prisonniers.module';
import { CellulesModule } from './cellules/celluless.module';
import { IncidentsModule } from './incidents/incidents.module';
import { VisitesModule } from './visites/visites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CellulesSeeder } from './cellules/cellules.seeder';
import { UsersSeeder } from './users/user.seeder';

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
    IncidentsModule,
    VisitesModule,
  ],
  controllers: [AppController],
  providers: [AppService, CellulesSeeder],
})
export class AppModule implements OnModuleInit {
  constructor(
    private cellulesSeeder: CellulesSeeder,
    private usersSeeder: UsersSeeder,
  ) {}

  async onModuleInit() {
    await this.cellulesSeeder.seed();
    await this.usersSeeder.seed();
  }
}
