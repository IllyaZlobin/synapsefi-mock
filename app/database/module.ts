import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRoot(
      "mongodb+srv://root:qwerty123@cluster0.s29br3v.mongodb.net/?retryWrites=true&w=majority"
    ),
  ],
})
export class DatabaseModule {}
