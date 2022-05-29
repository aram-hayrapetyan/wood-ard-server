import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { getConnection } from "typeorm";

@ValidatorConstraint({ name: 'isValid', async: false })
export default class isValid implements ValidatorConstraintInterface {
    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const where: any = {};
        where[validationArguments.constraints[1]] = value;

        const exists = await getConnection().getRepository(validationArguments.constraints[0]).findOne(where);

        if (exists) {
            // Deleted Data
            if (exists.hasOwnProperty('deleted_at') && exists['deleted_at'] && exists['deleted_at'] <= new Date()) {
                return false;
            }

            // Valid Account
            if ((exists.hasOwnProperty('activated') && !exists['activated']) || (exists.hasOwnProperty('blocked') && exists['blocked'])) {
                return false;
            }

            // Valid Data
            if (exists.hasOwnProperty('approved') && !exists['approved']) {
                return false;
            }

            return true;
        } else {
            return false;
        }
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return "Invalid '$property'.";
    }
}