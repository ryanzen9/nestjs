import { Module } from "@nestjs/common";
import { OpenObserveConfig } from "./open-observe.interfaces";

@Module({})
export class OpenObserveModule {
  static forRoot(config: OpenObserveConfig) {
    // Initialize OpenObserve with the provided configuration
    return {
      module: OpenObserveModule,
      providers: [
        {
          provide: "OPEN_OBSERVE_CONFIG",
          useValue: config,
        },
        // Add any other providers needed for OpenObserve integration
      ],
      exports: ["OPEN_OBSERVE_CONFIG"],
    };
  }
}
