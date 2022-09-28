/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { UserCipType } from "@app/synapsefi/constants/cip";
import { SynapsefiService } from "@app/synapsefi/service";
import { fromBody, fromParams } from "@app/utils/dto.utils";
import {
  getSuccessfulRespObj,
  withHttpErrors,
  withNestJs,
} from "@app/utils/function.utils";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { IdUtils } from "@app/utils/id.utils";
import { SubnetUtils } from "@app/utils/subnet.utils";
import { nonNull } from "@app/utils/nonNull";
import { AuthenticateDto } from "./dtos/authenticate.dto";
import { CreateNodeDto, CreateNodeParamsDto } from "./dtos/create-node.dto";
import {
  CreateSubnetDto,
  CreateSubnetParamsDto,
} from "./dtos/create-subnet.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { SynapsefiLambdaModule } from "./module";
import { GetUserDto } from "./dtos/get-user.dto";
import { GetSubnetsDto } from "./dtos/get-subnets.dto";
import {
  UpdateSubnetDto,
  UpdateSubnetParamsDto,
} from "./dtos/update-subnet.dto";

export const test = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      const service = await app.resolve(SynapsefiService);
      const userId = IdUtils.generateUserId(UserCipType.cip_three);
      const nodeId = IdUtils.generateNodeId(userId);
      const subnetId = IdUtils.generateSubnetId(userId, nodeId);
      const tinySubnetId = nonNull(subnetId.split("|").at(-1)).value;
      const cvc = tinySubnetId.slice(1, 4);
      const cardNumber = SubnetUtils.generateCardNumber(subnetId);
      return getSuccessfulRespObj({
        subnetId,
        tinySubnetId,
        cvc,
        userId,
        cardNumber,
      });
    }
  )
);

export const createSubscriptions = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      return getSuccessfulRespObj({});
    }
  )
);

export const generateUbo = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      return getSuccessfulRespObj({});
    }
  )
);

export const getUser = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      const { userId } = await fromParams(GetUserDto, e.pathParameters ?? {});
      return getSuccessfulRespObj({ _id: userId, data: {} });
    }
  )
);

export const updateUser = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      return getSuccessfulRespObj({});
    }
  )
);

export const createUser = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      const synapsefiService = await app.resolve(SynapsefiService);
      const payload = await fromBody(CreateUserDto, e.body);
      const { extra, logins } = payload;
      const { email } = logins[0];
      const cip_tag = extra.cip_tag ?? UserCipType.cip_one;

      const user = await synapsefiService.createUser({
        cip_tag,
        email,
        documents: payload.documents ?? [],
      });

      return getSuccessfulRespObj(user);
    }
  )
);

export const createNode = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      const synapsefiService = await app.resolve(SynapsefiService);
      const { extra, type, info } = await fromBody(CreateNodeDto, e.body);
      const { userId } = await fromParams(
        CreateNodeParamsDto,
        e.pathParameters ?? {}
      );
      const node = await synapsefiService.createNode({
        userId,
        supp_id: extra.supp_id,
        info,
        type,
      });
      return getSuccessfulRespObj({
        nodes: [{ ...node, _id: node.id }],
        success: true,
      });
    }
  )
);

export const createSubnet = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      const synapsefiService = await app.resolve(SynapsefiService);
      const { nodeId, userId } = await fromParams(
        CreateSubnetParamsDto,
        e.pathParameters ?? {}
      );
      const { supp_id, account_class, nickname } = await fromBody(
        CreateSubnetDto,
        e.body
      );
      const result = await synapsefiService.createSubnet({
        suppId: supp_id,
        nodeId,
        userId,
        account_class,
        nickname,
      });
      return getSuccessfulRespObj(result);
    }
  )
);

export const updateSubnet = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      const synapsefiService = await app.resolve(SynapsefiService);
      const { nodeId, subnetId, userId } = await fromParams(
        UpdateSubnetParamsDto,
        e.pathParameters ?? {}
      );
      const body = await fromBody(UpdateSubnetDto, e.body);

      await synapsefiService.updateSubnet({
        nodeId,
        subnetId,
        userId,
        supp_id: body.supp_id,
        status: body.status ?? "ACTIVE",
      });

      return getSuccessfulRespObj({});
    }
  )
);

export const getSubnet = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      const { subnetId } = await fromParams(
        UpdateSubnetParamsDto,
        e.pathParameters ?? {}
      );

      const cardNumber = SubnetUtils.generateCardNumber(subnetId, true);
      const cvc = SubnetUtils.getCvv(subnetId);

      return getSuccessfulRespObj({ cvc, card_number: cardNumber });
    }
  )
);

export const shipCard = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      return getSuccessfulRespObj({ _id: IdUtils.generate() });
    }
  )
);

export const authenticate = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      const { userId } = await fromParams(
        AuthenticateDto,
        e.pathParameters ?? {}
      );
      return { oauth_key: userId };
    }
  )
);

export const getAllSubnets = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      const { userId, nodeId } = await fromParams(
        GetSubnetsDto,
        e.pathParameters ?? {}
      );
      return { subnets_count: 0 }; // TODO Subnets count always 0
    }
  )
);

export const verifyAddress = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      return getSuccessfulRespObj({ deliverability: "deliverable" });
    }
  )
);
