import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';

// AlternativeType: Represents the experiment alternative/variant
export const AlternativeType = new GraphQLObjectType({
  name: 'Alternative',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// ExperimentType: Represents the experiment
export const ExperimentType = new GraphQLObjectType({
  name: 'Experiment',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// ExperimentGroupType: Represents the experiment group
export const ExperimentGroupType = new GraphQLObjectType({
  name: 'ExperimentGroup',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// ExperimentDataType: Full experiment data response
export const ExperimentDataType = new GraphQLObjectType({
  name: 'ExperimentData',
  fields: () => ({
    alternative: { type: new GraphQLNonNull(AlternativeType) },
    client_id: { type: new GraphQLNonNull(GraphQLString) },
    experiment: { type: new GraphQLNonNull(ExperimentType) },
    experiment_group: { type: new GraphQLNonNull(ExperimentGroupType) },
    participating: { type: new GraphQLNonNull(GraphQLBoolean) },
    simulating: { type: new GraphQLNonNull(GraphQLBoolean) },
    status: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// ModalHeaderType: Header section of the modal
export const ModalHeaderType = new GraphQLObjectType({
  name: 'ModalHeader',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    subtitle: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// ModalPriceType: Price information in the modal body
export const ModalPriceType = new GraphQLObjectType({
  name: 'ModalPrice',
  fields: () => ({
    current: { type: new GraphQLNonNull(GraphQLString) },
    next: { type: new GraphQLNonNull(GraphQLString) },
    period: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// ModalButtonType: Button configuration in the modal body
export const ModalButtonType = new GraphQLObjectType({
  name: 'ModalButton',
  fields: () => ({
    label: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// ModalBodyType: Body section of the modal
export const ModalBodyType = new GraphQLObjectType({
  name: 'ModalBody',
  fields: () => ({
    benefits: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    price: { type: new GraphQLNonNull(ModalPriceType) },
    button: { type: new GraphQLNonNull(ModalButtonType) },
  }),
});

// ModalFooterType: Footer section of the modal
export const ModalFooterType = new GraphQLObjectType({
  name: 'ModalFooter',
  fields: () => ({
    text: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

// NextPlanModalType: Complete modal structure
export const NextPlanModalType = new GraphQLObjectType({
  name: 'NextPlanModal',
  fields: () => ({
    header: { type: new GraphQLNonNull(ModalHeaderType) },
    body: { type: new GraphQLNonNull(ModalBodyType) },
    footer: { type: new GraphQLNonNull(ModalFooterType) },
  }),
});

