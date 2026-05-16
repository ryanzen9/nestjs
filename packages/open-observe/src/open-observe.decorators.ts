import { Inject } from "@nestjs/common";
import { OPEN_OBSERVE_CONFIG } from "./open-observe.constants";

export const InjectOpenObserveConfig = () => Inject(OPEN_OBSERVE_CONFIG);

export const InjectOpenObserveLogger = () => Inject("OPEN_OBSERVE_LOGGER");
