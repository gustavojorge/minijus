import {
  GraphQLObjectType,
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

// ResponseType for RegisterLastInteraction
export const RegisterLastInteractionResponseType = new GraphQLObjectType({
  name: 'RegisterLastInteractionResponse',
  fields: () => ({
    status: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    movement: { type: MovementType },
  }),
});

