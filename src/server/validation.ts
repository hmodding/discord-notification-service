import { string, object, boolean } from 'yup';
import { LauncherVersion } from '../entities/LauncherVersion';
import { LoaderVersion } from '../entities/LoaderVersion';
import { ModVersion } from '../entities/ModVersion';

const modVersionSchema = object().shape({
  modTitle: string().required(),
  modDescription: string().required(),
  modBannerUrl: string().url().required(),
  modIconUrl: string().url().required(),
  modUrl: string().url().required(),
  modAuthorName: string().required(),
  modAuthorUrl: string().url().required(),
  version: string().required(),
  changelog: string().required(),
  initial: boolean().required(),
}).required();

/**
 * Validates an input object as a mod version.
 * @param input the input to validate.
 * @returns the mod version - if it could be validated.
 * @throws ValidationError - if the input is invalid.
 */
export async function validateModVersion(input: object): Promise<ModVersion> {
  return await modVersionSchema.validate(input, {
      stripUnknown: true,
  });
}

const launcherVersionSchema = object().shape({
  version: string().required(),
  changelog: string().required(),
  url: string().url().required(),
}).required();

/**
 * Validates an input object as a launcher version.
 * @param input the input to validate.
 * @returns the launcher version - if it could be validated.
 * @throws ValidationError - if the input is invalid.
 */
export async function validateLauncherVersion(input: object): Promise<LauncherVersion> {
  return await launcherVersionSchema.validate(input, {
    stripUnknown: true,
  });
}

const loaderVersionSchema = object().shape({
  version: string().required(),
  changelog: string().required(),
  url: string().url().required(),
}).required();

/**
 * Validates an input object as a mod loader version.
 * @param input the input to validate.
 * @returns the mod loader version - if it could be validated.
 * @throws ValidationError - if the input is invalid.
 */
export async function validateLoaderVersion(input: object): Promise<LoaderVersion> {
  return await loaderVersionSchema.validate(input, {
    stripUnknown: true,
  });
}
