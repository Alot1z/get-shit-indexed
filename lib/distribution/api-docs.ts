// lib/distribution/api-docs.ts
// Phase 50E: Distribution Layer - API Documentation Generation (TDD GREEN Phase)

/**
 * API endpoint definition
 */
export interface ApiEndpoint {
  method: string;
  path: string;
  responseType: string;
}

/**
 * API type definition
 */
export interface ApiType {
  properties: string[];
}

/**
 * Complete API documentation
 */
export interface ApiDocumentation {
  endpoints: ApiEndpoint[];
  types: Record<string, ApiType>;
}

/**
 * OpenAPI specification
 */
export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
  };
  paths: Record<string, unknown>;
}

/**
 * ApiDocsGenerator - Generates API documentation and OpenAPI specs
 */
export class ApiDocsGenerator {
  /**
   * Generate API documentation from code
   */
  async generateApiDocs(code: string): Promise<ApiDocumentation> {
    const endpoints: ApiEndpoint[] = [];
    const types: Record<string, ApiType> = {};
    
    // Extract interface definitions
    const interfaceRegex = /interface\s+(\w+)\s*\{([^}]+)\}/g;
    let match;
    while ((match = interfaceRegex.exec(code)) !== null) {
      const typeName = match[1];
      const body = match[2];
      const properties = body
        .split(/[;\n]/)
        .map(line => line.split(':')[0].trim())
        .filter(prop => prop && !prop.startsWith('//'));
      
      types[typeName] = { properties };
    }
    
    // Extract API methods from interface
    const apiInterfaceRegex = /interface\s+\w*Api\w*\s*\{([\s\S]*?)\}/g;
    while ((match = apiInterfaceRegex.exec(code)) !== null) {
      const body = match[1];
      
      // Extract get methods
      const getRegex = /get\(([^)]+)\)\s*:\s*Promise<(\w+)>/g;
      let methodMatch;
      while ((methodMatch = getRegex.exec(body)) !== null) {
        endpoints.push({
          method: 'GET',
          path: methodMatch[1].replace(/['"]/g, '').trim(),
          responseType: methodMatch[2]
        });
      }
      
      // Extract post methods
      const postRegex = /post\(([^)]+)\)\s*:\s*Promise<(\w+)>/g;
      while ((methodMatch = postRegex.exec(body)) !== null) {
        endpoints.push({
          method: 'POST',
          path: methodMatch[1].split(',')[0].replace(/['"]/g, '').trim(),
          responseType: methodMatch[2]
        });
      }
    }
    
    // If no endpoints found, create defaults from async functions
    if (endpoints.length === 0) {
      const funcRegex = /export\s+async\s+function\s+(\w+)(?:\([^)]*\))?\s*:\s*Promise<([^>]+)>/g;
      while ((match = funcRegex.exec(code)) !== null) {
        const funcName = match[1];
        const returnType = match[2].trim();
        
        // Convert function name to path
        let path = '/' + funcName
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .replace(/^-/, '');
        
        // Handle common patterns
        if (funcName.startsWith('list')) {
          // listUsers -> /users (pluralize the resource)
          // Extract singular resource name: 'Users' from 'listUsers'
          const resourceName = funcName.slice(4); // 'Users'
          // Convert to lowercase: 'users' - this is already plural form in the function name
          path = '/' + resourceName.toLowerCase();
        } else if (funcName.startsWith('get')) {
          // getUser -> /user
          const resourceName = funcName.slice(3); // Remove 'get'
          path = '/' + resourceName.toLowerCase();
        }
        
        endpoints.push({
          method: 'GET',
          path,
          responseType: returnType.replace(/\[\]/g, '') // Handle array types
        });
      }
    }
    
    return { endpoints, types };
  }

  /**
   * Generate OpenAPI specification from code
   */
  async generateOpenApiSpec(code: string): Promise<OpenApiSpec> {
    const apiDocs = await this.generateApiDocs(code);
    
    const paths: Record<string, unknown> = {};
    
    for (const endpoint of apiDocs.endpoints) {
      const method = endpoint.method.toLowerCase();
      
      if (!paths[endpoint.path]) {
        paths[endpoint.path] = {};
      }
      
      (paths[endpoint.path] as Record<string, unknown>)[method] = {
        summary: `${endpoint.method} ${endpoint.path}`,
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${endpoint.responseType}`
                }
              }
            }
          }
        }
      };
    }
    
    return {
      openapi: '3.0.0',
      info: {
        title: 'GSI API',
        version: '1.0.0'
      },
      paths
    };
  }
}

export default ApiDocsGenerator;
