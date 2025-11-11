/**
 * Transform searcher API response to GraphQL format
 */
export const transformLawsuit = (lawsuit) => {
  // Generate IDs for movements (activities) if not present
  const movements = (lawsuit.activities || []).map((activity, index) => ({
    id: activity.id || `mov${index + 1}`,
    date: activity.date,
    description: activity.description,
    lastInteractionDate: activity.lastInteractionDate || null,
  }));

  return {
    id: lawsuit.id,
    number: lawsuit.number,
    parties: lawsuit.related_people || [],
    court: lawsuit.court,
    startDate: lawsuit.date || lawsuit.startDate,
    movements: movements,
    nature: lawsuit.nature,
    kind: lawsuit.kind,
    subject: lawsuit.subject,
    judge: lawsuit.judge,
    value: lawsuit.value,
    lawyers: lawsuit.lawyers || [],
  };
};

