/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { UserCipType } from "@app/synapsefi/constants/cip-type.enum";
import { SynapsefiService } from "@app/synapsefi/service";
import { fromBody, fromParams } from "@app/utils/dto.utils";
import {
  getSuccessfulRespObj,
  withHttpErrors,
  withNestJs,
} from "@app/utils/function.utils";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import shortid from "shortid";
import { BadRequestException } from "@nestjs/common";
import { UserService } from "@app/synapsefi/user.service";
import { SubnetService } from "@app/synapsefi/subnet.service";
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
      return getSuccessfulRespObj(service.test());
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
      const userService = await app.resolve(UserService);
      const { userId } = await fromParams(GetUserDto, e.pathParameters ?? {});
      const isValid = await userService.isExist(userId);

      if (!isValid) {
        throw new BadRequestException("Invalid user");
      }
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
        supp_id,
        node_id: nodeId,
        user_id: userId,
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
      const subnetService = await app.resolve(SubnetService);

      const { nodeId, subnetId, userId } = await fromParams(
        UpdateSubnetParamsDto,
        e.pathParameters ?? {}
      );

      const subnet = await subnetService.getOne({ nodeId, subnetId, userId });

      return getSuccessfulRespObj(subnet);
    }
  )
);

export const shipCard = withHttpErrors(
  withNestJs<APIGatewayProxyHandlerV2<any>>(
    SynapsefiLambdaModule,
    async (app, e) => {
      return getSuccessfulRespObj({ _id: shortid.generate() });
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
      const subnetService = await app.resolve(SubnetService);
      const { userId, nodeId } = await fromParams(
        GetSubnetsDto,
        e.pathParameters ?? {}
      );

      const subnets = await subnetService.getAll({ nodeId, userId });

      return { subnets_count: subnets.length };
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
