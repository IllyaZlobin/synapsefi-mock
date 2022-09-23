import { SynapsefiModule } from "@app/synapsefi/module";
import { Module } from "@nestjs/common";

@Module({ imports: [SynapsefiModule] })
export class SynapsefiLambdaModule {}
