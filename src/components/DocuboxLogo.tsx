/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface DocuboxLogoProps {
  className?: string;
  size?: number;
}

export const DocuboxLogo: React.FC<DocuboxLogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-label="Docubox Logo"
      style={{ display: 'block' }}
    >
      {/* Outer rounded badge box */}
      <rect
        x="5.5"
        y="5.5"
        width="89"
        height="89"
        rx="21"
        ry="21"
        fill="#FFFDF8"
        stroke="#E50038"
        strokeWidth="6.5"
        strokeLinejoin="round"
      />

      {/* Stylized DOCU / BOX text */}
      <g fill="#E50038" stroke="#E50038" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
        {/* DOCU */}
        {/* D */}
        <path d="M14.5 15.5 h8.5 c7.5 0 11.2 3.8 11.2 14.5 s-3.7 14.5 -11.2 14.5 h-8.5 z m6.2 5.8 v17.4 h2.3 c4 0 5.2 -2.8 5.2 -8.7 s-1.2 -8.7 -5.2 -8.7 z" />

        {/* O */}
        <path d="M41.5 15 c6.8 0 10.8 4.6 10.8 15 s-4 15 -10.8 15 s-10.8 -4.6 -10.8 -15 s4 -15 10.8 -15 z m0 5.5 c-3 0 -4.6 3.4 -4.6 9.5 s1.6 9.5 4.6 9.5 s4.6 -3.4 4.6 -9.5 s-1.6 -9.5 -4.6 -9.5 z" />

        {/* C */}
        <path d="M68.5 21.8 c-1.6 -4.8 -4.6 -6.8 -9 -6.8 c-6.8 0 -10.8 4.6 -10.8 15 s4 15 10.8 15 c4.6 0 8 -2.4 9.4 -7 l-5.6 -1.8 c-0.6 2.2 -1.8 3.2 -3.6 3.2 c-3 0 -4.6 -3 -4.6 -9.4 s1.6 -9.4 4.6 -9.4 c1.8 0 3 1.2 3.6 3.2 z" />

        {/* U */}
        <path d="M71.5 15.5 h6.2 v16.8 c0 4.8 1.6 6.8 4.2 6.8 s4.2 -2 4.2 -6.8 v-16.8 h6.2 v17 c0 8.8 -4.6 12.8 -10.4 12.8 s-10.4 -4 -10.4 -12.8 z" />

        {/* BOX */}
        {/* B */}
        <path d="M14.5 48.5 h11.2 c5.8 0 9.2 2.6 9.2 8.5 c0 3.6 -1.8 5.8 -4.8 7 c3.8 1.2 5.8 4.2 5.8 8.6 c0 7.2 -4.2 10.4 -11.2 10.4 h-10.2 z m6.2 6.2 v7.6 h4.6 c2.4 0 4 -1.2 4 -3.8 s-1.6 -3.8 -4 -3.8 z m0 13.6 v8.6 h5 c2.6 0 4.4 -1.4 4.4 -4.3 s-1.8 -4.3 -4.4 -4.3 z" />

        {/* O */}
        <path d="M48 47.5 c8.5 0 14 6.2 14 21.5 s-5.5 21.5 -14 21.5 s-14 -6.2 -14 -21.5 s5.5 -21.5 14 -21.5 z m0 7.4 c-3.8 0 -5.8 4.5 -5.8 14.1 s2 14.1 5.8 14.1 s5.8 -4.5 5.8 -14.1 s-2 -14.1 -5.8 -14.1 z" />

        {/* X */}
        <path d="M64.2 48.5 h8.8 l6 16.5 l6.2 -16.5 h8.8 l-9.8 21.8 l11.2 22.5 h-9.2 l-7.2 -17.4 l-7.2 17.4 h-8.8 l10.6 -22.5 z" />
      </g>
    </svg>
  );
};

export default DocuboxLogo;
