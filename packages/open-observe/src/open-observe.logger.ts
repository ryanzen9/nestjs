import { Inject } from "@nestjs/common";
import { OpenObserveConfig } from "./open-observe.interfaces";

export class OBLogger {
  constructor(@Inject("OPEN_OBSERVE_CONFIG") private readonly config: OpenObserveConfig) {}

  log(message: string) {
    console.log(`[OpenObserve] ${message}`);
  }

  error(message: string, trace?: string) {
    console.error(`[OpenObserve] ${message}`);
    if (trace) {
      console.error(trace);
    }
  }

  warn(message: string) {
    console.warn(`[OpenObserve] ${message}`);
  }

  debug(message: string) {
    console.debug(`[OpenObserve] ${message}`);
  }
}
