const db = require('../../data/db-config')

async function find() { // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */
  const result = await db('schemes as sc')
    .select('sc.scheme_id', 'sc.scheme_name')
		.leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
		.count('st.step_id as number_of_steps')
		.groupBy('sc.scheme_id')
		.orderBy('sc.scheme_id', 'asc');

    return result

}

async function findById(scheme_id) { // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

      */

      const rows = await db('schemes as sc').select(
				'sc.scheme_name',
				'st.step_id',
        'st.step_number',
				'st.instructions',
				'sc.scheme_id'
			).leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
      .where('sc.scheme_id', scheme_id)
      .orderBy('st.step_number', 'asc');

      /*


    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

      */
    let scheme_name = rows[0].scheme_name
    let steps = []

    let result = rows.map( (row) => {
      if(row.step_number) {
				let answer = {
					step_id: row.step_id,
					step_number: row.step_number,
					instructions: row.instructions,
				};
				steps.push(answer);
			}
      })
      // "scheme_id": 1,
      //   "scheme_name": "World Domination",
      //   "steps": [
      //     {
      //       "step_id": 2,
      //       "step_number": 1,
      //       "instructions": "solve prime number theory"
      //     },

      let info = {
        scheme_id: scheme_id,
        scheme_name: scheme_name,
        steps: steps
      }

      return info

      /*

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */
}

async function findSteps(scheme_id) {
	// EXERCISE C
	/*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]

      select
    st.step_id,
    st.step_number,
    st.instructions,
    sc.scheme_name
from schemes as sc
left join steps as st
    on sc.scheme_id = st.scheme_id
where sc.scheme_id = 1
order by st.step_number;
  */

const rows = await db('schemes as sc')
      .select('st.step_id', 'st.step_number', 'st.instructions', 'sc.scheme_name')
      .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
      .where('sc.scheme_id', scheme_id)
      .orderBy('st.step_number')


if (rows[0].step_id) {
  return rows
} else {
  return []
}
}


async function add(scheme) {
  let {scheme: realScheme} = scheme
	// EXERCISE D
	/*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
    insert into schemes (scheme_name)
    values('test');
  */
  const rows = await db('schemes')
    .insert({
      scheme_name: realScheme
    })

    const newScheme = await db('schemes')
      .where('scheme_id', rows[0])

    return newScheme[0];
}

async function addStep(scheme_id, step) {
  console.log('inside add a step')
  const { step_number, instructions } = step.step
	// EXERCISE E
	/*
  step is obj with step_number, instructions
  linked with scheme_id


  insert into steps (step_number, instructions, scheme_id)
  values(1, 'This is a test', 8);

  */

  const newStep = await db('steps')
    .insert({
      step_number: step_number,
      instructions: instructions,
      scheme_id: scheme_id
    })

  /*

    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
 console.log('newStep: ', newStep)

    const allSteps = await db('steps')
      .where('scheme_id', scheme_id)
      .orderBy('step_number')

      console.log('allSteps: ', allSteps)

      return allSteps
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
