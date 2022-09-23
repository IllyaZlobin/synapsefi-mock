import { Module } from "@nestjs/common";
import { SynapsefiService } from "@app/synapsefi/service";
import { HttpModule } from "@nestjs/axios";
import { DatabaseModule } from "@app/database/module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "@app/database/schemas/user.schema";
import { Node, NodeSchema } from "@app/database/schemas/node.schema";
import { Subnet, SubnetSchema } from "@app/database/schemas/subnet.schema";
import { SubnetService } from "@app/synapsefi/subnet.service";
import { SYNAPSE_WEBHOOK_SIGNATURE, WIREBEE_API_URL } from "./constants";
import { WebHookService } from "./webhook.service";
import { UserService } from "./user.service";

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Node.name, schema: NodeSchema },
      { name: Subnet.name, schema: SubnetSchema },
    ]),
    HttpModule.register({
      baseURL: WIREBEE_API_URL.value,
      headers: {
        "x-synapse-signature-sha256": SYNAPSE_WEBHOOK_SIGNATURE.value,
      },
    }),
  ],
  providers: [SynapsefiService, WebHookService, UserService, SubnetService],
  exports: [SynapsefiService, UserService, SubnetService],
})
export class SynapsefiModule {}
