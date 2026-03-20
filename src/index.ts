type AgentSpec = {
  code: string
  keywords: string[]
}

const AGENTS: AgentSpec[] = [
  { code: 'ZEUS', keywords: ['orchestrate', 'plan', 'coordinate', 'manage project'] },
  { code: 'ATLAS', keywords: ['build', 'code', 'architect', 'refactor', 'implement'] },
  { code: 'SENTINEL', keywords: ['secure', 'audit', 'pentest', 'compliance', 'threat model'] },
  { code: 'FORGE', keywords: ['deploy', 'infrastructure', 'ci/cd', 'kubernetes', 'monitor', 'cloud'] },
  { code: 'NEXUS', keywords: ['ai', 'ml', 'llm', 'rag', 'data pipeline', 'prompt', 'eval'] },
  { code: 'PIXEL', keywords: ['design', 'ux', 'ui', 'accessibility', 'brand', 'design system'] },
  { code: 'PULSE', keywords: ['prd', 'roadmap', 'growth', 'marketing', 'seo', 'pricing', 'launch'] },
  { code: 'TITAN', keywords: ['test', 'tdd', 'e2e', 'performance test', 'quality gate', 'verification'] },
  { code: 'HERMES', keywords: ['automate', 'integrate', 'bot', 'workflow', 'mcp', 'webhook'] },
  { code: 'ORACLE', keywords: ['research', 'analyze', 'competitive', 'market', 'strategy', 'financial model'] }
]

function score(text: string, keywords: string[]): number {
  const v = text.toLowerCase()
  return keywords.reduce((n, k) => n + (v.includes(k) ? 1 : 0), 0)
}

function routeMission(mission: string): { primary: string; support: string[] } {
  const ranked = [...AGENTS].sort((a, b) => score(mission, b.keywords) - score(mission, a.keywords))
  const primary = ranked[0].code
  const support = ranked.slice(1).filter((a) => score(mission, a.keywords) > 0).map((a) => a.code)
  return { primary, support: support.length ? support : ['TITAN', 'SENTINEL'] }
}

async function main(): Promise<void> {
  const mission = 'build secure API, run tests, and deploy'
  const routed = routeMission(mission)
  console.log('[Vercel AI] mission:', mission)
  console.log('[Vercel AI] primary:', routed.primary)
  console.log('[Vercel AI] support:', routed.support.join(', '))
  console.log('[Vercel AI] next step: wire route output into streamText/generateText calls')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
