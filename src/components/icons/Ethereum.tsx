
import * as React from 'react';

export const EthereumIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m6 12 6-7 6 7-6 7-6-7Z" />
    <path d="m6 12 6 7v-7" />
    <path d="m18 12-6 7v-7" />
    <path d="m12 5-6 7h12L12 5Z" />
  </svg>
);
