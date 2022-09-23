import { BadRequestException, Type, ValidationPipe } from "@nestjs/common";

const pipe = new ValidationPipe({
  transform: true,
});

export async function fromBody<T>(
  type: Type<T>,
  body: string | undefined
): Promise<T> {
  let plain: unknown;
  if (!body) throw new BadRequestException("Body is required");
  try {
    plain = JSON.parse(body);
  } catch (err) {
    throw new BadRequestException("Body is not a valid JSON.");
  }
  return await pipe.transform(plain, {
    type: "body",
    metatype: type,
  });
}

export async function fromQuery<T>(
  type: Type<T>,
  params: Record<string, string | undefined>
): Promise<T> {
  return await pipe.transform(params, {
    type: "query",
    metatype: type,
  });
}

export async function fromParams<T>(
  type: Type<T>,
  params: Record<string, string | undefined>
): Promise<T> {
  return await pipe.transform(params, {
    type: "param",
    metatype: type,
  });
}
