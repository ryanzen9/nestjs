import { Logger, LoggerService } from "@nestjs/common";
import { catchError, from, of, tap } from "rxjs";
import { InjectOpenObserveConfig } from "./open-observe.decorators";
import { OpenObserveConfig } from "./open-observe.interfaces";

export class OBLogger implements LoggerService {
  constructor(@InjectOpenObserveConfig() private readonly config: OpenObserveConfig) {}

  private formatMessage(level: string, message: string): string {
    return `[${level.toUpperCase()}] [${new Date().toISOString()}] ${message}`;
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
      message:
        typeof message === "string" ? this.formatMessage(level, message) : JSON.stringify(message),
      context: context || "Logger",
      "@timestamp": new Date().toISOString(),
    };
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
    this.logToObserve("info", message, context, undefined, ...arg);
    Logger.log(message, context); // Also log to console
  }

  error(message: any, trace?: string, context?: string, ...arg: any): void {
    this.logToObserve("error", message, context, trace, ...arg);
    Logger.error(message, trace, context); // Also log to console
  }

  warn(message: any, context?: string, ...arg: any): void {
    this.logToObserve("warn", message, context, undefined, ...arg);
    Logger.warn(message, context); // Also log to console
  }

  debug(message: any, context?: string, ...arg: any): void {
    this.logToObserve("debug", message, context, undefined, ...arg);
    Logger.debug(message, context); // Also log to console
  }

  verbose(message: any, context?: string, ...arg: any): void {
    this.logToObserve("verbose", message, context, undefined, ...arg);
    Logger.verbose(message, context); // Also log to console
  }
}
