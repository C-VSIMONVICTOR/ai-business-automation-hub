export type LeadQualification = {
  score: number;
  temperature: 'Hot' | 'Warm' | 'Cold' | 'Spam';
  category: string;
  summary: string;
  recommendedAction: string;
  suggestedReply: string;
};

/**
 * Safe baseline qualification engine. It is intentionally deterministic so
 * the API remains useful even when an LLM provider is unavailable. An LLM can
 * later enrich this result without becoming a single point of failure.
 */
export function qualifyLead(input: {
  name: string;
  company?: string;
  message: string;
}): LeadQualification {
  const text = `${input.company ?? ''} ${input.message}`.toLowerCase();
  let score = 25;

  const buyingSignals = ['price', 'pricing', 'quote', 'cost', 'hire', 'buy', 'book', 'demo', 'proposal', 'budget'];
  const urgencySignals = ['urgent', 'asap', 'today', 'this week', 'deadline'];
  const spamSignals = ['casino', 'viagra', 'crypto giveaway', 'free money', 'click here'];

  score += buyingSignals.reduce((n, signal) => n + (text.includes(signal) ? 8 : 0), 0);
  score += urgencySignals.reduce((n, signal) => n + (text.includes(signal) ? 7 : 0), 0);
  if (input.company?.trim()) score += 10;
  if (input.message.length >= 250) score += 10;
  score = Math.min(100, score);

  if (spamSignals.some((signal) => text.includes(signal))) {
    return {
      score: 0,
      temperature: 'Spam',
      category: 'Spam',
      summary: `Potential spam inquiry received from ${input.name}.`,
      recommendedAction: 'Do not contact automatically; review and discard if confirmed spam.',
      suggestedReply: '',
    };
  }

  const category = text.includes('automation') || text.includes('n8n') || text.includes('workflow')
    ? 'Automation'
    : text.includes('ai') || text.includes('gpt') || text.includes('chatbot')
      ? 'AI Integration'
      : text.includes('website') || text.includes('web')
        ? 'Web Project'
        : 'General Inquiry';

  const temperature = score >= 70 ? 'Hot' : score >= 45 ? 'Warm' : 'Cold';
  const recommendedAction = temperature === 'Hot'
    ? 'Respond quickly and qualify budget, timeline, and requirements.'
    : temperature === 'Warm'
      ? 'Respond with relevant information and ask targeted qualification questions.'
      : 'Send a helpful response and nurture the lead without aggressive follow-up.';

  return {
    score,
    temperature,
    category,
    summary: `${input.name} submitted a ${category.toLowerCase()} inquiry with a qualification score of ${score}/100.`,
    recommendedAction,
    suggestedReply: `Hi ${input.name}, thanks for reaching out. I reviewed your request and would be happy to discuss the project, requirements, timeline, and budget.`,
  };
}
