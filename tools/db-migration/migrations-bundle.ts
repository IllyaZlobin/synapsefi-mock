import { MigrationObject } from '@mikro-orm/core/typings';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions
import * as migrations from '../../migrations/*';

const { default: migrationsArray } = migrations;

export const migrationsList: MigrationObject[] = migrationsArray
  .map((x: any) => {
    const name = Object.keys(x)[0];
    return { name, class: x[name] };
  })
  .sort((a: { name: string }, b: { name: any }) =>
    a.name.localeCompare(b.name),
  );
