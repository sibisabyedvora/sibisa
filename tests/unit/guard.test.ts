import { hashIp, verifyAllowedDomain } from '../../src/lib/guard';

export function runGuardTest() {
  const ip1 = '192.168.1.1';
  const hashed = hashIp(ip1);
  if (!hashed || hashed.length !== 16) {
    throw new Error('Hash IP length check failed');
  }

  const isAllowedEmpty = verifyAllowedDomain([], 'https://example.com', null);
  if (!isAllowedEmpty) {
    throw new Error('Empty allowed_domains should return true');
  }

  const allowed = ['my-store.id'];
  const isAllowed = verifyAllowedDomain(allowed, 'https://my-store.id', null);
  const isBlocked = verifyAllowedDomain(allowed, 'https://malicious.com', null);

  if (!isAllowed || isBlocked) {
    throw new Error('Domain verification test failed');
  }

  return true;
}
