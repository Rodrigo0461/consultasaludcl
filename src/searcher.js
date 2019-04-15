/* eslint no-underscore-dangle: "error" */
const axios = require('axios');

const BASE_URL = 'https://rnpi.superdesalud.gob.cl/getPrestadores';

const search = async (query) => {
  try {
    const result = await axios.post(BASE_URL, {
      query: {
        bool: {
          must: [
            {
              match_phrase: { estado: 'Registrado' },
            },
            {
              bool: {
                should: [
                  {
                    multi_match: {
                      query,
                      type: 'cross_fields',
                      fields: [
                        'nombreCompleto',
                        'antecedentes.codAntecedente',
                      ],
                      operator: 'and',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      size: 500,
    });
    return result.data.hits.hits;
  } catch (error) {
    throw new Error(error);
  }
};

const searchByRut = async (rut) => {
  try {
    const result = await axios.post(BASE_URL, {
      query: {
        bool: {
          must: [
            {
              match_phrase: {
                estado: 'Registrado',
              },
            },
            {
              bool: {
                should: [
                  {
                    multi_match: {
                      query: rut,
                      fields: [
                        'rutCompleto',
                        'nroRegistro',
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    // eslint-disable-next-line no-underscore-dangle
    return result.data.hits.hits[0]._source;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { search, searchByRut };
