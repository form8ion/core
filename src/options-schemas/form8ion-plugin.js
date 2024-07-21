import joi from 'joi';

export default joi.object().required()
  .keys({
    scaffold: joi.func().arity(1).required(),
    lift: joi.func().arity(1)
  })
  .unknown();
