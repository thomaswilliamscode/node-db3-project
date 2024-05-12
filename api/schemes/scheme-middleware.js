const db = require('../../data/db-config')

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = (req, res, next) => {
  next()
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  next()
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = async (req, res, next) => {
  const { step_number, } = req.body.step
  const { scheme_id } = req.params;
  const data = await db('steps')
		.where('scheme_id', scheme_id)
		.where('step_number', step_number);

    const length = data.length

    if(length) {
      console.log('isTaken: ', data)
      res.status(400).json({message: 'That Step number is taken'})
    } else {
      console.log('made it past middleware')
      next();
    }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
