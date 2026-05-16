/**
 * @description Configuration options for OpenObserve
 */

export interface OpenObserveConfig {
  observerTraceUrl: string;
  observerScope: string;
  observerStream: string;
  observerUsername?: string;
  observerPassword?: string;
  observerTraceToken?: string;
}
