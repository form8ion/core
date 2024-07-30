import joi from 'joi';

export default joi.object().required()
  .keys({
    scaffold: joi.func().minArity(1).required(),
    lift: joi.func().minArity(1),
    test: joi.func().arity(1)
  })
  .unknown();
