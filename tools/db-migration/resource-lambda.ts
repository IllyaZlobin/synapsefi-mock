import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { CdkCustomResourceHandler } from 'aws-lambda';
import { SecretsManager } from 'aws-sdk';
import KnexPostgres from 'knex/lib/dialects/postgres';
import { migrationsList } from './migrations-bundle';

export const handler: CdkCustomResourceHandler = async (e) => {
  const physicalResourceId: string = e.ResourceProperties.PhysicalResourceId;
  if (e.RequestType === 'Delete') {
    return { PhysicalResourceId: physicalResourceId };
  }

  const secretsClient = new SecretsManager();
  const orm = await MikroORM.init({
    driver: PostgreSqlDriver,
    driverOptions: {
      client: KnexPostgres,
    },
    type: 'postgresql',
    host: e.ResourceProperties.DbHost,
    dbName: e.ResourceProperties.DbName,
    user: e.ResourceProperties.DbUser,
    password: async () => {
      const staticPassword = e.ResourceProperties.DbPassword;
      if (staticPassword) return staticPassword;
      const secret = await secretsClient
        .getSecretValue({
          SecretId: e.ResourceProperties.DbSecretARN,
        })
        .promise();
      if (secret.SecretString === undefined) {
        throw new Error('Property "SecretString" of secret is undefined.');
      }
      const secretJson = JSON.parse(secret.SecretString);
      return secretJson.password;
    },
    migrations: {
      migrationsList,
    },
    discovery: {
      warnWhenNoEntities: false,
    },
  });
  try {
    const migrator = orm.getMigrator();
    await migrator.up();
  } finally {
    await orm.close(true);
  }
  return {
    PhysicalResourceId: physicalResourceId,
  };
};
