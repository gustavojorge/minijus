import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLFloat,
} from 'graphql';

// PartyType: Represents a party (Author or Defendant)
export const PartyType = new GraphQLObjectType({
  name: 'Party',
  fields: () => ({
    name: { type: GraphQLString },
    role: { type: GraphQLString },
  }),
});

// LawyerType: Represents a lawyer
export const LawyerType = new GraphQLObjectType({
  name: 'Lawyer',
  fields: () => ({
    name: { type: GraphQLString },
  }),
});

// MovementType: Represents a movement of the process (Activity)
export const MovementType = new GraphQLObjectType({
  name: 'Movement',
  fields: () => ({
    id: { type: GraphQLID },
    date: { type: GraphQLString },
    description: { type: GraphQLString },
    lastInteractionDate: { type: GraphQLString },
  }),
});

// LawsuitType: Represents a lawsuit
export const LawsuitType = new GraphQLObjectType({
  name: 'Lawsuit',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    number: { type: new GraphQLNonNull(GraphQLString) },
    parties: { type: new GraphQLList(PartyType) }, 
    court: { type: GraphQLString },
    startDate: { type: GraphQLString }, 
    movements: { type: new GraphQLList(MovementType) }, 
    nature: { type: GraphQLString },
    kind: { type: GraphQLString },
    subject: { type: GraphQLString },
    judge: { type: GraphQLString },
    value: { type: GraphQLFloat },
    lawyers: { type: new GraphQLList(LawyerType) },
  }),
});

// DateFilterInputType: Input type for date filter
export const DateFilterInputType = new GraphQLInputObjectType({
  name: 'DateFilterInput',
  fields: () => ({
    date: { type: new GraphQLNonNull(GraphQLString) },
    operator: { type: new GraphQLNonNull(GraphQLString) }, // "<", "=", or ">"
  }),
});

// FiltersInputType: Input type for filters
export const FiltersInputType = new GraphQLInputObjectType({
  name: 'FiltersInput',
  fields: () => ({
    court: { type: GraphQLString },
    date: { type: DateFilterInputType },
  }),
});

// ResponseType for RegisterLastInteraction
export const RegisterLastInteractionResponseType = new GraphQLObjectType({
  name: 'RegisterLastInteractionResponse',
  fields: () => ({
    status: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    movement: { type: MovementType },
  }),
});

// SearchResultType: Union type for search results (either Lawsuit or CollectionQueued)
// Note: __typename is automatically available in GraphQL, no need to define it
export const SearchResultType = new GraphQLObjectType({
  name: 'SearchResult',
  fields: () => ({
    // Lawsuit fields
    id: { type: GraphQLID },
    number: { type: GraphQLString },
    parties: { type: new GraphQLList(PartyType) },
    court: { type: GraphQLString },
    startDate: { type: GraphQLString },
    movements: { type: new GraphQLList(MovementType) },
    nature: { type: GraphQLString },
    kind: { type: GraphQLString },
    subject: { type: GraphQLString },
    judge: { type: GraphQLString },
    value: { type: GraphQLFloat },
    lawyers: { type: new GraphQLList(LawyerType) },
    // CollectionQueued fields
    status: { type: GraphQLString },
    taskId: { type: GraphQLString },
    cnj: { type: GraphQLString },
    message: { type: GraphQLString },
  }),
});

