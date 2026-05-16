import { Logger, LoggerService } from "@nestjs/common";
import { catchError, from, of, tap } from "rxjs";
import { InjectOpenObserveConfig } from "./open-observe.decorators";
import { OpenObserveConfig } from "./open-observe.interfaces";

export class OBLogger implements LoggerService {
  constructor(@InjectOpenObserveConfig() private readonly config: OpenObserveConfig) {}

  private formatMessage(level: string, message: any): string {
    return typeof message === "string"
      ? `[${level.toUpperCase()}] [${new Date().toISOString()}] ${message}`
      : JSON.stringify(message);
  }

  private sendLogs(logs: any[]) {
    const traceUrl = this.config.observerTraceUrl;
    const org = this.config.observerScope;
    const stream = this.config.observerStream;
    const observerTraceToken = this.config.observerTraceToken;
    const observerUsername = this.config.observerUsername;
    const observerPassword = this.config.observerPassword;

    // Url parsing
    const path = `${traceUrl}/api/${org}/${stream}/_json`;

    // Http Headers
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (observerTraceToken) {
      headers["Authorization"] = `Bearer ${observerTraceToken}`;
    } else if (observerUsername && observerPassword) {
      const basic = Buffer.from(`${observerUsername}:${observerPassword}`).toString("base64");
      headers["Authorization"] = `Basic ${basic}`;
    }

    from(
      fetch(path, {
        method: "POST",
        headers,
        body: JSON.stringify(logs),
      }),
    )
      .pipe(
        tap(async (response) => {
          if (!response.ok) {
            const errorBody = await response.text();
            console.error(
              `[OpenObserveLogger] Logger Send Failed: ${response.status} - ${errorBody}`,
            );
          }
        }),
        catchError((error) => {
          console.error(`[OpenObserveLogger] Network Failed: ${error.message}`);
          return of(null);
        }),
      )
      .subscribe();
  }

  private logToObserve(
    level: string,
    message: any,
    context?: string,
    trace?: string,
    ...args: any
  ): void {
    const logEntry: any = {
      level,
      message: typeof message === "string" ? message : JSON.stringify(message),
      "@timestamp": new Date().toISOString(),
    };

    if (context) {
      logEntry.context = context;
    }
    if (trace) {
      logEntry.trace = trace;
    }
    if (args && args.length > 0) {
      logEntry.payload = args.map((arg: any) =>
        typeof arg === "string" ? arg : JSON.stringify(arg),
      );
    }
    this.sendLogs([logEntry]);
  }

  log(message: any, context?: string, ...arg: any): void {
    const msg = this.formatMessage("info", message);
    this.logToObserve("info", msg, context, undefined, ...arg);
    Logger.log(msg, context ?? "Logger"); // Also log to console
  }

  error(message: any, trace?: string, context?: string, ...arg: any): void {
    const msg = this.formatMessage("error", message);
    this.logToObserve("error", msg, context, trace, ...arg);
    Logger.error(msg, trace, context ?? "Logger"); // Also log to console
  }

  warn(message: any, context?: string, ...arg: any): void {
    const msg = this.formatMessage("warn", message);
    this.logToObserve("warn", msg, context, undefined, ...arg);
    Logger.warn(msg, context ?? "Logger"); // Also log to console
  }

  debug(message: any, context?: string, ...arg: any): void {
    const msg = this.formatMessage("debug", message);
    this.logToObserve("debug", msg, context, undefined, ...arg);
    Logger.debug(msg, context ?? "Logger"); // Also log to console
  }

  verbose(message: any, context?: string, ...arg: any): void {
    const msg = this.formatMessage("verbose", message);
    this.logToObserve("verbose", msg, context, undefined, ...arg);
    Logger.verbose(msg, context ?? "Logger"); // Also log to console
  }
}
