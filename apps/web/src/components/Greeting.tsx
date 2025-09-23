import type { ReactNode } from 'react';

export interface GreetingProps {
  name?: string | null;
  suffix?: ReactNode;
}

const DEFAULT_MESSAGE = '你好，欢迎使用 CDM 平台';

export const Greeting = ({ name, suffix }: GreetingProps) => {
  const trimmed = name?.trim();
  const message = trimmed && trimmed.length > 0 ? `你好，${trimmed}` : DEFAULT_MESSAGE;

  return (
    <div role="status" aria-live="polite">
      <span>{message}</span>
      {suffix ? <span data-testid="suffix">{suffix}</span> : null}
    </div>
  );
};

export const sum = (left: number, right: number) => left + right;
