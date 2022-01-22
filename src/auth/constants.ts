import { readFileSync } from 'fs';

export const jwtConstant = {
    secret: readFileSync(`${process.cwd()}/keys/private.pem`).toString()
}