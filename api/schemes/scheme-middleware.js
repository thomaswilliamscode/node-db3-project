const db = require('../../data/db-config')
const Scheme = require('./scheme-model')

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const { scheme_id } = req.params
  const answer = await Scheme.findById(scheme_id)
  if (answer.scheme_name) {
    next()
  } else {
    res.status(404).json({message: `scheme with scheme_id ${scheme_id} not found`})
  }
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = async (req, res, next) => {
  const { scheme_name } = req.body

  if (typeof scheme_name !== 'string' ) {
    return res.status(400).json({ message: `invalid scheme_name` });
  }
  const data = await db('schemes')
    .where('scheme_name', scheme_name)

    const isTaken = data.length

    console.log(`scheme_name: ${scheme_name}`)

  if (scheme_name && !isTaken) {
    next();
  } else {
    return res.status(400).json({message: `invalid scheme_name`})
  }
  
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

  if (!req.body.step_number || !req.body.instructions) {
    res.status(400).json({ message: 'invalid step' });
  }
  const { step_number, instructions } = req.body
  
  const { scheme_id } = req.params;


  const data = await db('steps')
		.where('scheme_id', scheme_id)
		.where('step_number', step_number);

    const length = data.length

    if(length) {
      console.log('isTaken: ', data)
      res.status(400).json({message: 'That Step number is taken'})
    } else if (step_number > 0){
      next();
    } else {
      res.status(400).json({message: 'invalid step'})
    }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
