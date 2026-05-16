import { Module } from "@nestjs/common";
import { OPEN_OBSERVE_CONFIG, OPEN_OBSERVE_LOGGER } from "./open-observe.constants";
import { OpenObserveConfig } from "./open-observe.interfaces";
import { OBLogger } from "./open-observe.logger";

@Module({})
export class OpenObserveModule {
  static forRoot(config: OpenObserveConfig) {
    // Initialize OpenObserve with the provided configuration
    return {
      module: OpenObserveModule,
      providers: [
        {
          provide: OPEN_OBSERVE_CONFIG,
          useValue: config,
        },
        // Add any other providers needed for OpenObserve integration
        {
          provide: OPEN_OBSERVE_LOGGER,
          useClass: OBLogger,
        },
      ],
      exports: [OPEN_OBSERVE_CONFIG, OPEN_OBSERVE_LOGGER],
    };
  }
}
