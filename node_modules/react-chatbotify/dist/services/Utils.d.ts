import { Flow } from "../types/Flow";
export declare const defaultFlow: Flow;
export declare const isDesktop: boolean;
/**
 * Parses message that has markup enabled (holds html tags as individual elements to enable smooth streaming).
 *
 * @param message message to parse
 */
export declare const parseMarkupMessage: (message: string) => string[];
/**
 * Checks if chatbot is visible (uses chatbot body as reference).
 *
 * @param element chatbot body used to gauge visibility
 */
export declare const isChatBotVisible: (element: HTMLDivElement) => boolean;
