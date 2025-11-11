/**
 * @deprecated This mock data has been replaced by the searcher API integration.
 * This file is kept for backward compatibility with:
 * - registerLastInteraction mutation (still uses mock data)
 * - Unit tests that depend on mock data
 * 
 * TODO: Update registerLastInteraction to use searcher API or a proper database
 * TODO: Update tests to use searcher API mocks instead of this file
 */
const lawsuits = [
  {
    id: '1',
    number: '5001682-88.2020.8.13.0672',
    parties: [
      { name: 'João Silva', role: 'Autor' },
      { name: 'Maria Santos', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2020-01-15',
    movements: [
      {
        id: 'mov5',
        date: '2020-05-12',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov4',
        date: '2020-04-05',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov3',
        date: '2020-03-10',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov2',
        date: '2020-02-20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov1',
        date: '2020-01-15',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    ],
  },
  {
    id: '2',
    number: '1234567-89.2021.8.06.0001',
    parties: [
      { name: 'Pedro Oliveira', role: 'Autor' },
      { name: 'Ana Costa', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2021-03-20',
    movements: [
      {
        id: 'mov8',
        date: '2021-05-10',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov7',
        date: '2021-04-15',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov6',
        date: '2021-03-20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    ],
  },
  {
    id: '3',
    number: '9876543-21.2019.8.13.0123',
    parties: [
      { name: 'Carlos Mendes', role: 'Autor' },
      { name: 'Julia Ferreira', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2019-06-10',
    movements: [
      {
        id: 'mov14',
        date: '2019-11-30',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov13',
        date: '2019-10-15',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov12',
        date: '2019-09-20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov11',
        date: '2019-08-12',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov10',
        date: '2019-07-05',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov9',
        date: '2019-06-10',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    ],
  },
  {
    id: '4',
    number: '1111111-11.2022.8.06.0002',
    parties: [
      { name: 'Roberto Alves', role: 'Autor' },
      { name: 'Fernanda Lima', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2022-01-05',
    movements: [
      {
        id: 'mov16',
        date: '2022-02-10',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov15',
        date: '2022-01-05',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    ],
  },
  {
    id: '5',
    number: '2222222-22.2021.8.13.0456',
    parties: [
      { name: 'Lucas Pereira', role: 'Autor' },
      { name: 'Gabriela Souza', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2021-08-25',
    movements: [
      {
        id: 'mov20',
        date: '2021-11-18',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov19',
        date: '2021-10-20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov18',
        date: '2021-09-15',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov17',
        date: '2021-08-25',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    ],
  },
  {
    id: '6',
    number: '3333333-33.2020.8.06.0789',
    parties: [
      { name: 'Mariana Rocha', role: 'Autor' },
      { name: 'Bruno Martins', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2020-05-10',
    movements: [
      {
        id: 'mov27',
        date: '2020-12-05',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov26',
        date: '2020-10-30',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov25',
        date: '2020-09-15',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov24',
        date: '2020-08-20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov23',
        date: '2020-07-12',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov22',
        date: '2020-06-08',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov21',
        date: '2020-05-10',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    ],
  },
  {
    id: '7',
    number: '4444444-44.2022.8.13.0901',
    parties: [
      { name: 'Rafaela Torres', role: 'Autor' },
      { name: 'Thiago Nunes', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2022-03-15',
    movements: [
      {
        id: 'mov28',
        date: '2022-06-20',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        id: 'mov29',
        date: '2022-05-10',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
      {
        id: 'mov30',
        date: '2022-04-05',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      },
      {
        id: 'mov31',
        date: '2022-03-15',
        description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      },
    ],
  },
  {
    id: '8',
    number: '5555555-55.2021.8.06.1234',
    parties: [
      { name: 'Isabela Cardoso', role: 'Autor' },
      { name: 'Felipe Araújo', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2021-07-10',
    movements: [
      {
        id: 'mov32',
        date: '2021-10-25',
        description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
      },
      {
        id: 'mov33',
        date: '2021-09-15',
        description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
      },
      {
        id: 'mov34',
        date: '2021-08-20',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov35',
        date: '2021-07-10',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
    ],
  },
  {
    id: '9',
    number: '6666666-66.2020.8.13.2345',
    parties: [
      { name: 'Camila Ribeiro', role: 'Autor' },
      { name: 'André Campos', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2020-09-20',
    movements: [
      {
        id: 'mov36',
        date: '2021-01-15',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov37',
        date: '2020-12-10',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov38',
        date: '2020-11-05',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov39',
        date: '2020-10-15',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov40',
        date: '2020-09-20',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
    ],
  },
  {
    id: '10',
    number: '7777777-77.2023.8.06.3456',
    parties: [
      { name: 'Larissa Monteiro', role: 'Autor' },
      { name: 'Rodrigo Dias', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2023-02-10',
    movements: [
      {
        id: 'mov41',
        date: '2023-05-20',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov42',
        date: '2023-04-12',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov43',
        date: '2023-03-08',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov44',
        date: '2023-02-10',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
    ],
  },
  {
    id: '11',
    number: '8888888-88.2019.8.13.4567',
    parties: [
      { name: 'Patricia Lopes', role: 'Autor' },
      { name: 'Marcelo Freitas', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2019-04-25',
    movements: [
      {
        id: 'mov45',
        date: '2019-09-30',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov46',
        date: '2019-08-20',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov47',
        date: '2019-07-15',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov48',
        date: '2019-06-10',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov49',
        date: '2019-05-05',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov50',
        date: '2019-04-25',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
    ],
  },
  {
    id: '12',
    number: '9999999-99.2022.8.06.5678',
    parties: [
      { name: 'Vanessa Almeida', role: 'Autor' },
      { name: 'Gustavo Barbosa', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2022-06-12',
    movements: [
      {
        id: 'mov51',
        date: '2022-09-25',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov52',
        date: '2022-08-18',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov53',
        date: '2022-07-20',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov54',
        date: '2022-06-12',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
    ],
  },
  {
    id: '13',
    number: '1010101-01.2021.8.13.6789',
    parties: [
      { name: 'Juliana Castro', role: 'Autor' },
      { name: 'Renato Moreira', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2021-11-05',
    movements: [
      {
        id: 'mov55',
        date: '2022-02-15',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov56',
        date: '2022-01-10',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov57',
        date: '2021-12-20',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov58',
        date: '2021-11-05',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
    ],
  },
  {
    id: '14',
    number: '2020202-02.2020.8.06.7890',
    parties: [
      { name: 'Amanda Correia', role: 'Autor' },
      { name: 'Diego Ramos', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2020-12-18',
    movements: [
      {
        id: 'mov59',
        date: '2021-04-10',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov60',
        date: '2021-03-05',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov61',
        date: '2021-02-12',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov62',
        date: '2021-01-20',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov63',
        date: '2020-12-18',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
    ],
  },
  {
    id: '15',
    number: '3030303-03.2023.8.13.8901',
    parties: [
      { name: 'Bianca Teixeira', role: 'Autor' },
      { name: 'Eduardo Lima', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2023-01-22',
    movements: [
      {
        id: 'mov64',
        date: '2023-05-15',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov65',
        date: '2023-04-08',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov66',
        date: '2023-03-12',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov67',
        date: '2023-02-20',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov68',
        date: '2023-01-22',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
    ],
  },
  {
    id: '16',
    number: '4040404-04.2018.8.06.9012',
    parties: [
      { name: 'Carolina Farias', role: 'Autor' },
      { name: 'Henrique Gomes', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2018-08-30',
    movements: [
      {
        id: 'mov69',
        date: '2019-01-25',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov70',
        date: '2018-12-15',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov71',
        date: '2018-11-10',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov72',
        date: '2018-10-05',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov73',
        date: '2018-09-20',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov74',
        date: '2018-08-30',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
    ],
  },
  {
    id: '17',
    number: '5050505-05.2022.8.13.0123',
    parties: [
      { name: 'Daniela Moura', role: 'Autor' },
      { name: 'Leonardo Azevedo', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2022-08-05',
    movements: [
      {
        id: 'mov75',
        date: '2022-11-20',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov76',
        date: '2022-10-15',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov77',
        date: '2022-09-10',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov78',
        date: '2022-08-05',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
    ],
  },
  {
    id: '18',
    number: '6060606-06.2021.8.06.1234',
    parties: [
      { name: 'Fernanda Rocha', role: 'Autor' },
      { name: 'Paulo Henrique', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2021-05-18',
    movements: [
      {
        id: 'mov79',
        date: '2021-09-25',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov80',
        date: '2021-08-20',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov81',
        date: '2021-07-15',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov82',
        date: '2021-06-10',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov83',
        date: '2021-05-18',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
    ],
  },
  {
    id: '19',
    number: '7070707-07.2020.8.13.2345',
    parties: [
      { name: 'Gabriela Nascimento', role: 'Autor' },
      { name: 'Ricardo Sousa', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2020-10-12',
    movements: [
      {
        id: 'mov84',
        date: '2021-02-28',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov85',
        date: '2021-01-20',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov86',
        date: '2020-12-15',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov87',
        date: '2020-11-10',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov88',
        date: '2020-10-12',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
    ],
  },
  {
    id: '20',
    number: '8080808-08.2023.8.06.3456',
    parties: [
      { name: 'Helena Barros', role: 'Autor' },
      { name: 'Sérgio Machado', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2023-04-08',
    movements: [
      {
        id: 'mov89',
        date: '2023-07-20',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov90',
        date: '2023-06-15',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov91',
        date: '2023-05-22',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov92',
        date: '2023-04-08',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
    ],
  },
  {
    id: '21',
    number: '9090909-09.2019.8.13.4567',
    parties: [
      { name: 'Ingrid Pires', role: 'Autor' },
      { name: 'Vinicius Costa', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2019-12-05',
    movements: [
      {
        id: 'mov93',
        date: '2020-04-18',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov94',
        date: '2020-03-12',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov95',
        date: '2020-02-08',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov96',
        date: '2020-01-15',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov97',
        date: '2019-12-05',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
    ],
  },
  {
    id: '22',
    number: '1212121-12.2022.8.06.5678',
    parties: [
      { name: 'Jéssica Melo', role: 'Autor' },
      { name: 'Wagner Silva', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2022-05-25',
    movements: [
      {
        id: 'mov98',
        date: '2022-09-10',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov99',
        date: '2022-08-05',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov100',
        date: '2022-07-12',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov101',
        date: '2022-06-18',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov102',
        date: '2022-05-25',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
    ],
  },
  {
    id: '23',
    number: '1313131-13.2021.8.13.6789',
    parties: [
      { name: 'Karina Oliveira', role: 'Autor' },
      { name: 'Yuri Santos', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2021-09-30',
    movements: [
      {
        id: 'mov103',
        date: '2022-01-25',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov104',
        date: '2021-12-20',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov105',
        date: '2021-11-15',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov106',
        date: '2021-10-22',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov107',
        date: '2021-09-30',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
    ],
  },
  {
    id: '24',
    number: '1414141-14.2020.8.06.7890',
    parties: [
      { name: 'Leticia Araújo', role: 'Autor' },
      { name: 'Zeca Ferreira', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2020-07-22',
    movements: [
      {
        id: 'mov108',
        date: '2020-11-30',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov109',
        date: '2020-10-25',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov110',
        date: '2020-09-18',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov111',
        date: '2020-08-15',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov112',
        date: '2020-07-22',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
    ],
  },
  {
    id: '25',
    number: '1515151-15.2023.8.13.8901',
    parties: [
      { name: 'Mariana Duarte', role: 'Autor' },
      { name: 'Alexandre Rocha', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2023-03-18',
    movements: [
      {
        id: 'mov113',
        date: '2023-07-05',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov114',
        date: '2023-06-10',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov115',
        date: '2023-05-15',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov116',
        date: '2023-04-20',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov117',
        date: '2023-03-18',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
    ],
  },
  {
    id: '26',
    number: '1616161-16.2018.8.06.9012',
    parties: [
      { name: 'Natália Campos', role: 'Autor' },
      { name: 'Bruno Henrique', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2018-11-12',
    movements: [
      {
        id: 'mov118',
        date: '2019-04-20',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov119',
        date: '2019-03-15',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov120',
        date: '2019-02-10',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov121',
        date: '2019-01-08',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov122',
        date: '2018-12-20',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov123',
        date: '2018-11-12',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
    ],
  },
  {
    id: '27',
    number: '1717171-17.2022.8.13.0123',
    parties: [
      { name: 'Olivia Martins', role: 'Autor' },
      { name: 'Caio Rodrigues', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2022-09-15',
    movements: [
      {
        id: 'mov124',
        date: '2023-01-20',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov125',
        date: '2022-12-15',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov126',
        date: '2022-11-10',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov127',
        date: '2022-10-18',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov128',
        date: '2022-09-15',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
    ],
  },
  {
    id: '28',
    number: '1818181-18.2021.8.06.1234',
    parties: [
      { name: 'Priscila Souza', role: 'Autor' },
      { name: 'Davi Alves', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2021-06-28',
    movements: [
      {
        id: 'mov129',
        date: '2021-10-25',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov130',
        date: '2021-09-20',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov131',
        date: '2021-08-15',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov132',
        date: '2021-07-22',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov133',
        date: '2021-06-28',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
    ],
  },
  {
    id: '29',
    number: '1919191-19.2020.8.13.2345',
    parties: [
      { name: 'Raquel Mendes', role: 'Autor' },
      { name: 'Fábio Lopes', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2020-12-08',
    movements: [
      {
        id: 'mov134',
        date: '2021-04-15',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov135',
        date: '2021-03-10',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov136',
        date: '2021-02-05',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov137',
        date: '2021-01-12',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov138',
        date: '2020-12-08',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
    ],
  },
  {
    id: '30',
    number: '2020202-20.2023.8.06.3456',
    parties: [
      { name: 'Sabrina Costa', role: 'Autor' },
      { name: 'Guilherme Nunes', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2023-05-22',
    movements: [
      {
        id: 'mov139',
        date: '2023-09-10',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov140',
        date: '2023-08-15',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov141',
        date: '2023-07-20',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov142',
        date: '2023-06-25',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov143',
        date: '2023-05-22',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
    ],
  },
  {
    id: '31',
    number: '2121212-21.2019.8.13.4567',
    parties: [
      { name: 'Tatiana Reis', role: 'Autor' },
      { name: 'Igor Barbosa', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2019-03-15',
    movements: [
      {
        id: 'mov144',
        date: '2019-08-30',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov145',
        date: '2019-07-25',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov146',
        date: '2019-06-20',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov147',
        date: '2019-05-15',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov148',
        date: '2019-04-10',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov149',
        date: '2019-03-15',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
    ],
  },
  {
    id: '32',
    number: '2222222-22.2022.8.06.5678',
    parties: [
      { name: 'Ursula Farias', role: 'Autor' },
      { name: 'João Pedro', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2022-07-30',
    movements: [
      {
        id: 'mov150',
        date: '2022-11-25',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov151',
        date: '2022-10-20',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov152',
        date: '2022-09-15',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov153',
        date: '2022-08-22',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov154',
        date: '2022-07-30',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
    ],
  },
  {
    id: '33',
    number: '2323232-23.2021.8.13.6789',
    parties: [
      { name: 'Valéria Gomes', role: 'Autor' },
      { name: 'Lucas Gabriel', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2021-04-12',
    movements: [
      {
        id: 'mov155',
        date: '2021-08-28',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov156',
        date: '2021-07-22',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov157',
        date: '2021-06-18',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov158',
        date: '2021-05-25',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov159',
        date: '2021-04-12',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
    ],
  },
  {
    id: '34',
    number: '2424242-24.2020.8.06.7890',
    parties: [
      { name: 'Wanessa Lima', role: 'Autor' },
      { name: 'Matheus Oliveira', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2020-08-18',
    movements: [
      {
        id: 'mov160',
        date: '2020-12-30',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov161',
        date: '2020-11-25',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov162',
        date: '2020-10-20',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov163',
        date: '2020-09-22',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov164',
        date: '2020-08-18',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
    ],
  },
  {
    id: '35',
    number: '2525252-25.2023.8.13.8901',
    parties: [
      { name: 'Ximena Torres', role: 'Autor' },
      { name: 'Nathan Pereira', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2023-06-10',
    movements: [
      {
        id: 'mov165',
        date: '2023-10-15',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov166',
        date: '2023-09-20',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov167',
        date: '2023-08-25',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov168',
        date: '2023-07-30',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov169',
        date: '2023-06-10',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
    ],
  },
  {
    id: '36',
    number: '2626262-26.2018.8.06.9012',
    parties: [
      { name: 'Yasmin Barros', role: 'Autor' },
      { name: 'Otávio Castro', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2018-09-25',
    movements: [
      {
        id: 'mov170',
        date: '2019-02-20',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov171',
        date: '2019-01-15',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov172',
        date: '2018-12-10',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov173',
        date: '2018-11-05',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov174',
        date: '2018-10-18',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov175',
        date: '2018-09-25',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
    ],
  },
  {
    id: '37',
    number: '2727272-27.2022.8.13.0123',
    parties: [
      { name: 'Zara Monteiro', role: 'Autor' },
      { name: 'Pedro Henrique', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2022-10-28',
    movements: [
      {
        id: 'mov176',
        date: '2023-02-15',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov177',
        date: '2023-01-20',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov178',
        date: '2022-12-18',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov179',
        date: '2022-11-25',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov180',
        date: '2022-10-28',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
    ],
  },
  {
    id: '38',
    number: '2828282-28.2021.8.06.1234',
    parties: [
      { name: 'Adriana Pires', role: 'Autor' },
      { name: 'Rafael Correia', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2021-08-05',
    movements: [
      {
        id: 'mov181',
        date: '2021-12-20',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov182',
        date: '2021-11-15',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
      {
        id: 'mov183',
        date: '2021-10-10',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov184',
        date: '2021-09-18',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov185',
        date: '2021-08-05',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
    ],
  },
  {
    id: '39',
    number: '2929292-29.2020.8.13.2345',
    parties: [
      { name: 'Beatriz Dias', role: 'Autor' },
      { name: 'Thales Ramos', role: 'Réu' },
    ],
    court: 'TJAL',
    startDate: '2020-11-22',
    movements: [
      {
        id: 'mov186',
        date: '2021-04-10',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov187',
        date: '2021-03-05',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
      {
        id: 'mov188',
        date: '2021-02-08',
        description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
      },
      {
        id: 'mov189',
        date: '2021-01-12',
        description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      },
      {
        id: 'mov190',
        date: '2020-12-20',
        description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
      },
      {
        id: 'mov191',
        date: '2020-11-22',
        description: 'Ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      },
    ],
  },
  {
    id: '40',
    number: '3030303-30.2023.8.06.3456',
    parties: [
      { name: 'Cecília Teixeira', role: 'Autor' },
      { name: 'Victor Hugo', role: 'Réu' },
    ],
    court: 'TJCE',
    startDate: '2023-07-15',
    movements: [
      {
        id: 'mov192',
        date: '2023-11-20',
        description: 'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
      },
      {
        id: 'mov193',
        date: '2023-10-25',
        description: 'Sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      },
      {
        id: 'mov194',
        date: '2023-09-30',
        description: 'Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
      },
      {
        id: 'mov195',
        date: '2023-08-28',
        description: 'Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
      },
      {
        id: 'mov196',
        date: '2023-07-15',
        description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      },
    ],
  },
];

export default lawsuits;

