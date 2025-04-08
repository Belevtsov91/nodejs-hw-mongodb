
import Joi from 'joi';

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
