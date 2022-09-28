import { Module } from "@nestjs/common";
import { SynapsefiService } from "@app/synapsefi/service";
import { HttpModule } from "@nestjs/axios";
import { SYNAPSE_WEBHOOK_SIGNATURE, WIREBEE_API_URL } from "./constants";
import { WebHookService } from "./webhook.service";

@Module({
  imports: [
    HttpModule.register({
      baseURL: WIREBEE_API_URL.value,
      headers: {
        "x-synapse-signature-sha256": SYNAPSE_WEBHOOK_SIGNATURE.value,
      },
    }),
  ],
  providers: [SynapsefiService, WebHookService],
  exports: [SynapsefiService],
})
export class SynapsefiModule {}
