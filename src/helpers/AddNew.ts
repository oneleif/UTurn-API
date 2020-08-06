import { getRepository } from "typeorm";

export async function addNew(model, fields) {
  const repository = getRepository(model);

  const instance = new model();

  const entries = Object.entries(fields);

  for (const [k, v] of entries) {
    instance[k] = v;
  }

  await repository.save(instance);
}

export async function addNewWith(instance, model, fields) {
  const repository = getRepository(model);

  const entries = Object.entries(fields);

  for (const [k, v] of entries) {
    instance[k] = v;
  }

  await repository.save(instance);
}