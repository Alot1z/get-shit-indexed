/**
 * Visual Explainer Module
 * 
 * Generates Mermaid diagrams from code structures for visualization.
 * Supports flowcharts, sequence diagrams, class diagrams, and state diagrams.
 */

export type DiagramType = 'flowchart' | 'sequence' | 'class' | 'state';

export interface DiagramDocumentation {
  approach: string;
  supportedTypes: string[];
  inputFormats: string[];
}

export interface CodeStructure {
  type: string;
  name: string;
  exports: string[];
  imports: string[];
}

export interface CallSequence {
  from: string;
  to: string;
  message: string;
}

export interface ClassStructure {
  name: string;
  properties: string[];
  methods: string[];
}

/**
 * Analyze and document the diagram generation approach
 */
export async function analyzeDiagramApproach(): Promise<DiagramDocumentation> {
  return {
    approach: 'mermaid',
    supportedTypes: ['flowchart', 'sequence', 'class', 'state'],
    inputFormats: ['code', 'ast', 'markdown']
  };
}

/**
 * Generate a Mermaid diagram from a given structure
 */
export async function generateMermaidDiagram(
  structure: CodeStructure | CallSequence[] | ClassStructure | any,
  type: DiagramType
): Promise<string> {
  switch (type) {
    case 'flowchart':
      return generateFlowchart(structure as CodeStructure);
    case 'sequence':
      return generateSequence(structure as CallSequence[]);
    case 'class':
      return generateClassDiagram(structure as ClassStructure);
    case 'state':
      return generateStateDiagram(structure);
    default:
      throw new Error(`Unsupported diagram type: ${type}`);
  }
}

/**
 * Generate a flowchart from module structure
 */
function generateFlowchart(structure: CodeStructure): string {
  const lines: string[] = ['flowchart TD'];
  
  // Add main module node
  lines.push(`  ${sanitizeId(structure.name)}["${structure.name}"]`);
  
  // Add export nodes and connections
  if (structure.exports && structure.exports.length > 0) {
    structure.exports.forEach((exp: string) => {
      lines.push(`  ${sanitizeId(exp)}["${exp}"]`);
      lines.push(`  ${sanitizeId(structure.name)} --> ${sanitizeId(exp)}`);
    });
  }
  
  // Add import nodes and connections
  if (structure.imports && structure.imports.length > 0) {
    structure.imports.forEach((imp: string) => {
      lines.push(`  ${sanitizeId(imp)}_import["${imp}"]`);
      lines.push(`  ${sanitizeId(imp)}_import --> ${sanitizeId(structure.name)}`);
    });
  }
  
  return lines.join('\n');
}

/**
 * Generate a sequence diagram from call sequences
 */
function generateSequence(calls: CallSequence[]): string {
  const lines: string[] = ['sequenceDiagram'];
  
  // Add participants
  const participants = new Set<string>();
  calls.forEach(call => {
    participants.add(call.from);
    participants.add(call.to);
  });
  
  participants.forEach(p => {
    lines.push(`  participant ${sanitizeId(p)}`);
  });
  
  // Add messages
  calls.forEach(call => {
    lines.push(`  ${sanitizeId(call.from)}->>${sanitizeId(call.to)}: ${call.message}`);
  });
  
  return lines.join('\n');
}

/**
 * Generate a class diagram from class structure
 */
function generateClassDiagram(structure: ClassStructure): string {
  const lines: string[] = ['classDiagram'];
  
  lines.push(`  class ${sanitizeId(structure.name)} {`);
  
  // Add properties
  if (structure.properties && structure.properties.length > 0) {
    structure.properties.forEach((prop: string) => {
      lines.push(`    +${prop}`);
    });
  }
  
  // Add methods
  if (structure.methods && structure.methods.length > 0) {
    structure.methods.forEach((method: string) => {
      lines.push(`    +${method}()`);
    });
  }
  
  lines.push('  }');
  
  return lines.join('\n');
}

/**
 * Generate a state diagram from state structure
 */
function generateStateDiagram(structure: any): string {
  const lines: string[] = ['stateDiagram-v2'];
  
  if (structure.states && Array.isArray(structure.states)) {
    structure.states.forEach((state: any) => {
      if (typeof state === 'string') {
        lines.push(`  ${sanitizeId(state)}`);
      } else if (state.from && state.to) {
        lines.push(`  ${sanitizeId(state.from)} --> ${sanitizeId(state.to)}: ${state.label || ''}`);
      }
    });
  }
  
  return lines.join('\n');
}

/**
 * Sanitize ID for Mermaid compatibility
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}
