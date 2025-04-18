import { NextRouter } from 'next/router';
import 'jest';

export const createMockRouter = (overrides: Partial<NextRouter> = {}): NextRouter => ({
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  forward: jest.fn(),
  beforePopState: jest.fn(),
  isFallback: false,
  isReady: true,
  isLocaleDomain: false,
  isPreview: false,
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  ...overrides,
});
