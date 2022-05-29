import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
// import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { diskStorage } from 'multer';
import { GenralSliderModule } from './genral-slider/genral-slider.module';
import { TypesModule } from './types/types.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    // MulterModule.register({
    //   fileFilter: (req, file, cb) => {
    //     const image_dirs = ['items'];

    //     if (image_dirs.includes(req.params.dir) && !/\.(jpe?g|png|JPE?G|PNG)$/i.test(file.originalname)) {

    //         return cb(new Error('Uploaded file must have image mimetype'), false);
    //     }

    //     cb(null, true);
    //   },
    //   storage: diskStorage({
    //       destination: function (req, file, cb) {
    //           cb(null, `${process.cwd()}/public/${req.params.dir}`);
    //       },
    //       filename: function (req, file, cb) {
    //           const extention = file.originalname.split('.').pop();

    //           cb(null, `${Date.now()}${Math.floor(100 + Math.random()*899)}.${extention}`);
    //       },
    //   })
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'wood-ard-client/build')
    }),
    AuthModule,
    UsersModule,
    ItemsModule,
    GenralSliderModule,
    TypesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
